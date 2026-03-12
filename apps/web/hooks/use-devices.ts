'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDevices } from '@/lib/api';

export function useDevices(clientId?: string, limit = 50, authToken?: string) {
  return useQuery({
    queryKey: ['devices', clientId, limit, authToken],
    queryFn: () => fetchDevices(clientId, limit, authToken),
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}
