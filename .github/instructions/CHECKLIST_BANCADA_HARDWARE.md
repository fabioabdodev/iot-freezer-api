# Checklist de Bancada para Hardware

Data de referencia: 2026-03-14

## Objetivo

Validar em bancada e em ambiente domestico o fluxo completo entre:

- ESP32
- sensor de temperatura
- rele/acionamento
- API Virtuagil IoT
- dashboard web

## Escopo inicial

Primeiros cenarios previstos:

- teste de temperatura na geladeira
- teste de acionamento em carga controlada
- teste futuro em quadro de energia com muito mais cuidado

## Regra de seguranca

Antes de qualquer teste com energia:

1. comecar pelo monitoramento, sem acionar carga critica
2. testar o rele primeiro em carga simples e isolada
3. nao ligar nada diretamente no quadro sem isolamento adequado e seguranca eletrica
4. se houver duvida de instalacao eletrica, parar o teste e revisar

## Checklist de preparacao

- confirmar chegada dos componentes
- confirmar modelo do ESP32
- confirmar modelo do sensor de temperatura
- confirmar modulo de rele e tensao de operacao
- separar resistores, jumpers, fonte e protoboard
- definir `deviceId` de bancada
- separar `x-device-key`
- confirmar que a API esta acessivel na rede do teste
- confirmar que existe pelo menos um `clientId` valido para associar o device

## Checklist de backend antes da bancada

- API sobe com sucesso
- dashboard carrega
- `POST /iot/temperature` responde corretamente com `x-device-key`
- `GET /iot/actuators?deviceId=...` responde corretamente
- `POST /iot/actuators/:id/ack` responde corretamente
- device de teste esta cadastrado ou pode ser criado automaticamente
- atuador de teste esta vinculado ao `deviceId` certo
- regra de alerta de temperatura esta configurada se o teste exigir alerta

## Checklist de firmware esperado

O firmware deve conseguir:

1. conectar no Wi-Fi
2. identificar o `deviceId`
3. enviar leitura para `POST /iot/temperature`
4. consultar `GET /iot/actuators?deviceId=...`
5. aplicar o estado local do rele
6. confirmar aplicacao em `POST /iot/actuators/:id/ack`
7. repetir o ciclo de forma estavel

## Checklist de teste de temperatura

- sensor responde com leitura coerente em temperatura ambiente
- leitura muda ao aproximar de frio/calor
- leitura entra na API
- `lastSeen` do device atualiza
- dashboard mostra temperatura atual
- historico aparece no frontend
- alertas disparam quando a faixa e ultrapassada
- cooldown e tolerancia se comportam como esperado

## Checklist de teste de acionamento

- atuador aparece vinculado ao `deviceId`
- painel consegue enviar comando `on`
- dispositivo recebe o estado por polling
- rele muda fisicamente para `on`
- hardware envia `ack`
- historico registra `device_ack`
- painel consegue enviar `off`
- dispositivo volta para `off`
- estado persistido permanece coerente

## Checklist de observabilidade

- logs da API mostram ingestao de temperatura
- logs da API mostram polling de acionamento
- logs da API mostram `ack` do hardware
- dashboard reflete estado sem atraso excessivo
- nao ha erro repetitivo de autenticacao
- nao ha rate limit indevido em telemetria normal

## Checklist de risco para quadro de energia

Usar apenas depois dos testes basicos estarem estaveis:

- revisar isolamento do rele
- revisar capacidade de corrente
- revisar alimentacao do modulo
- revisar protecao fisica da montagem
- validar se o comando errado pode causar risco real
- definir procedimento claro para desligamento manual

## Resultado esperado da primeira bancada

Ao final da primeira rodada, queremos conseguir dizer com seguranca:

- o sensor esta lendo corretamente
- a API recebe telemetria real
- o dashboard mostra a operacao real
- o acionamento fecha o ciclo painel -> ESP32 -> rele -> `ack`
- o sistema esta pronto para a proxima iteracao de firmware e hardware

## Proximas decisoes depois da bancada

- manter polling simples ou reduzir latencia
- enriquecer `ack` com mais telemetria
- criar estado real de saida
- criar tratamento de falha eletrica
- decidir pinagem e padrao definitivo para o firmware separado

