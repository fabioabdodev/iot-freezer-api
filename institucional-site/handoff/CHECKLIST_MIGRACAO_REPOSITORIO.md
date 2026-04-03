# Checklist de Migracao para Repositorio Proprio

Use este checklist quando a pasta `institucional-site/` for virar um projeto separado.

## Estrutura minima do novo repositorio

- `README.md`
- `docs/`
- `web/`
- `assets/`
- `handoff/`

## O que copiar

- `regras/`
- `estrategia/`
- `textos/`
- `comercial/`
- `assets/`
- `PROMPT_AGENT_SITE.txt`
- `PROMPT_AGENT_GERENTE_INTEGRACAO.txt`

## O que reorganizar no novo repo

- mover `regras/`, `estrategia/`, `textos/` e `comercial/` para dentro de `docs/`, se quiser padrao mais limpo
- manter `web/` como a implementacao real do site
- manter `assets/` com logo, favicon e imagens
- manter `handoff/` com decisoes de arquitetura

## O que nao copiar do projeto principal

- dashboard tecnico
- componentes do monitor
- hooks do app operacional
- logica de multi-tenant
- codigo de firmware

## Decisoes tecnicas recomendadas

- `Next.js`
- `TypeScript`
- `App Router`
- deploy separado do monitor
- stack propria no `Portainer`
- proxy no `Traefik`
- DNS e borda externa no `Cloudflare`
- dominio principal:
  - `www.virtuagil.com.br`

## Regra de produto

O site institucional:

- vende
- explica
- posiciona
- capta leads

O monitor:

- opera
- monitora
- alerta
- configura

## Paginas minimas do MVP

- Home
- Solucoes
- Segmentos
- Como funciona
- Planos
- Contato
- FAQ

## Integracoes futuras previstas

- WhatsApp comercial
- formulario de lead
- analytics
- pixel
- CRM ou automacao comercial

## Handoff para o proximo agente

Ao iniciar o site, o proximo agente deve ler primeiro:

- `README.md`
- `regras/REGRAS_FRONTEND.md`
- `regras/REGRAS_MARCA.md`
- `regras/REGRAS_CONTEUDO.md`
- `estrategia/PLANOS_INICIAIS.md`
- `estrategia/MODELO_MODULAR.md`
- `textos/MAPA_DO_SITE.md`
- `textos/PROPOSTA_VISUAL.md`
