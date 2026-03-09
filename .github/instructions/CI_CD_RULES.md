---
description: regras de versionamento, CI/CD e deploy com GitHub Actions
applyTo: '**'
---

# CI_CD_RULES.md - Regras de CI/CD e versionamento

## Versionamento

- O codigo fonte deve ficar no GitHub
- Nunca versionar `.env`
- Nunca versionar chaves privadas, tokens ou credenciais
- Mudancas grandes devem ser separadas em commits coesos quando fizer sentido

Arquivos sensiveis devem ser configurados via:

- GitHub Secrets
- `.env.prod` na VPS
- variaveis de ambiente do Docker Swarm

## Pipelines atuais

O projeto usa GitHub Actions com dois workflows:

- `ci.yml`
  - `npm ci`
  - `prisma generate`
  - `npm run build`
  - testes unitarios
  - testes e2e
- `deploy.yml`
  - build e push das imagens `api` e `web` para GHCR
  - deploy da stack no Swarm

## Deploy atual

Ambiente de producao:

- VPS na Hostinger
- Docker Swarm
- Traefik
- GHCR como registry
- Portainer Community Edition

Fluxo padrao:

1. push para `main`
2. GitHub Actions publica as imagens
3. workflow faz `docker stack deploy` por SSH

Observacao:

- no Portainer Community Edition, webhook de stack nao e o fluxo padrao
- o caminho principal deste projeto e deploy por SSH

## Regras de seguranca

Nunca colocar no repositorio:

- `DATABASE_URL`
- `DEVICE_API_KEY`
- `GHCR_TOKEN`
- tokens do Supabase
- webhooks sensiveis
- credenciais da VPS

Sempre usar:

- GitHub Secrets
- `.env.prod` fora do Git
- environment variables no Swarm

## Regras para agentes

Ao sugerir automacao, deploy ou pipeline:

- considerar GitHub Actions como padrao
- considerar Docker Swarm como ambiente de producao
- considerar `api` e `web` como servicos independentes
- nao sugerir segredos hardcoded
