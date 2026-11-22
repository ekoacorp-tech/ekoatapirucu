// node servidor-email/teste.mjs — testa o Worker com KV e Resend simulados
import w from './worker.js';
const kv = new Map(); const KV = { get: async k => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); }, delete: async k => { kv.delete(k); } };
const env = { RESEND_KEY: 'x', SEGREDO: 'segredo-de-teste-com-mais-de-32-caracteres!!', DE: 'Teste <a@b.c>', ORIGENS: 'https://app.teste', LIMITE: KV };
const enviados = []; globalThis.fetch = async (url, o) => { enviados.push(JSON.parse(o.body)); return new Response('{}', { status: 200 }); };
const ID = 'a1b2c3d4e5f60718293a4b5c', EM = 'ana@empresa.com.br';
const chama = async (rota, corpo, origem = 'https://app.teste', metodo = 'POST') => { const r = await w.fetch(new Request('https://w.test' + rota, { method: metodo, headers: { 'Content-Type': 'application/json', ...(origem ? { Origin: origem } : {}) }, body: metodo === 'POST' ? JSON.stringify(corpo) : undefined }), env); return { s: r.status, j: await r.json().catch(() => null), h: r.headers }; };
let falhas = 0; const ck = (n, c, x = '') => { if (!c) falhas++; console.log((c ? 'ok    ' : 'FALHA ') + n + (c ? '' : ' → ' + x)); };
const codDoEmail = () => { const t = enviados[enviados.length - 1].text; return t.match(/: ([A-Z0-9]{4}-[A-Z0-9]{4})\./)[1].replace('-', ''); };

let r = await chama('/boas-vindas', { email: EM, did: ID, url: 'https://app.teste/x/' });
ck('boas-vindas envia 1 e-mail ao cadastrado', r.s === 200 && enviados.length === 1 && enviados[0].to[0] === EM && /Bem-vindo/.test(enviados[0].subject));
ck('boas-vindas não contém senha/código', !/senha:|código de recuperação:/i.test(enviados[0].text));
ck('CORS devolve a origem permitida', r.h.get('Access-Control-Allow-Origin') === 'https://app.teste');
r = await chama('/boas-vindas', { email: EM, did: ID }, 'https://outro.site'); ck('origem não permitida é recusada (403)', r.s === 403, r.s);
r = await chama('/boas-vindas', { email: 'sem-arroba', did: ID }); ck('e-mail inválido → 400', r.s === 400);
r = await chama('/boas-vindas', { email: EM, did: 'x' }); ck('did inválido → 400', r.s === 400);
for (let i = 0; i < 3; i++) r = await chama('/boas-vindas', { email: EM, did: ID });
ck('limite de boas-vindas por hora (429 na 4ª)', r.s === 429, r.s);
enviados.length = 0;
r = await chama('/redefinir', { email: EM, did: ID }); const cod = codDoEmail();
ck('redefinir envia código de 8 caracteres', r.s === 200 && /^[A-Z2-9]{8}$/.test(cod) && /15 minutos/.test(enviados[0].text), cod);
r = await chama('/validar', { email: EM, did: ID, codigo: 'AAAAAAAA' }); ck('código errado → 400', r.s === 400);
r = await chama('/validar', { email: EM, did: 'ffffffffffffffffffffffff', codigo: cod }); ck('mesmo código em outro aparelho (did) → 400', r.s === 400);
r = await chama('/validar', { email: 'outra@empresa.com', did: ID, codigo: cod }); ck('mesmo código para outro e-mail → 400', r.s === 400);
r = await chama('/validar', { email: EM, did: ID, codigo: cod.slice(0, 4) + '-' + cod.slice(4).toLowerCase() }); ck('código correto (com hífen e minúsculas) → 200', r.s === 200, r.s);
r = await chama('/validar', { email: EM, did: ID, codigo: cod }); ck('código não vale duas vezes → 400', r.s === 400);
await chama('/redefinir', { email: EM, did: ID }); r = await chama('/validar', { email: EM, did: ID, codigo: codDoEmail() }); ck('novo pedido libera novo uso', r.s === 200);
// bloqueio por tentativas
await chama('/redefinir', { email: EM, did: ID }); let ult; for (let i = 0; i < 6; i++) ult = await chama('/validar', { email: EM, did: ID, codigo: 'ZZZZZZZZ' });
r = await chama('/validar', { email: EM, did: ID, codigo: codDoEmail() }); ck('após 5 erros, até o código certo é barrado (429)', ult.s === 429 && r.s === 429, ult.s + '/' + r.s);
// janela: código da janela anterior vale; de duas janelas atrás não
const real = Date.now; const base = real(); Date.now = () => base; enviados.length = 0; kv.clear();
await chama('/redefinir', { email: EM, did: ID }); const c0 = codDoEmail();
Date.now = () => base + 16 * 60 * 1000; r = await chama('/validar', { email: EM, did: ID, codigo: c0 }); ck('código ainda vale na janela seguinte (≥15 min)', r.s === 200, r.s);
kv.clear(); Date.now = () => base + 31 * 60 * 1000; r = await chama('/validar', { email: EM, did: ID, codigo: c0 }); ck('código vence depois de 30 min', r.s === 400, r.s);
Date.now = real;
r = await chama('/x', { email: EM, did: ID }); ck('rota desconhecida → 404', r.s === 404);
r = await chama('/redefinir', null, 'https://app.teste', 'GET'); ck('GET → 405', r.s === 405);
const semKv = { ...env }; delete semKv.LIMITE; const rr = await w.fetch(new Request('https://w.test/redefinir', { method: 'POST', body: '{}' }), semKv); ck('sem KV/segredo → 500 (não funciona sem limite)', rr.status === 500);
console.log(falhas ? falhas + ' FALHA(S)' : 'TUDO OK'); process.exit(falhas ? 1 : 0);
