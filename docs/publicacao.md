# Publicação de atualizações

O app é publicado pelo **GitHub Pages** a partir da branch **`gh-pages`**, pasta raiz. A `main` é a branch de trabalho; a `gh-pages` é a cópia publicada. Endereço: https://ekoacorp-tech.github.io/ekoatapirucu/

## Para publicar uma nova versão

1. Faça as alterações em `index.html` (e demais arquivos).
2. Suba o número da versão **nos três lugares**, sempre com o mesmo número inteiro:
   - `index.html` → `const APP_VERSION = N;`
   - `sw.js` → `const V = 'ekoa-tapirucu-vN';`
   - `version.json` → `"versao": N`, `"rotulo"`, `"data"`, `"titulo"` e a entrada `"N"` em `notas`
3. Registre a versão no `CHANGELOG.md`.
4. Teste localmente (`python3 -m http.server` na pasta e abra `http://localhost:8000`) e rode o roteiro de [homologação](homologacao.md) nos cenários afetados.
5. Faça o commit e o push para `main` e publique com `git push origin main:gh-pages`. O Pages publica em 1 a 2 minutos (acompanhe em *Actions → pages build and deployment*).
6. Os aparelhos que abrirem o app com internet já recebem a versão nova. Quem estiver com o app aberto vê a barra **"Nova versão disponível"** e atualiza com um toque, sem perder dados.
7. Se a barra disser que a versão "ainda está chegando ao servidor", é o cache do GitHub Pages (até 10 minutos). Basta aguardar.

## Serviço de e-mail

O envio de e-mail não faz parte do app: roda à parte, em `servidor-email/`. Alterar `Codigo.gs` (Gmail) ou `worker.js` (Cloudflare) **não exige nova versão do app**, mas exige reimplantar o serviço (Apps Script: *Implantar → Gerenciar implantações → Nova versão*, a URL se mantém). Detalhes em [E-mail e recuperação da senha](email.md).

## Regras

- A âncora `ancora/v13` (branch) e `ancora-v13` (tag) ficam apenas como registro histórico. Não são mais referência: a versão publicada em `gh-pages` é a de trabalho.

- **Nunca** alterar o nome do banco (`ekoa_tapirucu`), o prefixo do cache (`ekoa-tapirucu-`) ou o campo `app` do arquivo de sincronização.
- Mudança no formato do arquivo de sincronização: subir `SYNC_FORMAT` e manter a importação do formato anterior.
- Mudança que altera dados já gravados precisa de migração no `init()` e de teste com uma cópia de dados reais.
- Cada publicação deve ter nota clara em `version.json`: é o que o usuário de campo lê.
