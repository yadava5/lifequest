import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useJourneyStore } from '@/store/journeyStore';
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
    onError: (_error, _questId, context) => {
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
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
