'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchActuatorCommands } from '@/lib/api';

export function useActuatorCommands(
  actuatorId: string | null,
  authToken?: string,
) {
  return useQuery({
    queryKey: ['actuator-commands', actuatorId, authToken],
    queryFn: () => fetchActuatorCommands(actuatorId as string, authToken),
    enabled: Boolean(actuatorId),
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}
