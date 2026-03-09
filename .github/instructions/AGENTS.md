---
applyTo: '**'
description: regras globais para agentes de IA neste repositorio
---

# AGENTS.md - Regras para agentes neste repositorio

Este repositorio implementa um sistema de monitoramento IoT para equipamentos,
com foco inicial em temperatura de freezers e geladeiras.

Stack atual:

- NestJS no backend
- Prisma ORM
- PostgreSQL (Supabase)
- Next.js no frontend
- Docker Swarm + Traefik em producao
- GitHub Actions para CI/CD

## Regra principal de colaboracao

Antes de editar arquivos, o agente deve:

1. Explicar o que pretende alterar
2. Dizer por que a mudanca e necessaria
3. Listar os arquivos que devem ser modificados

Depois disso, pode seguir com a implementacao sem exigir nova confirmacao quando
a direcao ja estiver clara no pedido do usuario.

## Como trabalhar no projeto

Preferir sempre:

- mudancas pequenas e coesas
- codigo legivel
- baixo risco de regressao
- compatibilidade com deploy em Docker Swarm

Evitar:

- refatoracoes grandes sem necessidade
- mover arquivos sem motivo claro
- espalhar regra de negocio em controllers

## Regras de backend

- Controllers devem ser finos
- Regras de negocio devem ficar em services
- Acesso ao banco deve acontecer via Prisma em services/infra
- Nunca expor segredos em logs
- Sempre considerar `clientId` quando o fluxo for multi-tenant

## Regras de API atuais

Fluxo principal de ingestao:

- `POST /iot/temperature`
- header obrigatorio: `x-device-key`

Payload esperado:

```json
{
  "device_id": "freezer_01",
  "temperature": -12.3
}
```

Resposta esperada:

```json
{
  "ok": true
}
```

## Regras de monitoramento

- Device offline e detectado por inatividade
- Alerta deve ocorrer apenas na transicao `online -> offline`
- Quando o device volta a enviar dados, o estado offline deve ser limpo
- Alertas de temperatura devem respeitar tolerancia e cooldown configurados

## Integracoes externas

O backend nao envia WhatsApp diretamente.

Fluxo correto:

Backend -> webhook -> n8n -> Evolution API -> WhatsApp

## Documentacao obrigatoria

Se a mudanca alterar fluxo, deploy, simulacao ou arquitetura, atualizar tambem o
documento relevante em `.github/instructions/`.

Arquivos mais importantes:

- `ARCHITECTURE.md`
- `PROJECT_RULES.md`
- `CI_CD_RULES.md`
- `FRONTEND_RULES.md`
- `SIMULATED_DEVICE.md`

## Testes e validacao

Sempre indicar como validar a mudanca. Prioridade:

1. `npm run build`
2. `npm test -- --runInBand`
3. `npm run test:e2e -- --runInBand`
4. validacao manual quando envolver dashboard, ingestao ou deploy
