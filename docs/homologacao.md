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
| H18 | CSV | Exportar inventário, eventos e lotes | Abre no Excel com acentos, decimais e datas corretos | Planilha |

## Critérios de saída da Fase 1

A definir na Fase 0, junto com a chave mestra. Sugestão de partida, a validar com o gestor:

- **Adoção:** lidas finalizadas por semana e usuários ativos por semana, por 8 semanas seguidas.
- **Qualidade:** percentual de lidas reabertas para correção e de pesos fora da faixa.
- **Valor:** os indicadores da chave mestra são lidos e usados na reunião de gestão.
- **Parada:** critério objetivo para encerrar o piloto se a adoção não acontecer.
