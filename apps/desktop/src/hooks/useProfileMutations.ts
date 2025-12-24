import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useJourneyStore } from '@/store/journeyStore';
import { apiClient } from '@/lib/apiClient';
import type { UpdateUserPayload } from '@lifequest/schemas';

export const useProfileMutations = () => {
  const queryClient = useQueryClient();
  const pushEvent = useJourneyStore((state) => state.pushEvent);
  const setUser = useJourneyStore((state) => state.setUser);

  const updateProfile = useMutation({
    mutationFn: async (payload: UpdateUserPayload) => apiClient.users.update(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['user'], user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      pushEvent('Profile updated', 'profile');
    },
  });

  const resetProgress = useMutation({
    mutationFn: async () => apiClient.users.reset(),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['user'], user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      pushEvent('Progress reset', 'profile');
    },
  });

  return { updateProfile, resetProgress };
};
