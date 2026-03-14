'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchActuationSchedules } from '@/lib/api';

export function useActuationSchedules(
  clientId?: string,
  authToken?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ['actuation-schedules', clientId, authToken],
    queryFn: () => fetchActuationSchedules(clientId, authToken),
    enabled: Boolean(clientId && authToken && enabled),
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}
