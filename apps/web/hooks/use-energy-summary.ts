'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchEnergySummary } from '@/lib/api';

export function useEnergySummary(
  clientId?: string,
  authToken?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ['energy-summary', clientId, authToken],
    queryFn: () =>
      fetchEnergySummary(
        {
          clientId: clientId as string,
          sensors: ['consumo', 'corrente', 'tensao'],
          recentHours: 24,
        },
        authToken,
      ),
    enabled: Boolean(clientId && authToken && enabled),
    retry: 2,
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
    placeholderData: (previousData) => previousData,
  });
}
