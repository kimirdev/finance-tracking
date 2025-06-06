import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProfile } from '../api';

export function useCreateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createProfile(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
} 