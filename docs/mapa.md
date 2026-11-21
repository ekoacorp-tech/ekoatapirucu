# Mapa da fazenda

**Situação:** disponível desde a versão 6 beta. A rotação de pastejo (dias de ocupação e de descanso por piquete) é a etapa seguinte.

## O que a tela faz

| Recurso | Como funciona |
|---|---|
| Fazendas | Cartões com animais, lotes e área do perímetro. Tocar troca a fazenda ativa. |
| Perímetro | Linha tracejada dourada. Vem do CAR, de arquivo, de desenho ou do GPS. |
| Piquetes | Contorno colorido pela ocupação: verde até 85%, amarelo de 85 a 100%, vermelho acima de 100%, azul sem lotação máxima informada. Rótulo com animais e ocupação (aparece quando o piquete tem tamanho suficiente na tela). |
| Pontos | Sede e lotes sem contorno aparecem como ponto. |
| Resumo do piquete | Animais, peso médio, GMD, área, ocupação, carência e sem manejo; "Ver animais" abre o Rebanho filtrado. |
| Fundo | Mapa (OpenStreetMap), Satélite (Esri World Imagery) ou Sem fundo. Precisa de internet; os blocos vistos ficam guardados no aparelho (até cerca de 4.000 blocos) para uso no campo. |
| Ficha do animal | Fazenda, lote, pasto, localização e minimapa do piquete atual. |

## Como obter o perímetro pelo CAR

O número do recibo (código do imóvel, como `GO-5218805-…`) identifica o imóvel no SICAR, e o polígono declarado é público:

1. Acesse a consulta pública do SICAR (https://consultapublica.car.gov.br/publico/imoveis/index), localize o imóvel pelo código e baixe o arquivo .zip com os shapefiles.
2. No app, **Mapa da fazenda → Importar contorno**, escolha o .zip.
3. O app mostra as camadas do arquivo (imóvel, APP, reserva legal, área consolidada…). Para o perímetro, use a camada do **imóvel** e o destino **Perímetro da fazenda**.

O app não baixa o arquivo sozinho: a consulta pública exige interação no site (captcha), e a integração automática pela API do governo (Conecta gov.br, SICAR Imóvel) é restrita a órgãos públicos.

## Hierarquia das medições

O perímetro do CAR é **declaratório**: é o que o proprietário informou, nem sempre com precisão de campo. As medições posteriores refinam, sem apagar a origem:

| Prioridade | Fonte | Uso |
|---|---|---|
| 1 | Georreferenciamento certificado (SIGEF/INCRA) | Limite oficial da propriedade, quando existir. Importar como arquivo. |
| 2 | CAR | Ponto de partida do perímetro e das áreas ambientais (APP, reserva legal). |
| 3 | Percorrer a cerca com GPS | Piquetes reais, como estão no campo. Precisão de 3 a 10 m em celular comum. |
| 4 | Desenho sobre o satélite | Rápido para começar; conferir em campo depois. |

Cada contorno guarda a origem (`car`, `arquivo`, `gps`, `desenho`) e a área é sempre recalculada a partir do desenho, nunca confiada ao arquivo.

## Por que vale cuidar do cadastro da fazenda

- **Lotação real:** a área do piquete deixa de ser digitada e passa a vir do contorno. UA/ha e ocupação ficam corretos.
- **Área útil:** APP e reserva legal não são pasto. Separar o que é pastejável evita superestimar a capacidade.
- **Rotação:** com os piquetes desenhados, o próximo passo é registrar entrada e saída de cada lote, medir dias de ocupação e de descanso e alertar piquete superlotado ou descanso curto.

## Decisões ainda abertas

| # | Decisão | Situação |
|---|---|---|
| D-M1 | Tipo de pastejo (rotacionado ou contínuo) | Confirmar com o gestor; define a prioridade da rotação. |
| D-M3 | Provedor de imagem | Em uso no piloto: OpenStreetMap e Esri World Imagery, com atribuição. **Antes de ampliar o uso, validar os termos de uso de cada provedor para uso comercial e guarda offline.** |
| D-M5 | Camadas ambientais | Importar APP e reserva legal como camadas próprias (hoje podem virar lotes, o que não é o ideal). |

## Ponte para o ERP

Na integração (Fase 2), latitude e longitude vão para campos numéricos e o contorno (GeoJSON) para campo texto longo na tabela de lotes/piquetes. O Sankhya guarda; o mapa continua no app ou em dashboard HTML5.
