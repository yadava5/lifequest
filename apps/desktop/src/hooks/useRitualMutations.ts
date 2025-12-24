import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { useJourneyStore } from '@/store/journeyStore';

export const useRitualMutations = () => {
  const queryClient = useQueryClient();
  const setUser = useJourneyStore((state) => state.setUser);
  const updateUser = useJourneyStore((state) => state.updateUser);
  const pushEvent = useJourneyStore((state) => state.pushEvent);

  const logRitual = useMutation({
    mutationFn: async (ritual: string) => apiClient.users.logRitual({ ritual }),
    onMutate: async (ritual: string) => {
      await queryClient.cancelQueries({ queryKey: ['user'] });
      const previousUser = useJourneyStore.getState().user;
      updateUser((user) => ({
        ...user,
        ritualsToday: [
          {
            id: `optimistic-ritual-${Date.now()}`,
            name: ritual,
            createdAt: new Date().toISOString(),
          },
          ...(user.ritualsToday ?? []),
        ],
      }));
      return { previousUser };
    },
    onError: (_error, _ritual, context) => {
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
    },
    onSuccess: (user) => {
      setUser(user);
      pushEvent('Ritual logged', 'quest');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return { logRitual };
};
