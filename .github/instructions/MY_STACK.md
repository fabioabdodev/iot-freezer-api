---
applyTo: '**'
description: minha stack de producao, dominios e organizacao dos produtos.
---

# Infraestrutura de producao

A aplicacao roda em uma VPS na Hostinger KVM4 usando Docker Swarm.

Stack disponivel na infraestrutura:

- Docker Swarm (Portainer)
- Traefik (reverse proxy)
- Cloudflare (DNS)
- PostgreSQL
- MySQL
- Redis
- n8n editor/workflows -> workflow.virtuagil.com.br
- n8n webhooks -> webhookworkflow.virtuagil.com.br
- Evolution API (envio de WhatsApp) -> evolution.virtuagil.com.br
- Supabase (PostgreSQL gerenciado)

## Regras importantes de infraestrutura

- Nao implementar envio direto de WhatsApp na aplicacao.
- Alertas devem ser enviados via webhook para n8n.
- n8n sera responsavel por disparar mensagens via Evolution API.
- Banco principal da aplicacao e o Supabase (PostgreSQL gerenciado).
- PostgreSQL local pode existir para outros servicos, mas o produto principal deve considerar Supabase como banco principal.
- Redis hoje apoia principalmente os fluxos do n8n.
- Redis pode ser reaproveitado no futuro pela API para fila e cache compartilhados.

## Regras de deploy

- Aplicacoes devem ser containerizadas com Docker.
- Deploy deve ser compativel com Docker Swarm.
- Preferir configuracao por variaveis de ambiente.
- Preferir servicos independentes por produto.
- Considerar integracao com Traefik para roteamento por subdominio.

# Dominios e organizacao de produtos

Dominio principal da empresa:

- virtuagil.com.br

## Estrategia de dominios

- O site institucional fica em virtuagil.com.br
- Cada produto deve ter frontend e API separados por subdominio
- Preferir subdominios a caminhos como /api
- O backend nao deve servir paginas HTML do frontend
- Evitar concentrar multiplos produtos em um unico backend monolitico baseado em caminhos

## Padrao preferido

- {produto}.virtuagil.com.br
- api-{produto}.virtuagil.com.br

## Exemplo atual

- monitor.virtuagil.com.br
- api-monitor.virtuagil.com.br
- workflow.virtuagil.com.br
- webhookworkflow.virtuagil.com.br
- evolution.virtuagil.com.br
