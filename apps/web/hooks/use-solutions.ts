'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchSolutionReadiness, fetchSolutionsCatalog } from '@/lib/api';

export function useSolutionsCatalog(authToken?: string, enabled = true) {
  return useQuery({
    queryKey: ['solutions-catalog', authToken],
    queryFn: () => fetchSolutionsCatalog(authToken),
    enabled: Boolean(authToken && enabled),
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}

export function useSolutionReadiness(
  clientId?: string,
  authToken?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ['solutions-readiness', clientId, authToken],
    queryFn: () => fetchSolutionReadiness(clientId as string, authToken),
    enabled: Boolean(clientId && authToken && enabled),
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}
