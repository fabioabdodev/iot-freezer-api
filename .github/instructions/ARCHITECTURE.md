---
description: Arquitetura técnica do projeto, incluindo componentes, estrutura de pastas, banco de dados e fluxo do sistema.
applyTo: '**'
---

# ARCHITECTURE.md — Arquitetura técnica

Stack principal:

- NestJS
- Prisma ORM
- PostgreSQL (Supabase)
- Docker
- n8n (automação)
- Evolution API (WhatsApp)

Este sistema implementa um **monitoramento inteligente de dispositivos IoT**, começando com sensores de temperatura.

A arquitetura foi desenhada para evoluir futuramente para um **SaaS de monitoramento de equipamentos**.

---

# Visão geral do sistema

Fluxo principal:

Device (ESP32)  
↓  
HTTP Request  
↓  
API (NestJS)  
↓  
Banco (Supabase / PostgreSQL)  
↓  
Monitor (cron scheduler)  
↓  
Alertas (n8n → Evolution → WhatsApp)

Representação:

Device → API → Database  
              ↓  
           Monitor  
              ↓  
            n8n  
              ↓  
          WhatsApp

---

# Componentes do sistema

## 1. Device (ESP32 ou outros dispositivos)

Responsável por enviar leituras periódicas para a API.

Formato atual da requisição:

POST /iot/temperature

Payload:

{
  "device_id": "freezer_01",
  "temperature": -12.3
}

No futuro dispositivos poderão enviar outros sensores.

Exemplo futuro:

{
  "device_id": "freezer_01",
  "temperature": -12,
  "humidity": 45
}

---

# 2. API (NestJS)

Responsável por:

- receber leituras dos dispositivos
- validar dados
- persistir leituras
- atualizar estado dos devices
- fornecer endpoints para frontend

A API não deve enviar mensagens diretamente.

Alertas são delegados para **n8n via webhook**.

---

# 3. Ingest Module

Localização:

src/modules/ingest

Responsável por receber dados dos dispositivos.

Endpoint principal:

POST /iot/temperature

Fluxo:

1. Validar DTO
2. Registrar leitura no banco
3. Atualizar lastSeen do device
4. Garantir que device está online

---

# 4. Devices Module

Localização:

src/modules/devices

Responsável por:

- estado dos dispositivos
- controle de online/offline
- metadados do dispositivo

Campos principais:

- id
- lastSeen
- isOffline
- offlineSince
- lastAlertAt

---

# 5. Readings Module

Localização:

src/modules/readings

Responsável por armazenar leituras de sensores.

Atualmente:

- temperatura

No futuro:

- umidade
- consumo de energia
- sensores de porta
- sensores industriais

---

# 6. Monitor Module

Localização:

src/modules/monitor

Executa tarefas periódicas.

Tecnologia:

NestJS Scheduler (cron)

Função principal:

detectar dispositivos offline.

Fluxo:

1. calcular cutoff (tempo limite)
2. buscar dispositivos inativos
3. verificar estado atual
4. marcar device como offline
5. disparar alerta

Importante:

Alertas só devem ocorrer na transição:

ONLINE → OFFLINE

para evitar spam.

---

# Sistema de alertas

A aplicação **não envia mensagens diretamente**.

Fluxo correto:

API  
↓  
Webhook  
↓  
n8n  
↓  
Evolution API  
↓  
WhatsApp

Variável de ambiente usada:

N8N_OFFLINE_WEBHOOK_URL

---

# Estrutura de pastas

src/
  main.ts
  app.module.ts

  prisma/
    prisma.service.ts
    prisma.module.ts

  modules/
    ingest/
    devices/
    readings/
    monitor/

Cada módulo deve conter:

- controller
- service
- dto

Controllers devem ser finos.

---

# Banco de dados (MVP)

## Device

Campos:

- id (string)
- lastSeen (DateTime)
- isOffline (boolean)
- offlineSince (DateTime)
- lastAlertAt (DateTime)

Representa um equipamento físico.

---

## TemperatureLog

Campos:

- id (uuid)
- deviceId (string)
- temperature (float)
- createdAt (DateTime)

Índice recomendado:

(deviceId, createdAt)

---

# Evolução futura do banco

Para suportar múltiplos sensores futuramente, o sistema poderá evoluir para um modelo genérico de leituras.

Exemplo:

SensorReading

- id
- deviceId
- sensorType
- value
- unit
- createdAt

Isso permitirá monitorar:

- temperatura
- umidade
- energia
- sensores industriais

sem alterar arquitetura.

---

# Segurança

Próximo passo de segurança:

autenticação por API key.

Exemplo de header:

x-device-key: DEVICE_SECRET

Outras medidas:

- rate limit por IP
- validação forte de DTO
- logs sem segredos

---

# Deploy

Ambiente de produção:

Docker containers  
Docker Swarm  
Traefik (reverse proxy)

Banco:

Supabase (PostgreSQL gerenciado)

Frontend e backend devem ser serviços independentes.

---

# Domínios

Estrutura de domínios:

virtuagil.com.br

Site institucional.

Sistema:

monitor.virtuagil.com.br

API:

api-monitor.virtuagil.com.br

Traefik será responsável pelo roteamento.

---

# Testes manuais mínimos

1. Enviar temperatura

POST /iot/temperature

{
  "device_id": "freezer_01",
  "temperature": -12.3
}

Esperado:

- registro em TemperatureLog
- atualização de lastSeen

---

2. Simular offline

Parar envio de dados por tempo maior que minutesOffline.

Esperado:

- log WARN no monitor
- device marcado como offline

---

3. Device volta online

Enviar nova leitura.

Esperado:

- isOffline = false
- offlineSince = null