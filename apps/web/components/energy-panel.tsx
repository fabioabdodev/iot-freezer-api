'use client';

import { useMemo, useState } from 'react';
import { Gauge, LineChart, PlugZap } from 'lucide-react';
import { useEnergyReadings } from '@/hooks/use-energy-readings';
import { useEnergySummary } from '@/hooks/use-energy-summary';
import type { EnergySensorType } from '@/types/energy';
import type { ClientSummary } from '@/types/client';
import type { ClientModule } from '@/types/client-module';
import type { DeviceSummary } from '@/types/device';
import { Badge } from '@/components/ui/badge';
import { Feedback } from '@/components/ui/feedback';
import { Select } from '@/components/ui/input';
import { Panel } from '@/components/ui/panel';
import { formatRelativeDateTime } from '@/lib/date';

interface EnergyPanelProps {
  clientId?: string;
  authToken?: string;
  client?: ClientSummary;
  devices: DeviceSummary[];
  clientModules: ClientModule[];
}

const SENSOR_OPTIONS: Array<{
  value: EnergySensorType;
  label: string;
  unit: string;
}> = [
  { value: 'consumo', label: 'Consumo', unit: 'kWh' },
  { value: 'corrente', label: 'Corrente', unit: 'A' },
  { value: 'tensao', label: 'Tensao', unit: 'V' },
];

function moduleEnabled(clientId: string | undefined, clientModules: ClientModule[]) {
  return clientId == null
    ? true
    : clientModules.find((module) => module.moduleKey === 'energia')?.enabled ?? false;
}

export function EnergyPanel({
  clientId,
  authToken,
  client,
  devices,
  clientModules,
}: EnergyPanelProps) {
  const energyEnabled = moduleEnabled(clientId, clientModules);
  const [sensor, setSensor] = useState<EnergySensorType>('consumo');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const resolvedSelectedDeviceId = devices.some(
    (device) => device.id === selectedDeviceId,
  )
    ? selectedDeviceId
    : (devices[0]?.id ?? '');
  const selectedDevice =
    devices.find((device) => device.id === resolvedSelectedDeviceId) ?? null;
  const selectedSensorMeta =
    SENSOR_OPTIONS.find((option) => option.value === sensor) ?? SENSOR_OPTIONS[0];

  const {
    data: summary,
    isLoading: isLoadingSummary,
    isError: isSummaryError,
    error: summaryError,
  } = useEnergySummary(clientId, authToken, energyEnabled);

  const {
    data: readings,
    isLoading: isLoadingReadings,
    isError: isReadingsError,
    error: readingsError,
  } = useEnergyReadings(
    selectedDevice?.id,
    clientId,
    authToken,
    sensor,
    energyEnabled && Boolean(selectedDevice?.id),
  );

  const latestReading = useMemo(() => {
    if (!readings || readings.length === 0) return null;
    return readings[readings.length - 1];
  }, [readings]);

  return (
    <Panel className="p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Modulo energia</p>
          <h2 className="mt-1 text-xl font-semibold">Visao de consumo e saude eletrica</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Use este bloco para demonstrar valor de energia com leitura recente por
            sensor, cobertura dos equipamentos e historico consolidado.
          </p>
        </div>
        <Badge>
          <PlugZap className="h-3.5 w-3.5 text-accent" />
          {client?.name ?? clientId ?? 'visao geral'}
        </Badge>
      </div>

      {!clientId ? (
        <Feedback>Selecione um cliente para visualizar os indicadores do modulo energia.</Feedback>
      ) : null}

      {clientId && !energyEnabled ? (
        <Feedback>
          O modulo `energia` nao esta contratado para este cliente. Habilite os itens para
          liberar resumo e historico.
        </Feedback>
      ) : null}

      {clientId && energyEnabled ? (
        <>
          <div className="mb-4 grid gap-3 lg:grid-cols-3">
            <div className="rounded-2xl border border-line/70 bg-bg/30 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Equipamentos</p>
              <p className="mt-2 text-lg font-semibold text-ink">
                {isLoadingSummary ? '...' : (summary?.deviceCount ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted">Total de equipamentos associados na conta.</p>
            </div>
            <div className="rounded-2xl border border-line/70 bg-bg/30 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Com telemetria recente</p>
              <p className="mt-2 text-lg font-semibold text-ink">
                {isLoadingSummary ? '...' : (summary?.devicesWithRecentReadings ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted">
                Leitura nas ultimas {summary?.recentWindowHours ?? 24} horas.
              </p>
            </div>
            <div className="rounded-2xl border border-line/70 bg-bg/30 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Leitura atual</p>
              <p className="mt-2 text-lg font-semibold text-ink">
                {latestReading
                  ? `${latestReading.value.toFixed(2)} ${latestReading.unit ?? selectedSensorMeta.unit}`
                  : 'Sem leitura'}
              </p>
              <p className="mt-1 text-xs text-muted">
                {latestReading?.createdAt
                  ? `Atualizado ${formatRelativeDateTime(latestReading.createdAt)}.`
                  : 'Sem dados recentes para o sensor selecionado.'}
              </p>
            </div>
          </div>

          {isSummaryError ? (
            <Feedback variant="danger">
              {summaryError instanceof Error
                ? summaryError.message
                : 'Falha ao carregar resumo de energia.'}
            </Feedback>
          ) : null}

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-[24px] border border-line/70 bg-bg/30 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-[hsl(var(--accent-2))]" />
                  <p className="text-sm font-semibold text-ink">Leituras por sensor</p>
                </div>
                <Select
                  value={sensor}
                  onChange={(event) => setSensor(event.target.value as EnergySensorType)}
                  className="w-[150px] py-2 text-xs"
                >
                  {SENSOR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {isLoadingSummary ? <Feedback>Carregando indicadores por sensor...</Feedback> : null}
              {!isLoadingSummary && summary?.latestBySensor?.length ? (
                <div className="space-y-2">
                  {summary.latestBySensor.map((item) => (
                    <div
                      key={item.sensorType}
                      className="rounded-2xl border border-line/70 bg-card/40 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-ink">{item.sensorType}</p>
                        <Badge>
                          {item.value != null
                            ? `${item.value.toFixed(2)} ${item.unit ?? ''}`.trim()
                            : 'Sem leitura'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {item.deviceId ? `Equipamento: ${item.deviceId}. ` : ''}
                        {item.createdAt
                          ? `Atualizado ${formatRelativeDateTime(item.createdAt)}.`
                          : 'Aguardando primeira leitura.'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-[24px] border border-line/70 bg-bg/30 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-accent" />
                  <p className="text-sm font-semibold text-ink">Historico por equipamento</p>
                </div>
                <Select
                  value={resolvedSelectedDeviceId}
                  onChange={(event) => setSelectedDeviceId(event.target.value)}
                  className="w-[180px] py-2 text-xs"
                >
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name ?? device.id}
                    </option>
                  ))}
                </Select>
              </div>

              {isLoadingReadings ? <Feedback>Carregando historico de energia...</Feedback> : null}
              {isReadingsError ? (
                <Feedback variant="danger">
                  {readingsError instanceof Error
                    ? readingsError.message
                    : 'Falha ao carregar historico de energia.'}
                </Feedback>
              ) : null}
              {!isLoadingReadings && !isReadingsError && (!readings || readings.length === 0) ? (
                <Feedback>Sem leituras para o equipamento e sensor selecionados.</Feedback>
              ) : null}
              {!isLoadingReadings && !isReadingsError && readings && readings.length > 0 ? (
                <div className="max-h-72 space-y-2 overflow-auto pr-1">
                  {readings
                    .slice()
                    .reverse()
                    .map((row, index) => (
                      <div
                        key={`${row.deviceId}-${row.createdAt}-${index}`}
                        className="rounded-2xl border border-line/70 bg-card/35 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-ink">
                            {row.value.toFixed(2)} {row.unit ?? selectedSensorMeta.unit}
                          </p>
                          <p className="text-xs text-muted">{formatRelativeDateTime(row.createdAt)}</p>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          Sensor {row.sensorType} em {row.deviceId}.
                        </p>
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </Panel>
  );
}
