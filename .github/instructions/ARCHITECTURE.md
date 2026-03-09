---
description: arquitetura tecnica do projeto, componentes e fluxo do sistema
applyTo: '**'
---

# ARCHITECTURE.md - Arquitetura tecnica

## Stack principal

- NestJS
- Prisma ORM
- PostgreSQL (Supabase)
- Next.js
- Docker Swarm + Traefik
- n8n para automacao
- GHCR para imagens

## Visao geral

Fluxo principal:

Device -> API -> Database -> Monitor -> Queue -> n8n -> WhatsApp

Tambem existe o fluxo operacional do dashboard:

Dashboard web -> API -> Database

## Componentes principais

### Device

ESP32 ou simulador HTTP que envia leituras periodicas.

Endpoint atual:

- `POST /iot/temperature`

### API

Responsavel por:

- validar ingestao
- persistir leituras
- atualizar estado do device
- expor endpoints para dashboard e administracao

### Dashboard web

Responsavel por:

- listar devices
- exibir historico
- editar cadastro
- configurar alertas
- orientar testes via `/lab`

### Monitor

Processo agendado que:

- detecta offline
- avalia regras de temperatura
- evita spam com cooldown e transicao de estado

### Fila de entrega de alertas

Responsavel por desacoplar a deteccao do envio do webhook.

## Modulos do backend

- `src/modules/ingest`
  - recebe dados do device
- `src/modules/devices`
  - cadastro e estado operacional
- `src/modules/readings`
  - historico e agregacoes
- `src/modules/alert-rules`
  - configuracao de limites e tolerancias
- `src/modules/clients`
  - base multi-tenant
- `src/modules/monitor`
  - jobs periodicos e processamento de alertas

## Modelo atual de dominio

Entidades centrais:

- `Client`
- `Device`
- `TemperatureLog`
- `AlertRule`

O sistema ja opera com isolamento por `clientId`, embora a autenticacao de
usuarios ainda nao exista.

## Seguranca

- `x-device-key` obrigatorio para ingestao
- rate limit por device
- segredos fora do Git
- logs operacionais sem valores sensiveis

## Deploy

Producao:

- `api` e `web` em servicos separados
- imagens publicadas no GHCR
- deploy via GitHub Actions + SSH
- roteamento por Traefik

Dominios atuais:

- `monitor.virtuagil.com.br`
- `api-monitor.virtuagil.com.br`

## Validacao manual minima

1. enviar leitura via simulador
2. confirmar leitura no dashboard
3. testar `/health`
4. simular offline
5. simular temperatura fora da faixa
