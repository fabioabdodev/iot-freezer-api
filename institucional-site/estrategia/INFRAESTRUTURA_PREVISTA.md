# Infraestrutura Prevista para o Site Institucional

## Direcao geral

O futuro projeto institucional da `www.virtuagil.com.br` deve usar a mesma linha de infraestrutura da sua operacao atual, mas como stack separada do produto IoT.

Decisao atual registrada:

- o site institucional sera uma nova stack
- a criacao e a operacao devem acontecer pelo `Portainer`
- o roteamento continuara com `Traefik`
- o DNS e a camada externa continuarao com `Cloudflare`

## Base de infraestrutura prevista

- Docker
- Portainer
- Docker Swarm
- Traefik
- Cloudflare

Dependencias opcionais, conforme a evolucao do site:

- PostgreSQL
- Redis
- n8n
- analytics
- integracoes de WhatsApp

## Regra principal

Mesmo usando stack parecida com a do monitor, o site institucional deve ser tratado como projeto separado.

Separar:

- repositorio
- stack
- deploy
- dominio principal
- backlog
- secrets

## O que pode ser compartilhado conceitualmente

- padrao de deploy com Docker
- operacao de stack pelo Portainer
- roteamento via Traefik
- DNS e proxy no Cloudflare
- boas praticas de CI/CD
- observabilidade quando fizer sentido

## O que deve continuar separado

- banco do produto
- rotas do dashboard
- codigo do frontend do monitor
- secrets do produto
- regras internas do sistema IoT

## Estrutura sugerida de dominio

- `www.virtuagil.com.br` -> site institucional
- `virtuagil.com.br` -> opcional, com redirecionamento para `www`
- `monitor.virtuagil.com.br` -> produto IoT
- `api-monitor.virtuagil.com.br` -> API do produto IoT

## Fluxo operacional recomendado

Para o site institucional, o fluxo esperado e:

1. codigo no projeto institucional
2. stack propria publicada pelo `Portainer`
3. roteamento externo pelo `Traefik`
4. DNS e protecao externa via `Cloudflare`

## Regra de separacao de stacks

Mesmo no mesmo servidor ou cluster, manter separado:

- stack do institucional
- stack do monitor
- stack da API
- stacks auxiliares

## Decisao pratica para o proximo agente

Ao criar o app do institucional, assumir como padrao:

- deploy por `Portainer`
- reverse proxy por `Traefik`
- borda externa por `Cloudflare`
- stack propria do site
