---
description: roteiro pratico de testes manuais no Insomnia para fechar os modulos principais
applyTo: '**'
---

# MANUAL_TESTS.md - Testes manuais no Insomnia

## Atualizacao de referencia (2026-03-19)

Para validacoes novas:

- priorizar `POST /iot/readings` para ingestao generica
- manter `POST /iot/temperature` apenas para compatibilidade
- considerar `ambiental` como modulo-categoria (itens: `temperatura`, `umidade`, `gases`)
- considerar `acionamento` como modulo-categoria por itens

Este arquivo existe para dar praticidade.

Objetivo:

- fechar validacao manual dos modulos `ambiental` e `acionamento`
- evitar depender de memoria ou teste improvisado
- dar um roteiro facil de repetir em demo ou revisao operacional

## Nomes reais dos blocos no Monitor (UI atual)

Para evitar orientacao incorreta durante suporte:

- contratacao do modulo `ambiental`: abrir `Modulos do cliente`
- leituras de `temperatura`, `umidade` e `gases`: abrir `Equipamentos`
- regras de alerta ambiental: abrir `Regras de alerta`
- comandos `on/off` e historico de atuador: abrir `Acionamento`

No layout atual, nao existe um card principal separado chamado `Ambiental`.

## Labels oficiais de formularios (UI atual)

Para reduzir retrabalho entre chats/agentes, registrar e usar os labels exatamente como aparecem na tela:

- Em `Equipamentos`:
  - `Codigo tecnico (imutavel)`
  - `Codigo interno do cliente`
  - `Nome`
  - `Localizacao`
  - `Min temp (C)`
  - `Max temp (C)`

- Em `Regras de alerta`:
  - `Sensor`
  - `Equipamento (opcional)`
  - `Min`
  - `Max`
  - `Cooldown (min)`
  - `Tolerancia (min)`

## Preparacao

Base local padrao:

- API: `http://localhost:3000`

Headers importantes:

- login usa `Content-Type: application/json`
- ingestao usa `x-device-key`

Seeds e apoio:

```bash
npm run db:seed
```

Se quiser validar a base do `acionamento` antes:

```bash
npm run db:verify-actuation
```

## 1. Autenticacao

### Login

- metodo: `POST`
- URL: `http://localhost:3000/auth/login`
- body:

```json
{
  "email": "plataforma@virtuagil.com.br",
  "password": "plataforma123"
}
```

Esperado:

- `201`
- resposta com `token`
- resposta com `user`

Guardar:

- token para usar como `Bearer`

Credenciais demo uteis:

- admin global: `plataforma@virtuagil.com.br` / `plataforma123`
- admin do tenant `virtuagil`: `admin@virtuagil.com.br` / `virtuagil123`
- operador do tenant `virtuagil`: `operator@virtuagil.com.br` / `operador123`

### Sessao atual

- metodo: `GET`
- URL: `http://localhost:3000/auth/me`
- header:
  - `Authorization: Bearer SEU_TOKEN`

Esperado:

- `200`
- usuario autenticado retornado

## 2. Modulo ambiental (item temperatura)

Se esse modulo ja foi validado anteriormente, use esta parte apenas como revisao rapida.

Campos recomendados no cadastro de `Equipamentos` para estudo de caso:

- obrigatorios:
  - `id`
- recomendados (nao omitir no onboarding comercial):
  - `name`
  - `location`
  - `minTemperature`
  - `maxTemperature`
  - cliente em foco correto no filtro

### Listar devices

- metodo: `GET`
- URL: `http://localhost:3000/devices?clientId=virtuagil`
- header:
  - `Authorization: Bearer SEU_TOKEN`

Esperado:

- `200`
- lista de devices do tenant

### Listar regras

- metodo: `GET`
- URL: `http://localhost:3000/alert-rules?clientId=virtuagil`
- header:
  - `Authorization: Bearer SEU_TOKEN`

Esperado:

- `200`
- regras configuradas

### Enviar leitura manual

- metodo: `POST`
- URL: `http://localhost:3000/iot/temperature`
- headers:
  - `Content-Type: application/json`
  - `x-device-key: SUA_CHAVE`
- body:

```json
{
  "device_id": "freezer_01",
  "temperature": -11.2
}
```

Esperado:

- `200`
- `{ "ok": true }`

### Ver historico do device

- metodo: `GET`
- URL: `http://localhost:3000/readings/freezer_01?clientId=virtuagil&sensor=temperature&limit=10`
- header:
  - `Authorization: Bearer SEU_TOKEN`

Esperado:

- `200`
- leituras retornadas em ordem cronologica

### Revisao de offline

Fluxo:

1. enviar leituras normalmente
2. parar de enviar
3. esperar acima de `DEVICE_OFFLINE_MINUTES`
4. consultar dashboard ou `GET /devices`

Esperado:

- device marcado como `isOffline=true`
- `offlineSince` preenchido
- quando o device voltar a enviar leitura, o painel deve retornar para online
- a operacao pode usar um alerta de recuperacao para confirmar que nao e mais necessario deslocamento imediato
- se o equipamento alternar `offline/online` varias vezes em janela curta, o comportamento esperado deixa de ser varios avisos tecnicos e passa a ser um alerta unico de `instabilidade de conectividade`
- depois desse alerta de instabilidade, o backend deve respeitar cooldown e evitar nova rajada de mensagens repetidas

## 3. Modulo acionamento

### Listar atuadores

- metodo: `GET`
- URL: `http://localhost:3000/actuators?clientId=virtuagil`
- header:
  - `Authorization: Bearer SEU_TOKEN`

Esperado:

- `200`
- lista de atuadores do tenant

### Criar atuador

- metodo: `POST`
- URL: `http://localhost:3000/actuators`
- headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer SEU_TOKEN`
- body:

```json
{
  "id": "sauna_demo_insomnia",
  "clientId": "virtuagil",
  "deviceId": "freezer_01",
  "name": "Sauna demo Insomnia",
  "location": "Area de testes"
}
```

Esperado:

- `201`
- atuador criado com `currentState = "off"`

### Ligar atuador

- metodo: `POST`
- URL: `http://localhost:3000/actuators/sauna_demo_insomnia/commands`
- headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer SEU_TOKEN`
- body:

```json
{
  "desiredState": "on",
  "source": "insomnia",
  "note": "Teste manual de ligacao"
}
```

Esperado:

- `201`
- comando criado
- `actuator.currentState = "on"`

### Desligar atuador

- metodo: `POST`
- URL: `http://localhost:3000/actuators/sauna_demo_insomnia/commands`
- headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer SEU_TOKEN`
- body:

```json
{
  "desiredState": "off",
  "source": "insomnia",
  "note": "Teste manual de desligamento"
}
```

Esperado:

- `201`
- `actuator.currentState = "off"`

### Consultar historico do atuador

- metodo: `GET`
- URL: `http://localhost:3000/actuators/sauna_demo_insomnia/commands`
- header:
  - `Authorization: Bearer SEU_TOKEN`

Esperado:

- `200`
- historico com comandos `on` e `off`

### Consultar comandos recentes do tenant

- metodo: `GET`
- URL: `http://localhost:3000/actuators/commands/recent?clientId=virtuagil&limit=10`
- header:
  - `Authorization: Bearer SEU_TOKEN`

Esperado:

- `200`
- lista dos ultimos comandos do tenant
- cada item pode trazer o atuador relacionado

## 4. Criterio de fechamento dos modulos

### Ambiental (item temperatura)

Considerar fechado quando:

- login funciona
- devices listam corretamente
- leitura entra com sucesso
- historico responde
- online/offline aparece coerente
- regras podem ser revisadas pelo tenant

### Acionamento

Considerar fechado quando:

- atuador pode ser criado
- comando `on` funciona
- comando `off` funciona
- historico do atuador responde
- endpoint de comandos recentes responde
- dashboard reflete o estado sem hardware fisico

### Acionamento com n8n (opcional, para pacote comercial)

Se quiser notificar comandos no WhatsApp com controle de ruido:

1. configurar variaveis na API:
   - `N8N_ACTUATION_WEBHOOK_URL`
   - `ACTUATION_NOTIFY_ENABLED=true`
   - `ACTUATION_NOTIFY_SOURCES=dashboard`
   - `ACTUATION_NOTIFY_COOLDOWN_SECONDS=900`
2. publicar workflow de acionamento no n8n
3. testar `ligar/desligar` no painel
4. validar destino correto por unidade

Recomendacao operacional:

- nao notificar todo comando de rotina
- priorizar eventos relevantes para evitar spam ao cliente

## 5. Regra pratica para continuidade

Enquanto nao houver hardware:

- usar Insomnia, dashboard e simulador como trilha principal
- tratar `currentState` como estado operacional registrado na plataforma
- nao prometer confirmacao eletrica real da carga

## 6. Modulo energia (novo)

### Consultar resumo de energia

- metodo: `GET`
- URL: `http://localhost:3000/energy/summary?clientId=virtuagil&sensors=consumo,corrente,tensao`
- header:
  - `Authorization: Bearer SEU_TOKEN`

Esperado:

- `200`
- `deviceCount`
- `devicesWithRecentReadings`
- `latestBySensor` com itens de energia

### Consultar historico de energia por equipamento

- metodo: `GET`
- URL: `http://localhost:3000/energy/readings/freezer_01?clientId=virtuagil&sensor=consumo&limit=20`
- header:
  - `Authorization: Bearer SEU_TOKEN`

Esperado:

- `200`
- historico retornado para o sensor informado

## 7. Solucoes comerciais (novo)

### Catalogo de solucoes

- metodo: `GET`
- URL: `http://localhost:3000/solutions/catalog`
- header:
  - `Authorization: Bearer SEU_TOKEN`

Esperado:

- `200`
- ao menos `cadeia_fria@v1`

### Aplicar receita de solucao

- metodo: `POST`
- URL: `http://localhost:3000/solutions/apply`
- headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer SEU_TOKEN`
- body:

```json
{
  "clientId": "virtuagil",
  "solutionKey": "cadeia_fria",
  "version": "v1",
  "includeRecommended": true
}
```

Esperado:

- `201`
- lista de `appliedItemKeys`

### Validar prontidao por cliente

- metodo: `GET`
- URL: `http://localhost:3000/solutions?clientId=virtuagil`
- header:
  - `Authorization: Bearer SEU_TOKEN`

Esperado:

- `200`
- status `ready` refletindo os itens obrigatorios da receita

## 5.1 Padrao de execucao dos estudos de caso (UI-first)

Regra oficial para novos atendimentos e demos:

1. realizar cadastro de cliente, equipamento, regra e atuador no Monitor
2. validar se a jornada ficou clara para um operador nao tecnico
3. anotar friccao de UI na hora em que ela aparece
4. usar API/scripts apenas para:
   - validar webhook/n8n
   - gerar evidencia tecnica repetivel
   - investigar erro que o painel nao explica

Checklist do caso `sabor-serra-restaurante` no Monitor:

- cliente selecionado no filtro do dashboard
- modulo `ambiental` habilitado com itens `temperatura`, `umidade`, `gases`
- modulo `acionamento` habilitado com item `rele`
- equipamento `adega_vinhos_01` existente e online
- atuador `rele_luzes_salao_01` criado e vinculado ao equipamento certo
- regra ambiental de gases critica habilitada

Se `POST /actuators/:id/commands` retornar `404 Actuator not found`, primeiro revisar no Monitor se o `id` do atuador cadastrado e exatamente o mesmo usado no teste.

## 5.2 Fluxo ponta a ponta com WhatsApp

Direcao atual do produto:

- o dashboard web serve para monitoramento, historico e operacao assistida
- a notificacao principal ao cliente deve sair por `WhatsApp`
- o fluxo esperado de entrega e `API -> n8n -> Evolution -> WhatsApp`

Roteiro sugerido de validacao sem hardware:

1. entrar no dashboard do tenant e revisar a conta
2. simular leitura normal para mostrar operacao saudavel
3. simular temperatura fora da faixa ou offline
4. confirmar que o evento aparece no dashboard
5. confirmar que a API disparou o webhook correto
6. confirmar que o `n8n` recebeu e processou a execucao
7. confirmar que o `Evolution` enviou a mensagem
8. confirmar que o alerta chegou no `WhatsApp` do responsavel

Considerar aprovado quando:

- o evento aparece no dashboard
- o webhook chega ao `n8n`
- a mensagem sai pelo `Evolution`
- o responsavel recebe o `WhatsApp`
- a equipe consegue entender o que aconteceu sem depender de explicacao tecnica extra

Observacao operacional importante:

- nesta fase, sucesso no `HTTP Request` do `n8n` ou status `PENDING` na Evolution nao devem ser tratados como entrega confirmada
- em `17/03/2026`, no caso `Cuidare`, houve atraso perceptivel entre a execucao bem-sucedida no fluxo e a chegada efetiva da mensagem no `WhatsApp`
- por isso, em alertas criticos, confirmar sempre a entrega final ao destinatario antes de encerrar a validacao
- no fluxo de `offline`, validar tambem se o nome do equipamento esta legivel na mensagem final; em um dos testes iniciais ele apareceu como `undefined`
- quando houver varios ciclos curtos de queda e retorno, validar se a plataforma envia um aviso de instabilidade em vez de acumular `offline` + `online` em excesso

Padrao recomendado para template do workflow `online` no n8n (2026-03-20):

- manter um unico bloco cobrindo:
  - `device_back_online`
  - `device_connectivity_instability`
- priorizar campos em `camelCase` com fallback para `snake_case`
- incluir sempre contexto operacional:
  - cliente
  - unidade
  - equipamento
- evitar `nao informado` quando possivel:
  - usar fallback de datas (`offlineSince` -> `lastSeenAt`)
  - validar data antes de formatar para nao gerar `Invalid Date`
- usar acentuacao correta nas mensagens finais ao cliente (`não`, `é`, `último`, `recuperação`)

Comando pronto para o estudo de caso `sabor-serra-restaurante` (PowerShell):

```powershell
.\scripts\lab-sabor-serra.ps1 -Token "SEU_TOKEN" -DeviceKey "SUA_DEVICE_KEY" -ClientId "sabor-serra-restaurante" -DeviceId "adega_vinhos_01" -ActuatorId "rele_luzes_salao_01" -TriggerCriticalGas -RunActuation -CheckN8n
```

## 6. Checklist rapido de pos-deploy em producao

Use este bloco quando o deploy ja subiu, mas voce quer confirmar rapidamente se o ambiente ficou certo.

### Portainer

Confirmar:

- stack `iot-monitor` atualizada sem erro
- `update_config.order = stop-first` em `api` e `web`
- servico `iot-monitor_api` com task nova em `running`
- servico `iot-monitor_web` com task nova em `running`

### Health

Abrir:

- `https://api-monitor.virtuagil.com.br/health`

Esperado:

- `"status": "ok"`
- `"environment": "production"`
- `"release": "latest"` quando o deploy estiver usando imagem `latest`
- `"buildTime"` preenchido com a data/hora mais recente do deploy
- `"alertQueueDepth": 0` ou baixo

### Dashboard

Abrir:

- `https://monitor.virtuagil.com.br`

Esperado:

- tela de login abre normalmente
- login funciona
- dashboard carrega devices
- painel principal abre sem erro visivel

### Se algo der errado

Ver nesta ordem:

- logs do servico `iot-monitor_api`
- retorno atual de `/health`
- valores de `APP_RELEASE` e `APP_BUILD_TIME`
- se a stack ainda ficou com `order: start-first`

Sinal comum em VPS pequena:

- `exit code 137` durante update costuma indicar pico de memoria no rollout
- nesse caso, confirmar se a stack realmente ficou com `stop-first`
