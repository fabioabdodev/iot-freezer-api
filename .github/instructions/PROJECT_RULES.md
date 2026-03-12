---
description: regras do projeto e conceitos do produto no estado atual
applyTo: '**'
---

# PROJECT_RULES.md - Regras e estado atual do projeto

## Escopo atual do projeto

Funcionalidades ja implementadas:

1. Ingestao de temperatura via HTTP
   - `POST /iot/temperature`
2. Persistencia
   - leituras de temperatura
   - estado do device (`lastSeen`, `isOffline`, `offlineSince`)
3. Monitoramento
   - deteccao de offline
   - alerta por temperatura fora da faixa
   - cooldown e tolerancia
   - webhook de temperatura e offline
4. Operacao
   - ambiente local
   - deploy em Docker Swarm
   - banco no Supabase
   - integracao com n8n e Evolution
5. Gestao
   - clients
   - devices
   - alert rules
   - dashboard web
6. Multi-tenant basico
   - isolamento por `clientId`

## Estado atual do modulo temperatura

O modulo `temperatura` esta em estado de quase conclusao.

Ja foi validado:

- cadastro de cliente
- cadastro de device
- cadastro de regra
- historico
- temperatura fora da faixa
- online/offline
- filtro por cliente
- feedback principal do dashboard
- integracao da API com webhook do n8n ate a criacao da execucao

Pendencias principais restantes:

- estabilizacao do processamento do `n8n` com Redis
- estabilizacao do deploy automatico quando houver falha intermitente de SSH/SCP

## O que ainda nao entrou por completo

- autenticacao de usuarios
- billing / assinaturas
- dashboards por perfil de usuario
- multiplos tipos reais de sensor no mesmo fluxo de ingestao
- app mobile

## Conceitos principais

### Client

Representa a empresa ou operacao dona dos dispositivos.

### Device

Representa o equipamento monitorado, por exemplo `freezer_01`.

Campos importantes:

- `id`
- `clientId`
- `lastSeen`
- `isOffline`
- `offlineSince`
- `lastAlertAt`

### Reading

Leitura de sensor armazenada no historico. Hoje o foco e temperatura, mas a
arquitetura deve continuar preparada para futura extensao.

### Alert Rule

Define os limites, tolerancia, cooldown e habilitacao do alerta por device,
cliente e tipo de sensor.

## Regras de negocio atuais

### Ingestao

Ao receber uma leitura valida:

- salvar a temperatura
- atualizar `lastSeen`
- marcar o device como online
- limpar `offlineSince`

### Offline

O monitor roda de forma periodica.

Se `lastSeen` estiver alem do cutoff:

- marcar o device como offline
- registrar `offlineSince`
- disparar alerta uma unica vez na transicao

### Temperatura fora da faixa

Quando existir regra habilitada:

- respeitar temperatura minima e maxima
- respeitar tolerancia configurada
- respeitar cooldown para nao spammar

## Seguranca

- `x-device-key` e obrigatorio no endpoint do device
- nunca comitar `.env`
- nunca logar `DATABASE_URL`, tokens ou webhooks sensiveis
- segredos de pipeline devem ficar em GitHub Secrets

## Direcao de evolucao

Ver `.github/instructions/ROADMAP.md` para a sequencia de evolucao.
