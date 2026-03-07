---
description: regras de produto, visão do sistema e evolução para SaaS de monitoramento IoT.
applyTo: '**'
---

# PRODUCT_RULES.md — Regras de produto

Este projeto implementa um sistema de **monitoramento inteligente de equipamentos usando IoT**.

O primeiro caso de uso é **monitoramento de temperatura de freezer**, mas o sistema foi projetado para evoluir para um **SaaS completo de monitoramento de dispositivos e sensores**.

---

# Visão do produto

Objetivo do sistema:

Monitorar equipamentos físicos em tempo real utilizando sensores conectados.

Exemplos de equipamentos monitorados:

- freezers
- geladeiras comerciais
- câmaras frias
- máquinas industriais
- equipamentos hospitalares
- sensores ambientais

O sistema deve detectar:

- falhas de comunicação
- valores fora do limite
- eventos críticos

E enviar alertas automaticamente.

---

# MVP atual

O MVP implementa:

- registro de dispositivos (devices)
- envio de temperatura via HTTP
- armazenamento das leituras
- monitoramento de offline
- geração de alertas via n8n

Fluxo atual:

Device → API → Database → Monitor → n8n → WhatsApp

---

# Entidades principais do produto

## Cliente (futuro)

Representa uma empresa que utiliza o sistema.

Exemplo:

- clínica
- restaurante
- indústria
- laboratório

Um cliente pode possuir:

- vários dispositivos
- vários sensores
- vários usuários

---

## Device

Representa um equipamento físico monitorado.

Exemplos:

- freezer_01
- freezer_vacinas
- camara_fria_02

Um device pode possuir:

- sensores
- localização
- metadados

---

## Sensor

Representa um tipo de leitura.

Exemplos:

- temperatura
- umidade
- energia
- porta aberta
- vibração

Um device pode possuir múltiplos sensores.

---

## Reading (Leitura)

Representa um valor medido por um sensor.

Exemplo:

Device: freezer_01  
Sensor: temperatura  
Valor: -12.3°C

As leituras são armazenadas com timestamp.

---

## Alert

Representa um evento crítico detectado pelo sistema.

Exemplos:

- dispositivo offline
- temperatura fora do limite
- sensor com falha

Alertas devem ser enviados para sistemas externos (n8n).

---

# Tipos de alerta suportados

O sistema deve suportar:

1. Device offline
2. Temperatura fora do limite
3. Sensor com erro
4. Falha de comunicação
5. Eventos personalizados

---

# Integração com automação

O sistema **não envia mensagens diretamente**.

Fluxo de alerta:

Backend → Webhook → n8n → Evolution API → WhatsApp

Responsabilidades:

Backend:
- detectar evento
- enviar webhook

n8n:
- decidir fluxo
- enviar notificações
- registrar logs

---

# Interface do sistema (frontend)

O frontend deve fornecer:

- dashboard de dispositivos
- status online/offline
- histórico de leituras
- configuração de alertas
- visualização de gráficos

---

# Evolução para SaaS

O sistema deverá evoluir para um modelo SaaS.

Funcionalidades futuras:

- múltiplos clientes (multi-tenant)
- autenticação de usuários
- gerenciamento de dispositivos
- gerenciamento de sensores
- dashboards por cliente
- alertas configuráveis
- planos de assinatura

---

# Modelo SaaS futuro

Estrutura esperada:

Cliente
 └ Devices
    └ Sensors
       └ Readings

Cada cliente terá:

- seus dispositivos
- seus sensores
- seus usuários

---

# Tipos de sensores suportados no futuro

O sistema deve ser flexível para suportar novos sensores.

Exemplos:

- temperatura
- umidade
- energia elétrica
- corrente elétrica
- pressão
- sensores industriais
- sensores ambientais

A arquitetura deve permitir novos sensores **sem refatoração grande do sistema**.

---

# Regras importantes de produto

- O sistema deve ser modular.
- Cada tipo de sensor deve ser extensível.
- O backend não deve assumir apenas temperatura.
- O sistema deve suportar múltiplos dispositivos por cliente.
- Alertas devem ser desacoplados via webhook.

---

# Objetivo de longo prazo

Transformar o sistema em uma **plataforma SaaS de monitoramento inteligente de equipamentos**.

Possíveis aplicações futuras:

- monitoramento de cadeia fria
- monitoramento industrial
- automação de prédios
- monitoramento ambiental
- IoT corporativo