import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export const useRewardsQuery = () =>
  useQuery({
    queryKey: ['rewards'],
    queryFn: () => apiClient.rewards.list(),
    staleTime: 1000 * 60,
  });
