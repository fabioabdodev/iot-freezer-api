'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAlertRuleMutations } from '@/hooks/use-alert-rule-mutations';
import { useAlertRules } from '@/hooks/use-alert-rules';
import { DeviceSummary } from '@/types/device';

const formSchema = z
  .object({
    sensorType: z.string().trim().min(1, 'Sensor obrigatorio'),
    deviceId: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value ? value : undefined)),
    minValue: z
      .string()
      .optional()
      .transform((value) => (value?.trim() ? Number(value) : undefined))
      .refine((value) => value == null || Number.isFinite(value), {
        message: 'Min invalido',
      }),
    maxValue: z
      .string()
      .optional()
      .transform((value) => (value?.trim() ? Number(value) : undefined))
      .refine((value) => value == null || Number.isFinite(value), {
        message: 'Max invalido',
      }),
    cooldownMinutes: z
      .string()
      .optional()
      .transform((value) => (value?.trim() ? Number(value) : 15))
      .refine((value) => Number.isFinite(value) && value >= 1, {
        message: 'Cooldown minimo: 1',
      }),
    toleranceMinutes: z
      .string()
      .optional()
      .transform((value) => (value?.trim() ? Number(value) : 0))
      .refine((value) => Number.isFinite(value) && value >= 0, {
        message: 'Tolerancia minima: 0',
      }),
  })
  .refine(
    (values) =>
      values.minValue == null ||
      values.maxValue == null ||
      values.minValue <= values.maxValue,
    {
      message: 'Min deve ser menor ou igual ao max',
      path: ['maxValue'],
    },
  );

type FormValues = z.input<typeof formSchema>;

type AlertRulesPanelProps = {
  clientId?: string;
  authToken?: string;
  devices: DeviceSummary[];
};

export function AlertRulesPanel({
  clientId,
  authToken,
  devices,
}: AlertRulesPanelProps) {
  const { data, isLoading, isError } = useAlertRules(clientId, authToken);
  const { createMutation, deleteMutation } = useAlertRuleMutations(
    clientId,
    authToken,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sensorType: 'temperature',
      deviceId: '',
      minValue: '',
      maxValue: '',
      cooldownMinutes: '15',
      toleranceMinutes: '0',
    },
  });

  async function handleRemove(id: string) {
    const confirmed = window.confirm('Remover regra de alerta?');
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  }

  return (
    <section className="glass animate-fade-up rounded-2xl border p-4 shadow-lift [animation-delay:280ms]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Regras de alerta</h2>
        {!clientId ? (
          <span className="text-xs text-muted">
            Defina clientId para gerenciar regras
          </span>
        ) : null}
      </div>

      {clientId ? (
        <form
          onSubmit={handleSubmit(async (rawValues) => {
            const values = formSchema.parse(rawValues);
            await createMutation.mutateAsync({
              clientId,
              deviceId: values.deviceId,
              sensorType: values.sensorType,
              minValue: values.minValue,
              maxValue: values.maxValue,
              cooldownMinutes: values.cooldownMinutes,
              toleranceMinutes: values.toleranceMinutes,
              enabled: true,
            });
            reset();
          })}
          className="mb-4 grid gap-3 rounded-xl border border-line bg-card/60 p-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label className="mb-1 block text-xs text-muted">Sensor</label>
            <input
              {...register('sensorType')}
              className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">
              Device (opcional)
            </label>
            <select
              {...register('deviceId')}
              className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm"
            >
              <option value="">Todos os devices do cliente</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name ?? device.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Min</label>
            <input
              {...register('minValue')}
              className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm"
              placeholder="-20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Max</label>
            <input
              {...register('maxValue')}
              className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm"
              placeholder="-10"
            />
            {errors.maxValue ? (
              <p className="mt-1 text-xs text-bad">{errors.maxValue.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">
              Cooldown (min)
            </label>
            <input
              {...register('cooldownMinutes')}
              className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">
              Tolerancia (min)
            </label>
            <input
              {...register('toleranceMinutes')}
              className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg border border-line bg-card/80 px-3 py-2 text-sm font-medium hover:bg-card disabled:opacity-60"
            >
              {createMutation.isPending ? 'Salvando...' : 'Criar regra'}
            </button>
          </div>
        </form>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-muted">Carregando regras...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-bad">Erro ao carregar regras.</p>
      ) : null}

      {!isLoading && !isError ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted">
                <th className="px-3 py-2">Sensor</th>
                <th className="px-3 py-2">Device</th>
                <th className="px-3 py-2">Limites</th>
                <th className="px-3 py-2">Cooldown</th>
                <th className="px-3 py-2">Tolerancia</th>
                <th className="px-3 py-2 text-right">Acao</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((rule) => (
                <tr key={rule.id} className="border-t border-line/60">
                  <td className="px-3 py-2">{rule.sensorType}</td>
                  <td className="px-3 py-2 text-muted">
                    {rule.deviceId ?? 'Todos'}
                  </td>
                  <td className="px-3 py-2">
                    {rule.minValue ?? '-'} / {rule.maxValue ?? '-'}
                  </td>
                  <td className="px-3 py-2">{rule.cooldownMinutes} min</td>
                  <td className="px-3 py-2">{rule.toleranceMinutes} min</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => {
                        void handleRemove(rule.id);
                      }}
                      className="rounded-lg border border-bad/40 bg-bad/10 px-2 py-1.5 text-xs font-medium text-bad hover:bg-bad/20"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
