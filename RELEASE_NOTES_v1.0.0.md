# Virtuagil Monitor - Release v1.0.0

Data: 2026-03-21

## Escopo da release

- consolidacao dos modulos `ambiental`, `acionamento`, `energia` e `solucoes comerciais`
- ajuste do fluxo de estudo de caso para continuidade sem recadastro obrigatorio
- padronizacao de cadastro com geracao automatica de codigo tecnico a partir de `Nome`
- filtro principal com busca por nome
- aplicacao de branding oficial (logomarca e favicon)
- melhoria visual no bloco de modulos contratados do cliente
- consolidacao de regras operacionais e documentacao para continuidade entre chats

## Ajustes de produto e UI

- `SessionAuthGuard` resolvido via import correto de `AuthModule` em `SolutionsModule`
- titulo comercial da solucao ajustado para narrativa de venda
- guia de estudo de caso atualizado para operacao real sem refazer cadastros existentes
- rodape global com versao/release/build aplicado em todas as telas

## Regras consolidadas

- labels oficiais de formulario registrados e padronizados em portugues
- regra transversal: `Nome` como entrada principal de cadastro
- `codigo tecnico (imutavel)` e `codigo interno do cliente` sem digitacao manual quando derivavel
- regra de release visual com exibicao de versao/build/release no fechamento
- inicio oficial da fase de hardware real registrado (ESP32 + sensor em bancada domestica)

## Validacao final

- build backend: `npm run build` (ok)
- build frontend: `npm run build` em `apps/web` (ok)

## Observacoes de deploy

- preferir deploy com imagens versionadas por release (`sha-...` ou tag semantica)
- manter verificacao pos-deploy com `/health` e checklist de producao
