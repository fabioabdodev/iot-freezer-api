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

## Proximos passos recomendados

### Fase 7 - Autenticacao de usuarios

- login
- perfis
- isolamento por cliente no frontend

### Fase 8 - Multi-sensor real

- umidade
- porta
- energia
- leituras mais genericas

### Fase 9 - Observabilidade e escala

- metricas
- rastreabilidade
- cache e filas mais robustos
- otimização de historico

### Fase 10 - SaaS completo

- usuarios e equipes
- dashboards por conta
- relatorios
- planos
- API publica
