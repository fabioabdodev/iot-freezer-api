# Modelo de Acesso e Login

## Objetivo

Definir como o acesso ao sistema `monitor.virtuagil.com.br` deve evoluir do
painel administrativo atual para uma estrutura com login e perfis.

## Estado atual

Hoje o painel esta aberto e se comporta como ambiente administrativo/técnico.

Na pratica:

- nao existe login real
- nao existe separacao formal entre admin e cliente
- o painel nao esta pronto ainda para uso multiusuario comercial

## Direcao recomendada

O sistema deve evoluir para uma tela de login unica em:

- `monitor.virtuagil.com.br/login`

Depois do login, o sistema decide o destino conforme o perfil.

## Perfis iniciais

### 1. Admin

Perfil da Virtuagil.

Permissoes esperadas:

- ver todos os clientes
- cadastrar clientes
- cadastrar equipamentos
- configurar regras
- acompanhar operacao global

### 2. Cliente

Perfil do cliente final.

Permissoes esperadas:

- ver apenas os dados do proprio `clientId`
- acompanhar dashboard, historico e alertas
- sem acesso administrativo global

## Regra principal de acesso

Uma unica tela de login.

O que muda nao e a URL de entrada, e sim:

- o perfil autenticado
- o escopo de dados permitido

## Estrategia recomendada para fase inicial

No inicio da autenticacao comercial:

- admin com acesso total
- cliente com acesso somente leitura ou leitura com poucas acoes

Evitar abrir muitas configuracoes para o cliente logo de cara.

## O que fica para depois

- multiplos niveis de permissao
- equipes por cliente
- app mobile nativo
- SSO ou integracoes corporativas

## Regra de produto

Antes de sofisticar autenticacao, a prioridade e:

1. proteger o acesso
2. separar admin e cliente
3. garantir isolamento por `clientId`
4. manter a experiencia simples
