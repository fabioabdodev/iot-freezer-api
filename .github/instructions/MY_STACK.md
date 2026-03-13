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

## Ajustes operacionais recentes

- o `n8n` em producao estava apontando para `QUEUE_BULL_REDIS_HOST=redis`, mas o host correto na rede era `redis_redis`
- o `n8n` tambem tinha `N8N_NODE_PATH` incorreto em alguns servicos e foi ajustado para `/home/node/.n8n/nodes`
- a API em produção precisou migrar da conexão direta `db.<project>.supabase.co:5432` para o host do `session pooler`
- a conexão direta do Supabase era `Not IPv4 compatible` e falhava dentro do container da API
- a string final correta da API usa `aws-1-sa-east-1.pooler.supabase.com:5432`

## Regra pratica de deploy da API

Na VPS, antes de executar `docker stack deploy`, exportar o `.env.prod` no shell atual:

- `set -a`
- `. ./.env.prod`
- `set +a`

Sem isso, o Swarm pode aplicar a stack com variaveis vazias no servico `iot-monitor_api`.

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
