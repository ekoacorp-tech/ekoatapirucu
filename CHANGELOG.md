# Histórico de versões

Todas as mudanças relevantes do Ekoa Tapiruçu. A versão publicada fica em [`version.json`](version.json), e o próprio app avisa quando há atualização.

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
