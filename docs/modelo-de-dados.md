# Modelo de dados

Campos-chave do piloto, com origem no **Escopo de Validação Ekoa Tapiruçu** (Anexo B) e o destino provável no ERP. A coluna "Candidato no Sankhya" é hipótese de desenho, **não validada** em ambiente Sankhya.

## Campos comuns a todo registro (rastreabilidade)

| Campo | Conteúdo |
|---|---|
| `id` | UUID gerado no aparelho. Chave de idempotência da integração: reenviar não duplica. |
| `versao` | Começa em 1; sobe a cada edição gravada (reabrir e finalizar, editar cadastro, restaurar da lixeira). |
| `criadoEm`, `editadoEm`, `exportadoEm` | Datas ISO 8601 (UTC). Pendente de exportação = `exportadoEm` vazio ou anterior a `editadoEm`. |
| `origem`, `editadoNo` | Aparelho `{ id, nome }` que criou e que editou por último. |

## Fazenda (B.1)

| Campo | Tipo | Obrig. | Observação | Candidato no Sankhya |
|---|---|---|---|---|
| `nome` | texto (80) | Sim | Único no aparelho | Empresa ou tabela própria (AD_) |
| `municipio` | texto (80) | Não | | |
| `areaHa` | decimal | Não | Base do UA/ha da fazenda | |
| `car` | texto (60) | Não | Número do recibo do CAR (Cadastro Ambiental Rural) | Campo AD_ na empresa ou na tabela de fazendas |
| `geo` | objeto | Não | Ver **Geolocalização** abaixo; `perimetro` = limite da propriedade | Campos AD_ (lat, lng) + CLOB com GeoJSON |

## Pasto e Lote — duas entidades (desde a versão 10)

Até a versão 9 o "lote" guardava ao mesmo tempo o **lugar** (área, contorno, lotação) e o **grupo de animais**. Isso impedia medir rotação: quando o gado mudava de pasto, não havia como separar o que era do lugar e o que era do grupo. A partir da versão 10:

- **Pasto (piquete):** o lugar. Não se move.
- **Lote:** o grupo de animais. Ocupa um pasto hoje e outro amanhã, continuando o mesmo lote.

### Pasto

| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `fazendaId` | ID | Sim | |
| `nome` | texto (60) | Sim | Único na fazenda |
| `areaHa` | decimal | Não | Base do UA/ha. O contorno no mapa (`geo.areaHa`) prevalece sobre o valor digitado |
| `lotacaoMax` | decimal (UA/ha) | Não | Base da ocupação (R06) |
| `forrageira` | texto (40) | Não | Preenche as metas sugeridas |
| `diasOcupacao` | inteiro | Não | Meta de dias com o lote dentro (referência Embrapa: 1 a 7) |
| `diasDescanso` | inteiro | Não | Meta de dias sem animais, para a rebrota |
| `alturaEntrada`, `alturaSaida` | inteiro (cm) | Não | Régua de manejo: o sinal de campo |
| `ativo` | booleano | Sim | Pasto ocupado não pode ser inativado nem excluído |
| `geo` | objeto | Não | Ver **Geolocalização**; `poligono` = limite do pasto |

### Lote

| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `fazendaId` | ID | Sim | |
| `nome` | texto (60) | Sim | Único na fazenda |
| `pastoId` | ID | Não | Espelho da ocupação aberta: o pasto de hoje |
| `ocupacoes[]` | lista | Sim | `{ p: pastoId, de: data, ate: data ou null }`, ordenada por `de`. A ocupação sem `ate` é a atual |
| `ativo` | booleano | Sim | Lote com animais ativos não pode ser inativado |

### Migração e compatibilidade

Cada lote antigo vira um pasto mais o lote que o ocupa. A regra é **determinística**: o id do pasto é `pa-<id do lote>` e os carimbos (`versao`, `criadoEm`, `editadoEm`, `origem`) são copiados do lote. Dois aparelhos que migram o mesmo lote produzem registros idênticos, então a sincronização não duplica nem gera conflito. A mesma função converte arquivos de formato 1 e 2 na importação (`migraPkg`), o que mantém a versão 9 interoperável com a 10 na direção antiga → nova.

Para o histórico, datas anteriores à primeira ocupação são atribuídas ao primeiro pasto do lote. Sem essa regra, todo o ganho anterior à migração ficaria sem pasto.

### Rotação — como os números nascem

| Indicador | Cálculo |
|---|---|
| Dias de ocupação | hoje − `de` da ocupação aberta |
| Dias de descanso | hoje − maior `ate` entre as ocupações encerradas, quando não há ocupação aberta |
| Ciclos | ocupações do pasto que tocam o período |
| Descanso médio | média dos intervalos entre uma saída e a entrada seguinte |
| Pastos recomendados | (descanso ÷ ocupação) + 1, média dos pastos com meta — referência Embrapa |
| @/ha do pasto | ganho atribuído ao pasto no período ÷ 30 kg ÷ área do pasto |

O ganho é atribuído ao pasto onde o animal estava **na data da pesagem final** de cada intervalo, pela cadeia animal → lote (histórico de trocas) → pasto (histórico de ocupações).

## Geolocalização (preparação do mapa)

Padrão **WGS84 (EPSG:4326)**, o mesmo do GPS, do Google Maps e do CAR (após conversão).

```text
geo: {
  ponto: { lat, lng, precisaoM, em, fonte: "gps" | "manual" } | null,
  perimetro (fazenda) | poligono (lote): GeoJSON Polygon/MultiPolygon | null,
  fontePoligono: "car" | "arquivo" | "desenho" | "gps" | null,
  areaHa: número | null   // calculada a partir do contorno
}
```

| Regra | Detalhe |
|---|---|
| Ponto | Graus decimais com 6 casas (cerca de 10 cm). `precisaoM` vem do GPS; ponto digitado fica sem precisão. |
| Polígono | GeoJSON, coordenadas na ordem **[longitude, latitude]**, anel fechado (primeiro ponto = último), até 20.000 vértices. |
| Fonte | Cada geometria guarda de onde veio, para rastrear dado oficial (CAR) contra desenho manual. |
| Edição | Editar o cadastro sem mexer na coordenada preserva a origem GPS; o perímetro e o polígono existentes nunca são apagados pela tela de cadastro. |
| Validação | Na importação, coordenada fora da faixa ou polígono malformado é descartado sem derrubar o registro. Localização fora do Brasil pede confirmação. |
| Área | `geo.areaHa` é calculada pelo contorno (fórmula geodésica, descontando furos) e recalculada na importação; nunca é confiada ao arquivo. A área efetiva do lote é a do contorno, ou a informada quando não há contorno. Sem área de pastagem informada, a da fazenda é a soma dos piquetes. |

## Animal (B.6)

| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `brinco` | alfanumérico (30) | Sim | Único na fazenda; diferencia maiúsculas e minúsculas (R02) |
| `sexo` | `M` / `F` | Sim | |
| `loteId` | ID | Sim | **Lote de entrada.** O lote atual é derivado das lidas de troca. |
| `entradaEm` | data | Sim | Só animais com entrada participam do rateio de custos (R07, fase futura) |
| `nascimento` | data | Não | |
| `raca`, `categoria` | texto (40) | Não | Sugestões em lista, texto livre aceito |
| `caracteristica` | texto (120) | Não | Sinal físico ou de comportamento que ajuda a confirmar o animal no curral |
| `pesoEntrada` | decimal (kg) | Não | Primeiro ponto do histórico de peso |
| `origemEntrada` | `cadastro` / `nascimento` | Sim | |
| `maeId`, `lidaOrigemId` | ID | Cond. | Preenchidos quando o animal nasce por lida de nascimento |

A **foto** do animal não fica no registro: vive em `fotos[animalId] = { d, em, por }`, fora das coleções versionadas, para não pesar na comparação de versões. É reduzida no aparelho (720 px, JPEG) antes de ser guardada, viaja no arquivo de sincronização e a mais recente (`em`) vence.

Remover um animal só é permitido para cadastro errado e se ele não estiver em nenhuma lida (R03). Saída da fazenda é sempre por lida de **Baixa**.

## Lida (B.8, B.15)

| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `fazendaId` | ID | Sim | |
| `tipo` | `pesagem`, `sanitario`, `troca`, `baixa`, `nascimento` | Sim | |
| `data` | data | Sim | Retroativa permitida; futura bloqueada |
| `loteId` | ID | Cond. | Obrigatório em pesagem e sanitário |
| `status` | `aberta` / `finalizada` | Sim | Só `finalizada` altera o rebanho e é exportada (R01, R16) |
| `finalizadaEm` | data e hora | Cond. | |
| `obs` | texto (500) | Não | |
| `cab` | objeto | Cond. | Campos do tipo (abaixo) |
| `registros[]` | lista | Sim | Um item por animal |

### Cabeçalho por tipo (`cab`)

| Tipo | Campos |
|---|---|
| Pesagem | `motivo` (rotina, entrada, desmame, pré-venda, outro) |
| Sanitário | `procedimento` (vacina, vermífugo, medicamento, outro), `produto` (obrig.), `dose`, `carenciaAte` (R14), `proximaEm` |
| Troca de lote | `loteDestinoId` (obrig.) |
| Baixa | `motivo` (morte, perda, venda) |
| Nascimento | (sem cabeçalho) |

### Registro (`registros[]`)

| Campo | Uso |
|---|---|
| `id` | UUID do registro. No nascimento, é também o ID do bezerro criado. |
| `animalId`, `brinco` | Animal manejado (no nascimento, a vaca) |
| `peso` | Pesagem (kg) e nascimento (opcional) |
| `mover` | `true` quando, ao finalizar, o usuário escolheu trocar o animal para o lote do manejo (R04) |
| `obs` | Causa da baixa |
| `bezerroBrinco`, `sexo` | Nascimento. Brinco vazio vira brinco da vaca + `-MMAA` (R17) |

## Ponte para a Fase 2 (API)

| Piloto | Integração |
|---|---|
| Lida finalizada | Registro de pendência (staging) no ERP, aguardando aprovação |
| `id` da lida e do registro | Chave de idempotência: o serviço intermediário ignora o que já recebeu |
| `versao` | Lida reaberta e finalizada de novo chega como nova versão; a anterior é substituída se ainda não aprovada |
| Registro de exclusão | Cancelamento da pendência, se ainda não aprovada |
| Arquivo de sincronização | Contrato de dados: o mesmo JSON pode ser enviado ao serviço intermediário |

Requisitos da API de Integrações Sankhya a considerar na Fase 2: credenciamento de desenvolvedor e SankhyaID, AppKey exclusiva da aplicação, token concedido pelo cliente, usuário Sankhya com permissões próprias para a integração, ambiente liberado para o gateway e OAuth 2.0 (client credentials). O gateway pode ficar indisponível, por isso a fila com reenvio é requisito, não melhoria.
