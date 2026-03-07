'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDeviceReadings } from '@/lib/api';

export function useDeviceReadings(
  deviceId?: string,
  clientId?: string,
  limit = 48,
  authToken?: string,
) {
  return useQuery({
    queryKey: ['device-readings', deviceId, clientId, limit, authToken],
    queryFn: () =>
      fetchDeviceReadings(deviceId as string, clientId, limit, authToken),
    enabled: Boolean(deviceId),
  });
}
