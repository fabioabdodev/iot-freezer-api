---
description: regras de produto, visao do sistema e evolucao para SaaS de monitoramento IoT
applyTo: '**'
---

# PRODUCT_RULES.md - Regras de produto

Este projeto implementa um sistema de monitoramento inteligente de equipamentos
usando IoT. O primeiro caso e temperatura de freezer, mas a plataforma deve
evoluir para outros sensores e para um modelo SaaS.

## Estado atual do produto

O MVP expandido ja entrega:

- cadastro de clients
- cadastro de devices
- ingestao de temperatura por HTTP
- historico de leituras
- dashboard web
- monitoramento de offline
- alerta por temperatura
- integracao por webhook com n8n

## Entidades principais

### Client

Representa a operacao dona dos devices.

### Device

Representa o equipamento monitorado.

### Reading

Representa a leitura capturada. Hoje o foco e temperatura.

### Alert Rule

Representa a configuracao de monitoramento do device.

## Regras de produto

- o sistema deve suportar varios devices por cliente
- alertas devem ser desacoplados via webhook
- o backend nao deve enviar mensagens diretamente
- o dashboard deve focar em operacao rapida e leitura clara
- a base deve continuar preparada para novos sensores

## Integracao de alertas

Fluxo correto:

Backend -> webhook -> n8n -> Evolution API -> WhatsApp

## Evolucao esperada

Proximos grandes blocos de produto:

1. autenticacao de usuarios
2. dashboards por cliente
3. novos sensores
4. alertas e relatorios mais ricos
5. recursos reais de SaaS
