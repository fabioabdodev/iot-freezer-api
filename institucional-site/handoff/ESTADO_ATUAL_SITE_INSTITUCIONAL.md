# Estado Atual do Site Institucional

## Situação em 2026-04-03

O site institucional já existe como app real em:

- `institucional-site/web`

Ele está separado visualmente do monitor e foi preparado para rodar em stack própria no `Portainer`, com `Traefik` e `Cloudflare`, usando o domínio:

- `www.virtuagil.com.br`

## O que já está implementado

- app institucional em `Next.js`
- páginas:
  - `/`
  - `/solucoes`
  - `/planos`
  - `/contato`
- home com direção comercial
- header fixo
- CTA da Jade
- cards de venda dos módulos
- uso de `framer-motion`
- uso de `lucide-react`
- componentes `ui` próprios no estilo `shadcn`
- metadata institucional
- favicon e logomarca em `public/`

## Infraestrutura adotada

- stack separada no `Portainer`
- rede pública do ambiente: `network_public`
- proxy reverso: `Traefik`
- DNS e borda: `Cloudflare`
- imagem publicada no `GHCR`

## Arquivos principais desta fase

- `institucional-site/web/app/page.tsx`
- `institucional-site/web/app/layout.tsx`
- `institucional-site/web/app/globals.css`
- `institucional-site/web/components/site/home-page.tsx`
- `institucional-site/web/components/site/hero-illustration.tsx`
- `institucional-site/web/components/ui/button.tsx`
- `institucional-site/web/components/ui/card.tsx`
- `institucional-site/web/public/brand/logomarca.png`
- `institucional-site/web/public/favicon.png`
- `institucional-site/web/portainer-stack.yml`
- `.github/workflows/deploy.yml`

## O que já foi validado

- build local do institucional: ok
- stack no `Portainer`: subiu
- domínio `www.virtuagil.com.br`: abriu
- certificado/TLS: passou a responder depois do ajuste de imagem/stack

## Ponto importante para o próximo agente

Se o site publicado ainda parecer antigo, o problema mais provável não é código. Os pontos a checar são:

1. se a `GitHub Action` terminou;
2. se a imagem nova foi publicada no `GHCR`;
3. se a stack `virtuagil-site` foi atualizada no `Portainer`;
4. se o navegador ainda está com cache antigo.

## Decisões já tomadas e que devem ser preservadas

- o institucional não deve parecer dashboard
- a linguagem deve ser comercial, moderna e confiável
- a Jade faz parte da experiência comercial
- o texto-base da Jade no institucional pode usar a linha:
  - `Como posso ajudar?`
- o monitor e o institucional devem continuar separados, mesmo estando no mesmo repositório por enquanto

## O que ainda merece evolução

- deixar a home ainda mais premium e autoral
- revisar visual de `/solucoes`, `/planos` e `/contato` no mesmo nível da home
- incluir prova social, segmentos e casos de uso reais
- revisar SEO e Open Graph com mais capricho
- decidir se o projeto continua neste repositório ou migra depois para repo próprio

## Observação sobre a base da Jade

A pasta `docs/jade-knowledge/` foi revisada localmente para dar à Jade uma base mais ampla, direta e comercial. A versão mais útil para copiar em Google Docs está em:

- `docs/jade-knowledge/formatado/`

Esses arquivos continuam fora do fluxo normal de Git do projeto atual. Se o próximo agente precisar publicar essa base, deve primeiro revisar a regra de versionamento dessa pasta.
