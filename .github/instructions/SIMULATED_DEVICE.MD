---
description: regras e métodos para simulação de dispositivos IoT enquanto hardware físico não está disponível.
applyTo: '**'
---

# SIMULATED_DEVICES.md — Simulação de dispositivos IoT

Enquanto os dispositivos físicos (ESP32 e sensores) não estão disponíveis, o comportamento dos dispositivos deve ser **simulado via HTTP**.

Isso permite desenvolver e testar:

- backend
- banco de dados
- monitoramento
- alertas
- dashboard

sem depender do hardware real.

---

# Objetivo da simulação

Simular o comportamento de um dispositivo IoT que envia leituras periódicas para a API.

Fluxo simulado:

Simulated Device → HTTP Request → API → Database → Monitor → Alert

---

# Endpoint utilizado

Endpoint atual do sistema:

POST /iot/temperature

---

# Exemplo de requisição

Payload:

{
  "device_id": "freezer_01",
  "temperature": -12.3
}

Resposta esperada:

{
  "ok": true
}

---

# Ferramentas de simulação

Durante o desenvolvimento podem ser utilizadas:

- Insomnia
- curl
- scripts Node.js
- scripts Python

Essas ferramentas representam o comportamento do dispositivo ESP32.

---

# Teste manual com Insomnia

Criar requisição:

POST

http://localhost:3000/iot/temperature

Body (JSON):

{
  "device_id": "freezer_01",
  "temperature": -12.3
}

Resultado esperado:

- registro em TemperatureLog
- atualização de lastSeen em Device

---

# Teste com curl

Exemplo de comando:

curl -X POST http://localhost:3000/iot/temperature \
-H "Content-Type: application/json" \
-d '{
  "device_id": "freezer_01",
  "temperature": -12.3
}'

---

# Simulação de envio periódico

Um device real enviaria dados a cada intervalo de tempo.

Exemplo:

- 30 segundos
- 60 segundos

Para simulação manual basta repetir a requisição.

---

# Simulação de dispositivo offline

Para testar detecção de offline:

1. Enviar algumas leituras normalmente.
2. Parar de enviar dados.
3. Esperar tempo maior que minutesOffline.

Resultado esperado:

- monitor detecta offline
- log de alerta gerado
- webhook para n8n disparado (se configurado)

---

# Simulação de retorno online

Após um dispositivo ficar offline:

1. Enviar nova leitura.

Resultado esperado:

- device volta para online
- isOffline = false
- offlineSince = null

---

# Simulação de múltiplos dispositivos

É possível simular múltiplos equipamentos.

Exemplo:

freezer_01  
freezer_02  
camara_fria_01

Payload exemplo:

{
  "device_id": "freezer_02",
  "temperature": -15.1
}

---

# Simulação de eventos críticos

Também é possível simular temperatura fora do limite.

Exemplo:

{
  "device_id": "freezer_01",
  "temperature": -3
}

Se os limites estiverem configurados:

minTemperature = -20  
maxTemperature = -10

Isso deverá gerar alerta.

---

# Simulação com script Node.js (futuro)

No futuro pode ser criado um simulador automático.

Exemplo de comportamento:

- enviar dados a cada 30 segundos
- variar temperatura
- simular falhas de comunicação

Isso ajuda a testar:

- carga do sistema
- monitoramento
- alertas

---

# Objetivo desta etapa

Garantir que todo o sistema funcione corretamente antes de conectar dispositivos físicos.

Quando o hardware chegar, o ESP32 deverá apenas substituir o simulador.