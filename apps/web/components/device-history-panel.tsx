'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDeviceReadings } from '@/hooks/use-device-readings';
import { DeviceSummary } from '@/types/device';

type DeviceHistoryPanelProps = {
  device: DeviceSummary;
  clientId?: string;
  authToken?: string;
};

export function DeviceHistoryPanel({
  device,
  clientId,
  authToken,
}: DeviceHistoryPanelProps) {
  const { data, isLoading, isError } = useDeviceReadings(
    device.id,
    clientId,
    48,
    authToken,
  );

  const points = (data ?? []).map((item) => ({
    temperature: item.temperature,
    label: format(new Date(item.createdAt), 'HH:mm'),
    fullLabel: format(new Date(item.createdAt), 'dd/MM HH:mm', {
      locale: ptBR,
    }),
  }));

  return (
    <div className="mt-4 rounded-xl border border-line bg-card/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Historico - {device.name ?? device.id}
        </h3>
        <span className="text-xs text-muted">Ultimos 48 pontos</span>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Carregando historico...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-bad">
          Erro ao carregar historico do device.
        </p>
      ) : null}

      {!isLoading && !isError && points.length === 0 ? (
        <p className="text-sm text-muted">
          Sem dados de temperatura para este device.
        </p>
      ) : null}

      {!isLoading && !isError && points.length > 0 ? (
        <div className="space-y-4">
          <div className="h-64 w-full rounded-lg border border-line/70 bg-bg/30 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points}>
                <XAxis
                  dataKey="label"
                  minTickGap={28}
                  stroke="hsl(var(--muted))"
                />
                <YAxis stroke="hsl(var(--muted))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(7, 11, 22, 0.95)',
                    border: '1px solid rgba(69, 88, 123, 0.5)',
                    borderRadius: '10px',
                    color: '#f3f8ff',
                  }}
                  formatter={(value: number) => [
                    `${value.toFixed(1)} C`,
                    'Temperatura',
                  ]}
                  labelFormatter={(label) => `Horario: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="max-h-48 overflow-auto rounded-lg border border-line/70 bg-bg/20">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-muted">
                  <th className="px-3 py-2">Horario</th>
                  <th className="px-3 py-2">Temperatura</th>
                </tr>
              </thead>
              <tbody>
                {points
                  .slice()
                  .reverse()
                  .map((row, index) => (
                    <tr
                      key={`${device.id}-${row.fullLabel}-${index}`}
                      className="border-t border-line/60"
                    >
                      <td className="px-3 py-2 text-muted">{row.fullLabel}</td>
                      <td className="px-3 py-2 font-medium">
                        {row.temperature.toFixed(1)} C
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
