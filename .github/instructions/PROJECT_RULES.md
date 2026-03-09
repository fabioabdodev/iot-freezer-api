---
description: regras do projeto e conceitos do produto no estado atual
applyTo: '**'
---

# PROJECT_RULES.md - Regras e conceitos do produto

## Visao do produto

Construir um monitoramento inteligente para equipamentos usando sensores IoT.
O primeiro caso do produto continua sendo temperatura de freezer, mas a base ja
foi preparada para clientes, dispositivos, historico, alertas e dashboard web.

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
4. Operacao
   - ambiente local
   - deploy em Docker Swarm
   - banco no Supabase
5. Gestao
   - clients
   - devices
   - alert rules
   - dashboard web
6. Multi-tenant basico
   - isolamento por `clientId`

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
arquitetura ja considera futura extensao para outros sensores.

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

Proximos blocos mais coerentes:

1. autenticacao de usuarios
2. suporte a mais sensores
3. historico e graficos mais ricos
4. alertas mais configuraveis
5. evolucao real para SaaS multi-tenant completo
