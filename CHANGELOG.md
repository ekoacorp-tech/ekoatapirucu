# Histórico de versões

Todas as mudanças relevantes do Ekoa Tapiruçu. A versão publicada fica em [`version.json`](version.json), e o próprio app avisa quando há atualização.

## [5 beta] · 21/11/2026 · Atualização em um toque, de verdade
- **Corrigido o ciclo de atualização:** "Atualizar agora" recarregava na versão antiga. Causas: o download da versão nova passava pelo service worker, que respondia com a cópia guardada; e a página recarregava antes de o service worker novo assumir.
- **Service worker:** a tela principal passa a ser buscada na rede primeiro (revalidando o cache HTTP, limite de 4 s), com a cópia guardada como reserva offline.
- **Atualizar agora:** baixa direto da rede, confere se a versão baixada é a anunciada, espera o service worker novo assumir e só então recarrega.
- **Proteção contra ciclo:** publicação ainda a caminho gera aviso para tentar depois; atualização não concluída gera orientação para reabrir o app.

## [4 beta] · 21/11/2026 · Localização da fazenda e dos pastos
- **Modelo de dados preparado para o mapa:** fazenda e lote ganham o campo `geo` (ponto, perímetro/polígono em GeoJSON e origem). Nada lançado no piloto precisará ser refeito quando o mapa chegar.
- **Fazenda:** número do recibo do CAR e localização da sede.
- **Lote:** ponto de referência do pasto.
- **Captura pelo GPS do aparelho**, que funciona sem internet, com precisão registrada e aviso de precisão baixa; aceita coordenadas coladas do Google Maps (ponto ou vírgula decimal).
- **Sincronização no formato 2:** leva a localização com validação de cada coordenada e polígono. O formato 1 continua importável; aparelhos em versões antigas pedem atualização ao receber um arquivo do formato 2.
- **CSV de lotes** com latitude, longitude, origem da localização e indicação de polígono.

## [3 beta] · 21/11/2026 · Visual Ekoa Saber
- Identidade visual do Ekoa Saber: abertura clara com a logo, menu em degradê petróleo → café, início com logo e cartões, indicadores em blocos, tabelas leves, botões e modais arredondados.
- Rodapé do menu com a marca Ekoa Tech e o bloco Cliente (Blendcoffee).
- Movimento conforme o padrão Ekoa: só abertura, modais, avisos e hover; nada anima ao trocar de tela.

## [2 beta] · 21/11/2026 · Logo oficial do Tapiruçu
- Logo oficial aplicada na abertura, no menu, no topo do celular, no "Sobre" e nos ícones do app instalado.
- A logo entra no cache offline.

## [1 beta] · 21/11/2026 · App piloto: lidas de campo offline
- **PWA offline**, instalável em Android, iPhone e computador, com o mesmo padrão de engenharia do Ekoa Saber.
- **Cadastros:** fazenda (área de pastagem), lotes (pasto, área e lotação máxima) e carga inicial do rebanho por lista ou faixa de brincos.
- **Lidas de campo** em dois estágios (em aberto → finalizada): pesagem, sanitário com carência e próxima aplicação, troca de lote, baixa (morte, perda, venda) e nascimento com brinco automático do bezerro.
- **Regras do escopo aplicadas:** R01 dois estágios, R02 brinco alfanumérico, R03 baixa por evento, R04 animal de outro lote no manejo, R05 e R06 UA/ha e ocupação, R14 carência, R16 só lida finalizada é enviada, R17 brinco do bezerro, R19 animal sem manejo há mais de 30 dias.
- **Rebanho** com último peso, GMD, lote atual, carência e histórico por animal.
- **Painel** com peso médio, GMD, UA/ha e ocupação por lote, baixas e nascimentos do mês e próximas aplicações.
- **Sincronização** por arquivo (formato 1): integridade SHA-256, mesclagem por versão, registro de exclusão, prévia, cópia de segurança e desfazer.
- **CSV** de inventário, eventos e lotes, pronto para o Excel.
