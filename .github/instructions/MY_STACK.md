---
applyTo: '**'
description: minha stack de produção, domínios e organização dos produtos.
---

# Infraestrutura de produção

A aplicação roda em uma VPS na Hostinger KVM4 usando Docker Swarm.

Stack disponível na infraestrutura:

- Docker Swarm
- Traefik (reverse proxy)
- Cloudflare (DNS)
- PostgreSQL
- MySQL
- Redis
- n8n (automação e workflows) → workflows.virtuagil.com.br
- Evolution API (envio de WhatsApp) → evolution.virtuagil.com.br
- Supabase (PostgreSQL gerenciado)

## Regras importantes de infraestrutura

- Não implementar envio direto de WhatsApp na aplicação.
- Alertas devem ser enviados via webhook para n8n.
- n8n será responsável por disparar mensagens via Evolution API.
- Banco principal da aplicação é o Supabase (PostgreSQL gerenciado).
- PostgreSQL local pode existir para outros serviços, mas o produto principal deve considerar Supabase como banco principal.

## Regras de deploy

- Aplicações devem ser containerizadas com Docker.
- Deploy deve ser compatível com Docker Swarm.
- Preferir configuração por variáveis de ambiente.
- Preferir serviços independentes por produto.
- Considerar integração com Traefik para roteamento por subdomínio.

# Domínios e organização de produtos

Domínio principal da empresa:

- virtuagil.com.br

## Estratégia de domínios

- O site institucional fica em virtuagil.com.br
- Cada produto deve ter frontend e API separados por subdomínio
- Preferir subdomínios a caminhos como /api
- O backend não deve servir páginas HTML do frontend
- Evitar concentrar múltiplos produtos em um único backend monolítico baseado em caminhos

## Padrão preferido

- {produto}.virtuagil.com.br
- api-{produto}.virtuagil.com.br

## Exemplo atual

- monitor.virtuagil.com.br
- api-monitor.virtuagil.com.br