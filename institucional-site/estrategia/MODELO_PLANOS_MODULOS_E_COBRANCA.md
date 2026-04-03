# Modelo de Planos, Modulos e Cobranca

## Objetivo

Definir de forma simples como a Virtuagil pode organizar:

- usuarios
- clientes
- planos
- modulos
- cobranca

sem criar complexidade desnecessaria na fase inicial.

## Regra principal

Plano e cobranca devem ficar ligados ao cliente, nao ao usuario.

Motivo:

- usuario e a pessoa que acessa
- cliente e a conta comercial
- plano e modulo pertencem a relacao comercial com o cliente

## Estrutura conceitual recomendada

### User

Representa a pessoa que acessa o sistema.

Campos esperados no futuro:

- `id`
- `name`
- `email`
- `passwordHash`
- `role`
- `clientId`
- `active`

### Client

Representa a empresa/operacao contratante.

Exemplo:

- restaurante
- clinica
- laboratorio

### Plan

Representa um plano comercial da Virtuagil.

Exemplo:

- piloto
- base
- expandido

### Subscription

Representa a adesao de um cliente a um plano.

Pode guardar:

- `clientId`
- `planId`
- `status`
- `startDate`
- `endDate`
- `billingCycle`

### ClientModule

Representa quais modulos estao ativos para aquele cliente.

Exemplo:

- `temperatura`
- `bots_whatsapp`
- `energia`

## Regra de liberacao de modulos

O sistema deve funcionar assim:

1. o cliente contrata um plano
2. o plano pode liberar um conjunto base de modulos
3. a Virtuagil pode ativar modulos adicionais conforme a venda

## Exemplo pratico

### Cliente A

- plano: `Base`
- modulos ativos:
  - `temperatura`

### Cliente B

- plano: `Expandido`
- modulos ativos:
  - `temperatura`
  - `bots_whatsapp`

## Como isso afeta o sistema

Quando o cliente fizer login, o sistema pode:

- verificar o `clientId`
- verificar quais modulos estao ativos
- exibir apenas as areas liberadas para aquele cliente

## Regra para fase inicial

No comeco, a liberacao pode ser controlada manualmente pela Virtuagil.

Isso significa:

- voce cadastra o cliente
- voce define o plano
- voce ativa os modulos
- voce controla a operacao

## Cobranca na fase inicial

No inicio, a cobranca deve ser manual.

Exemplos:

- Pix
- transferencia
- boleto
- cobranca combinada diretamente com o cliente

## Por que comecar com cobranca manual

Porque neste momento o mais importante e validar:

- o cliente enxerga valor
- o cliente aceita pagar
- o formato da oferta faz sentido
- os modulos realmente resolvem o problema

Automatizar pagamento cedo demais adiciona complexidade antes da validacao.

## Cobranca no futuro

Depois que houver mais maturidade, a Virtuagil pode integrar uma plataforma de
pagamento.

Exemplos de caminho futuro:

- Stripe
- Asaas
- Mercado Pago

Fluxo futuro possivel:

1. cliente paga
2. pagamento e confirmado
3. assinatura fica ativa
4. modulos sao liberados automaticamente

## Regra de negocio importante

Separar sempre:

- autenticacao
- cliente
- plano
- modulo
- cobranca

Misturar tudo em `User` tende a dificultar a evolucao depois.

## Recomendacao final para a fase 1

Fase 1:

- autenticacao propria
- usuarios separados por perfil
- plano ligado ao cliente
- modulos ligados ao cliente
- cobranca manual

Fase 2:

- assinatura estruturada
- automacao parcial de cobranca
- liberacao automatica por plano/modulo
