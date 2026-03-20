---
description: arquitetura para modulos de solucao comerciais compostos por itens de modulos base
applyTo: '**'
---

# SOLUTION_MODULES_ARCHITECTURE.md

## Objetivo

Criar uma camada comercial de **modulos de solucao** que combina itens dos modulos base (`ambiental`, `acionamento`, `energia`, etc.) para formar produtos mais vendaveis, desacoplados e escalaveis.

## Conceito de produto

Camadas:

1. **Modulos base (capabilities)**  
   Recursos tecnicos contrataveis por item.
2. **Modulos de solucao (bundles comerciais)**  
   Pacotes orientados a problema de negocio.

Exemplo inicial:

- `cadeia_fria` = combinacao de itens ambientais + regras operacionais + opcional de acionamento/energia.

## Principios de arquitetura

1. **Composicao, nao duplicacao**  
   Solucao apenas orquestra itens base, sem reimplementar regra tecnica.
2. **Desacoplamento**  
   Modulo base continua independente de qualquer solucao comercial.
3. **Versionamento de solucao**  
   Ex.: `cadeia_fria@v1`, `cadeia_fria@v2`.
4. **Contratacao clara**  
   Cliente enxerga solucao vendavel; sistema ativa itens base correspondentes.
5. **Escalabilidade operacional**  
   A mesma solucao pode ser reaproveitada em segmentos diferentes com pequenas variacoes.

## Modelo de dados sugerido (fase nativa)

Entidades novas:

- `SolutionCatalog`
  - `key` (ex.: `cadeia_fria`)
  - `name`
  - `description`
  - `version`
  - `enabled`
- `SolutionCatalogItem`
  - relacao N:N entre solucao e item de modulo base (`itemKey`)
  - `required` (obrigatorio/opcional)
  - `defaultConfig` (json)
- `ClientSolution`
  - `clientId`
  - `solutionKey`
  - `version`
  - `enabled`
  - `activatedAt`

## Fase 1 (imediata, sem migracao estrutural pesada)

Implementacao pragmatica:

1. definir receitas de solucao em arquivo/config versionado
2. no onboarding do cliente, aplicar receita ativando itens existentes
3. exibir no dashboard um painel de prontidao por solucao
4. manter rastreio no handoff e case study

Receita exemplo `cadeia_fria` (v1):

- obrigatorios:
  - `ambiental.temperatura`
  - `ambiental.umidade`
  - `ambiental.gases`
- recomendados:
  - `acionamento.rele`
  - `energia.consumo`
- operacionais:
  - regra critica de gases
  - regra de temperatura com cooldown
  - fluxo `API -> n8n -> Evolution -> WhatsApp`

## Fase 2 (nativa no produto)

1. persistir entidades de solucao no banco
2. permitir contratar/descontratar solucao por cliente
3. sincronizar itens base automaticamente
4. exibir status de `pronto para venda` por solucao
5. registrar auditoria de alteracoes de solucao

## UX esperada

No dashboard, linguagem de negocio:

- mostrar **solucoes** primeiro
- mostrar **itens base** como detalhes tecnicos expansivos

Exemplo de card:

- `Solucao Cadeia Fria`
  - status: `implantacao`, `estabilizacao`, `pronta para venda`
  - checklist de aceite comercial

## Integracao com estudos de caso

Cada solucao deve ter:

1. playbook operacional
2. roteiro de validacao UI-first
3. checklist de pronto para venda

Para `cadeia_fria`, o proximo passo e abrir estudo de caso dedicado de multiunidade com contatos de WhatsApp por unidade.

## Criterio de aceite desta arquitetura

Considerar consolidada quando:

1. existir pelo menos 1 solucao versionada (`cadeia_fria@v1`)
2. solucao conseguir ativar itens base sem alterar codigo de dominio central
3. painel conseguir mostrar prontidao da solucao de forma comercial
4. estudo de caso da solucao estiver executavel ponta a ponta
