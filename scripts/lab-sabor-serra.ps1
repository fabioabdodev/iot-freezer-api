param(
  [Parameter(Mandatory = $true)]
  [string]$Token,

  [Parameter(Mandatory = $true)]
  [string]$DeviceKey,

  [string]$ClientId = 'sabor-serra-restaurante',
  [string]$DeviceId = 'adega_vinhos_01',
  [string]$ActuatorId = 'rele_luzes_salao_01',
  [string]$ApiBaseUrl = 'https://api-monitor.virtuagil.com.br',
  [switch]$OnlyReadings,
  [switch]$TriggerCriticalGas,
  [switch]$RunActuation,
  [switch]$CheckN8n
)

$ErrorActionPreference = 'Stop'

function Normalize-Token {
  param([string]$RawToken)
  return ($RawToken -replace '^Bearer\s+', '').Trim()
}

function Normalize-Key {
  param([string]$RawKey)
  return $RawKey.Trim()
}

function Invoke-ApiGet {
  param(
    [string]$Uri,
    [hashtable]$Headers
  )

  try {
    $response = Invoke-WebRequest -Uri $Uri -Method Get -Headers $Headers
    Write-Host "GET  $Uri -> $($response.StatusCode)"
    Write-Host $response.Content
    Write-Host ""
  } catch {
    Write-Host "GET  $Uri -> ERROR"
    Write-Host $_.Exception.Message
    Write-Host ""
    throw
  }
}

function Invoke-ApiPost {
  param(
    [string]$Uri,
    [hashtable]$Headers,
    [string]$Body,
    [string]$Label
  )

  try {
    $response = Invoke-WebRequest -Uri $Uri -Method Post -ContentType 'application/json' -Headers $Headers -Body $Body
    Write-Host "POST $Label -> $($response.StatusCode)"
    Write-Host $response.Content
    Write-Host ""
  } catch {
    Write-Host "POST $Label -> ERROR"
    Write-Host $_.Exception.Message
    Write-Host ""
    throw
  }
}

function Invoke-ApiPostAuth {
  param(
    [string]$Uri,
    [hashtable]$Headers,
    [string]$Body,
    [string]$Label
  )

  try {
    $response = Invoke-WebRequest -Uri $Uri -Method Post -ContentType 'application/json' -Headers $Headers -Body $Body
    Write-Host "POST $Label -> $($response.StatusCode)"
    Write-Host $response.Content
    Write-Host ""
  } catch {
    Write-Host "POST $Label -> ERROR"
    Write-Host $_.Exception.Message
    Write-Host ""
    throw
  }
}

$normalizedToken = Normalize-Token -RawToken $Token
$normalizedKey = Normalize-Key -RawKey $DeviceKey

if ([string]::IsNullOrWhiteSpace($normalizedToken)) {
  throw 'Token vazio. Passe -Token com JWT valido.'
}

if ([string]::IsNullOrWhiteSpace($normalizedKey)) {
  throw 'Device key vazia. Passe -DeviceKey com chave valida.'
}

Write-Host "Token length: $($normalizedToken.Length)"
Write-Host "Device key length: $($normalizedKey.Length)"
Write-Host "Cliente: $ClientId"
Write-Host "Device: $DeviceId"
Write-Host "Actuator: $ActuatorId"
Write-Host ""

$authHeaders = @{ Authorization = "Bearer $normalizedToken" }
$deviceHeaders = @{ 'x-device-key' = $normalizedKey }

if ($CheckN8n) {
  Write-Host "Validando webhooks n8n (modo estrito)..."
  npm run alerts:check:n8n -- --ping --strict --timeout-ms=15000
  if ($LASTEXITCODE -ne 0) {
    throw "Falha na validacao dos webhooks n8n em modo estrito."
  }
  Write-Host ""
}

$readings = @(
  @{ sensor_type = 'temperature'; value = 14.2; unit = 'celsius' },
  @{ sensor_type = 'umidade'; value = 64.2; unit = 'percent' },
  @{ sensor_type = 'gases'; value = 420; unit = 'ppm' }
)

if (-not $OnlyReadings) {
  foreach ($item in $readings) {
    $payload = @{
      device_id = $DeviceId
      client_id = $ClientId
      sensor_type = $item.sensor_type
      value = $item.value
      unit = $item.unit
    } | ConvertTo-Json -Compress

    Invoke-ApiPost -Uri "$ApiBaseUrl/iot/readings" -Headers $deviceHeaders -Body $payload -Label $item.sensor_type
  }
}

Invoke-ApiGet -Uri "${ApiBaseUrl}/readings/${DeviceId}?sensor=temperature&limit=5&clientId=${ClientId}" -Headers $authHeaders
Invoke-ApiGet -Uri "${ApiBaseUrl}/readings/${DeviceId}?sensor=umidade&limit=5&clientId=${ClientId}" -Headers $authHeaders
Invoke-ApiGet -Uri "${ApiBaseUrl}/readings/${DeviceId}?sensor=gases&limit=5&clientId=${ClientId}" -Headers $authHeaders

if ($TriggerCriticalGas) {
  $criticalPayload = @{
    device_id = $DeviceId
    client_id = $ClientId
    sensor_type = 'gases'
    value = 1500
    unit = 'ppm'
  } | ConvertTo-Json -Compress

  Invoke-ApiPost -Uri "$ApiBaseUrl/iot/readings" -Headers $deviceHeaders -Body $criticalPayload -Label 'gases-critico'
  Invoke-ApiGet -Uri "${ApiBaseUrl}/readings/${DeviceId}?sensor=gases&limit=5&clientId=${ClientId}" -Headers $authHeaders
}

if ($RunActuation) {
  Write-Host "Executando teste de acionamento ON/OFF..."

  $onPayload = @{
    desiredState = 'on'
    source = 'lab-sabor-serra'
    note = 'Teste ON do estudo de caso restaurante'
  } | ConvertTo-Json -Compress

  $offPayload = @{
    desiredState = 'off'
    source = 'lab-sabor-serra'
    note = 'Teste OFF do estudo de caso restaurante'
  } | ConvertTo-Json -Compress

  Invoke-ApiPostAuth -Uri "$ApiBaseUrl/actuators/$ActuatorId/commands" -Headers $authHeaders -Body $onPayload -Label 'actuation-on'
  Start-Sleep -Seconds 1
  Invoke-ApiPostAuth -Uri "$ApiBaseUrl/actuators/$ActuatorId/commands" -Headers $authHeaders -Body $offPayload -Label 'actuation-off'
  Invoke-ApiGet -Uri "$ApiBaseUrl/actuators/$ActuatorId/commands" -Headers $authHeaders
}

Write-Host 'Fluxo finalizado com sucesso.'

