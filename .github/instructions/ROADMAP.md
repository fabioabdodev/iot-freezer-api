---
description: roadmap de desenvolvimento do sistema de monitoramento IoT e evolução para SaaS.
applyTo: '**'
---

# ROADMAP.md — Evolução do sistema

Este documento define a ordem de evolução do projeto de monitoramento IoT.

O objetivo é transformar o MVP atual em um **SaaS de monitoramento inteligente de equipamentos**.

---

# Fase 1 — MVP funcional (estado atual)

Objetivo: garantir que o sistema funcione de ponta a ponta.

Funcionalidades:

- API NestJS funcionando
- Endpoint de ingestão de temperatura
- Registro de devices
- Armazenamento de leituras
- Monitoramento de offline
- Cron scheduler
- Alertas enviados para n8n
- Integração com Evolution API via n8n

Fluxo:

Device → API → Banco → Monitor → n8n → WhatsApp

---

# Fase 2 — Segurança básica

Objetivo: evitar uso indevido da API.

Funcionalidades:

- autenticação de devices via API Key
- header obrigatório:

x-device-key

- validação de device_id
- rate limit por dispositivo
- logs de segurança

---

# Fase 3 — Limites de sensores

Objetivo: detectar eventos críticos.

Funcionalidades:

- limite mínimo de temperatura
- limite máximo de temperatura
- configuração por device
- alerta automático quando limite é ultrapassado

Exemplo:

freezer_01

minTemperature: -20  
maxTemperature: -10

Se enviar:

temperature: -5

→ gerar alerta.

---

# Fase 4 — Dashboard inicial

Objetivo: criar interface para usuários.

Frontend:

monitor.virtuagil.com.br

Funcionalidades:

- lista de devices
- status online/offline
- última leitura
- gráfico de temperatura
- histórico de leituras

Tecnologias possíveis:

- Next.js
- React
- Chart.js ou Recharts

---

# Fase 5 — Gerenciamento de devices

Objetivo: permitir administração pelo usuário.

Funcionalidades:

- cadastrar device
- editar device
- remover device
- configurar limites de sensores
- associar device a cliente

---

# Fase 6 — Multi-sensor

Objetivo: tornar sistema genérico.

Adicionar suporte para:

- temperatura
- umidade
- sensores de porta
- energia elétrica
- sensores industriais

Mudança no modelo de dados:

SensorReading genérico.

---

# Fase 7 — Multi-tenant (SaaS)

Objetivo: suportar múltiplos clientes.

Adicionar:

- entidade Client
- autenticação de usuários
- separação de dados por cliente
- dashboard por cliente

Estrutura:

Client  
 └ Devices  
    └ Sensors  
       └ Readings

---

# Fase 8 — Alertas configuráveis

Objetivo: flexibilidade para clientes.

Adicionar:

- regras de alerta
- múltiplos canais de notificação
- limites configuráveis
- tempo de tolerância

Exemplo:

alertar somente após 5 minutos fora do limite.

---

# Fase 9 — Escalabilidade

Objetivo: preparar para crescimento.

Melhorias:

- filas de processamento
- Redis para cache
- otimização de consultas
- compressão de dados históricos

---

# Fase 10 — Produto SaaS completo

Funcionalidades finais:

- gestão de clientes
- gestão de usuários
- múltiplos dispositivos
- múltiplos sensores
- dashboards avançados
- relatórios
- histórico completo

Possíveis recursos adicionais:

- aplicativo mobile
- integração com outros sistemas
- exportação de dados
- API pública

---

# Objetivo final

Criar uma plataforma SaaS capaz de monitorar:

- equipamentos comerciais
- equipamentos industriais
- ambientes críticos
- sensores IoT em geral

com alertas inteligentes e visualização em tempo real.