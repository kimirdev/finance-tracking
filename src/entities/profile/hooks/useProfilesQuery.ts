import { useQuery } from '@tanstack/react-query';
import { getProfiles } from '../api';

export function useProfilesQuery() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: getProfiles,
  });
} 