'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Layers, Rocket } from 'lucide-react';
import { useSolutionMutations } from '@/hooks/use-solution-mutations';
import { useSolutionReadiness, useSolutionsCatalog } from '@/hooks/use-solutions';
import type { AuthUser } from '@/types/auth';
import type { ClientSummary } from '@/types/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { Panel } from '@/components/ui/panel';

interface SolutionReadinessPanelProps {
  clientId?: string;
  authToken?: string;
  currentUser?: AuthUser | null;
  client?: ClientSummary;
}

function humanItemLabel(itemKey: string) {
  return itemKey.replace(/_/g, ' ');
}

export function SolutionReadinessPanel({
  clientId,
  authToken,
  currentUser,
  client,
}: SolutionReadinessPanelProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const isPlatformAdmin = Boolean(currentUser?.role === 'admin' && !currentUser?.clientId);

  const {
    data: catalog,
    isLoading: isLoadingCatalog,
    isError: isCatalogError,
    error: catalogError,
  } = useSolutionsCatalog(authToken, Boolean(authToken));

  const {
    data: readiness,
    isLoading: isLoadingReadiness,
    isError: isReadinessError,
    error: readinessError,
  } = useSolutionReadiness(clientId, authToken, Boolean(clientId));

  const applyMutation = useSolutionMutations(clientId, authToken);

  const primaryCatalogEntry = useMemo(() => catalog?.[0] ?? null, [catalog]);
  const primaryReadinessEntry = useMemo(() => readiness?.[0] ?? null, [readiness]);

  async function handleApply(includeRecommended: boolean) {
    if (!clientId || !primaryCatalogEntry) return;
    setSuccessMessage(null);
    setLocalError(null);

    try {
      const result = await applyMutation.mutateAsync({
        clientId,
        solutionKey: primaryCatalogEntry.key,
        version: primaryCatalogEntry.version,
        includeRecommended,
      });
      setSuccessMessage(
        `${result.solutionKey}@${result.version} aplicado com ${result.appliedItemKeys.length} item(ns).`,
      );
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Falha ao aplicar solucao.');
    }
  }

  return (
    <Panel className="p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Solucoes comerciais</p>
          <h2 className="mt-1 text-xl font-semibold">Pacotes prontos para venda</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Este bloco fecha a narrativa comercial: aplica receita de solucao e mostra a
            prontidao do cliente para entrar em proposta ou implantacao.
          </p>
        </div>
        <Badge>
          <Layers className="h-3.5 w-3.5 text-accent" />
          {client?.name ?? clientId ?? 'visao geral'}
        </Badge>
      </div>

      {!clientId ? (
        <Feedback>Selecione um cliente para acompanhar prontidao por solucao comercial.</Feedback>
      ) : null}

      {isLoadingCatalog || isLoadingReadiness ? <Feedback>Carregando solucoes...</Feedback> : null}
      {isCatalogError ? (
        <Feedback variant="danger">
          {catalogError instanceof Error
            ? catalogError.message
            : 'Falha ao carregar catalogo de solucoes.'}
        </Feedback>
      ) : null}
      {isReadinessError ? (
        <Feedback variant="danger">
          {readinessError instanceof Error
            ? readinessError.message
            : 'Falha ao carregar prontidao da solucao.'}
        </Feedback>
      ) : null}
      {localError ? <Feedback variant="danger">{localError}</Feedback> : null}
      {successMessage ? <Feedback variant="success">{successMessage}</Feedback> : null}

      {clientId && primaryCatalogEntry && primaryReadinessEntry ? (
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-line/70 bg-bg/30 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink">
                {primaryCatalogEntry.name} ({primaryCatalogEntry.version})
              </p>
              <Badge variant={primaryReadinessEntry.ready ? 'success' : 'neutral'}>
                {primaryReadinessEntry.ready ? 'Pronta para venda' : 'Em implantacao'}
              </Badge>
            </div>
            <p className="text-sm text-muted">{primaryCatalogEntry.description}</p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-line/70 bg-card/30 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Itens obrigatorios</p>
                <p className="mt-2 text-lg font-semibold text-ink">
                  {primaryReadinessEntry.required.enabled}/{primaryReadinessEntry.required.total}
                </p>
                {primaryReadinessEntry.required.missingItems.length > 0 ? (
                  <p className="mt-1 text-xs text-muted">
                    Faltam:{' '}
                    {primaryReadinessEntry.required.missingItems
                      .map((item) => humanItemLabel(item.itemKey))
                      .join(', ')}
                    .
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-ok">Obrigatorios completos.</p>
                )}
              </div>
              <div className="rounded-2xl border border-line/70 bg-card/30 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Itens recomendados</p>
                <p className="mt-2 text-lg font-semibold text-ink">
                  {primaryReadinessEntry.recommended.enabled}/{primaryReadinessEntry.recommended.total}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Itens que fortalecem a narrativa comercial da proposta.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {primaryCatalogEntry.operationalGuidance.map((guide) => (
                <div
                  key={guide}
                  className="rounded-2xl border border-line/70 bg-card/25 p-3 text-sm text-muted"
                >
                  {guide}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-line/70 bg-bg/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Rocket className="h-4 w-4 text-[hsl(var(--accent-2))]" />
              <p className="text-sm font-semibold text-ink">Acoes comerciais</p>
            </div>
            <p className="text-sm text-muted">
              Aplique a receita para habilitar rapidamente os itens da conta e preparar a
              proposta de venda.
            </p>

            <div className="mt-4 space-y-2">
              <Button
                variant="primary"
                className="w-full"
                loading={applyMutation.isPending}
                disabled={!isPlatformAdmin}
                onClick={() => {
                  void handleApply(true);
                }}
              >
                Aplicar solucao completa
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                loading={applyMutation.isPending}
                disabled={!isPlatformAdmin}
                onClick={() => {
                  void handleApply(false);
                }}
              >
                Aplicar somente obrigatorios
              </Button>
            </div>

            {!isPlatformAdmin ? (
              <Feedback className="mt-3">
                Somente o administrador da plataforma pode aplicar receitas de solucao.
              </Feedback>
            ) : null}

            {primaryReadinessEntry.ready ? (
              <div className="mt-4 rounded-2xl border border-ok/30 bg-ok/10 p-3">
                <div className="flex items-center gap-2 text-ok">
                  <CheckCircle2 className="h-4 w-4" />
                  <p className="text-sm font-semibold">Conta pronta para proposta comercial</p>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Solucao aplicada e itens obrigatorios habilitados.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
