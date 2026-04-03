# Experiencia Cliente Final e Admin

## Objetivo

Formalizar a separacao entre os dois produtos visuais da Virtuagil:

- experiencia do cliente final
- experiencia do administrador tecnico

## Estado atual

O sistema hoje opera como uma central unica, mais adequada ao administrador.

A proxima evolucao recomendada e separar a experiencia de leitura simples da experiencia de configuracao.

## Cliente final

### O que ele quer ver

- se esta tudo bem
- qual equipamento esta em alerta
- qual temperatura esta agora
- se o equipamento esta online
- quando foi a ultima leitura

### O que ele nao quer ver de cara

- configuracao de cliente
- cadencia por equipamento
- gestao de usuarios
- laboratorio de simulacao
- auditoria profunda
- estrutura de modulos

### Linguagem visual

- refinada
- clara
- objetiva
- elegante
- tranquila

### Estrutura recomendada

- cabecalho simples da conta
- resumo geral
- cards por equipamento
- grafico resumido
- alertas recentes

## Administrador tecnico

### O que ele precisa ver

- clientes
- usuarios
- configuracao de modulos
- devices
- regras
- energia
- acionamento
- auditoria
- laboratorio

### Linguagem visual

- mais densa
- mais tecnica
- mais operacional
- ainda premium, mas menos contemplativa

## Regra de implementacao

A separacao deve acontecer por rota e por shell visual.

Sugestao:

- `/` ou rota atual: admin
- nova rota dedicada: cliente final

## Reflexo no institucional

Essa separacao reforca uma regra importante para o futuro site institucional:

- o institucional apresenta a empresa e a proposta de valor
- o painel do cliente final mostra acompanhamento simples
- o painel tecnico mostra configuracao e operacao

Ou seja:

- o site institucional nao deve ser desenhado como uma terceira variacao do dashboard
- ele deve ser um produto visual proprio, com foco em conversao e confianca

## Regra de design

Nao reutilizar a mesma pagina apenas escondendo blocos.

O ideal e uma experiencia com:

- hierarquia propria
- navegacao propria
- densidade propria
- componentes proprios

## Regra de acesso para o produto

No produto monitorado, a direcao validada agora e:

- administrador da plataforma:
  - clientes
  - modulos
  - usuarios
  - perfil comercial
  - equipamentos
  - estrutura da conta
- admin tecnico do cliente:
  - regras
  - leitura do que esta contratado
- usuario final:
  - painel simples
  - sem laboratorio
  - sem auditoria
  - sem areas internas da plataforma
