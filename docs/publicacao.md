# Publicação de atualizações

O app é publicado pelo **GitHub Pages** a partir da branch `main`, pasta raiz. Endereço: https://ekoacorp-tech.github.io/ekoatapirucu/

## Para publicar uma nova versão

1. Faça as alterações em `index.html` (e demais arquivos).
2. Suba o número da versão **nos três lugares**, sempre com o mesmo número inteiro:
   - `index.html` → `const APP_VERSION = N;`
   - `sw.js` → `const V = 'ekoa-tapirucu-vN';`
   - `version.json` → `"versao": N`, `"rotulo"`, `"data"`, `"titulo"` e a entrada `"N"` em `notas`
3. Registre a versão no `CHANGELOG.md`.
4. Teste localmente (`python3 -m http.server` na pasta e abra `http://localhost:8000`) e rode o roteiro de [homologação](homologacao.md) nos cenários afetados.
5. Faça o commit e o push para `main`. O Pages publica em 1 a 2 minutos.
6. Os aparelhos instalados veem a barra **"Nova versão disponível"** ao abrir o app com internet e atualizam com um toque, sem perder dados.

## Regras

- **Nunca** alterar o nome do banco (`ekoa_tapirucu`), o prefixo do cache (`ekoa-tapirucu-`) ou o campo `app` do arquivo de sincronização.
- Mudança no formato do arquivo de sincronização: subir `SYNC_FORMAT` e manter a importação do formato anterior.
- Mudança que altera dados já gravados precisa de migração no `init()` e de teste com uma cópia de dados reais.
- Cada publicação deve ter nota clara em `version.json`: é o que o usuário de campo lê.
