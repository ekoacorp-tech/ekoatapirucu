# Mapa de piquetes (próxima etapa)

**Situação:** especificado, não construído. Entra **depois das primeiras semanas de piloto**, quando o uso das lidas estiver comprovado. A versão 4 já coleta a localização da sede e dos pastos, e o modelo de dados já tem os campos de polígono, então nada do que for lançado no piloto precisa ser refeito.

## Objetivo

Ver a fazenda dividida em piquetes, com o rebanho e os indicadores de cada um, e apoiar o **manejo do pasto**: lotação real, dias de ocupação e de descanso, piquete superlotado.

## Escopo proposto

| # | Entrega | Detalhe |
|---|---|---|
| M1 | Importar perímetro do CAR | Arquivo baixado do SICAR (shapefile em .zip) ou KML/GeoJSON. Grava `fazenda.geo.perimetro` com `fontePoligono: "car"`. |
| M2 | Desenhar piquetes | Desenho no mapa, ou percorrendo a cerca com o GPS ("gravar trajeto"). Grava `lote.geo.poligono`. |
| M3 | Área calculada | `areaHa` do lote calculada a partir do polígono (cálculo geodésico), com origem registrada. A área digitada deixa de ser necessária. |
| M4 | Mapa do rebanho | Piquetes pintados pela ocupação (verde até 85%, amarelo até 100%, vermelho acima), com animais, peso médio, GMD, carência e manejo atrasado. Toque abre a lista do piquete. |
| M5 | Funcionamento offline | Polígonos e números sempre disponíveis. Imagem de satélite só com internet, ou baixada antes para a área da fazenda. |

Fora desta etapa: posição individual do animal (exigiria coleira com rastreador), histórico de rotação e planejamento de pastejo (etapa seguinte, se o pastejo for rotacionado).

## Decisões a tomar antes de construir

| # | Decisão | Opções | Recomendação inicial |
|---|---|---|---|
| D-M1 | Tipo de pastejo | Rotacionado (muitos piquetes, rodízio) ou contínuo | Confirmar com o gestor: no rotacionado o mapa é central; no contínuo, complementar |
| D-M2 | Biblioteca de mapa | Leaflet (leve, código aberto) ou desenho próprio em SVG | Leaflet, guardada no cache do app para funcionar offline. Muda o princípio "sem dependências", com registro em documentação |
| D-M3 | Imagem de fundo | OpenStreetMap, Esri World Imagery, Google | Avaliar os termos de uso de cada provedor para uso comercial e offline antes de escolher. Google exige chave e cobrança |
| D-M4 | Arquivo do CAR | Shapefile (.zip) direto ou conversão prévia para KML/GeoJSON | Aceitar KML e GeoJSON de início; shapefile em seguida |

## Pré-requisitos

- Arquivo do CAR da fazenda do piloto (recibo e perímetro).
- Lotes do piloto com o ponto de referência capturado (versão 4).
- Resultado das primeiras semanas do piloto (adoção das lidas).

## Ponte para o ERP

Na integração (Fase 2), a geometria vai para campos adicionais: latitude e longitude em campos numéricos e o GeoJSON em campo texto longo (CLOB) na tabela de lotes/piquetes. O Sankhya guarda; o mapa continua no app ou em dashboard HTML5.
