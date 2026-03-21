'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applySolutionRecipe } from '@/lib/api';
import type { ApplySolutionInput } from '@/types/solution';

export function useSolutionMutations(clientId?: string, authToken?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApplySolutionInput) => applySolutionRecipe(payload, authToken),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['solutions-readiness', clientId, authToken],
          refetchType: 'active',
        }),
        queryClient.invalidateQueries({
          queryKey: ['client-modules', clientId, authToken],
          refetchType: 'active',
        }),
      ]);
    },
  });
}
