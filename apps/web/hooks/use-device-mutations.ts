'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDevice, deleteDevice, updateDevice } from '@/lib/api';
import { DeviceInput } from '@/types/device';

export function useDeviceMutations(clientId?: string, authToken?: string) {
  const queryClient = useQueryClient();

  const invalidateDevices = async () => {
    await queryClient.invalidateQueries({ queryKey: ['devices'] });
    await queryClient.invalidateQueries({ queryKey: ['device-readings'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: DeviceInput) => createDevice(payload, authToken),
    onSuccess: invalidateDevices,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<DeviceInput, 'id'>;
    }) => updateDevice(id, payload, clientId, authToken),
    onSuccess: invalidateDevices,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDevice(id, clientId, authToken),
    onSuccess: invalidateDevices,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
