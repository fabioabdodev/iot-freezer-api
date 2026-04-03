---
applyTo: '**'
description: regras globais para agentes no futuro site institucional da Virtuagil
---

# AGENTS.md

Este projeto sera o site institucional e comercial da Virtuagil.

Ele nao deve misturar:

- codigo operacional do produto IoT
- rotas do dashboard
- regras internas de operacao do monitoramento

Antes de editar arquivos:

1. explicar a intencao da mudanca
2. listar os arquivos a alterar
3. manter foco comercial e institucional

Prioridades:

1. clareza comercial
2. credibilidade
3. geracao de leads
4. boa experiencia em mobile
5. SEO forte para servicos B2B locais e regionais

Evitar:

- linguagem tecnica demais na home
- visual generico sem identidade
- misturar o produto IoT com o site institucional na mesma aplicacao

## Infraestrutura assumida

Ao propor arquitetura ou deploy para este projeto, assumir como padrao:

- nova stack propria
- operacao via `Portainer`
- roteamento via `Traefik`
- borda externa e DNS via `Cloudflare`
- dominio principal institucional em `www.virtuagil.com.br`

Se o site nascer temporariamente dentro do repositorio atual, isso nao muda a regra:

- a stack continua separada
- o deploy continua separado
- a navegacao continua separada do monitor

## Regra de separacao obrigatoria

Se o institucional for criado neste mesmo repositorio, ele deve obedecer sem excecao:

- todo o codigo do site fica em `institucional-site/web/`
- nenhuma rota do institucional entra em `apps/web/`
- nenhum componente do monitor e reutilizado no institucional
- nenhum hook do produto e reutilizado no institucional
- nenhum deploy do institucional e acoplado ao deploy do monitor
- a stack do institucional no `Portainer` e propria
