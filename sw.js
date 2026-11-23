/* Service Worker — cache do app para uso offline.
   Ao publicar uma nova versão: troque o número em V, APP_VERSION no index.html e o version.json.

   Estratégia (v5):
   - Tela principal (navegação / index.html): REDE PRIMEIRO, revalidando o cache HTTP, com limite
     de 4 s; sem sinal, usa a cópia guardada. Assim, abrir o app com internet já traz a versão nova.
   - Demais arquivos: cópia guardada primeiro (rápido e offline) e atualização em segundo plano.
   - version.json e pedidos marcados com ?fresh= nunca passam pela cópia guardada. */
const V = 'ekoa-tapirucu-v25';
const TILES = 'tapirucu-mapa-v1';   // blocos do mapa já vistos (não é apagado nas atualizações)
const TILE_HOSTS = ['tile.openstreetmap.org', 'server.arcgisonline.com'];
const SHELL = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './assets/tapirucu-logo.png', './icons/ekoa-mark.png', './icons/logo-blend.png'];

self.addEventListener('install', e => {
  // cache: 'reload' evita gravar no cache uma cópia antiga vinda do cache HTTP do navegador
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ekoa-tapirucu-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

function networkFirst(req) {
  const net = fetch(req, { cache: 'no-cache' }).then(r => {
    if (r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put('./index.html', cp)); }
    return r;
  });
  const timeout = new Promise(ok => setTimeout(ok, 4000));
  const fallback = () => caches.match('./index.html').then(hit => hit || caches.match(req, { ignoreSearch: true }));
  return Promise.race([net.catch(() => null), timeout.then(() => null)]).then(r => r || fallback().then(hit => hit || net));
}

/* Blocos do mapa: cópia guardada primeiro; sem sinal, a fazenda já vista continua com fundo. */
function tile(req) {
  return caches.open(TILES).then(c => c.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { c.put(req, r.clone()); trimTiles(c); }
    return r;
  })));
}
let trimming = false;
function trimTiles(c) {   // mantém no máximo ~4.000 blocos (cerca de 60 MB)
  if (trimming) return; trimming = true;
  c.keys().then(ks => Promise.all(ks.length > 4000 ? ks.slice(0, ks.length - 3500).map(k => c.delete(k)) : [])).finally(() => { trimming = false; });
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (TILE_HOSTS.includes(url.hostname)) { e.respondWith(tile(e.request)); return; }
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith('/version.json') || url.searchParams.has('fresh')) return;   // sempre da rede
  const isPage = e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isPage) { e.respondWith(networkFirst(e.request)); return; }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => hit);
    return hit || net;
  }));
});
