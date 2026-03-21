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

- garantir pelo menos 2 equipamentos ativos na conta
- se os equipamentos ja existirem, nao recadastrar

No bloco `Regras de alerta`:

- garantir pelo menos 1 regra critica de temperatura
- se a regra ja existir, apenas revisar limites e status

### Labels oficiais da UI (obrigatorio seguir)

Para evitar erro de suporte entre chats/agentes, usar estes labels exatamente como no Monitor:

- Equipamentos:
  - `Nome`
  - `Localizacao`
  - `Min temp (C)`
  - `Max temp (C)`
  - observacao operacional:
    - `Codigo tecnico (imutavel)` e `Codigo interno do cliente` podem ser gerados automaticamente a partir do `Nome` nos fluxos novos de cadastro

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

## Modo continuidade (sem recadastro)

Quando cliente, equipamentos e regras ja estiverem criados, seguir este recorte:

1. pular criacao estrutural e iniciar em `Solucoes comerciais`
2. validar `Pronta para venda` da receita aplicada
3. simular leituras de energia (`consumo`, `corrente`, `tensao`) para os equipamentos existentes
4. validar no `Energia`:
   - ultimo valor por sensor
   - equipamentos com leitura recente
   - historico por equipamento
5. validar no `Prontidao comercial` o proximo passo para fechamento da venda

## Evidencias minimas

1. print de `Solucoes comerciais` com receita aplicada
2. print de `Energia` com ultimo valor por sensor
3. print de `Prontidao comercial` com score e proximo passo
