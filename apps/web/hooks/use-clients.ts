'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchClients } from '@/lib/api';

export function useClients(authToken?: string, enabled = true) {
  return useQuery({
    queryKey: ['clients', authToken],
    queryFn: () => fetchClients(authToken),
    enabled: Boolean(authToken && enabled),
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}
