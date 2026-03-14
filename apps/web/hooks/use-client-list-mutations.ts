'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient, deleteClient } from '@/lib/api';
import { CreateClientInput } from '@/types/client';

export function useClientListMutations(authToken?: string) {
  const queryClient = useQueryClient();

  const invalidateClients = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['clients', authToken],
      refetchType: 'active',
    });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientInput) => createClient(payload, authToken),
    onSuccess: async () => {
      await invalidateClients();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id, authToken),
    onSuccess: async (_client, deletedId) => {
      queryClient.removeQueries({ queryKey: ['client', deletedId, authToken] });
      await invalidateClients();
    },
  });

  return { createMutation, deleteMutation };
}
