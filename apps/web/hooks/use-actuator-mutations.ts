'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createActuator, issueActuatorCommand } from '@/lib/api';
import {
  ActuationCommand,
  ActuationCommandInput,
  ActuatorInput,
  ActuatorSummary,
} from '@/types/actuator';

export function useActuatorMutations(clientId?: string, authToken?: string) {
  const queryClient = useQueryClient();

  const invalidateActuators = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['actuators'],
      refetchType: 'active',
    });
    await queryClient.invalidateQueries({
      queryKey: ['actuator-commands'],
      refetchType: 'active',
    });
  };

  const upsertActuatorInCaches = (actuator: ActuatorSummary) => {
    queryClient.setQueriesData(
      { queryKey: ['actuators'] },
      (current: ActuatorSummary[] | undefined) => {
        if (!current) return current;

        const existingIndex = current.findIndex((row) => row.id === actuator.id);
        if (existingIndex === -1) return [actuator, ...current];

        const next = current.slice();
        next[existingIndex] = {
          ...next[existingIndex],
          ...actuator,
        };
        return next;
      },
    );
  };

  const prependCommandInCaches = (command: ActuationCommand) => {
    queryClient.setQueriesData(
      { queryKey: ['actuator-commands', command.actuatorId] },
      (current: ActuationCommand[] | undefined) =>
        current ? [command, ...current] : current,
    );
  };

  const createMutation = useMutation({
    mutationFn: (payload: ActuatorInput) => createActuator(payload, authToken),
    onSuccess: async (actuator) => {
      upsertActuatorInCaches(actuator);
      await invalidateActuators();
    },
  });

  const commandMutation = useMutation({
    mutationFn: ({
      actuatorId,
      payload,
    }: {
      actuatorId: string;
      payload: ActuationCommandInput;
    }) => issueActuatorCommand(actuatorId, payload, authToken),
    onSuccess: async (command) => {
      if (command.actuator) {
        upsertActuatorInCaches(command.actuator);
      }
      prependCommandInCaches(command);
      await invalidateActuators();
    },
  });

  return {
    createMutation,
    commandMutation,
    scopedClientId: clientId,
  };
}
