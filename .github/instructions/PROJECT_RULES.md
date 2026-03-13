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

O modulo `temperatura` esta funcionalmente concluido e operacionalmente validado.

Ja foi validado:

- cadastro de cliente
- cadastro de device
- cadastro de regra
- historico
- temperatura fora da faixa
- online/offline
- filtro por cliente
- feedback principal do dashboard
- webhook de temperatura ponta a ponta
- webhook de offline ponta a ponta
- n8n processando execucoes apos ajuste de Redis
- API em producao usando Supabase com session pooler

Pendencias principais restantes:

- reduzir ruido operacional do deploy em Swarm
- revisar a imagem da API para incluir OpenSSL e reduzir warnings do Prisma
- organizar o inicio do modulo `acionamento`

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

Importante:

- o alerta de offline e disparado apenas na transicao `online -> offline`
- se o device ja estiver offline, novos ticks do monitor nao reenfileiram o mesmo alerta

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

## Registro operacional recente

Correções validadas em produção:

- stack do `n8n` passou a usar `QUEUE_BULL_REDIS_HOST=redis_redis`
- `N8N_NODE_PATH` do `n8n` foi corrigido para `/home/node/.n8n/nodes`
- `N8N_TEMPERATURE_ALERT_WEBHOOK_URL` foi corrigida para `https://webhookworkflow.virtuagil.com.br/webhook/temperature-alert`
- `N8N_OFFLINE_WEBHOOK_URL` foi corrigida para `https://webhookworkflow.virtuagil.com.br/webhook/device-offline`
- `DATABASE_URL` da API em produção foi migrada da conexão direta IPv6 do Supabase para o `session pooler`

Observação importante para continuidade:

- a stack `iot-monitor` so carrega corretamente as variaveis da API quando o deploy e feito no mesmo shell com:
  - `set -a`
  - `. ./.env.prod`
  - `set +a`
  - `docker stack deploy -c deploy/swarm/stack.prod.yml iot-monitor --with-registry-auth`
