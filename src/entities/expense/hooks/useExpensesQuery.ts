import { useQuery } from '@tanstack/react-query';
import { getExpenses } from '../api';

export function useExpensesQuery(profileId: string | null) {
  return useQuery({
    queryKey: ['expenses', profileId],
    queryFn: () => getExpenses(profileId!),
    enabled: !!profileId,
  });
} 