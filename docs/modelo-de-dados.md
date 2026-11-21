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

## Lote (B.5 + B.4 simplificado)

| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `fazendaId` | ID | Sim | |
| `nome` | texto (60) | Sim | Único na fazenda |
| `pasto` | texto (60) | Não | Nome da área de pastagem. O polígono no mapa ficou fora do piloto. |
| `areaHa` | decimal | Não | Base do UA/ha do lote |
| `lotacaoMax` | decimal (UA/ha) | Não | Base da ocupação (R06) |
| `ativo` | booleano | Sim | Lote com animais ativos não pode ser inativado |

## Animal (B.6)

| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `brinco` | alfanumérico (30) | Sim | Único na fazenda; diferencia maiúsculas e minúsculas (R02) |
| `sexo` | `M` / `F` | Sim | |
| `loteId` | ID | Sim | **Lote de entrada.** O lote atual é derivado das lidas de troca. |
| `entradaEm` | data | Sim | Só animais com entrada participam do rateio de custos (R07, fase futura) |
| `nascimento` | data | Não | |
| `raca`, `categoria` | texto (40) | Não | Sugestões em lista, texto livre aceito |
| `pesoEntrada` | decimal (kg) | Não | Primeiro ponto do histórico de peso |
| `origemEntrada` | `cadastro` / `nascimento` | Sim | |
| `maeId`, `lidaOrigemId` | ID | Cond. | Preenchidos quando o animal nasce por lida de nascimento |

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
