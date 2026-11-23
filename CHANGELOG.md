# Histórico de versões

Todas as mudanças relevantes do Ekoa Tapiruçu. A versão publicada fica em [`version.json`](version.json), e o próprio app avisa quando há atualização.

## [21] — 2026-11-23 — Relatório em PDF
- Novo botão Relatório PDF no painel (geral, fazenda, pasto, lote e rebanho) e na ficha do animal. Abre uma folha A4 com a marca Ekoa e os mesmos números do painel, com gráficos e tabelas.
- Salvar PDF usa a impressão do navegador (Salvar como PDF) e funciona sem internet. O botão E-mail abre o app de e-mail do aparelho, já endereçado ao e-mail cadastrado e com um resumo; o PDF salvo é anexado por você.

## [20] — 2026-11-23 — Característica do animal no Modo Campo
- Na lista da lida, o botão Ver características dos animais mostra o brinco com o texto da característica (chifre, mancha, temperamento). A busca passa a achar o animal pelo brinco ou por parte da característica.
- O lápis ao lado de cada animal permite anotar, alterar ou apagar a característica no curral; a tela do peso mostra a característica no cabeçalho e tem o botão Alterar. A edição vai para o escritório na sincronização.

## [19] — 2026-11-23 — Aviso de privacidade do e-mail
- Novo aviso Como usamos o seu e-mail, no cadastro da senha e em Mais > Senha do aplicativo > e-mail. Explica a finalidade (boas-vindas e código de nova senha), que informar o e-mail é opcional, onde ele fica guardado, que a mensagem enviada fica na caixa de saída da conta de envio da Ekoa e como remover o e-mail ou pedir a exclusão.

## [18] — 2026-11-23 — Manejo a realizar no Modo Campo
- Novo card Manejo a realizar no início do Modo Campo: mostra, por lote e pasto, os animais sem manejo há mais de 30 dias e as aplicações sanitárias agendadas (vencidas ou dos próximos 7 dias).
- Ao tocar no lote, aparecem o pasto, os brincos pendentes com os dias sem manejo e os botões para escolher a lida (pesar, vacina e remédio, trocar de lote ou mudar de pasto). O lote já vai preenchido.
- Tocar numa aplicação agendada repete o produto e a dose; o app pergunta só a carência e a próxima data.
- Na lista de animais da lida, os que estavam pendentes aparecem destacados com os dias sem manejo.

## [17] — 2026-11-23 — E-mail ativado
- O envio de e-mail passa a funcionar: o cadastro envia a mensagem de boas-vindas e o Esqueci a senha envia o código de 8 caracteres para o e-mail cadastrado.
- O envio sai por uma conta Gmail da Ekoa, com limite diário e limite por e-mail para evitar abuso. Se o envio não estiver disponível, o app segue com o código anotado.
- Sem internet, a mensagem de boas-vindas espera a conexão voltar.

## [16] — 2026-11-23 — Acabamento visual e e-mail para recuperar a senha
- Cadastro da senha agora pede e-mail (com a opção Continuar sem e-mail). O e-mail fica só neste aparelho e recebe uma mensagem de boas-vindas; sem internet, o envio espera a conexão voltar.
- Esqueci a senha: além do código anotado, dá para receber um código de 8 caracteres no e-mail cadastrado (vale 15 min, 5 tentativas). Em Mais > Senha do aplicativo dá para adicionar, alterar ou remover o e-mail. O envio depende de ativar o serviço de e-mail da Ekoa (pasta servidor-email); até lá o app segue com o código anotado.
- Nomes longos de fazenda, pasto, lote e brinco passam a quebrar em várias linhas em vez de serem cortados (Início, Modo Campo e listas).
- No tema escuro, títulos de janelas, asterisco de campo obrigatório e botões de alerta ficaram legíveis (antes, contraste muito baixo).
- Links, botões verdes e dourados e subtítulos com contraste de leitura adequado; botões pequenos, ajuda (?) e links ganharam área de toque de 44 px no celular.
- Tabelas largas mostram uma sombra na lateral quando há mais colunas para rolar; cabeçalhos e selo BETA ficaram maiores.

## [15] — 2026-11-23 — Excluir fazenda e senha de acesso para demonstrações
- Excluir fazenda do aparelho: em Editar fazenda, o botão Excluir mostra o que sai junto (animais, lotes, pastos, lidas e fotos) e guarda uma cópia para desfazer. A exclusão vale só neste aparelho e não apaga a fazenda nos outros.
- Senha ao abrir o app: no primeiro acesso o app pede para criar uma senha e mostra um código de recuperação uma única vez. Há bloqueio após 5 erros. Em Mais > Senha do aplicativo dá para bloquear agora, trocar, desativar, ativar digital ou rosto do aparelho e escolher por quanto tempo o app não pede a senha de novo (1 h a 7 dias). É uma proteção para demonstrações; não criptografa os dados. O Modo Campo continua com o PIN próprio e não pede a senha.

## [14] — 2026-11-22 — Piloto mais seguro: lida sem duplicidade e Modo Campo reforçado
- Leitura repetida do mesmo brinco (leitor Bluetooth ou digitação) deixa de tirar o animal da lida: o app avisa que ele já está lá e nada muda. Tirar um animal continua possível tocando nele na lista, com Desfazer.
- Brinco digitado ou lido com letras agora é respeitado por inteiro. Antes, as letras eram descartadas e "XX001" podia virar o animal NL001.
- O mesmo parto lançado em dois aparelhos não duplica mais o bezerro: o app confere o brinco ao finalizar a lida e ao importar o arquivo, e lista na prévia o que ficou de fora.
- Conflito de edição entre aparelhos passa a aparecer na prévia da importação e em Sincronizar, com a versão que não valeu guardada.
- Arquivo com identificador inválido (como "constructor") não trava mais o app. Se algo impedir a abertura, uma tela de recuperação permite baixar uma cópia dos dados e voltar à última cópia automática.
- Modo Campo: o nome do aparelho sai do cabeçalho, o PIN tem bloqueio após 5 erros e "Esqueci o PIN" passa a usar um código de recuperação mostrado uma única vez ao ligar.
- Teclado de peso inteiro em telas baixas (iPhone SE/5), paisagem com teclado ao lado e app instalado travado em retrato.
- Toque duplo em Salvar peso não cai mais em Concluir; o botão da data ficou com área de toque de 44 px.
- Datas inexistentes (31/02) e anos fora de 1900-2100 são recusados.
- Exportação avisa quando o arquivo passa de 24 MB (fotos) e oferece exportar sem elas; a importação explica o limite de 30 MB.

## [13] — 2026-11-21 — Modo Campo para o curral
- Novo Modo Campo: ligado por aparelho, deixa o app simples para quem lança no curral. Uma pergunta por tela, botões grandes, teclado numérico próprio e confirmação clara a cada animal.
- Cobre todos os apontamentos: pesar, vacina e remédio (produto, dose, carência e próxima aplicação), trocar de lote, mudar o lote de pasto, nascimento e morte, perda ou venda.
- Ache o animal tocando no brinco da lista do lote ou digitando só os números. Também funciona com leitor de brinco por Bluetooth.
- Proteções: peso muito diferente do último pede confirmação, animal de outro lote é avisado, e cada lançamento pode ser desfeito na hora.
- A lida concluída no campo vai para o escritório como "Do campo · conferir": viaja na exportação, mas só altera o rebanho quando o gestor confere e finaliza.
- Sair do Modo Campo exige o PIN do gestor.

## [12] — 2026-11-21 — Tela inicial com todas as fazendas
- A tela inicial passa a mostrar o consolidado de todas as fazendas: cabeças, pastagem, lotação geral, arrobas em 90 dias, carência e animais sem manejo.
- Logo abaixo, um cartão por fazenda com cabeças, pastos, lotes, UA/ha, GMD e os alertas dela. Tocar na fazenda passa a usá-la no aparelho e abre o painel dela.
- Últimas lidas agora reúnem todas as fazendas, com o nome da fazenda quando a lida é de outra.
- O app passa a se chamar Ekoa Tapiruçu - Gestão do Rebanho.

## [11] — 2026-11-21 — Nome da fazenda sempre visível no mapa geral
- No mapa com todas as fazendas, o nome e as cabeças de cada uma aparecem mesmo com o mapa afastado. Antes, fazendas pequenas na tela ficavam sem rótulo.

## [10] — 2026-11-21 — Pasto e lote separados, painéis em árvore e foto do animal
- Pasto e lote deixam de ser a mesma coisa: o pasto é o lugar (área, contorno, lotação e metas de manejo) e o lote é o grupo de animais que o ocupa. A atualização converte os cadastros atuais sozinha, sem perder nada.
- Rotação de pastagem: "Mover de pasto" registra a saída e a entrada com data. O app passa a mostrar dias de ocupação, dias de descanso, ciclos e quando o pasto está pronto para receber o lote.
- Metas por forrageira (Mombaça, Marandu, Xaraés e outras) com ocupação, descanso e altura de entrada e saída, nas referências da Embrapa. O app também indica quantos pastos a rotação pediria.
- Painéis em árvore: todas as fazendas → fazenda → pasto, lote ou rebanho. Cada nível com seus próprios indicadores, incluindo @/ha por pasto e composição do rebanho por faixa de peso.
- Navegação: trilha no alto da tela com a fazenda que você está vendo e um botão Voltar que devolve exatamente para onde você estava.
- Menu lateral recolhido nas telas largas, só com ícones; o nome aparece ao passar o mouse. O botão ☰ fixa a sua preferência.
- Mapa com todas as fazendas numa visão só, cada uma com o nome e quantas cabeças tem.
- Foto do animal ou do brinco e campo de característica (chifre, mancha, temperamento). A foto é reduzida no aparelho e viaja na sincronização.
- Novo Pastos CSV e colunas de pasto no Inventário e nos Lotes CSV.
- Arquivos da versão 9 continuam sendo importados: o lote antigo vira pasto + lote com a mesma regra, sem conflito.

## [9] — 2026-11-21 — Modo escuro e sincronização mais clara
- Modo escuro nos tons do Ekoa Saber. O botão de tema alterna Automático (segue o celular), Claro e Escuro, e a escolha fica guardada no aparelho.
- Corrigido: importar o próprio arquivo mostrava registros "em conflito" sem diferença real. Agora eles aparecem como iguais.
- O nome do arquivo exportado usa a hora local do aparelho (antes saía em UTC, 3 horas à frente de Brasília).
- A prévia avisa quando o arquivo saiu do mesmo aparelho e explica: exporte no celular e importe no computador.
- Ao nomear o aparelho, o app sugere "Celular de …" ou "Computador do escritório" e alerta se o nome for igual ao de uma fazenda.

## [8 beta] · 21/11/2026 · Ekoa Ajuda, lidas em cascata e painel da fazenda
- **Ekoa Ajuda:** botão "?" no cabeçalho de cada tela e do editor de lida (tecla F1 no computador); temas com para que serve, passo a passo, regras do app, dúvidas frequentes e os cenários do roteiro beta a conferir. Central de ajuda com busca (menu → Ajuda e Mais → Ekoa Ajuda).
- **Cascata de cadastros nas lidas:** Fazenda → Lote/piquete → Animais. A fazenda só muda enquanto a lida não tem animais. Lista "Animais de …" com os elegíveis do lote (no nascimento, só fêmeas), busca e barra de progresso.
- **Validação da pré-seleção:** brinco de outro lote pede confirmação antes de entrar; brinco de outra fazenda é recusado com o nome da fazenda dele.
- **Lida em grupo:** sem lote escolhido, o primeiro brinco define o lote e os demais animais viram a fila. "Adicionar todos" em sanitário e troca.
- **Painel da fazenda:** escopo (uma fazenda ou todas) e período; ganhos e perdas (rebanho inicial e final, entradas, vendas, perdas e % do rebanho, ganho de peso, GMD, arrobas estimadas e @/ha); evolução de 12 meses (cabeças, peso médio, ganho no mês) com dica e tabela; comparativo entre fazendas; detalhe do piquete com a evolução dele.
- **Cálculo por fazenda** com histórico de lote de cada animal (trocas e mudança na finalização), para atribuir o ganho ao piquete onde o animal estava.
- Cores dos gráficos validadas (teal `#00909F`, cobre `#C86A2C`): faixa de luminosidade, saturação, separação para daltonismo e contraste.

## [7 beta] · 21/11/2026 · Exportação corrigida no computador
- **Corrigido:** "Exportar dados" no computador falhava com "Não foi possível exportar agora" quando havia lida em aberto. A confirmação consumia o clique recente e o compartilhamento nativo do Windows era recusado, sem plano B.
- Computador: baixa o arquivo direto. Celular: compartilhamento nativo e, se o sistema recusar (exceto cancelamento), download.
- Sincronizar movido para o fim do menu lateral.

## [6 beta] · 21/11/2026 · Mapa da fazenda e dos piquetes
- **Mapa da fazenda** (nova tela): cartões das fazendas, perímetro, piquetes coloridos pela ocupação (até 85%, 85 a 100%, acima de 100%), ponto da sede e dos pastos, rótulos com animais e ocupação. Toque no piquete abre o resumo e a lista de animais.
- **Motor de mapa próprio, sem bibliotecas:** projeção Web Mercator, arrastar, aproximar (botões, roda do mouse, dois dedos), fundo OpenStreetMap ou satélite com internet e desenho em SVG sempre disponível. Os blocos de fundo já vistos ficam guardados para uso offline.
- **Importar contorno:** .zip do CAR (shapefile, inclusive .zip dentro de .zip, com escolha da camada), .kml/.kmz do Google Earth e .geojson. Destinos: perímetro da fazenda, piquetes (um lote por polígono, casando pelo nome) ou contorno de um lote. Coordenadas projetadas (UTM) são recusadas com orientação.
- **Desenhar piquete** tocando nos cantos, ou **percorrer a cerca com o GPS** (ponto a cada 3 m, só com precisão de até 30 m, offline).
- **Área calculada** (geodésica) pelo contorno; passa a valer na lotação do lote e, sem área informada, na lotação da fazenda (soma dos piquetes).
- **KPIs clicáveis:** Animais ativos, Em carência e Sem manejo abrem o Rebanho filtrado; novo KPI Fazendas abre o mapa.
- **Ficha do animal:** fazenda, lote, pasto, localização e minimapa do piquete, com atalho "Ver no mapa".

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
