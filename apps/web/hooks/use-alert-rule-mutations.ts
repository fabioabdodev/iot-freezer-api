'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAlertRule, deleteAlertRule } from '@/lib/api';
import { AlertRuleInput } from '@/types/alert-rule';

export function useAlertRuleMutations(clientId?: string, authToken?: string) {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['alert-rules', clientId],
    });
  };

  const createMutation = useMutation({
    mutationFn: (payload: AlertRuleInput) =>
      createAlertRule(payload, authToken),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAlertRule(id, authToken),
    onSuccess: invalidate,
  });

  return { createMutation, deleteMutation };
}
