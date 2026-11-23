# E-mail e recuperação da senha

O app envia dois e-mails, só se o usuário informar um e-mail no cadastro da senha: **boas-vindas** e **código de nova senha** (8 caracteres, 15 minutos, uso único). A senha nunca é enviada nem recebida.

## Como o app fala com o serviço

`POST` para a URL do serviço, com `Content-Type: text/plain` e corpo JSON `{ rota, email, did, codigo? }`. As rotas são `boas-vindas`, `redefinir` e `validar`. O serviço responde sempre `{ ok, motivo? }`, com `motivo` em `recusado`, `limite` ou `erro`. A URL fica na constante `EKOA_MAIL_API` do `index.html`.

## Opções de serviço (pasta `servidor-email/`)

| Opção | Quando usar | Observação |
|---|---|---|
| **Gmail (Apps Script)**, em `gmail/Codigo.gs` | Sem domínio próprio; demonstrações e piloto | Sai do Gmail de quem publica o script. Cota de cerca de 100 destinatários por dia; o script para em 80. Pode cair em spam. |
| **Cloudflare Worker + Resend**, em `worker.js` | Produto com domínio verificado | Exige domínio e conta no Resend. |

Passo a passo de cada uma em `servidor-email/README.md`. Os dois têm os mesmos testes (`teste.mjs` e `gmail/teste.cjs`).

## Regras de segurança

- O código é calculado por HMAC com segredo do serviço, ligado ao e-mail, ao aparelho e a uma janela de 15 minutos; vale na atual e na anterior, uma única vez.
- Limites: 3 boas-vindas e 5 códigos por hora por e-mail, 5 erros de código por janela, teto diário de envios. Trocar o identificador do aparelho não escapa do limite por e-mail.
- O serviço não guarda lista de e-mails; guarda só contadores com validade curta.
- Um e-mail errado digitado por terceiros recebe só a mensagem; o código de recuperação sempre vai ao e-mail guardado no aparelho.

## Privacidade (LGPD)

Há aviso dentro do app ("Como usamos o seu e-mail"): finalidade, opcionalidade, onde fica, direitos e contato. Pontos a ter em mente:

- No envio por Gmail, **a mensagem enviada fica na pasta Enviados da conta de envio**, com o endereço do usuário e o código. Limpar a pasta periodicamente.
- A URL do serviço está no código público do app. Quem a conhece pode chamá-la; os limites acima protegem a cota, mas o teto diário pode ser consumido por abuso. Para produto, migrar para o Worker com domínio.
- O texto do aviso foi redigido pela equipe técnica e deve ser revisado por jurídico e pelo encarregado de dados antes de uso com clientes.

## Reimplantar

Apps Script: colar o novo `Codigo.gs`, *Implantar → Gerenciar implantações → lápis → Nova versão*. A URL não muda. O app não precisa de atualização.
