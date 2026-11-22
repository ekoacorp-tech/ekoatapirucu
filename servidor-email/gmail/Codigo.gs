/* Ekoa Tapiruçu — serviço de e-mail via Gmail (Google Apps Script)
   Usa a conta Gmail de quem publicar o script. Não precisa de domínio nem de cartão.
   Protocolo: POST com corpo JSON { rota: 'boas-vindas' | 'redefinir' | 'validar', email, did, codigo?, url? }.
   Resposta sempre em JSON { ok, motivo? } (Apps Script não devolve códigos HTTP diferentes de 200).
   Passos: ver README.md desta pasta. Rode a função configurar() uma vez antes de publicar. */

var JANELA_MS = 15 * 60 * 1000, ALFA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
var TETO_DIA = 80; // a cota diária de uma conta Gmail comum é 100 destinatários

function configurar() {
  var p = PropertiesService.getScriptProperties();
  if (!p.getProperty('SEGREDO')) p.setProperty('SEGREDO', Utilities.getUuid() + Utilities.getUuid());
  Logger.log('Pronto. Cota diária de e-mails restante: ' + MailApp.getRemainingDailyQuota());
}

function doGet() { return saida({ ok: true, servico: 'ekoa-tapirucu-email' }); }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(8000); } catch (x) { return saida({ ok: false, motivo: 'erro' }); }
  try { return saida(trata(e)); } catch (err) { return saida({ ok: false, motivo: 'erro' }); } finally { lock.releaseLock(); }
}

function saida(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function emailOk(e) { return typeof e === 'string' && e.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }
function didOk(d) { return typeof d === 'string' && /^[0-9a-f]{16,40}$/.test(d); }

function hmac(texto) {
  var seg = PropertiesService.getScriptProperties().getProperty('SEGREDO');
  if (!seg) throw new Error('Rode configurar() primeiro');
  var b = Utilities.computeHmacSha256Signature(texto, seg);
  return b.map(function (x) { return x & 255; });
}
function hex(bytes) { return bytes.map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
function codigo(email, did, janela) { var h = hmac('cod|' + email + '|' + did + '|' + janela), c = ''; for (var i = 0; i < 8; i++) c += ALFA.charAt(h[i] % 32); return c; }
function chave(email, did) { return hex(hmac('k|' + email + '|' + did).slice(0, 12)); }
function igual(a, b) { if (a.length !== b.length) return false; var r = 0; for (var i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }

function conta(chaveCache, ttl) {
  var c = CacheService.getScriptCache(), n = (parseInt(c.get(chaveCache), 10) || 0) + 1;
  c.put(chaveCache, String(n), Math.min(21600, Math.max(60, ttl))); return n;
}
function contaDia() {
  var p = PropertiesService.getScriptProperties(), hoje = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyyMMdd'), v = (p.getProperty('DIA') || '').split(':');
  var n = (v[0] === hoje ? parseInt(v[1], 10) || 0 : 0) + 1; p.setProperty('DIA', hoje + ':' + n); return n;
}

function moldura(titulo, corpo) {
  return '<div style="background:#EEF1F4;padding:24px 12px;font-family:Segoe UI,Arial,sans-serif;color:#1F2A3C"><div style="max-width:560px;margin:0 auto;background:#fff;border-radius:6px">' +
    '<div style="padding:18px 28px;border-bottom:1px solid #DDE3EA"><b style="color:#112347;font-size:18px">EKOA</b> <span style="color:#23757F">Tapiruçu</span></div>' +
    '<div style="padding:28px"><h1 style="margin:0 0 14px;font-size:22px;color:#112347">' + titulo + '</h1>' + corpo + '</div>' +
    '<div style="padding:16px 28px;border-top:1px solid #DDE3EA;font-size:12px;color:#5B6B80">Ekoa Gestão e Processo · mensagem automática, não responda este e-mail.</div></div></div>';
}
function msgBoasVindas(url) {
  var link = url && /^https:\/\//.test(url) ? '<p><a href="' + esc(url) + '" style="color:#23757F">Abrir o Ekoa Tapiruçu</a></p>' : '';
  return { assunto: 'Bem-vindo ao Ekoa Tapiruçu', html: moldura('Bem-vindo ao Ekoa Tapiruçu', '<p>Seu aparelho está protegido por senha e este e-mail ficou cadastrado para recuperá-la.</p>' +
    '<p style="margin:18px 0 6px"><b>Guarde estes pontos</b></p><ul style="padding-left:18px;line-height:1.6"><li>A senha e os dados ficam <b>somente no seu aparelho</b>. Nós nunca recebemos sua senha.</li><li>Se esquecer a senha, toque em <b>Esqueci a senha</b> e peça um código para este e-mail.</li><li>Você também tem o código de recuperação mostrado no cadastro. Guarde-o em lugar seguro.</li></ul>' + link +
    '<p style="color:#5B6B80;font-size:13px">Não foi você? Basta ignorar esta mensagem.</p>'),
    texto: 'Bem-vindo ao Ekoa Tapiruçu. Seu e-mail ficou cadastrado para recuperar a senha. A senha e os dados ficam só no seu aparelho. Se esquecer a senha, toque em Esqueci a senha e peça um código para este e-mail.' };
}
function msgCodigo(c) {
  var f = c.slice(0, 4) + '-' + c.slice(4);
  return { assunto: 'Seu código para criar uma nova senha', html: moldura('Código para nova senha', '<p>Digite este código no Ekoa Tapiruçu para criar uma nova senha. Ele vale por 15 minutos.</p>' +
    '<p style="font-size:30px;letter-spacing:4px;font-weight:700;color:#112347;background:#E9F3F4;padding:14px 18px;border-radius:4px;display:inline-block;margin:8px 0">' + f + '</p>' +
    '<p style="color:#5B6B80;font-size:13px">Se você não pediu, ignore este e-mail: nada muda sem este código.</p>'), texto: 'Seu código para criar uma nova senha no Ekoa Tapiruçu: ' + f + '. Vale por 15 minutos. Se você não pediu, ignore.' };
}
function envia(para, m) {
  try { MailApp.sendEmail({ to: para, subject: m.assunto, htmlBody: m.html, body: m.texto, name: 'Ekoa Tapiruçu' }); return true; } catch (e) { return false; }
}

function trata(e) {
  var b; try { b = JSON.parse(e.postData.contents); } catch (x) { return { ok: false, motivo: 'recusado' }; }
  var rota = String(b.rota || ''), email = String(b.email || '').trim().toLowerCase(), did = String(b.did || '');
  if (!emailOk(email) || !didOk(did)) return { ok: false, motivo: 'recusado' };
  var k = chave(email, did), ke = chave(email, ''), janela = Math.floor(Date.now() / JANELA_MS), cache = CacheService.getScriptCache();
  if (rota === 'boas-vindas') {
    if (conta('bv:' + ke, 3600) > 3 || contaDia() > TETO_DIA) return { ok: false, motivo: 'limite' };
    return envia(email, msgBoasVindas(b.url)) ? { ok: true } : { ok: false, motivo: 'erro' };
  }
  if (rota === 'redefinir') {
    if (conta('rd:' + ke, 3600) > 5 || contaDia() > TETO_DIA) return { ok: false, motivo: 'limite' };
    cache.remove('ok:' + k);
    return envia(email, msgCodigo(codigo(email, did, janela))) ? { ok: true } : { ok: false, motivo: 'erro' };
  }
  if (rota === 'validar') {
    var cod = String(b.codigo || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cod.length !== 8) return { ok: false, motivo: 'recusado' };
    if ((parseInt(cache.get('vf:' + k + ':' + janela), 10) || 0) >= 5) return { ok: false, motivo: 'limite' };
    if (cache.get('ok:' + k)) return { ok: false, motivo: 'recusado' };
    var valido = igual(cod, codigo(email, did, janela)) || igual(cod, codigo(email, did, janela - 1));
    if (!valido) { conta('vf:' + k + ':' + janela, 1800); return { ok: false, motivo: 'recusado' }; }
    cache.put('ok:' + k, '1', 1800); return { ok: true };
  }
  return { ok: false, motivo: 'recusado' };
}
