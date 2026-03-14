'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs } from '@/lib/api';

export function useAuditLogs(
  filters: {
    clientId?: string;
    entityType?: string;
    entityId?: string;
    limit?: number;
  },
  authToken?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ['audit-logs', filters.clientId, filters.entityType, filters.entityId, filters.limit, authToken],
    queryFn: () => fetchAuditLogs(filters, authToken),
    enabled: Boolean(authToken && enabled),
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}
