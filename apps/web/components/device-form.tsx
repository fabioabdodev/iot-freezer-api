'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DeviceSummary } from '@/types/device';

const deviceIdRegex = /^[a-zA-Z0-9_-]{3,50}$/;

const formSchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(3, 'ID deve ter pelo menos 3 caracteres')
      .max(50, 'ID deve ter no maximo 50 caracteres')
      .regex(deviceIdRegex, 'Use apenas letras, numeros, _ e -'),
    clientId: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value ? value : undefined))
      .refine((value) => !value || deviceIdRegex.test(value), {
        message: 'clientId invalido',
      }),
    name: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value ? value : undefined)),
    location: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value ? value : undefined)),
    minTemperature: z
      .string()
      .optional()
      .transform((value) => (value?.trim() ? Number(value) : undefined))
      .refine((value) => value == null || Number.isFinite(value), {
        message: 'Minimo invalido',
      }),
    maxTemperature: z
      .string()
      .optional()
      .transform((value) => (value?.trim() ? Number(value) : undefined))
      .refine((value) => value == null || Number.isFinite(value), {
        message: 'Maximo invalido',
      }),
  })
  .refine(
    (values) =>
      values.minTemperature == null ||
      values.maxTemperature == null ||
      values.minTemperature <= values.maxTemperature,
    {
      message: 'Minimo deve ser menor ou igual ao maximo',
      path: ['maxTemperature'],
    },
  );

type DeviceFormValues = z.input<typeof formSchema>;
type DeviceFormOutput = z.output<typeof formSchema>;

type DeviceFormProps = {
  mode: 'create' | 'edit';
  clientId?: string;
  device?: DeviceSummary | null;
  loading?: boolean;
  onSubmit: (values: DeviceFormOutput) => void | Promise<void>;
  onCancel?: () => void;
};

export function DeviceForm({
  mode,
  clientId,
  device,
  loading,
  onSubmit,
  onCancel,
}: DeviceFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeviceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      clientId: clientId ?? '',
      name: '',
      location: '',
      minTemperature: '',
      maxTemperature: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && device) {
      reset({
        id: device.id,
        clientId: device.clientId ?? clientId ?? '',
        name: device.name ?? '',
        location: device.location ?? '',
        minTemperature:
          device.minTemperature != null ? String(device.minTemperature) : '',
        maxTemperature:
          device.maxTemperature != null ? String(device.maxTemperature) : '',
      });
      return;
    }

    reset({
      id: '',
      clientId: clientId ?? '',
      name: '',
      location: '',
      minTemperature: '',
      maxTemperature: '',
    });
  }, [mode, device, clientId, reset]);

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(formSchema.parse(values));
      })}
      className="glass rounded-2xl border p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {mode === 'create' ? 'Novo device' : `Editar ${device?.id ?? ''}`}
        </h3>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-line px-2 py-1 text-xs text-muted"
          >
            Fechar
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">ID</label>
          <input
            {...register('id')}
            disabled={mode === 'edit'}
            className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-60"
            placeholder="freezer_01"
          />
          {errors.id ? (
            <p className="mt-1 text-xs text-bad">{errors.id.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">clientId</label>
          <input
            {...register('clientId')}
            className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="cliente_a"
          />
          {errors.clientId ? (
            <p className="mt-1 text-xs text-bad">{errors.clientId.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Nome</label>
          <input
            {...register('name')}
            className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Freezer Loja"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Localizacao</label>
          <input
            {...register('location')}
            className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Camara fria"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Min temp (C)</label>
          <input
            {...register('minTemperature')}
            className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="-20"
          />
          {errors.minTemperature ? (
            <p className="mt-1 text-xs text-bad">
              {errors.minTemperature.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Max temp (C)</label>
          <input
            {...register('maxTemperature')}
            className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="-10"
          />
          {errors.maxTemperature ? (
            <p className="mt-1 text-xs text-bad">
              {errors.maxTemperature.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg border border-line bg-card/80 px-3 py-2 text-sm font-medium hover:bg-card disabled:opacity-60"
        >
          {loading
            ? 'Salvando...'
            : mode === 'create'
              ? 'Criar device'
              : 'Salvar alteracoes'}
        </button>
      </div>
    </form>
  );
}
