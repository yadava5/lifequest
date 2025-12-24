import { useQuery } from '@tanstack/react-query';
import { useJourneyStore } from '@/store/journeyStore';
import { apiClient } from '@/lib/apiClient';
export const useUserQuery = () => {
  const token = useJourneyStore((state) => state.session?.id);
  const setUser = useJourneyStore((state) => state.setUser);
  const clearSession = useJourneyStore((state) => state.clearSession);

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!token) throw new Error('Missing session');
      const user = await apiClient.users.me();
      setUser(user);
      return user;
    },
    enabled: Boolean(token),
    retry: 1,
    staleTime: 1000 * 30,
    onError: (error: Error) => {
      if (error.message.toLowerCase().includes('unauthorized')) {
        clearSession();
      }
    },
  });
};
