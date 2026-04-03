# Decisao de Repositorio e MVP do Institucional

## Recomendacao principal

Criar o site institucional em repositorio proprio.

## Opcao 1 - Repositorio proprio

Melhor para:

- SEO
- deploy separado
- stack independente
- operacao limpa pelo Portainer
- agentes trabalhando sem misturar contexto
- evolucao de marca e marketing

## Opcao 2 - Mesmo repositorio por um periodo curto

Aceitavel quando:

- a prioridade e velocidade
- voce quer testar o MVP primeiro
- ainda nao quer abrir outro repositorio

Se seguir assim, a regra deve ser:

- o site institucional mora apenas em `institucional-site/web/`
- sem compartilhar componentes do dashboard
- sem misturar rotas do monitor com o institucional
- mesmo assim com stack separada no `Portainer`

## O que eu recomendo para voce

Como o projeto principal ja esta crescendo bastante, o melhor medio prazo e:

1. consolidar estrategia nesta pasta
2. iniciar o MVP aqui se quiser velocidade
3. mover para repositorio proprio assim que o app ganhar corpo

## Infraestrutura ja decidida

Independente da opcao de repositorio, a infraestrutura do institucional deve assumir:

- stack propria
- deploy via `Portainer`
- proxy via `Traefik`
- DNS e camada externa via `Cloudflare`

## MVP sugerido

Paginas:

- Home
- Solucoes
- Segmentos
- Como funciona
- Planos
- Contato
- FAQ

Objetivo do MVP:

- parecer profissional
- explicar a Virtuagil
- apresentar modulos e planos
- gerar conversa comercial

## O que nao entra no MVP

- area logada
- painel tecnico
- laboratorio
- simulador
- fluxo operacional do monitor

## Regra final

O institucional vende a Virtuagil.

O monitor entrega a operacao.
