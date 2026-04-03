# Monitoramento e Manutencao da Cisterna - Ruy

## Objetivo

Registrar uma visao simples de como acompanhar a cisterna e incluir rotinas de
manutencao sem complicar o projeto inicial.

## Situacao observada

- a cisterna nao possui uma boia de nivel para monitoramento
- existe uma boia na mangueira de captacao, usada para evitar puxar barro do fundo
- o Ruy precisa colocar cloro periodicamente
- em epocas de seca, ele reclama de falta de agua

## Leitura pratica

A boia da mangueira ajuda na captacao, mas nao resolve o problema de saber o
nivel da cisterna.

Entao, o sistema pode evoluir para cuidar de duas coisas:

1. nivel da cisterna
2. rotina de manutencao

## Nivel da cisterna

O primeiro objetivo nao precisa ser medir porcentagem exata.

No inicio, ja ajuda muito saber:

- nivel ok
- nivel baixo
- nivel critico

Isso ja permite:

- bloquear acionamento da bomba
- avisar em periodo de seca
- trazer mais controle

## Cloro e manutencao

No inicio, nao e necessario automatizar dosagem.

O caminho mais simples e:

- registrar a ultima aplicacao de cloro
- configurar um lembrete periodico

Exemplo:

- aplicar cloro a cada `X` dias
- gerar um aviso para lembrar da manutencao

## Estrategia recomendada

### Primeiro

- automatizar caixa e bomba

### Depois

- incluir nivel da cisterna

### Depois

- incluir lembrete de manutencao

## Valor desse aprendizado

Esse caso ajuda a Virtuagil a aprender sobre:

- automacao rural leve
- monitoramento de reservatorio
- controle de bomba
- lembretes operacionais

No futuro, isso pode virar um modulo proprio de monitoramento e automacao de
agua e reservatorios.
