# FRONTEND_RULES.md

## Stack sugerida

- Next.js
- TypeScript
- app router
- componentes reutilizaveis
- formularios simples para captacao

## Regra de separacao de produto

O site institucional:

- nao deve reutilizar a shell do monitor
- nao deve parecer dashboard
- nao deve misturar menus do admin
- nao deve carregar linguagem de operacao tecnica como primeira impressao

Se nascer dentro deste mesmo repositorio por um periodo:

- todo o app institucional deve ficar em `institucional-site/web/`
- sem compartilhar rotas com o monitor
- sem compartilhar navegacao autenticada com o produto principal
- sem compartilhar componentes do monitor
- sem compartilhar hooks do monitor
- sem copiar a home tecnica do produto como base visual

## Infraestrutura esperada

O futuro site institucional pode usar a mesma linha de infraestrutura do seu ambiente atual:

- Docker
- Docker Swarm
- Traefik
- Cloudflare

Mas deve permanecer em projeto e stack separados do produto IoT.

## Direcao visual

O site deve parecer premium, confiavel e comercial.

Preferir:

- tipografia forte
- secoes bem ritmadas
- imagens ou ilustracoes com contexto real de operacao
- CTA claro
- prova social quando existir

Evitar:

- visual de dashboard no site institucional
- excesso de blocos tecnicos
- cara de template generico

## Estrutura sugerida

- home
- solucoes
- segmentos
- como funciona
- planos ou proposta comercial
- contato
- FAQ

## Regra de UI para secao de pacotes

Na secao institucional de pacotes:

- renderizar cards para os 3 pacotes principais:
  - `Essencial`
  - `Operacao Local`
  - `Gestao Completa`
- incluir um 4o card fixo:
  - `Projeto Personalizado`
- manter destaque visual do card personalizado como alternativa consultiva
- evitar linguagem tecnica de modulo no primeiro nivel do card

## Regra de UI para plataforma de clientes

A plataforma deve assumir dois produtos visuais distintos:

### Dashboard do cliente final

Deve ser:

- sofisticado
- moderno
- intuitivo
- de simples leitura
- focado em status atual e historico essencial

Deve priorizar:

- temperatura atual
- faixa esperada
- status online ou offline
- ultimo envio
- alertas recentes
- cards claros e leitura rapida

Deve evitar:

- excesso de filtros
- termos tecnicos demais
- poluicao operacional
- visual de painel de suporte

### Dashboard tecnico do administrador

Deve ser:

- mais profundo
- mais configuravel
- orientado a operacao e diagnostico

Deve conter:

- cadencia de monitoramento
- regras e limites
- configuracao de cliente
- configuracao de device
- telemetria detalhada
- manutencao e suporte

## Integracoes futuras

- formulario de lead
- WhatsApp comercial
- analytics
- pixel e Google Ads quando fizer sentido

## Implementacao inicial validada

Ja existe uma primeira rota dedicada para cliente final:

- `/cliente`

## Regra de preferencia de layout

Na plataforma autenticada:

- cada `cliente` deve ter um layout padrao
- cada `usuario` pode:
  - herdar o layout do cliente
  - usar `client`
  - usar `technical`

Com isso:

- o admin da plataforma escolhe o perfil visual base da conta
- o acesso tecnico continua disponivel sem forcar todos os usuarios ao mesmo painel

Ela deve ser tratada como base da experiencia simplificada.

Regra para proximas evolucoes:

- expandir essa rota em vez de voltar a concentrar tudo na home administrativa
- manter linguagem visual mais limpa para o cliente final
- preservar a rota principal para uso tecnico e administrativo

## Regra para o futuro institucional

O site institucional deve aproveitar esse aprendizado sem copiar a interface do produto.

Ele pode usar como referencia:

- clareza
- hierarquia
- leitura rapida
- premium visual

Mas nao deve reproduzir:

- cards de telemetria
- navegacao operacional
- blocos de administracao
