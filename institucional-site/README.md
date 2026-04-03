# Site Institucional Virtuagil

Esta pasta e a base estrategica do futuro projeto institucional da
`www.virtuagil.com.br`.

Objetivos:

- separar o site comercial do produto IoT
- consolidar regras, estrategia, textos e material comercial
- servir de base para um repositorio proprio
- permitir que outro agente comece a implementacao sem depender da conversa atual

## Decisao recomendada de repositorio

O caminho mais saudavel e este:

- produto operacional continuar no projeto principal
- site institucional nascer em um repositorio proprio

Sugestao de nome futuro:

- `virtuagil-site`
- ou `institucional-virtuagil`

Motivos:

- separa marketing de operacao
- evita deploy acoplado com dashboard e API
- facilita SEO, conteudo e branding
- reduz mistura entre backlog comercial e backlog tecnico do produto

## Posso deixar no mesmo GitHub por um tempo?

Sim.

Se quiser ganhar velocidade no comeco, voce pode:

- manter a pasta `institucional-site/` neste repositorio
- criar o site dentro de `institucional-site/web/`
- validar o MVP aqui
- e depois mover para um repositorio proprio

Mas a recomendacao continua sendo:

- usar esta pasta como incubadora
- e mover para repositorio proprio quando o escopo do site ganhar vida propria

## Importante

- esta pasta esta pensada para ser exportada ou copiada depois
- ela nao deve herdar a UI do dashboard tecnico
- ela nao deve virar deposito de firmware ou operacao do monitor
- quando o projeto institucional nascer, estes arquivos devem acompanhar o novo repositorio

## O que esta pasta deve entregar

Ela deve deixar pronto:

- posicionamento da Virtuagil
- estrutura de paginas
- regras de frontend
- regras de marca
- base comercial
- textos institucionais
- handoff para implementacao

Ela nao deve virar:

- copia do monitor
- backlog de API
- documentacao de bancada
- painel autenticado do produto

## Estrutura atual

### `regras/`

Regras do projeto institucional:

- `regras/INSTRUCOES_AGENTES.md`
- `regras/REGRAS_PRODUTO.md`
- `regras/REGRAS_FRONTEND.md`
- `regras/REGRAS_CONTEUDO.md`
- `regras/REGRAS_SEO.md`
- `regras/REGRAS_MARCA.md`

### `estrategia/`

Base de produto e posicionamento:

- `estrategia/MODELO_MODULAR.md`
- `estrategia/MODULOS_COMERCIAIS.md`
- `estrategia/PLANOS_INICIAIS.md`
- `estrategia/INFRAESTRUTURA_PREVISTA.md`
- `estrategia/MODELO_OPERACIONAL_INICIAL.md`
- `estrategia/MODELO_ACESSO_E_LOGIN.md`
- `estrategia/MODELO_PLANOS_MODULOS_E_COBRANCA.md`
- `estrategia/PLANO_EDITORIAL_INICIAL.md`
- `estrategia/EXPERIENCIA_CLIENTE_FINAL_E_ADMIN.md`

### `textos/`

Base textual do site:

- `textos/MAPA_DO_SITE.md`
- `textos/TEXTO_HOME.md`
- `textos/TEXTO_SOLUCOES.md`
- `textos/TEXTO_SEGMENTOS.md`
- `textos/TEXTO_CONTATO.md`
- `textos/FAQ_COMERCIAL.md`
- `textos/ESTRUTURA_HOME_SECOES.md`
- `textos/PROPOSTA_VISUAL.md`
- `textos/RASCUNHO_HOME.md`

### `comercial/`

Materiais de venda, propostas e oportunidades:

- `comercial/base/`
- `comercial/vendas/`
- `comercial/clientes/`

### `assets/`

Base de marca e identidade:

- `assets/brand/`

### `web/`

Reservado para a implementacao real do site institucional.

## Direcao atual

- site institucional em `www.virtuagil.com.br`
- produto operacional em `monitor.virtuagil.com.br`
- API em `api-monitor.virtuagil.com.br`
- proposta comercial modular
- entrada principal via `temperatura`
- expansoes comerciais por modulo:
  - `ambiental`
  - `acionamento`
  - `energia`

## Estrutura recomendada para o novo repositorio

Quando esta pasta virar repositorio proprio, a estrutura recomendada e:

- `docs/`
- `web/`
- `assets/`
- `handoff/`

Distribuicao sugerida:

- `docs/`
  estrategia, regras, textos, SEO, comercial
- `web/`
  app Next.js institucional
- `assets/`
  marca, favicon, imagens e materiais visuais
- `handoff/`
  estado atual, checklist de migracao e decisoes de arquitetura

## MVP recomendado do site

Primeira versao:

- Home
- Solucoes
- Segmentos
- Como funciona
- Planos e pacotes
- Contato
- FAQ

Evitar no MVP:

- area autenticada
- blog complexo
- CMS pesado
- laboratorio
- simulador
- shell do dashboard

## Dependencias que precisam ser lembradas

O site institucional depende conceitualmente do projeto principal, mas nao deve depender dele em runtime.

Ele deve herdar apenas:

- nome dos modulos
- linguagem comercial
- planos e pacotes
- provas reais de implantacao
- coerencia de produto
- papel institucional da Jade como assistente comercial

Ele nao deve herdar:

- shell do admin
- componentes do monitor
- logica de multi-tenant
- navegacao operacional

## Relacao com os outros projetos locais

Estas tres frentes devem continuar separadas, mas alinhadas:

- `institucional-site/`
  vende a Virtuagil, seus modulos, pacotes, diferenciais e proposta comercial
- projeto principal `iot-virtuagil-api`
  entrega API, dashboard, operacao, alertas e multi-tenant
- `iot-virtuagil-firmware/`
  cuida de firmware, hardware, sensores, bancada e runtime embarcado

Regra pratica:

- assunto institucional, comercial, SEO, copy, marca e marketing:
  consultar primeiro esta pasta
- assunto dashboard, alertas, operacao e UX do produto:
  consultar primeiro o projeto principal
- assunto ESP32, sensores, caixa, bancada e instalacao:
  consultar primeiro `iot-virtuagil-firmware/`

## Regra central

O site institucional deve vender a Virtuagil como empresa de automacao e monitoramento por modulos.

O produto IoT continua separado, com repositorio, stack e deploy proprios.

## Jade no institucional

A `Jade` deve ser tratada como parte oficial da experiencia institucional e comercial.

Papel esperado da Jade:

- recepcionar o visitante
- responder duvidas iniciais
- conduzir triagem comercial
- ajudar no primeiro contato via WhatsApp
- usar linguagem simples e acolhedora

Direcao de UX registrada:

- a Jade pode aparecer no site como assistente comercial
- a abordagem deve ser humana e leve
- a frase-base pode seguir a linha:
  - `Como posso ajudar?`

Ela nao deve ser apresentada como painel tecnico, bot frio ou interface operacional do monitor.

## Arquivos-chave para o proximo agente

Se outro agente iniciar o projeto institucional depois, os arquivos mais importantes para abrir primeiro sao:

- `README.md`
- `regras/REGRAS_FRONTEND.md`
- `regras/REGRAS_MARCA.md`
- `regras/REGRAS_CONTEUDO.md`
- `estrategia/PLANOS_INICIAIS.md`
- `estrategia/MODELO_MODULAR.md`
- `estrategia/EXPERIENCIA_CLIENTE_FINAL_E_ADMIN.md`
- `textos/MAPA_DO_SITE.md`
- `textos/ESTRUTURA_HOME_SECOES.md`
- `textos/PROPOSTA_VISUAL.md`
- `textos/TEXTO_HOME.md`

## Proximo passo esperado

Quando voce decidir iniciar a implementacao, o agente deve:

1. revisar esta pasta inteira
2. confirmar se o site nascera:
   - em repositorio proprio
   - ou temporariamente dentro de `institucional-site/web/`
3. propor a arquitetura inicial do `Next.js`
4. criar o shell visual institucional
5. transformar os textos em paginas reais
