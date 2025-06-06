import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExpense } from '../api';

export function useAddExpenseMutation(profileId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createExpense(profileId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', profileId] });
    },
  });
} 