/* Service Worker — cache do app para uso offline.
   Ao publicar uma nova versão: troque o número em V, APP_VERSION no index.html e o version.json. */
const V = 'ekoa-tapirucu-v1';
const SHELL = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  // cache: 'reload' evita gravar no cache uma cópia antiga vinda do cache HTTP do navegador
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ekoa-tapirucu-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // version.json nunca passa pelo cache: é o que avisa que existe versão nova
  if (url.pathname.endsWith('/version.json')) return;
  // Responde do cache na hora (offline) e atualiza o cache em segundo plano quando há rede.
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => hit || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined));
    return hit || net;
  }));
});
