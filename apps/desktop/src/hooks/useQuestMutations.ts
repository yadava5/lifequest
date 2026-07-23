import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@lifequest/client';
import { useJourneyStore } from '@/store/journeyStore';
import { useToastStore } from '@/store/toastStore';
import { apiClient } from '@/lib/apiClient';
import type { QuestProgress } from '@lifequest/schemas';

const questMatches = (progress: QuestProgress, questId: string) =>
  progress.questId === questId || progress.quest.id === questId;

const updateQuestStatus = (quests: QuestProgress[], questId: string, status: QuestProgress['status']) =>
  quests.map((quest) =>
    questMatches(quest, questId)
      ? {
          ...quest,
          status,
          completedAt: status === 'COMPLETED' ? new Date().toISOString() : quest.completedAt,
        }
      : quest
  );

export const useQuestMutations = () => {
  const queryClient = useQueryClient();
  const pushEvent = useJourneyStore((state) => state.pushEvent);
  const setUser = useJourneyStore((state) => state.setUser);
  const updateUser = useJourneyStore((state) => state.updateUser);

  const startQuest = useMutation({
    mutationFn: async (questId: string) => apiClient.quests.start(questId),
    onMutate: async (questId: string) => {
      await queryClient.cancelQueries({ queryKey: ['user'] });
      const previousUser = useJourneyStore.getState().user;
      if (!questId) {
        return { previousUser };
      }
      updateUser((user) => ({
        ...user,
        quests: updateQuestStatus(user.quests, questId, 'IN_PROGRESS'),
      }));
      return { previousUser };
    },
    onError: (_error, _questId, context) => {
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
      useToastStore.getState().pushToast('Could not start that mission. Try again.', 'error');
    },
    onSuccess: () => {
      pushEvent('Quest started', 'quest');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const completeQuest = useMutation({
    mutationFn: async (questId: string) => apiClient.quests.complete(questId),
    onMutate: async (questId: string) => {
      await queryClient.cancelQueries({ queryKey: ['user'] });
      const previousUser = useJourneyStore.getState().user;
      if (!questId) {
        return { previousUser };
      }
      updateUser((user) => {
        const quest = user.quests.find((progress) => questMatches(progress, questId));
        if (!quest || quest.status === 'COMPLETED') {
          return user;
        }
        return {
          ...user,
          coins: user.coins + quest.quest.reward,
          quests: updateQuestStatus(user.quests, questId, 'COMPLETED'),
        };
      });
      return { previousUser };
    },
    onError: (error, _questId, context) => {
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
      // A 409 means the quest was already completed (e.g. a stale button or a
      // double tap). That's a benign race, not a failure — surface a calm
      // notice instead of letting the ApiError bubble up as a page error. The
      // onSettled refetch below re-syncs the button state either way.
      const alreadyDone = error instanceof ApiError && error.status === 409;
      useToastStore
        .getState()
        .pushToast(
          alreadyDone
            ? 'That mission is already complete.'
            : 'Could not complete the mission. Try again.',
          alreadyDone ? 'warning' : 'error',
        );
    },
    onSuccess: () => {
      pushEvent('Quest completed', 'quest');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return { startQuest, completeQuest };
};
