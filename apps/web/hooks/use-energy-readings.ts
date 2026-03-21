'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchEnergyReadings } from '@/lib/api';
import type { EnergySensorType } from '@/types/energy';

export function useEnergyReadings(
  deviceId?: string,
  clientId?: string,
  authToken?: string,
  sensor: EnergySensorType = 'consumo',
  enabled = true,
) {
  return useQuery({
    queryKey: ['energy-readings', deviceId, clientId, authToken, sensor],
    queryFn: () =>
      fetchEnergyReadings(
        deviceId as string,
        {
          clientId,
          sensor,
          limit: 48,
          resolution: '15m',
        },
        authToken,
      ),
    enabled: Boolean(deviceId && clientId && authToken && enabled),
    retry: 2,
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
    placeholderData: (previousData) => previousData,
  });
}
