// node servidor-email/gmail/teste.js — roda Codigo.gs com serviços do Google simulados
const vm = require('vm'), fs = require('fs'), crypto = require('crypto');
const mem = { cache: new Map(), props: new Map(), enviados: [] };
const sandbox = {
  console, Date, Math, JSON, parseInt, String, Error,
  Utilities: { getUuid: () => crypto.randomUUID(), computeHmacSha256Signature: (t, k) => Array.from(crypto.createHmac('sha256', k).update(t).digest(), b => b > 127 ? b - 256 : b), formatDate: (d) => new Date(d.getTime() - 3 * 3600e3).toISOString().slice(0, 10).replace(/-/g, '') },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => mem.props.has(k) ? mem.props.get(k) : null, setProperty: (k, v) => mem.props.set(k, v) }) },
  CacheService: { getScriptCache: () => ({ get: k => mem.cache.has(k) ? mem.cache.get(k) : null, put: (k, v) => mem.cache.set(k, v), remove: k => mem.cache.delete(k) }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  MailApp: { sendEmail: o => mem.enviados.push(o), getRemainingDailyQuota: () => 100 },
  ContentService: { MimeType: { JSON: 'json' }, createTextOutput: s => ({ s, setMimeType() { return this; }, getContent() { return s; } }) },
  Logger: { log() {} }
};
vm.createContext(sandbox); vm.runInContext(fs.readFileSync(__dirname + '/Codigo.gs', 'utf8'), sandbox);
let falhas = 0; const ck = (n, c, x = '') => { if (!c) falhas++; console.log((c ? 'ok    ' : 'FALHA ') + n + (c ? '' : ' → ' + x)); };
const post = o => JSON.parse(sandbox.doPost({ postData: { contents: JSON.stringify(o) } }).getContent());
const ID = 'a1b2c3d4e5f60718293a4b5c', EM = 'ana@empresa.com.br', cod = () => mem.enviados[mem.enviados.length - 1].body.match(/: ([A-Z0-9]{4}-[A-Z0-9]{4})\./)[1].replace('-', '');
let r = post({ rota: 'redefinir', email: EM, did: ID }); ck('sem configurar() não envia', r.ok === false && mem.enviados.length === 0, JSON.stringify(r));
sandbox.configurar(); ck('configurar() cria o segredo', !!mem.props.get('SEGREDO') && mem.props.get('SEGREDO').length >= 64);
r = post({ rota: 'boas-vindas', email: EM, did: ID, url: 'https://app.teste/' }); ck('boas-vindas envia ao cadastrado, com nome do remetente', r.ok && mem.enviados.length === 1 && mem.enviados[0].to === EM && mem.enviados[0].name === 'Ekoa Tapiruçu' && /Bem-vindo/.test(mem.enviados[0].subject), JSON.stringify(r));
ck('boas-vindas sem senha nem código', !/senha:|recuperação:/i.test(mem.enviados[0].body));
r = post({ rota: 'boas-vindas', email: 'x', did: ID }); ck('e-mail inválido recusado', r.ok === false && r.motivo === 'recusado');
r = post({ rota: 'boas-vindas', email: EM, did: 'zz' }); ck('did inválido recusado', r.ok === false);
post({ rota: 'boas-vindas', email: EM, did: ID }); post({ rota: 'boas-vindas', email: EM, did: ID }); r = post({ rota: 'boas-vindas', email: EM, did: 'ffffffffffffffffffffffff' }); ck('limite por e-mail (mudar o did não escapa)', r.ok === false && r.motivo === 'limite', JSON.stringify(r));
mem.cache.clear(); mem.enviados.length = 0;
r = post({ rota: 'redefinir', email: EM, did: ID }); const c = cod(); ck('redefinir envia código de 8 caracteres', r.ok && /^[A-Z2-9]{8}$/.test(c), c);
ck('código errado recusado', post({ rota: 'validar', email: EM, did: ID, codigo: 'AAAAAAAA' }).motivo === 'recusado');
ck('outro aparelho recusado', post({ rota: 'validar', email: EM, did: 'ffffffffffffffffffffffff', codigo: c }).ok === false);
ck('código certo (hífen e minúsculas) aceito', post({ rota: 'validar', email: EM, did: ID, codigo: c.slice(0, 4).toLowerCase() + '-' + c.slice(4) }).ok === true);
ck('não vale duas vezes', post({ rota: 'validar', email: EM, did: ID, codigo: c }).ok === false);
post({ rota: 'redefinir', email: EM, did: ID }); ck('novo pedido libera novo uso', post({ rota: 'validar', email: EM, did: ID, codigo: cod() }).ok === true);
post({ rota: 'redefinir', email: EM, did: ID }); let u; for (let i = 0; i < 6; i++) u = post({ rota: 'validar', email: EM, did: ID, codigo: 'ZZZZZZZ' + i }); r = post({ rota: 'validar', email: EM, did: ID, codigo: cod() });
ck('após 5 erros até o certo é barrado', u.motivo === 'limite' && r.motivo === 'limite', JSON.stringify([u, r]));
mem.cache.clear(); mem.props.set('DIA', sandbox.Utilities.formatDate(new Date()) + ':80'); r = post({ rota: 'redefinir', email: 'outra@empresa.com', did: ID }); ck('teto diário de 80 e-mails', r.ok === false && r.motivo === 'limite', JSON.stringify(r));
const real = Date.now; const base = Math.floor(real() / 900000) * 900000 + 60000; mem.props.delete('DIA'); mem.cache.clear(); Date.now = () => base; sandbox.Date = class extends Date { constructor(...a) { super(...(a.length ? a : [Date.now()])); } static now() { return Date.now(); } };
post({ rota: 'redefinir', email: EM, did: ID }); const c0 = cod(); Date.now = () => base + 16 * 60e3; ck('código vale na janela seguinte', post({ rota: 'validar', email: EM, did: ID, codigo: c0 }).ok === true);
mem.cache.clear(); Date.now = () => base + 31 * 60e3; ck('código vence após 30 min', post({ rota: 'validar', email: EM, did: ID, codigo: c0 }).ok === false); Date.now = real;
ck('rota desconhecida recusada', post({ rota: 'x', email: EM, did: ID }).ok === false);
ck('corpo inválido recusado', JSON.parse(sandbox.doPost({ postData: { contents: 'nao-json' } }).getContent()).ok === false);
console.log(falhas ? falhas + ' FALHA(S)' : 'TUDO OK'); process.exit(falhas ? 1 : 0);
