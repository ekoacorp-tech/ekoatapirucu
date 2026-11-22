/* Ekoa Tapiruçu — serviço de e-mail (Cloudflare Worker + Resend)
   Rotas (POST, JSON):
     /boas-vindas  { email, did, url }        envia a mensagem de boas-vindas
     /redefinir    { email, did }             envia um código de 8 caracteres (vale 15 min)
     /validar      { email, did, codigo }     confere o código (máx. 5 tentativas por janela)
   O servidor não guarda e-mails: o código é derivado (HMAC) de e-mail + aparelho + janela de tempo,
   e o KV guarda só contadores com hash e prazo curto. A senha do app nunca passa por aqui.
   Variáveis: RESEND_KEY (secret), SEGREDO (secret, 32+ caracteres), DE, ORIGENS (lista separada por vírgula), KV "LIMITE". */

const JANELA_MS = 15 * 60 * 1000, ALFA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const enc = new TextEncoder();
const bytesHex = b => Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, '0')).join('');
const emailOk = e => typeof e === 'string' && e.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const didOk = d => typeof d === 'string' && /^[0-9a-f]{16,40}$/.test(d);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function hmac(segredo, texto) {
  const k = await crypto.subtle.importKey('raw', enc.encode(segredo), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(texto)));
}
async function codigo(segredo, email, did, janela) {
  const h = await hmac(segredo, 'cod|' + email + '|' + did + '|' + janela);
  let c = ''; for (let i = 0; i < 8; i++) c += ALFA[h[i] % 32];
  return c;
}
async function chave(segredo, email, did) { return bytesHex((await hmac(segredo, 'k|' + email + '|' + did)).slice(0, 12)); }
const igual = (a, b) => { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; };

function cors(req, env) {
  const o = req.headers.get('Origin') || '', ok = (env.ORIGENS || '').split(',').map(x => x.trim()).filter(Boolean);
  const h = { 'Vary': 'Origin', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' };
  if (ok.includes(o) || ok.includes('*')) h['Access-Control-Allow-Origin'] = o || '*';
  return h;
}
const MOTIVO = { 400: 'recusado', 401: 'recusado', 403: 'recusado', 429: 'limite' };
const resp = (req, env, status, corpo) => new Response(JSON.stringify(status >= 400 ? Object.assign({ motivo: MOTIVO[status] || 'erro' }, corpo) : corpo), { status, headers: Object.assign({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, cors(req, env)) });

/* contador com prazo (KV): devolve o valor depois de somar 1 */
async function conta(env, chaveKv, ttl) {
  const atual = parseInt(await env.LIMITE.get(chaveKv), 10) || 0;
  await env.LIMITE.put(chaveKv, String(atual + 1), { expirationTtl: Math.max(60, ttl) });
  return atual + 1;
}

const moldura = (titulo, corpo) => `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#EEF1F4;font-family:Segoe UI,Arial,sans-serif;color:#1F2A3C">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" style="max-width:560px;background:#fff;border-radius:6px" cellpadding="0" cellspacing="0">
<tr><td style="padding:18px 28px;border-bottom:1px solid #DDE3EA"><b style="color:#112347;font-size:18px;letter-spacing:.5px">EKOA</b> <span style="color:#23757F">Tapiruçu</span></td></tr>
<tr><td style="padding:28px"><h1 style="margin:0 0 14px;font-size:22px;color:#112347">${titulo}</h1>${corpo}</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #DDE3EA;font-size:12px;color:#5B6B80">Ekoa Gestão e Processo · mensagem automática, não responda este e-mail.</td></tr>
</table></td></tr></table></body></html>`;

function msgBoasVindas(url) {
  const link = url && /^https:\/\//.test(url) ? `<p><a href="${esc(url)}" style="color:#23757F">Abrir o Ekoa Tapiruçu</a></p>` : '';
  return { assunto: 'Bem-vindo ao Ekoa Tapiruçu', html: moldura('Bem-vindo ao Ekoa Tapiruçu', `<p>Seu aparelho está protegido por senha e este e-mail ficou cadastrado para recuperá-la.</p>
    <p style="margin:18px 0 6px"><b>Guarde estes pontos</b></p><ul style="padding-left:18px;line-height:1.6"><li>A senha e os dados ficam <b>somente no seu aparelho</b>. Nós nunca recebemos sua senha.</li><li>Se esquecer a senha, toque em <b>Esqueci a senha</b> e peça um código para este e-mail.</li><li>Você também tem o código de recuperação mostrado no cadastro. Guarde-o em lugar seguro.</li></ul>${link}
    <p style="color:#5B6B80;font-size:13px">Não foi você? Basta ignorar esta mensagem.</p>`),
    texto: 'Bem-vindo ao Ekoa Tapiruçu. Seu e-mail ficou cadastrado para recuperar a senha. A senha e os dados ficam só no seu aparelho. Se esquecer a senha, toque em Esqueci a senha e peça um código para este e-mail.' };
}
function msgCodigo(c) {
  const f = c.slice(0, 4) + '-' + c.slice(4);
  return { assunto: 'Seu código para criar uma nova senha', html: moldura('Código para nova senha', `<p>Digite este código no Ekoa Tapiruçu para criar uma nova senha. Ele vale por 15 minutos.</p>
    <p style="font-size:30px;letter-spacing:4px;font-weight:700;color:#112347;background:#E9F3F4;padding:14px 18px;border-radius:4px;display:inline-block;margin:8px 0">${f}</p>
    <p style="color:#5B6B80;font-size:13px">Se você não pediu, ignore este e-mail: nada muda sem este código.</p>`), texto: 'Seu código para criar uma nova senha no Ekoa Tapiruçu: ' + f + '. Vale por 15 minutos. Se você não pediu, ignore.' };
}
async function envia(env, para, m) {
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Authorization': 'Bearer ' + env.RESEND_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.DE, to: [para], subject: m.assunto, html: m.html, text: m.texto }) });
  return r.ok;
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req, env) });
    if (req.method !== 'POST') return resp(req, env, 405, { ok: false });
    if (!env.SEGREDO || !env.RESEND_KEY || !env.DE || !env.LIMITE) return resp(req, env, 500, { ok: false, erro: 'configuracao-incompleta' });
    const o = req.headers.get('Origin') || '';
    if (o && !cors(req, env)['Access-Control-Allow-Origin']) return resp(req, env, 403, { ok: false });
    let b; try { b = await req.json(); } catch (e) { return resp(req, env, 400, { ok: false }); }
    const rota = '/' + String(b.rota || u.pathname).replace(/^\/+|\/+$/g, '');
    const email = String(b.email || '').trim().toLowerCase(), did = String(b.did || '');
    if (!emailOk(email) || !didOk(did)) return resp(req, env, 400, { ok: false });
    const k = await chave(env.SEGREDO, email, did), ke = await chave(env.SEGREDO, email, ''), agora = Date.now(), janela = Math.floor(agora / JANELA_MS);
    const dia = new Date(agora).toISOString().slice(0, 10), teto = parseInt(env.TETO_DIA, 10) || 200;

    if (rota === '/boas-vindas') {
      if (await conta(env, 'bv:' + ke, 3600) > 3 || await conta(env, 'dia:' + dia, 86400) > teto) return resp(req, env, 429, { ok: false });
      return resp(req, env, await envia(env, email, msgBoasVindas(b.url)) ? 200 : 502, { ok: true });
    }
    if (rota === '/redefinir') {
      if (await conta(env, 'rd:' + ke, 3600) > 5 || await conta(env, 'dia:' + dia, 86400) > teto) return resp(req, env, 429, { ok: false });
      await env.LIMITE.delete('ok:' + k);
      const c = await codigo(env.SEGREDO, email, did, janela);
      return resp(req, env, await envia(env, email, msgCodigo(c)) ? 200 : 502, { ok: true });
    }
    if (rota === '/validar') {
      const cod = String(b.codigo || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (cod.length !== 8) return resp(req, env, 400, { ok: false });
      const falhas = parseInt(await env.LIMITE.get('vf:' + k + ':' + janela), 10) || 0;
      if (falhas >= 5) return resp(req, env, 429, { ok: false });
      if (await env.LIMITE.get('ok:' + k)) return resp(req, env, 400, { ok: false });
      const valido = igual(cod, await codigo(env.SEGREDO, email, did, janela)) || igual(cod, await codigo(env.SEGREDO, email, did, janela - 1));
      if (!valido) { await conta(env, 'vf:' + k + ':' + janela, 2 * JANELA_MS / 1000); return resp(req, env, 400, { ok: false }); }
      await env.LIMITE.put('ok:' + k, '1', { expirationTtl: 2 * JANELA_MS / 1000 });
      return resp(req, env, 200, { ok: true });
    }
    return resp(req, env, 404, { ok: false });
  }
};
