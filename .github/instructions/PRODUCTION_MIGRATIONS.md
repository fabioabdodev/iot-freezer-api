# Migrations em Producao

Data de referencia: 2026-03-14

## Objetivo

Aplicar migrations do Prisma com seguranca antes de subir uma nova versao da API em producao.

As migrations obrigatorias no ponto atual sao:

- `20260314183000_create_audit_logs`
- `20260314195000_create_actuation_schedules`

## Regra operacional

- nunca assumir que a API nova pode subir sem schema atualizado
- rodar `prisma migrate deploy` antes do rollout da stack
- usar o mesmo `.env.prod` real da VPS
- manter backup recente do banco antes de changes estruturais

## Fluxo com deploy via SSH do GitHub Actions

O workflow ja foi preparado para:

1. dar `docker pull` da imagem nova da API
2. executar:

```bash
docker run --rm --env-file .env.prod "${API_IMAGE}" npx prisma migrate deploy
```

3. fazer `docker stack deploy`

Isso depende de:

- `/opt/iot-virtuagil-api/.env.prod` existir na VPS
- a imagem da API conter `prisma` CLI e a pasta `prisma/`

## Fluxo manual para VPS ou Portainer

Se o deploy for disparado por webhook do Portainer, a migration precisa ser rodada manualmente antes do update da stack.

No host da VPS:

```bash
cd /opt/iot-virtuagil-api
set -a
. ./.env.prod
set +a
docker pull ghcr.io/fabioabdodev/iot-virtuagil-api/api:latest
docker run --rm --env-file .env.prod ghcr.io/fabioabdodev/iot-virtuagil-api/api:latest npx prisma migrate deploy
```

Depois disso:

- atualizar a stack no Portainer
- ou deixar o webhook seguir normalmente

## Verificacao rapida

Comandos uteis:

```bash
docker run --rm --env-file .env.prod ghcr.io/fabioabdodev/iot-virtuagil-api/api:latest npx prisma migrate status
docker service ls | grep iot-monitor
```

## Cuidados

- nunca rodar `prisma migrate dev` em producao
- se `migrate deploy` falhar, nao seguir com rollout da stack
- confirmar `DATABASE_URL` e `DIRECT_DATABASE_URL` antes da execucao
- se houver duvida sobre o estado do banco, fazer backup antes de repetir a migration
