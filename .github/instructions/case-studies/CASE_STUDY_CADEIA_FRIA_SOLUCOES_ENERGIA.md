---
description: estudo de caso ui-first para demonstrar receita comercial cadeia fria e modulo energia no Monitor
applyTo: '**'
---

# CASE_STUDY_CADEIA_FRIA_SOLUCOES_ENERGIA.md

## Cenario

Conta de referencia para proposta comercial com narrativa de valor completa:

- monitoramento ambiental
- acionamento assistido
- telemetria energetica
- receita comercial aplicada por solucao

## Objetivo do ensaio

Validar em uma unica jornada:

1. aplicacao da receita `cadeia_fria@v1`
2. prontidao comercial no painel de solucoes
3. leituras operacionais no painel de energia
4. entendimento do operador sem depender de explicacao tecnica longa

## Preparacao (UI-first)

No Monitor:

1. selecionar cliente alvo
2. abrir `Modulos do cliente`
3. garantir itens habilitados:
   - `ambiental.temperatura`
   - `ambiental.umidade`
   - `ambiental.gases`
   - `acionamento.rele`
   - `energia.consumo`

## Execucao da demo

### Etapa 1 - Receita comercial

No bloco `Solucoes comerciais`:

1. aplicar `cadeia_fria@v1` (titulo comercial: `Controle Inteligente de Camaras Frias`)
2. confirmar obrigatorios preenchidos
3. confirmar status `Pronta para venda`

### Etapa 2 - Base operacional

No bloco `Equipamentos`:

- cadastrar pelo menos 2 equipamentos da conta

No bloco `Regras de alerta`:

- cadastrar regra critica de temperatura

### Labels oficiais da UI (obrigatorio seguir)

Para evitar erro de suporte entre chats/agentes, usar estes labels exatamente como no Monitor:

- Equipamentos:
  - `Codigo tecnico (imutavel)`
  - `Codigo interno do cliente`
  - `Nome`
  - `Localizacao`
  - `Min temp (C)`
  - `Max temp (C)`

- Regras de alerta:
  - `Sensor`
  - `Equipamento (opcional)`
  - `Min`
  - `Max`
  - `Cooldown (min)`
  - `Tolerancia (min)`

### Etapa 3 - Energia

Enviar leituras para sensores:

- `consumo`
- `corrente`
- `tensao`

No bloco `Energia`, validar:

- total de equipamentos
- equipamentos com leitura recente
- ultimo valor por sensor
- historico por equipamento

### Etapa 4 - Fechamento comercial

No bloco `Prontidao comercial`:

- revisar score da conta
- revisar pendencias operacionais
- fechar proximo passo com o cliente

## Criterio de aceite

Considerar aprovado quando:

1. rota de aplicacao de solucao responde e reflete no painel
2. painel de energia mostra dados recentes sem erro
3. operador repete o roteiro sem apoio tecnico
4. narrativa comercial fica clara em ate 7 minutos de demonstracao

## Evidencias minimas

1. print de `Solucoes comerciais` com receita aplicada
2. print de `Energia` com ultimo valor por sensor
3. print de `Prontidao comercial` com score e proximo passo
