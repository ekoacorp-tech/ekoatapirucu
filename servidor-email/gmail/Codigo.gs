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

var LOGO = 'https://ekoacorp-tech.github.io/ekoatapirucu/assets/tapirucu-logo.png';
var APP_URL = 'https://ekoacorp-tech.github.io/ekoatapirucu/';

/* Moldura em tabelas e estilos inline (único formato que Gmail/Outlook respeitam). Cores explícitas
   em todas as células para o modo escuro não deixar texto ilegível. */
function moldura(preheader, titulo, corpo) {
  return '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"></head>' +
    '<body style="margin:0;padding:0;background:#EEF1F4;">' +
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#EEF1F4;font-size:1px;line-height:1px;">' + esc(preheader) + '&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#EEF1F4" style="background:#EEF1F4;"><tr><td align="center" style="padding:24px 12px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;font-family:Segoe UI,Helvetica,Arial,sans-serif;">' +
    '<tr><td bgcolor="#112347" style="background:#112347;background-image:linear-gradient(#112347,#112347);border-radius:10px 10px 0 0;padding:26px 28px 22px;" align="left">' +
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
      '<td style="padding-right:14px;" valign="middle"><img src="' + LOGO + '" width="56" alt="Ekoa Tapiruçu" style="display:block;border:0;height:auto;"></td>' +
      '<td valign="middle"><div style="font-size:20px;line-height:22px;font-weight:700;color:#FFFFFF !important;letter-spacing:.5px;">EKOA <span style="color:#7CC4CC;">Tapiruçu</span></div>' +
      '<div style="font-size:12px;line-height:18px;color:#B9C6DA;">Gestão do Rebanho</div></td></tr></table></td></tr>' +
    '<tr><td height="4" bgcolor="#C2753E" style="background:#C2753E;background-image:linear-gradient(#C2753E,#C2753E);font-size:0;line-height:0;">&nbsp;</td></tr>' +
    '<tr><td bgcolor="#FFFFFF" style="background:#FFFFFF;padding:32px 28px 28px;color:#1F2A3C;font-size:15px;line-height:24px;">' +
      '<h1 style="margin:0 0 16px;font-size:24px;line-height:30px;color:#112347;font-weight:700;">' + titulo + '</h1>' + corpo + '</td></tr>' +
    '<tr><td bgcolor="#F7F9FB" style="background:#F7F9FB;border-top:1px solid #DDE3EA;border-radius:0 0 10px 10px;padding:18px 28px;font-size:12px;line-height:18px;color:#5B6B80;">' +
      '<b style="color:#112347;">Ekoa Gestão e Processo</b><br>Mensagem automática, por favor não responda este e-mail.</td></tr>' +
    '</table></td></tr></table></body></html>';
}
function botao(url, texto) {
  return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 6px;"><tr>' +
    '<td align="center" bgcolor="#23757F" style="background:#23757F;background-image:linear-gradient(#23757F,#23757F);border-radius:8px;padding:14px 30px;">' +
    '<a href="' + esc(url) + '" style="font-size:16px;line-height:20px;font-weight:700;color:#FFFFFF !important;text-decoration:none;display:block;"><font color="#FFFFFF">' + texto + '</font></a></td></tr></table>';
}
function ponto(titulo, texto) {
  return '<tr><td valign="top" width="28" style="padding:6px 0;"><div style="width:20px;height:20px;line-height:20px;border-radius:10px;background:#E9F3F4;color:#23757F;font-weight:700;font-size:12px;text-align:center;">&#10003;</div></td>' +
    '<td style="padding:6px 0;font-size:14px;line-height:21px;color:#1F2A3C;"><b style="color:#112347;">' + titulo + '</b><br>' + texto + '</td></tr>';
}
function msgBoasVindas(url) {
  var destino = url && /^https:\/\//.test(url) ? url : APP_URL;
  var corpo = '<p style="margin:0 0 14px;">Seu aparelho está protegido por senha e este e-mail ficou cadastrado para recuperá-la, se um dia você precisar.</p>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;">' +
    ponto('Seus dados ficam com você', 'A senha e as informações do rebanho ficam somente no seu aparelho. Nós nunca recebemos sua senha.') +
    ponto('Esqueceu a senha?', 'Toque em <b>Esqueci a senha</b> e peça um código para este e-mail.') +
    ponto('Guarde o código de recuperação', 'Aquele mostrado uma única vez no cadastro continua valendo. Anote em lugar seguro.') + '</table>' +
    botao(destino, 'Abrir o Ekoa Tapiruçu') +
    '<p style="margin:18px 0 0;font-size:13px;line-height:20px;color:#5B6B80;">Não foi você? Basta ignorar esta mensagem: nada muda sem a sua ação no aparelho.</p>';
  return { assunto: 'Bem-vindo ao Ekoa Tapiruçu', html: moldura('Seu e-mail ficou cadastrado para recuperar a senha.', 'Bem-vindo ao Ekoa Tapiruçu', corpo),
    texto: 'Bem-vindo ao Ekoa Tapiruçu. Seu e-mail ficou cadastrado para recuperar a senha. A senha e os dados ficam só no seu aparelho. Se esquecer a senha, toque em Esqueci a senha e peça um código para este e-mail. Abrir: ' + destino };
}
function msgCodigo(c) {
  var f = c.slice(0, 4) + '&nbsp;&ndash;&nbsp;' + c.slice(4);
  var corpo = '<p style="margin:0 0 6px;">Digite este código no Ekoa Tapiruçu para criar uma nova senha.</p>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;"><tr><td align="center" bgcolor="#E9F3F4" style="background:#E9F3F4;border:1px solid #BFDDE0;border-radius:10px;padding:22px 12px;">' +
    '<div style="font-size:12px;line-height:16px;letter-spacing:1.5px;text-transform:uppercase;color:#23757F;font-weight:700;">Seu código</div>' +
    '<div style="font-family:Consolas,Menlo,monospace;font-size:36px;line-height:46px;letter-spacing:5px;font-weight:700;color:#112347;">' + f + '</div>' +
    '<div style="font-size:13px;line-height:20px;color:#5B6B80;">Vale por <b>15 minutos</b> e só pode ser usado uma vez.</div></td></tr></table>' +
    '<p style="margin:0;font-size:14px;line-height:22px;">Volte ao app e informe o código na tela <b>Esqueci a senha</b>.</p>' + botao(APP_URL, 'Abrir o Ekoa Tapiruçu') +
    '<p style="margin:18px 0 0;font-size:13px;line-height:20px;color:#5B6B80;">Você não pediu? Ignore este e-mail: sem o código, nada muda.</p>';
  return { assunto: 'Seu código para criar uma nova senha', html: moldura('Código para criar uma nova senha. Vale por 15 minutos.', 'Código para nova senha', corpo),
    texto: 'Seu código para criar uma nova senha no Ekoa Tapiruçu: ' + c.slice(0, 4) + '-' + c.slice(4) + '. Vale por 15 minutos e só pode ser usado uma vez. Se você não pediu, ignore.' };
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
