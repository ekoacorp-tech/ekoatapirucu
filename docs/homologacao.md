# Roteiro de homologação do piloto

Cada cenário segue **Entrada → Processamento → Resultado → Evidência**. Registrar data, aparelho, versão do app e quem executou.

| # | Cenário | Entrada | Resultado esperado | Evidência |
|---|---|---|---|---|
| H01 | Primeiro acesso | Abrir o link, instalar | App instalado; funciona em modo avião | Print com modo avião |
| H02 | Cadastro base | Fazenda com área, 2 lotes com área e lotação | Lotes listados em Fazenda e lotes | Print |
| H03 | Carga inicial | Faixa `NL001-NL020` + lista `V10, V11` | 22 animais; brinco repetido é recusado | Print + CSV de inventário |
| H04 | Pesagem | 10 animais, pesos com vírgula e com ponto | Pesos gravados corretamente; brinco inexistente avisado antes do peso | Print da lida |
| H05 | GMD | Segunda pesagem 30 dias depois | GMD = ganho ÷ dias, por animal e por lote | Conta manual de 2 animais |
| H06 | Animal de outro lote (R04) | Pesar animal de outro lote | Pergunta ao finalizar; animal muda ou não conforme a resposta | Print do Rebanho |
| H07 | Sanitário com carência (R14) | "Todos do lote", carência +30 dias | 🔒 no Rebanho; Painel conta "em carência" | Print |
| H08 | Troca de lote | 2 animais para outro lote | Lote atual atualizado; histórico na ficha | Print da ficha |
| H09 | Baixa (R03) | Morte de 1 animal com causa | Sai dos ativos; aparece em Baixados e no Painel do mês | Print |
| H10 | Nascimento (R17) | Vaca sem brinco do bezerro | Bezerro criado com brinco automático, no lote da mãe | Print |
| H11 | Lida em aberto | Lida com registros, sem finalizar | Não altera o rebanho; não entra na exportação; aviso na exportação | Print |
| H12 | Correção | Reabrir lida, remover registro, finalizar | Versão sobe; rebanho recalculado | Print |
| H13 | Exportar | Exportar após o dia de campo | Arquivo `Tapirucu_<aparelho>_<data>.json`; pendências zeradas | Arquivo |
| H14 | Importar em outro aparelho | Importar o arquivo | Prévia correta; mesmos números no Painel dos dois aparelhos | Prints lado a lado |
| H15 | Volta | Corrigir e excluir no aparelho 2; importar no 1 | Correção chega; exclusão vai para a lixeira; "desfazer" restaura | Prints |
| H16 | Arquivo inválido | Editar o JSON à mão; importar CSV | Importação recusada com mensagem clara | Print |
| H17 | Atualização | Publicar versão nova | Aviso no app; atualiza sem perder dados | Print antes/depois |
| H19 | Localização da sede | Na sede, "Usar minha localização" em modo avião | Coordenada com precisão; ponto aparece no "ver no mapa" quando houver internet | Print |
| H20 | Ponto do pasto | Capturar na porteira; colar outro do Google Maps | Os dois aceitos; origem GPS ou Digitada; CSV de lotes com latitude e longitude | Print + CSV |
| H21 | Localização na sincronização | Exportar e importar em outro aparelho | Mesma coordenada, precisão e origem nos dois | Prints |
| H22 | KPIs clicáveis | Tocar em Animais ativos, Em carência e Sem manejo | Rebanho abre já filtrado | Prints |
| H23 | Perímetro pelo CAR | Baixar o .zip da consulta pública do SICAR e importar | Camada do imóvel sugerida; área próxima da área do recibo | Print + recibo |
| H24 | Piquetes por arquivo | Importar .kml/.geojson com vários piquetes | Lotes com o mesmo nome recebem o contorno; os demais são criados | Print |
| H25 | Desenho no satélite | Desenhar um piquete tocando nos cantos | Área calculada; lotação do lote passa a usar a área do mapa | Print |
| H26 | Percorrer a cerca | Rodar a cerca de um piquete com o GPS, em modo avião | Contorno salvo com origem GPS; diferença de área anotada contra o desenho | Prints |
| H27 | Mapa offline | Abrir o mapa com internet, depois em modo avião | Contornos sempre aparecem; fundo aparece nas áreas já vistas | Prints |
| H28 | Ficha do animal | Abrir um animal de um piquete com contorno | Fazenda, lote, localização e minimapa com o piquete destacado | Print |
| H29 | Lida em cascata e em grupo | Pesagem sem lote: ler um brinco; depois um de outro lote e um de outra fazenda | Primeiro brinco define o lote; outro lote pede confirmação; outra fazenda é recusada com o nome | Prints |
| H30 | Painel da fazenda | Período de 90 dias; trocar para "Todas as fazendas"; abrir um piquete | Rebanho inicial e final batem com entradas e saídas; ganho de 1 animal conferido à mão; evolução e detalhe abrem | Print + conta |
| H34 | Pasto e lote | Após atualizar, abrir Fazenda, pastos e lotes | Cada lote antigo aparece como um pasto (com a área e a lotação de antes) mais o lote que o ocupa; nenhum dado perdido | Print antes e depois |
| H35 | Rotação | Cadastrar forrageira e metas num pasto; mover o lote para outro pasto com data de 3 dias atrás; abrir o painel do pasto | Pasto de origem em descanso há 3 dias; destino ocupado há 3 dias; ciclos e histórico corretos; aviso quando passa da meta | Prints do painel |
| H36 | Painéis em árvore | Percorrer todas as fazendas → fazenda → pasto → lote → rebanho e usar Voltar | Cada nível com seus indicadores; o botão Voltar devolve exatamente à tela anterior | Prints |
| H37 | Foto e característica | Adicionar foto pelo celular, preencher a característica, exportar e importar no computador | Foto aparece na ficha e na lista nos dois aparelhos; arquivo informa o tamanho das fotos | Prints |
| H38 | Menu recolhido | Abrir painel e mapa no computador; passar o mouse no menu; usar o botão ☰ | Menu recolhe sozinho nas telas largas, mostra os nomes ao passar o mouse e guarda a preferência | Prints |
| H32 | Celular → computador | Nomear o celular ("Celular do João") e o PC ("Computador do escritório"); exportar no celular, importar no PC; depois reimportar o mesmo arquivo no celular | Nome do arquivo com a hora local; no PC tudo entra como novo; no celular a prévia mostra "iguais", 0 conflitos, e o aviso de mesmo aparelho | Prints da prévia |
| H33 | Modo escuro | Alternar o tema (Automático → Claro → Escuro); fechar e reabrir; conferir Início, Rebanho, Painel, Mapa e uma lida | Escolha mantida ao reabrir, sem piscar claro; textos, gráficos, alertas e chips legíveis; Automático segue o celular | Prints claro x escuro |
| H31 | Ekoa Ajuda | Tocar no "?" de 3 telas e buscar "CAR" na central | Ajuda do assunto da tela; busca encontra o tema de importação | Prints |
| H18 | CSV | Exportar inventário, eventos e lotes | Abre no Excel com acentos, decimais e datas corretos | Planilha |

## Critérios de saída da Fase 1

A definir na Fase 0, junto com a chave mestra. Sugestão de partida, a validar com o gestor:

- **Adoção:** lidas finalizadas por semana e usuários ativos por semana, por 8 semanas seguidas.
- **Qualidade:** percentual de lidas reabertas para correção e de pesos fora da faixa.
- **Valor:** os indicadores da chave mestra são lidos e usados na reunião de gestão.
- **Parada:** critério objetivo para encerrar o piloto se a adoção não acontecer.
