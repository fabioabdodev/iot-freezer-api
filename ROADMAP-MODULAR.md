# Roadmap Modular da Plataforma

## Visao

Este projeto nao deve evoluir como um sistema fechado apenas para freezer. A direcao definida e transformar a aplicacao em uma plataforma de automacao e monitoramento com base multi-tenant, onde cada cliente pode contratar um ou mais modulos conforme o caso de uso.

Exemplos:

- freezer: modulo de temperatura
- forno: modulo de temperatura
- sauna: modulo de temperatura + modulo de acionamento
- quadra de futebol: modulo de acionamento por agenda

## Estrategia de Evolucao

A evolucao sera feita modulo por modulo, e nao tudo de uma vez.

Ordem recomendada:

1. consolidar o modulo `temperatura`
2. validar uso real e ajustes operacionais
3. preparar a base para contratacao por modulos
4. iniciar o modulo `acionamento`
5. evoluir para agendas e automacoes combinadas

Essa abordagem reduz risco tecnico, facilita testes e ajuda a vender a plataforma em etapas.

## Plataforma Base

Os recursos abaixo pertencem ao nucleo da plataforma e devem ser reutilizados por todos os modulos:

- clientes
- devices
- autenticacao de devices
- multi-tenant
- dashboard
- historico
- regras e alertas
- scheduler
- controle de acesso por modulo no futuro

## Modulo Atual: Temperatura

Escopo atual:

- ingestao de leituras
- status online/offline
- historico por device
- limites minimo e maximo
- regras de alerta
- destaque visual para fora da faixa

Objetivo:

- fechar esse modulo como primeiro produto funcional da plataforma

## Proximo Modulo Sugerido: Acionamento

Nome recomendado:

- `acionamento`

Evita limitar o conceito apenas a "energia", porque o valor real e controlar cargas e equipamentos.

Escopo inicial sugerido:

- ligar/desligar uma saida
- mostrar estado atual
- registrar eventos de acionamento

Fase seguinte:

- agenda por dia e horario
- repeticao semanal
- janela de funcionamento

Fase futura:

- automacoes combinadas entre modulos

Exemplos:

- ligar sauna as 17h e desligar as 19h
- ligar iluminacao da quadra por agenda
- desligar um equipamento se temperatura ultrapassar limite

## Modelo Comercial Sugerido

- plano base da plataforma
- modulo temperatura
- modulo acionamento
- modulos futuros conforme novas necessidades

Um mesmo cliente pode contratar mais de um modulo.

Exemplo:

- cliente com sauna: temperatura + acionamento
- cliente com freezer: apenas temperatura

## Diretrizes Arquiteturais

Para os proximos modulos, evitar criar sistemas separados por tipo de negocio. O ideal e reaproveitar a mesma base e diferenciar capacidades.

Conceitos que devem orientar a evolucao:

- `device`
- `sensor`
- `actuator`
- `reading`
- `command`
- `schedule`
- `automation_rule`
- `module_entitlement`

## Regra de Produto

Nao iniciar o modulo seguinte antes de considerar o modulo atual suficientemente consolidado em:

- fluxo principal
- testes principais
- UX basica
- deploy estavel
- documentacao minima
