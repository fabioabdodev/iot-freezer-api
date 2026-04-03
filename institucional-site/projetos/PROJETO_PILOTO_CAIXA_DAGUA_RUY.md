# Projeto Piloto - Caixa d'Agua do Ruy

## Objetivo

Criar uma automacao simples e confiavel para o sistema de abastecimento da caixa
d'agua do Ruy, reduzindo a necessidade de ligar e desligar a bomba manualmente.

## Situacao atual

Hoje o processo funciona assim:

- a bomba sapo fica na cisterna
- existe um fio puxado ate a varanda da casa
- o acionamento e feito manualmente por um disjuntor
- quando a caixa esvazia, liga a bomba
- quando a caixa enche e comeca a sair agua pelo ladrao, a bomba e desligada

## Problemas atuais

- dependencia de acao manual
- risco de esquecer a bomba ligada
- risco de desperdicio de agua
- falta de visibilidade do nivel da cisterna

## Estrategia recomendada

Fazer o projeto em fases.

## Fase 1 - Caixa d'agua e bomba

### Objetivo

Automatizar o acionamento da bomba com base no nivel da caixa d'agua.

### Regra

- se a caixa estiver baixa, ligar a bomba
- se a caixa estiver cheia, desligar a bomba

### Resultado esperado

- menos trabalho manual
- menos risco de transbordo
- mais confiabilidade na rotina

## Fase 2 - Nivel da cisterna

### Objetivo

Evitar ligar a bomba quando a cisterna estiver muito baixa.

### Regra

- se a cisterna estiver abaixo do nivel minimo, nao ligar a bomba
- gerar alerta ou aviso de nivel baixo

### Observacao

Como a cisterna fica a aproximadamente 50 a 100 metros da casa, pode fazer
sentido avaliar comunicacao remota, inclusive LoRa, dependendo da instalacao.

## Fase 3 - Monitoramento e avisos

### Objetivo

Adicionar visibilidade e acompanhamento.

### Possibilidades

- status da bomba
- status da caixa
- status da cisterna
- alerta de nivel critico
- alerta de tempo excessivo de enchimento

## Fase 4 - Rotina de manutencao

### Objetivo

Incluir lembretes operacionais simples.

### Exemplo

- lembrete para aplicar cloro periodicamente

## Regra principal do projeto

A automacao deve funcionar localmente.

Ou seja:

- a internet pode servir para monitoramento
- mas a logica principal nao deve depender dela

## Valor do projeto

Esse projeto e importante porque:

- resolve um problema real
- permite treino sem pressao comercial
- ensina automacao, sensores e monitoramento
- pode virar base para um futuro modulo da Virtuagil
