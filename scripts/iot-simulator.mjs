#!/usr/bin/env node

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith('--')) continue;

    const [rawKey, inlineValue] = current.slice(2).split('=');
    const nextValue =
      inlineValue ?? (argv[index + 1] && !argv[index + 1].startsWith('--')
        ? argv[index + 1]
        : 'true');

    parsed[rawKey] = nextValue;

    if (inlineValue == null && nextValue !== 'true') {
      index += 1;
    }
  }

  return parsed;
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function parseDeviceList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolvePreset(presetName) {
  if (!presetName) {
    return null;
  }

  const preset = presetName.toLowerCase();

  if (preset === 'normal') {
    return {
      min: -18,
      max: -12,
      mode: 'random',
      spikeValue: 8,
      intervalMs: 5000,
    };
  }

  if (preset === 'alerta') {
    return {
      min: -14,
      max: -9,
      mode: 'ramp',
      spikeValue: 2,
      intervalMs: 4000,
    };
  }

  if (preset === 'critico') {
    return {
      min: -2,
      max: 8,
      mode: 'spike',
      spikeValue: 12,
      intervalMs: 2500,
    };
  }

  if (preset === 'geladeira') {
    return {
      min: 2,
      max: 8,
      mode: 'random',
      spikeValue: 12,
      intervalMs: 5000,
    };
  }

  return null;
}

function buildDeviceMetadata(deviceId, preset, clientId, min, max, index) {
  const kind = preset === 'geladeira' ? 'Geladeira' : 'Freezer';
  return {
    id: deviceId,
    clientId: clientId || undefined,
    name: `${kind} Simulado ${String(index + 1).padStart(2, '0')}`,
    location: `Ambiente Simulado ${String(index + 1).padStart(2, '0')}`,
    minTemperature: min,
    maxTemperature: max,
  };
}

async function ensureDevices(baseUrl, simulators, preset, clientId) {
  for (const [index, simulator] of simulators.entries()) {
    const metadata = buildDeviceMetadata(
      simulator.deviceId,
      preset,
      clientId,
      simulator.min,
      simulator.max,
      index,
    );

    try {
      const response = await fetch(`${baseUrl}/devices/${simulator.deviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      const body = await response.text();
      console.log(
        `[simulator] ensure-device status=${response.status} device=${simulator.deviceId} body=${body}`,
      );
    } catch (error) {
      console.error(
        `[simulator] falha ao cadastrar/atualizar device ${simulator.deviceId}:`,
        error,
      );
    }
  }
}

function buildTemperatureGenerator(mode, min, max, spikeValue) {
  let tick = 0;

  if (mode === 'spike') {
    return () => {
      tick += 1;
      if (tick % 10 === 0) return spikeValue;
      return Number(randomBetween(min, max).toFixed(2));
    };
  }

  if (mode === 'ramp') {
    let current = min;
    let direction = 1;

    return () => {
      const range = Math.max(max - min, 1);
      const step = Math.max(range / 8, 0.2);
      current += step * direction;

      if (current >= max) {
        current = max;
        direction = -1;
      } else if (current <= min) {
        current = min;
        direction = 1;
      }

      return Number(current.toFixed(2));
    };
  }

  return () => Number(randomBetween(min, max).toFixed(2));
}

function printHelp() {
  console.log(`
Simulador de dispositivos IoT

Uso:
  npm run simulate:iot -- --device freezer_01 --api-key sua_chave

Opcoes:
  --url              URL base da API. Padrao: http://localhost:3000
  --device           ID do device. Padrao: freezer_sim_01
  --devices          Lista separada por virgula para simular varios devices de uma vez
  --preset           normal | alerta | critico | geladeira
  --ensure-devices   Cadastra ou atualiza os devices pela API antes da simulacao
  --api-key          Valor do header x-device-key. Padrao: valor de DEVICE_API_KEY no ambiente
  --interval-ms      Intervalo entre envios. Padrao: 5000
  --min              Temperatura minima da simulacao. Padrao: -18
  --max              Temperatura maxima da simulacao. Padrao: -12
  --mode             random | ramp | spike. Padrao: random
  --spike-value      Temperatura usada no modo spike. Padrao: 8
  --count            Quantidade de envios antes de encerrar. Padrao: infinito
  --client-id        Apenas exibido no log local para ajudar no contexto
  --help             Exibe esta ajuda

Exemplos:
  npm run simulate:iot -- --device freezer_01 --api-key farm2809
  npm run simulate:iot -- --device freezer_02 --mode ramp --min -25 --max -10
  npm run simulate:iot -- --device freezer_03 --mode spike --spike-value 12 --interval-ms 2000
  npm run simulate:iot -- --devices freezer_01,freezer_02,freezer_03 --api-key farm2809 --mode ramp
  npm run simulate:iot -- --devices freezer_01,freezer_02 --api-key farm2809 --preset alerta
  npm run simulate:iot -- --devices freezer_01,freezer_02 --preset normal --client-id virtuagil --ensure-devices --api-key farm2809
`.trim());
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help === 'true') {
    printHelp();
    return;
  }

  const baseUrl = (args.url ?? process.env.SIMULATOR_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  const deviceIds = args.devices
    ? parseDeviceList(args.devices)
    : [args.device ?? process.env.SIMULATOR_DEVICE_ID ?? 'freezer_sim_01'];
  const apiKey = args['api-key'] ?? process.env.DEVICE_API_KEY;
  const preset = resolvePreset(args.preset);
  const intervalMs = clamp(
    toNumber(args['interval-ms'], preset?.intervalMs ?? 5000),
    250,
    60_000,
  );
  const min = toNumber(args.min, preset?.min ?? -18);
  const max = toNumber(args.max, preset?.max ?? -12);
  const spikeValue = toNumber(args['spike-value'], preset?.spikeValue ?? 8);
  const count = toNumber(args.count, Number.POSITIVE_INFINITY);
  const mode = args.mode ?? preset?.mode ?? 'random';
  const clientId = args['client-id'] ?? '';
  const ensureDeviceRegistration = args['ensure-devices'] === 'true';

  if (!apiKey) {
    console.error('DEVICE_API_KEY nao informado. Use --api-key ou configure no .env.');
    process.exit(1);
  }

  if (min > max) {
    console.error('--min nao pode ser maior que --max.');
    process.exit(1);
  }

  if (deviceIds.length === 0) {
    console.error('Nenhum device valido foi informado.');
    process.exit(1);
  }

  const endpoint = `${baseUrl}/iot/temperature`;
  const simulators = deviceIds.map((deviceId, index) => {
    const offset = index * 0.6;
    const deviceMin = Number((min - offset).toFixed(2));
    const deviceMax = Number((max + offset).toFixed(2));
    return {
      deviceId,
      sent: 0,
      attempts: 0,
      min: deviceMin,
      max: deviceMax,
      nextTemperature: buildTemperatureGenerator(
        mode,
        deviceMin,
        deviceMax,
        spikeValue + index,
      ),
    };
  });

  console.log(`[simulator] iniciando envio para ${endpoint}`);
  console.log(
    `[simulator] devices=${deviceIds.join(',')} preset=${args.preset ?? 'custom'} mode=${mode} intervalMs=${intervalMs} faixaBase=${min}..${max} clientId=${clientId || 'n/a'}`,
  );

  if (ensureDeviceRegistration) {
    await ensureDevices(baseUrl, simulators, args.preset ?? 'custom', clientId);
  }

  const timer = setInterval(async () => {
    const batch = simulators.map(async (simulator) => {
      const temperature = simulator.nextTemperature();
      const payload = {
        device_id: simulator.deviceId,
        temperature,
      };
      simulator.attempts += 1;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-device-key': apiKey,
          },
          body: JSON.stringify(payload),
        });

        const body = await response.text();
        simulator.sent += 1;

        console.log(
          `[simulator] #${simulator.sent} status=${response.status} device=${simulator.deviceId} temp=${temperature} body=${body}`,
        );

        if (!response.ok) {
          console.error('[simulator] envio falhou; verifique API, chave e rate limit.');
        }
      } catch (error) {
        console.error(`[simulator] erro de conexao no device ${simulator.deviceId}:`, error);
      }
    });

    await Promise.all(batch);

    if (simulators.every((simulator) => simulator.attempts >= count)) {
      clearInterval(timer);
      console.log('[simulator] quantidade solicitada concluida para todos os devices.');
    }
  }, intervalMs);
}

main().catch((error) => {
  console.error('[simulator] erro fatal:', error);
  process.exit(1);
});
