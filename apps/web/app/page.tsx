'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  KeyRound,
  Snowflake,
  Thermometer,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import { DeviceForm } from '@/components/device-form';
import { DeviceHistoryPanel } from '@/components/device-history-panel';
import { AlertRulesPanel } from '@/components/alert-rules-panel';
import { useDeviceMutations } from '@/hooks/use-device-mutations';
import { useDevices } from '@/hooks/use-devices';

const TOKEN_STORAGE_KEY = 'iot_web_auth_token';

function statusClass(isOffline: boolean) {
  return isOffline
    ? 'bg-bad/10 text-bad border-bad/20'
    : 'bg-ok/10 text-ok border-ok/20';
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-4 py-8">Carregando...</main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryClientId = searchParams.get('clientId') ?? '';

  const [clientIdDraft, setClientIdDraft] = useState(queryClientId);
  const [authTokenDraft, setAuthTokenDraft] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<'closed' | 'create' | 'edit'>(
    'closed',
  );
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);

  useEffect(() => {
    setClientIdDraft(queryClientId);
  }, [queryClientId]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? '';
    setAuthToken(savedToken);
    setAuthTokenDraft(savedToken);
  }, []);

  const clientId = useMemo(
    () => queryClientId.trim() || undefined,
    [queryClientId],
  );

  const { data, isLoading, isError, refetch } = useDevices(
    clientId,
    50,
    authToken,
  );
  const devices = data ?? [];

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) ?? null;
  const editingDevice = devices.find((d) => d.id === editingDeviceId) ?? null;

  const { createMutation, updateMutation, deleteMutation } = useDeviceMutations(
    clientId,
    authToken,
  );

  const online = devices.filter((d) => !d.isOffline).length;
  const offline = devices.filter((d) => d.isOffline).length;

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    const nextClientId = clientIdDraft.trim();

    if (nextClientId) {
      params.set('clientId', nextClientId);
    } else {
      params.delete('clientId');
    }

    const query = params.toString();
    router.replace(query ? `/?${query}` : '/');
  }

  function saveToken() {
    const nextToken = authTokenDraft.trim();
    window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setAuthToken(nextToken);
    void refetch();
  }

  function clearToken() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken('');
    setAuthTokenDraft('');
    void refetch();
  }

  async function handleDeleteDevice(id: string) {
    const confirmed = window.confirm(
      `Tem certeza que deseja remover o device ${id}?`,
    );
    if (!confirmed) return;

    await deleteMutation.mutateAsync(id);

    if (selectedDeviceId === id) setSelectedDeviceId(null);
    if (editingDeviceId === id) {
      setEditingDeviceId(null);
      setFormMode('closed');
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="glass rounded-2xl border px-3 py-2">
            <Image
              src="/brand/virtuagil_logo_low.png"
              alt="Virtuagil"
              width={146}
              height={42}
              priority
            />
          </div>
          <div>
            <p className="text-sm text-muted">Plataforma de monitoramento</p>
            <h1 className="text-xl font-semibold tracking-tight">
              Dashboard de Dispositivos
            </h1>
          </div>
        </div>

        <div className="glass flex w-full flex-col gap-3 rounded-2xl border p-3 lg:w-auto lg:min-w-[420px]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={clientIdDraft}
              onChange={(event) => setClientIdDraft(event.target.value)}
              placeholder="Filtrar por clientId"
              className="w-full rounded-lg border border-line bg-card/70 px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              onClick={applyFilters}
              className="rounded-lg border border-line bg-card/80 px-3 py-2 text-sm font-medium hover:bg-card"
            >
              Aplicar
            </button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full">
              <KeyRound className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted" />
              <input
                type="password"
                value={authTokenDraft}
                onChange={(event) => setAuthTokenDraft(event.target.value)}
                placeholder="Token (opcional)"
                className="w-full rounded-lg border border-line bg-card/70 py-2 pl-8 pr-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              onClick={saveToken}
              className="rounded-lg border border-line bg-card/80 px-3 py-2 text-sm font-medium hover:bg-card"
            >
              Salvar token
            </button>
            <button
              onClick={clearToken}
              className="rounded-lg border border-line bg-card/80 px-3 py-2 text-sm font-medium hover:bg-card"
            >
              Limpar
            </button>
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass animate-fade-up rounded-2xl border p-5 shadow-lift">
          <p className="mb-2 text-sm text-muted">Dispositivos</p>
          <p className="text-3xl font-semibold">{devices.length}</p>
          <Snowflake className="mt-3 h-4 w-4 text-accent" />
        </div>
        <div className="glass animate-fade-up rounded-2xl border p-5 shadow-lift [animation-delay:80ms]">
          <p className="mb-2 text-sm text-muted">Online</p>
          <p className="text-3xl font-semibold text-ok">{online}</p>
          <Activity className="mt-3 h-4 w-4 text-ok" />
        </div>
        <div className="glass animate-fade-up rounded-2xl border p-5 shadow-lift [animation-delay:120ms]">
          <p className="mb-2 text-sm text-muted">Offline</p>
          <p className="text-3xl font-semibold text-bad">{offline}</p>
          <AlertTriangle className="mt-3 h-4 w-4 text-bad" />
        </div>
        <div className="glass animate-fade-up rounded-2xl border p-5 shadow-lift [animation-delay:160ms]">
          <p className="mb-2 text-sm text-muted">Atualizacao</p>
          <p className="text-sm font-medium">
            {new Date().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <Thermometer className="mt-3 h-4 w-4 text-accent" />
        </div>
      </section>

      <section className="glass animate-fade-up rounded-2xl border p-4 shadow-lift [animation-delay:220ms]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Resumo operacional</h2>
          <div className="flex items-center gap-2">
            {clientId ? (
              <span className="rounded-full border border-line bg-card/70 px-2 py-1 text-xs text-muted">
                clientId: {clientId}
              </span>
            ) : (
              <span className="rounded-full border border-line bg-card/70 px-2 py-1 text-xs text-muted">
                clientId: todos
              </span>
            )}
            <button
              onClick={() => {
                void refetch();
              }}
              className="rounded-lg border border-line bg-card/80 px-3 py-2 text-sm font-medium hover:bg-card"
            >
              Atualizar
            </button>
            <button
              onClick={() => {
                setEditingDeviceId(null);
                setFormMode((current) =>
                  current === 'create' ? 'closed' : 'create',
                );
              }}
              className="rounded-lg border border-line bg-card/80 px-3 py-2 text-sm font-medium hover:bg-card"
            >
              {formMode === 'create' ? 'Fechar cadastro' : 'Novo device'}
            </button>
          </div>
        </div>

        {formMode === 'create' ? (
          <div className="mb-4">
            <DeviceForm
              mode="create"
              clientId={clientId}
              loading={createMutation.isPending}
              onCancel={() => setFormMode('closed')}
              onSubmit={async (values) => {
                await createMutation.mutateAsync({
                  ...values,
                  clientId: values.clientId ?? clientId,
                });
                setFormMode('closed');
              }}
            />
          </div>
        ) : null}

        {formMode === 'edit' && editingDevice ? (
          <div className="mb-4">
            <DeviceForm
              mode="edit"
              clientId={clientId}
              device={editingDevice}
              loading={updateMutation.isPending}
              onCancel={() => {
                setEditingDeviceId(null);
                setFormMode('closed');
              }}
              onSubmit={async (values) => {
                await updateMutation.mutateAsync({
                  id: editingDevice.id,
                  payload: {
                    clientId: values.clientId,
                    name: values.name,
                    location: values.location,
                    minTemperature: values.minTemperature,
                    maxTemperature: values.maxTemperature,
                  },
                });
                setEditingDeviceId(null);
                setFormMode('closed');
              }}
            />
          </div>
        ) : null}

        {createMutation.isError ||
        updateMutation.isError ||
        deleteMutation.isError ? (
          <p className="mb-3 text-sm text-bad">
            Erro ao salvar alteracoes do device. Verifique os dados e tente
            novamente.
          </p>
        ) : null}

        {isLoading ? <p className="text-sm text-muted">Carregando...</p> : null}
        {isError ? (
          <p className="text-sm text-bad">Erro ao carregar dispositivos.</p>
        ) : null}

        {!isLoading && !isError ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="px-3 py-2">Device</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Temperatura</th>
                    <th className="px-3 py-2">Faixa</th>
                    <th className="px-3 py-2">Ultima leitura</th>
                    <th className="px-3 py-2 text-right">Acoes</th>
                    <th className="px-3 py-2 text-right">Historico</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr
                      key={device.id}
                      className="rounded-xl border bg-card/70"
                    >
                      <td className="px-3 py-3 font-medium">
                        {device.name ?? device.id}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full border px-2 py-1 text-xs ${statusClass(device.isOffline)}`}
                        >
                          {device.isOffline ? 'Offline' : 'Online'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {device.lastTemperature != null
                          ? `${device.lastTemperature.toFixed(1)} C`
                          : 'Sem dados'}
                      </td>
                      <td className="px-3 py-3 text-muted">
                        {device.minTemperature != null ||
                        device.maxTemperature != null
                          ? `${device.minTemperature ?? '-'} / ${device.maxTemperature ?? '-'}`
                          : 'Nao configurada'}
                      </td>
                      <td className="px-3 py-3 text-muted">
                        {device.lastReadingAt
                          ? formatDistanceToNow(
                              new Date(device.lastReadingAt),
                              {
                                addSuffix: true,
                                locale: ptBR,
                              },
                            )
                          : 'Sem leitura'}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingDeviceId(device.id);
                              setFormMode('edit');
                            }}
                            className="rounded-lg border border-line bg-card/80 px-2 py-1.5 text-xs font-medium hover:bg-card"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              void handleDeleteDevice(device.id);
                            }}
                            className="rounded-lg border border-bad/40 bg-bad/10 px-2 py-1.5 text-xs font-medium text-bad hover:bg-bad/20"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedDeviceId((current) =>
                              current === device.id ? null : device.id,
                            );
                          }}
                          className="rounded-lg border border-line bg-card/80 px-3 py-1.5 text-xs font-medium hover:bg-card"
                        >
                          {selectedDeviceId === device.id
                            ? 'Fechar'
                            : 'Ver grafico'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedDevice ? (
              <DeviceHistoryPanel
                device={selectedDevice}
                clientId={clientId}
                authToken={authToken}
              />
            ) : null}
          </div>
        ) : null}
      </section>

      <AlertRulesPanel
        clientId={clientId}
        authToken={authToken}
        devices={devices}
      />
    </main>
  );
}
