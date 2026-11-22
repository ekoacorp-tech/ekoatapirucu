# Serviço de e-mail do Ekoa Tapiruçu

Envia a mensagem de boas-vindas e o código de nova senha. Roda como um Cloudflare Worker (gratuito para este volume) e usa o Resend para o envio.

## Publicar (uma vez)
1. Resend: crie a conta, verifique o domínio de envio e gere uma chave de API.
2. `npm i -g wrangler` e `wrangler login`.
3. `wrangler kv namespace create LIMITE` e cole o `id` no `wrangler.toml`.
4. No `wrangler.toml`, ajuste `DE` (remetente do domínio verificado) e `ORIGENS` (endereço onde o app roda, sem barra final).
5. `wrangler secret put RESEND_KEY` e `wrangler secret put SEGREDO` (qualquer texto aleatório com 32+ caracteres).
6. `wrangler deploy`. Copie a URL gerada.
7. No `index.html`, preencha `const EKOA_MAIL_API = 'URL-gerada'`, aumente a versão e publique o app.

## Teste local
`node servidor-email/teste.mjs` roda 20 verificações com KV e Resend simulados.

## O que o serviço guarda
Nada de e-mail ou senha. O KV guarda contadores com prazo curto, identificados por hash. O código é calculado (HMAC) a partir de e-mail + aparelho + janela de 15 min.

## Limites e riscos conhecidos
- A senha do app é uma pré-camada para demonstrações e não criptografa os dados do aparelho. Quem tem o aparelho desbloqueado já alcança os dados; o código por e-mail só evita ficar sem acesso.
- O código vai sempre para o e-mail guardado no aparelho, nunca para um digitado na hora.
- Máximo de 5 pedidos de código por hora e 5 tentativas erradas por janela por aparelho.
- O Resend processa o e-mail do usuário: informe isso na política de privacidade (LGPD).
