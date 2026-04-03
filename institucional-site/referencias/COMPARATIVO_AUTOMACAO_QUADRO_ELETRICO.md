# Comparativo - Automacao em Quadro Eletrico

## Objetivo

Comparar, de forma simples, as principais abordagens para automatizar cargas em
quadro eletrico, sem confundir automacao com protecao.

## Regra principal

Protecao eletrica e automacao nao sao a mesma coisa.

- disjuntor protege o circuito
- relé/atuador ou contator comandam a carga

## 1. Disjuntor inteligente DIN

### O que e

Equipamento para trilho DIN que combina, em alguns modelos, protecao e algum
nivel de monitoramento ou acionamento remoto.

### Vantagens

- visual limpo
- instalacao compacta
- apelo comercial forte

### Riscos e cuidados

- avaliar bem qualidade e confiabilidade do fabricante
- nem sempre e a melhor escolha para carga critica
- exige analise eletrica correta antes de usar em ambiente real

### Quando pode fazer sentido

- automacoes simples
- pilotos controlados
- cargas menores, dependendo do equipamento

## 2. Interruptor ou rele inteligente para trilho DIN

### O que e

Modulo de automacao para ligar ou desligar uma carga ou circuito, normalmente
sem ser o elemento principal de protecao.

### Vantagens

- mais simples de integrar
- comum em ecossistemas como Tuya e eWeLink
- bom para automacao leve

### Riscos e cuidados

- respeitar corrente real da carga
- nao assumir que serve para qualquer circuito
- conferir qualidade do equipamento

### Quando pode fazer sentido

- cargas menores
- automacao residencial leve
- comandos simples

## 3. Contator acionado por modulo inteligente

### O que e

Arranjo em que um modulo inteligente faz o comando, e a contatora faz o trabalho
de acionamento da carga.

### Vantagens

- mais profissional para cargas maiores
- separa comando de potencia
- mais adequado para automacao operacional

### Riscos e cuidados

- precisa de avaliacao eletrica
- instalacao deve ser feita com criterio
- ideal ter apoio de eletricista

### Quando faz mais sentido

- sauna
- iluminacao de quadras
- bombas
- cargas maiores ou circuitos importantes

## Resposta curta para a principal duvida

Contator nao e substituto direto de disjuntor.

Papel de cada um:

- disjuntor: protege contra sobrecorrente e curto
- contator: liga e desliga a carga sob comando

## Recomendacao pratica para a Virtuagil

Para projetos como o Clube Palmeiras:

- nao assumir que um dispositivo smart substitui toda a parte eletrica
- primeiro validar a necessidade operacional
- depois mapear a carga
- so entao escolher entre relé inteligente, disjuntor inteligente ou contatora

## Estrategia recomendada

No inicio:

- evitar prometer automacao de quadro sem avaliacao
- vender como piloto pequeno e controlado
- comecar por uma rotina simples, como sauna ou iluminacao de uma area
