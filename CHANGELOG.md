# Histórico de versões

Todas as mudanças relevantes do Ekoa Tapiruçu. A versão publicada fica em [`version.json`](version.json), e o próprio app avisa quando há atualização.

## [32] — 2026-11-25 — Ordens de lida de todas as fazendas
- A tela Ordens de lida abre unificada quando há mais de uma fazenda: sugestões e ordens das fazendas juntas, agrupadas pelo nome da fazenda. O seletor permite ver só a fazenda ativa.
- A ordem continua pertencendo a uma fazenda só: criar pela sugestão ou pela ordem manual grava a fazenda de origem (no modal, escolha fazenda e lote). O campo de cada fazenda vê só as ordens dela.
- Fazer agora uma ordem de outra fazenda troca para essa fazenda e abre a lida nela. Criar todas cria uma ordem por sugestão, cada uma na sua fazenda.

## [31] — 2026-11-25 — Peso de venda e Ordem de Lida
- Peso esperado para a venda, por animal: informe no cadastro (Editar cadastro) ou, ao adicionar animais, o mesmo valor para todos. Fica visível na ficha do animal.
- Previsão da data de atingimento: o app usa o ganho médio das pesagens dos últimos 120 dias. Só calcula com 2 ou mais pesagens que cubram 21+ dias e com ganho positivo; sem isso mostra "sem base" e o motivo, sem inventar data. Mostra a confiança (alta ou média) e deixa claro que é estimativa.
- Conferência por pesagem: quando a data prevista chega a 21 dias e o animal está sem pesar há 7+ dias, Atenção agora avisa e abre uma lida de pesagem (motivo Pré-venda) no lote, mostrando o peso esperado de cada animal e o desvio. Ao finalizar, o esperado fica gravado no registro e a previsão é recalculada com o peso real.
- Peso de venda e o esperado viajam na sincronização. Ainda não aparece no Modo Campo nem na importação de planilha (CSV).
- Ordem de Lida (menu e Mais): o app sugere o que fazer (perda de peso, sem manejo há mais de 30 dias, pesagem vencida, peso de venda próximo, carência terminando, aplicação atrasada, campanha com animais faltando) e você cria a ordem com um toque, ou cria uma manual com lote, manejo, prazo e operador opcional. Nada vira ordem sem você, e cada animal entra em uma sugestão só.
- A ordem vai na carga para o campo e aparece em Manejo a realizar. O campo começa a lida já no lote certo, conclui, e a ordem fica Feita; a lida volta para você conferir. Se duas lidas forem feitas para a mesma ordem, o app avisa antes de finalizar a segunda. A fazenda é o endereço; o operador é só indicação. Funciona por arquivo, sem servidor.

## [30] — 2026-11-25 — Vacinas e medicamentos
- Nova tela Insumos (menu e Mais): registre a compra de vacinas e remédios com produto, fabricante, lote de fabricação, validade, quantidade em doses e custo total. O app mostra o saldo, avisa quando vence em até 30 dias e marca o vencido.
- Na lida sanitária, escolha o Produto do estoque: o app baixa as doses quando o gestor finaliza e calcula o custo da aplicação (por animal e por lote). Produto vencido na data do manejo ou sem saldo não deixa finalizar a lida. Lida enviada do campo e ainda não finalizada reserva as doses: duas lidas não disputam o mesmo saldo até a conferência, e a reserva se desfaz sozinha se a lida for excluída ou reaberta. No Modo Campo, o passo do produto lista o estoque disponível, o que vence primeiro em cima.
- Custo sanitário na tela Insumos: total, por animal ativo e por lote. Só entra o que foi aplicado com produto do estoque que tenha o valor da compra informado (ou com o custo por dose digitado na lida); o resto aparece como fora do custo. A tela mostra a cobertura do custo (% das aplicações que entraram), quais produtos ficaram de fora e marca "sem custo" nas entradas sem valor. Com cobertura abaixo de 100%, o custo por animal é apresentado como estimativa.
- Campanhas obrigatórias: defina o que aplicar, em quais categorias e até quando. O app conta quem já recebeu (só lida finalizada ligada à campanha) e quem falta, mostra a barra de progresso, alerta em Atenção agora quando faltam 7 dias ou menos ou o prazo venceu, e abre a lida da campanha já pronta, com o botão Só quem falta na campanha. No Modo Campo, a campanha aparece em Manejo a realizar.
- Insumos e campanhas viajam na sincronização e na carga para o campo, como o resto dos cadastros.

## [29] — 2026-11-25 — Morte com prova
- Morte e perda exigem foto do animal: no app completo e no Modo Campo, a baixa só é lançada com a foto (câmera do aparelho). A foto viaja na sincronização junto com a lida.
- Validação do gestor: baixa lançada no Modo Campo chega marcada A validar. Na conferência o gestor vê a foto e a causa, e valida ou recusa (com motivo registrado). Recusada, a baixa sai da lida e o animal continua no rebanho. A lida de morte ou perda só finaliza com todas as fotos e validações.
- Baixa lançada pelo gestor no app completo já entra validada (ele mesmo está lançando).
- Atenção agora mostra quantas baixas por morte ou perda esperam foto ou validação. Venda não exige foto nem validação.

## [28] — 2026-11-23 — Base de confiança
- Importar animais de planilha (CSV): em Adicionar animais, botão Importar de planilha. Aceita ; , ou tabulação, acentos do Excel, datas dd/mm/aaaa. Só brinco e sexo são obrigatórios; o lote vem da planilha ou de um lote padrão. Mostra quantos estão prontos e quais linhas têm problema (brinco repetido ou já cadastrado, lote inexistente, peso absurdo, data impossível ou no futuro) antes de importar. Há modelo para baixar.
- Proteção dos dados: Sincronizar mostra se o navegador protege o armazenamento deste aparelho, o espaço usado e a idade da última cópia, com botão Pedir proteção e orientação para o iPhone.
- Versões diferentes: importar arquivo gerado por versão mais nova do app agora avisa e deixa recusar, para não perder campos novos.

## [27] — 2026-11-23 — Painel em escada
- Painel em escada: quatro abas no topo — Fazenda, Lotes, Pastos e Rebanho. O filtro de fazenda (uma ou Todas) vale para todas as abas e se mantém ao navegar.
- Atenção agora: no topo de cada aba, o que pede ação na ordem de importância (aplicação atrasada, animal que perdeu peso, lote que parou de ganhar ou sem pesar, pasto que passou da meta). Um toque leva à lista ou ao detalhe certo, mesmo em outra fazenda.
- Aba Lotes: todos os lotes numa lista com peso médio, GMD com seta comparando a pesagem anterior, dias no pasto e situação (Em dia, Pesagem vencida, Ganho caiu, Parou de ganhar). No detalhe do lote: uniformidade do peso e última pesagem com a cobertura.
- Aba Pastos: situação de cada pasto, lotação contra o máximo, dias contra a meta e @/ha por pasto, com a ordem por quem pede ação.
- Aba Rebanho em Todas as fazendas, com novos números: Perderam peso e Pesagem vencida. Na Fazenda: Capacidade ociosa em UA.
- Botão ? em cada número: o que é, como é calculado e o que fazer com ele, sem sair do app. O painel agora diz a data da última pesagem e avisa que mostra produção, não lucro.
- Topo do Painel mais enxuto no celular: planilhas CSV recolhidas e filtros lado a lado.

## [26] — 2026-11-23 — Carga para o campo e cópia de segurança
- Carga para o campo: novo cartão em Sincronizar, com os 4 passos (o escritório cadastra, gera a carga, o campo recebe e depois envia de volta). O arquivo é o mesmo da sincronização, com o nome Tapirucu_Carga_…, e leva os cadastros e o histórico finalizado. Não leva o Modo Campo nem o PIN.
- Aparelho do campo sem dados: a tela agora explica os 3 passos para receber a carga.
- Aviso de perda de dados: quando há registros só neste aparelho e a última exportação foi há 3 dias ou mais (ou nunca), o Início mostra Faça uma cópia, com o botão Exportar agora, e o Modo Campo lembra de enviar ao escritório. O app não consegue ser avisado na hora de desinstalar; o aviso é a proteção possível.

## [25] — 2026-11-23 — Lidas à vista, em qualquer fazenda
- Lidas em outras fazendas: o aviso do Início passa a contar só a fazenda em uso, e uma linha separada diz quais outras fazendas têm lida em aberto ou para conferir, com o botão Ir para lá (troca a fazenda e abre a lista). Na tela Lidas, quando o filtro vem vazio, o app diz onde estão as lidas. Corrige o Ver que abria uma lista vazia.

## [24] — 2026-11-23 — Cadastro guiado, painel de ocupação e controle do gestor
- Novo painel visual de ocupação: um quadro por pasto, com a situação (ocupado, em descanso, pronto para entrar, nunca ocupado), os lotes que estão lá, a barra de dias contra a meta e o aviso de pasto que passou da meta. Aparece na aba Pastos e no painel da fazenda, com atalho para o mapa.
- Cadastro guiado de primeiro uso (passo a passo): fazenda, primeiro pasto e primeiro lote, em três telas, com o resto opcional. Aparece na tela inicial e em Fazendas quando não há nada cadastrado, e termina oferecendo cadastrar os animais.
- Pasto: o botão Excluir virou Excluir ou arquivar, com o resumo do que o pasto tem (ciclos de ocupação, lotes, período). Arquivar tira o pasto das listas e mantém o histórico; se o pasto está ocupado, o app diz qual lote precisa sair antes.
- Modo Campo: trocar de fazenda agora pede o PIN do gestor. Aparelho sem PIN (versão antiga) continua abrindo direto.
- Quem está usando: com Modo Campo e PIN, o nome só muda com o PIN do gestor, e fica o mesmo nos dias seguintes até o gestor trocar. Sem PIN, o app continua perguntando uma vez por dia. Serve para controlar a entrega do aparelho; não é segurança contra quem sabe mexer.
- Exportar: no celular, o compartilhamento já leva o arquivo anexado e uma mensagem com fazenda, aparelho e operador. Um site não consegue abrir o WhatsApp direto com o anexo; o app abre a lista de compartilhamento e você escolhe o WhatsApp. No computador o arquivo é baixado, como antes.
- Histórico do animal (tela e PDF): nova coluna Lançado por, com o nome de quem fez a lida e o aparelho. O rodapé do PDF diz quem gerou e em qual aparelho. Tabelas do PDF com cabeçalho, linhas alternadas e Página X de Y.
- Início: saíram a logo e os textos de marca; fica o título e a fazenda em uso. Novo indicador Aplicações atrasadas (vacinas e remédios com a data vencida).
- Senha do app: nova opção Nunca pedir (só ao tocar em Bloquear agora). Reduz a proteção do aparelho; a senha não criptografa os dados.

## [23] — 2026-11-23 — Números que orientam
- Arrobas passam a mostrar até quando vão os dados ("dados até DD/MM, N de M animais"). Sem pesagem recente, o número de arrobas fica abaixo do real, e agora isso aparece na tela.
- O ganho de peso de um animal que trocou de lote ou de pasto é repartido pelos dias em cada um, e não mais todo no último. Isso corrige o @/ha por pasto e o ganho por lote.
- Perdas mostram também a mortalidade anualizada (≈ X%/ano) quando o período tem 30 dias ou mais.
- Próximas aplicações sanitárias mostra, em destaque, as aplicações com a data vencida (atrasada há N dias). Só vale a última aplicação de cada produto e lote.
- Pasto ou lote com animal sem peso avisa que a lotação (UA/ha) pode estar subestimada, e a lotação geral informa que só entram animais com peso.
- Ao finalizar uma pesagem, o app confirma pesos que diferem mais de 30% do anterior e avisa se há outra lida igual do mesmo lote ainda aberta ou esperando conferência (pode ser a mesma lida lançada em dois aparelhos).
- Fazenda, pastos e lotes agora tem uma aba para cada cadastro, com contador. O botão de novo cadastro fica dentro de cada aba, e a ordem é guiada: Novo pasto só aparece com fazenda e Novo lote só com pasto, com a explicação do que falta. Cada aba avisa pendências (fazenda ou pasto sem área, lote sem pasto) e o novo lote exige escolher o pasto.

## [22] — 2026-11-23 — Dados que não mentem
- Edição ao mesmo tempo não se perde mais: cada registro leva um carimbo por aparelho. Se dois aparelhos ou duas janelas mudam o mesmo registro, o app guarda a versão que não valeu em vez de apagar sem aviso. Duas janelas abertas do app se atualizam sozinhas.
- Começar de novo a mesma lida no Modo Campo (mesmo manejo, lote e dia) continua a lida que já estava aberta, em vez de criar uma segunda. No escritório, o app pergunta antes de abrir outra lida sem lote do mesmo tipo.
- Lida aberta com data de outro dia mostra um aviso para trocar a data.
- Se o aparelho não conseguir gravar (espaço cheio), aparece uma faixa vermelha fixa no topo, que só some quando voltar a gravar. Com mais de 80% do espaço usado, aparece um aviso amarelo para exportar o arquivo.
- Quem está usando: ao começar a lançar, o app pergunta o seu nome (uma vez por dia). O nome fica registrado em cada registro novo ou alterado, aparece em Lançada no Modo Campo e no CSV de eventos (coluna Lancado por). Serve para saber quem fez; não é senha.

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
