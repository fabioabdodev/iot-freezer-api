'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Filter, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useClients } from '@/hooks/use-clients';
import { useClientListMutations } from '@/hooks/use-client-list-mutations';
import { ClientStatus } from '@/types/client';
import { AuthUser } from '@/types/auth';
import { AccessNotice } from '@/components/ui/access-notice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DataTable, DataTableWrapper } from '@/components/ui/data-table';
import { Feedback } from '@/components/ui/feedback';
import { Input, Select } from '@/components/ui/input';
import { Panel } from '@/components/ui/panel';
import { useState } from 'react';

const clientIdRegex = /^[a-zA-Z0-9_-]{3,50}$/;

const formSchema = z.object({
  id: z
    .string()
    .trim()
    .min(3, 'ID obrigatorio')
    .max(50, 'ID muito longo')
    .regex(clientIdRegex, 'Use apenas letras, numeros, _ e -'),
  name: z.string().trim().min(2, 'Nome obrigatorio'),
  document: z.string().trim().optional().transform((value) => value || undefined),
  phone: z.string().trim().optional().transform((value) => value || undefined),
  billingEmail: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .refine((value) => value == null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: 'Email invalido',
    }),
  status: z.enum(['active', 'inactive', 'delinquent']).default('active'),
  notes: z.string().trim().optional().transform((value) => value || undefined),
});

type FormValues = z.input<typeof formSchema>;

const statusLabel: Record<ClientStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  delinquent: 'Pendente',
};

type ClientsPanelProps = {
  authToken?: string;
  currentUser: AuthUser | null;
  canManage: boolean;
  selectedClientId?: string;
  onSelectClient: (clientId: string) => void;
};

export function ClientsPanel({
  authToken,
  currentUser,
  canManage,
  selectedClientId,
  onSelectClient,
}: ClientsPanelProps) {
  const { data, isLoading, isError, error } = useClients(authToken, canManage);
  const { createMutation, deleteMutation } = useClientListMutations(authToken);
  const [pendingDeleteClientId, setPendingDeleteClientId] = useState<string | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const clients = data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      document: '',
      phone: '',
      billingEmail: '',
      status: 'active',
      notes: '',
    },
  });

  async function handleDeleteClient(id: string) {
    setDeletingClientId(id);
    try {
      await deleteMutation.mutateAsync(id);
      if (selectedClientId === id && clients.length > 1) {
        const fallback = clients.find((client) => client.id !== id);
        if (fallback) onSelectClient(fallback.id);
      }
    } finally {
      setDeletingClientId(null);
      setPendingDeleteClientId(null);
    }
  }

  if (!canManage) {
    return (
      <AccessNotice
        title="Clientes da plataforma"
        description="A gestao de clientes fica disponivel apenas para o administrador global da plataforma."
        badge={currentUser?.role ?? 'sem sessao'}
        hint="Use o login global para criar clientes e trocar rapidamente o tenant em foco."
      />
    );
  }

  return (
    <Panel className="mb-6 p-5">
      <ConfirmDialog
        open={Boolean(pendingDeleteClientId)}
        title="Excluir cliente?"
        description={
          <>
            O cliente <strong>{pendingDeleteClientId}</strong> sera removido da plataforma.
          </>
        }
        confirmLabel="Excluir cliente"
        loading={deleteMutation.isPending}
        onCancel={() => setPendingDeleteClientId(null)}
        onConfirm={() => {
          if (pendingDeleteClientId) {
            void handleDeleteClient(pendingDeleteClientId);
          }
        }}
      />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Plataforma
          </p>
          <h2 className="mt-1 text-xl font-semibold">Clientes</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Crie novos tenants e troque o foco operacional do dashboard sem sair da tela principal.
          </p>
        </div>
        <Badge>
          <Building2 className="h-3.5 w-3.5 text-accent" />
          admin global
        </Badge>
      </div>

      <form
        onSubmit={handleSubmit(async (rawValues) => {
          const values = formSchema.parse(rawValues);
          await createMutation.mutateAsync(values);
          reset();
          onSelectClient(values.id);
        })}
      >
        <Panel variant="strong" className="mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-muted">clientId</label>
            <Input {...register('id')} placeholder="restaurante_bom_sabor" />
            {errors.id ? <p className="mt-1 text-xs text-bad">{errors.id.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Nome</label>
            <Input {...register('name')} placeholder="Restaurante Bom Sabor" />
            {errors.name ? <p className="mt-1 text-xs text-bad">{errors.name.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Documento</label>
            <Input {...register('document')} placeholder="CNPJ ou CPF" />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Status</label>
            <Select {...register('status')}>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="delinquent">Pendente</option>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Telefone</label>
            <Input {...register('phone')} placeholder="31999990000" />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Email financeiro</label>
            <Input {...register('billingEmail')} placeholder="financeiro@cliente.com.br" />
            {errors.billingEmail ? (
              <p className="mt-1 text-xs text-bad">{errors.billingEmail.message}</p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-muted">Observacoes</label>
            <Input {...register('notes')} placeholder="Contexto comercial e observacoes iniciais" />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.isPending}
              className="min-w-[180px]"
            >
              Criar cliente
            </Button>
          </div>
        </Panel>
      </form>

      {createMutation.isError ? (
        <Feedback variant="danger" className="mb-3">
          {createMutation.error?.message ?? 'Falha ao criar cliente.'}
        </Feedback>
      ) : null}
      {deleteMutation.isError ? (
        <Feedback variant="danger" className="mb-3">
          {deleteMutation.error?.message ?? 'Falha ao excluir cliente.'}
        </Feedback>
      ) : null}
      {isLoading ? <Feedback>Carregando clientes...</Feedback> : null}
      {isError ? (
        <Feedback variant="danger">
          {error?.message ?? 'Falha ao carregar clientes.'}
        </Feedback>
      ) : null}

      {!isLoading && !isError && clients.length > 0 ? (
        <DataTableWrapper className="rounded-[22px]">
          <DataTable>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Status</th>
                <th>Contato</th>
                <th>Selecao</th>
                <th className="text-right">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="font-medium">
                    <div className="flex flex-col">
                      <span>{client.name}</span>
                      <span className="text-xs text-muted">{client.id}</span>
                    </div>
                  </td>
                  <td>{statusLabel[client.status]}</td>
                  <td className="text-muted">
                    <div className="flex flex-col">
                      <span>{client.billingEmail ?? 'Sem email financeiro'}</span>
                      <span className="text-xs">{client.phone ?? 'Sem telefone'}</span>
                    </div>
                  </td>
                  <td>
                    {selectedClientId === client.id ? (
                      <Badge>ativo no dashboard</Badge>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onSelectClient(client.id)}
                      >
                        <Filter className="h-3.5 w-3.5" />
                        Abrir
                      </Button>
                    )}
                  </td>
                  <td className="text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      loading={deletingClientId === client.id}
                      disabled={deleteMutation.isPending && deletingClientId !== client.id}
                      onClick={() => setPendingDeleteClientId(client.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </DataTableWrapper>
      ) : null}

      {!isLoading && !isError && clients.length === 0 ? (
        <Feedback>Nenhum cliente cadastrado ainda.</Feedback>
      ) : null}
    </Panel>
  );
}
