---
description: roadmap de desenvolvimento do sistema de monitoramento IoT
applyTo: '**'
---

# ROADMAP.md - Evolucao do sistema

## Entregas ja concluidas

### Fase 1 - Base operacional

- API NestJS funcionando
- ingestao de temperatura
- armazenamento de leituras
- monitoramento de offline

### Fase 2 - Seguranca basica

- autenticacao por `x-device-key`
- rate limit por device

### Fase 3 - Regras de temperatura

- limites por regra
- tolerancia
- cooldown
- envio de alerta por webhook

### Fase 4 - Dashboard inicial

- frontend Next.js
- lista de devices
- historico
- configuracao de devices
- configuracao de alertas

### Fase 5 - Base multi-tenant

- entidade `Client`
- uso de `clientId` no fluxo administrativo

### Fase 6 - Simulacao e operacao

- seed de dados demo
- simulador IoT
- laboratorio `/lab`
- deploy automatizado em producao

### Fase 7 - Consolidacao do modulo temperatura

- loading e feedback melhores no dashboard
- confirmacao customizada para exclusao
- destaque visual para temperatura fora da faixa
- polling automatico no dashboard
- mensagens de erro mais claras
- testes ampliados para cooldown e tolerance
- webhook de offline implementado
- webhook de temperatura validado ponta a ponta em producao
- webhook de offline validado ponta a ponta em producao
- API estabilizada com Supabase `session pooler`
- stack do n8n ajustada para Redis correto

Estado:

- concluido no escopo funcional atual
- pendente apenas de refinamentos operacionais e observabilidade

Referencia complementar:

- detalhes do estado atual em `.github/instructions/PROJECT_RULES.md`
- direcao de produto em `.github/instructions/PRODUCT_RULES.md`

### Fase 8 - Modulo acionamento

Escopo inicial sugerido:

- ligar/desligar manualmente uma carga
- exibir estado atual
- registrar historico basico de comandos
- caso inicial sugerido: sauna

Proximo ponto de continuidade:

- modelar entidades e fluxos do modulo `acionamento`
- manter o modulo `temperatura` apenas em manutencao corretiva

## Proximos passos recomendados

### Fase 9 - Autenticacao de usuarios

- login
- perfis
- isolamento por cliente no frontend

### Fase 10 - Multi-sensor real

- umidade
- porta
- energia
- leituras mais genericas

### Fase 11 - Observabilidade e escala

- metricas
- rastreabilidade
- cache e filas mais robustos
- otimizacao de historico

### Fase 12 - SaaS completo

- usuarios e equipes
- dashboards por conta
- relatorios
- planos
- API publica
