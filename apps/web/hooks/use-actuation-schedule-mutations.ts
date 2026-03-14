'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createActuationSchedule,
  deleteActuationSchedule,
  updateActuationSchedule,
} from '@/lib/api';
import { ActuationScheduleInput } from '@/types/actuator';

export function useActuationScheduleMutations(clientId?: string, authToken?: string) {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['actuation-schedules', clientId, authToken],
      refetchType: 'active',
    });
  };

  const createMutation = useMutation({
    mutationFn: (payload: ActuationScheduleInput) =>
      createActuationSchedule(payload, authToken),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ActuationScheduleInput>;
    }) => updateActuationSchedule(id, payload, authToken),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteActuationSchedule(id, authToken),
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
}
