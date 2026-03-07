---
applyTo: '**'
description: regras globais para agentes de IA neste repositório
---

# AGENTS.md — Regras para agentes neste repositório

Este repositório implementa um MVP de **monitoramento inteligente** para dispositivos IoT  
(inicialmente monitoramento de temperatura de freezer).

Stack principal:

- NestJS
- Prisma ORM
- PostgreSQL (Supabase)
- Node.js
- Docker (deploy futuro)

O projeto foi desenhado para evoluir futuramente para um **SaaS de monitoramento de equipamentos**.

---

# Regra mais importante

**Sempre explique o que pretende modificar antes de alterar arquivos.**

Fluxo obrigatório para qualquer mudança:

1. Analisar o problema
2. Explicar a solução proposta
3. Listar arquivos que serão modificados
4. Somente depois gerar código

Nunca modificar arquivos diretamente sem explicar primeiro.

---

# Como trabalhar no projeto

Preferir sempre:

- mudanças pequenas
- mudanças seguras
- código legível

Evitar:

- refatorações grandes desnecessárias
- alterar arquitetura sem justificativa
- mover arquivos sem explicar

Controllers devem ser **finos**.

Controllers devem apenas:

- validar DTO
- receber requisição HTTP
- chamar services

Toda regra de negócio deve estar em **Services**.

Persistência deve acontecer em Services usando **Prisma**.

Evitar acessar Prisma diretamente dentro de Controllers.

# Modo de trabalho do agente

O agente deve trabalhar de forma didática e incremental.

Regras obrigatórias:

- não implementar grandes blocos de funcionalidade de uma vez
- sempre propor apenas o próximo passo pequeno
- sempre explicar o que será feito antes de alterar arquivos
- sempre listar os arquivos que pretende modificar
- esperar confirmação do usuário antes de aplicar mudanças
- priorizar aprendizado e clareza sobre velocidade
- explicar a lógica das mudanças de forma simples

---

# Estrutura de pastas (arquitetura alvo)

src/
  modules/
    ingest/
      entrada de dados do device
      exemplo: POST /iot/temperature

    devices/
      estado do device
      lastSeen
      status online/offline

    readings/
      armazenamento de leituras
      atualmente temperatura
      futuramente outros sensores

    monitor/
      cron de monitoramento
      verificação de offline
      disparo de alertas

  prisma/
    PrismaService
    PrismaModule

---

# Regras de API (MVP)

Manter compatibilidade com o endpoint atual:

POST /iot/temperature

Payload esperado do device:

{
  "device_id": "freezer_01",
  "temperature": -12.3
}

Resposta esperada:

{
  "ok": true
}

Regras adicionais:

- Validar DTO com class-validator
- Converter tipos com class-transformer
- Nunca expor segredos em logs
- Nunca logar DATABASE_URL ou tokens

---

# Regras de monitoramento

Device deve ser considerado offline quando:

lastSeen < (agora - X minutos)

ou

lastSeen = null

Evitar spam de alertas:

- Alertar apenas na transição ONLINE → OFFLINE
- Usar campo isOffline para controlar estado

Quando device volta a enviar dados:

isOffline = false  
offlineSince = null

---

# Integrações externas

Quando habilitadas:

- n8n → recebe webhook de alerta
- Evolution API → envio de WhatsApp

Responsabilidade do backend:

- apenas enviar webhook
- não enviar mensagens diretamente

---

# Prisma / Banco de dados

Sempre que alterar schema.prisma:

Executar:

npx prisma migrate dev

ou

npx prisma generate

Modelos principais do MVP:

Device

- id
- lastSeen
- isOffline
- offlineSince
- lastAlertAt

TemperatureLog

- deviceId
- temperature
- createdAt

---

# Testes manuais esperados

Sempre indicar como testar.

Exemplo:

POST /iot/temperature

{
  "device_id": "freezer_01",
  "temperature": -12
}

Verificar:

- registro em TemperatureLog
- atualização de lastSeen em Device

---

# Qualidade de código

Prioridades:

1. código legível
2. simplicidade
3. segurança

Sempre:

- tratar integrações externas com try/catch
- logar erros importantes
- não esconder exceções críticas

---

# Atualização de documentação

Se mudanças alterarem conceitos do projeto:

Atualizar também:

- ARCHITECTURE.md
- PROJECT_RULES.md

---

# Futuro do projeto

Este projeto deverá evoluir para suportar:

- múltiplos sensores
- múltiplos tipos de leitura
- múltiplos dispositivos
- múltiplos clientes (multi-tenant SaaS)

A arquitetura deve permitir essa evolução.
