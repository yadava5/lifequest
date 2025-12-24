import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useJourneyStore } from '@/store/journeyStore';
import { apiClient } from '@/lib/apiClient';

export type RedeemableReward = {
  id: string;
  name: string;
  description: string;
  cost: number;
};

export const useRewardMutations = () => {
  const queryClient = useQueryClient();
  const pushEvent = useJourneyStore((state) => state.pushEvent);
  const setUser = useJourneyStore((state) => state.setUser);
  const updateUser = useJourneyStore((state) => state.updateUser);

  const redeemReward = useMutation({
    mutationFn: async (reward: RedeemableReward) => apiClient.rewards.redeem(reward.id),
    onMutate: async (reward: RedeemableReward) => {
      await queryClient.cancelQueries({ queryKey: ['user'] });
      const previousUser = useJourneyStore.getState().user;
      updateUser((user) => ({
        ...user,
        coins: Math.max(0, user.coins - reward.cost),
        redemptions: user.redemptions.some((entry) => entry.reward.id === reward.id)
          ? user.redemptions
          : [
              {
                id: `optimistic-${reward.id}-${Date.now()}`,
                createdAt: new Date().toISOString(),
                reward: {
                  id: reward.id,
                  name: reward.name,
                  description: reward.description,
                  cost: reward.cost,
                },
              },
              ...user.redemptions,
            ],
      }));
      return { previousUser };
    },
    onError: (_error, _reward, context) => {
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
    },
    onSuccess: () => {
      pushEvent('Reward redeemed', 'reward');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });

  return { redeemReward };
};
