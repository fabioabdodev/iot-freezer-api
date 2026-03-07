---
description: regras de versionamento, CI/CD e deploy com GitHub Actions.
applyTo: '**'
---

# CI_CD_RULES.md — Regras de CI/CD e versionamento

Este projeto é versionado no GitHub e utilizará GitHub Actions para automação de build e deploy.

---

# Versionamento

Regras:

- O código fonte deve ser enviado para o GitHub.
- Nunca enviar arquivos com segredos.
- Nunca versionar `.env`.
- Nunca versionar chaves privadas, tokens ou credenciais.

Arquivos sensíveis devem ser configurados via:

- GitHub Secrets
- variáveis de ambiente no servidor
- secrets do Docker Swarm

---

# GitHub Actions

O projeto utilizará GitHub Actions para:

- build
- testes
- deploy

Fluxo esperado:

1. push para branch principal
2. GitHub Actions executa pipeline
3. build de imagem Docker
4. push para registry
5. deploy no servidor usando Docker Swarm

---

# Deploy

Ambiente de deploy:

- VPS com Docker Swarm
- Traefik
- containers Docker

Regras:

- a aplicação deve ser compatível com containerização
- preferir variáveis de ambiente para configuração
- deploy deve ser automatizável
- frontend e backend devem poder ser deployados separadamente

---

# Segurança de CI/CD

Nunca colocar no repositório:

- DATABASE_URL
- API keys
- tokens do GitHub
- tokens do Supabase
- tokens do Evolution
- webhooks sensíveis
- secrets do n8n

Sempre usar:

- GitHub Secrets
- secrets do Swarm
- environment variables

---

# Estrutura de pipelines

Back-end e front-end devem poder possuir pipelines independentes.

Exemplo futuro:

- pipeline do backend NestJS
- pipeline do frontend Next.js

---

# Regras para agentes

Ao sugerir deploy, CI/CD ou automações:

- considerar GitHub Actions como padrão
- considerar Docker Swarm como ambiente de produção
- não sugerir deploy manual como padrão
- não sugerir segredos hardcoded em arquivos