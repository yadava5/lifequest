import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  completeQuest as apiCompleteQuest,
  fetchQuests,
  fetchRewards,
  fetchUser,
  redeemReward as apiRedeemReward,
  resetUser as apiResetUser,
  updateUser as apiUpdateUser,
} from '../../lib/api';

export const QuestContext = createContext(undefined);

const normaliseQuests = (items) =>
  items.map((item) => ({
    progressId: item.id,
    questId: item.quest.id,
    title: item.quest.title,
    description: item.quest.description,
    audience: item.quest.audience,
    type: item.quest.type,
    reward: item.quest.reward,
    status: item.status,
    completedAt: item.completedAt,
  }));

export const QuestProvider = ({ userId, children }) => {
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!userId) {
      setUser(null);
      setQuests([]);
      setRewards([]);
      setError(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [userData, questData, rewardData] = await Promise.all([
        fetchUser(userId),
        fetchQuests(userId),
        fetchRewards(),
      ]);
      setUser(userData);
      setQuests(normaliseQuests(questData));
      setRewards(rewardData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const completeQuest = useCallback(
    async (questId) => {
      if (!userId) {
        throw new Error('Not authenticated');
      }
      const response = await apiCompleteQuest(userId, questId);
      setQuests((prev) =>
        prev.map((quest) =>
          quest.questId === questId
            ? { ...quest, status: 'COMPLETED', completedAt: response.completedAt }
            : quest
        )
      );
      setUser((prev) => (prev ? { ...prev, coins: response.coins } : prev));
    },
    [userId]
  );

  const redeemReward = useCallback(
    async (rewardId) => {
      if (!userId) {
        throw new Error('Not authenticated');
      }
      const response = await apiRedeemReward(userId, rewardId);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              coins: response.remainingCoins,
              redemptions: [
                {
                  id: response.id,
                  createdAt: response.createdAt,
                  reward: response.reward,
                },
                ...(prev.redemptions ?? []),
              ],
            }
          : prev
      );
      return response;
    },
    [userId]
  );

  const resetProgress = useCallback(async () => {
    if (!userId) {
      throw new Error('Not authenticated');
    }
    await apiResetUser(userId);
    await load();
  }, [userId, load]);

  const updateProfile = useCallback(
    async (updates) => {
      if (!userId) {
        throw new Error('Not authenticated');
      }
      const updatedUser = await apiUpdateUser(userId, updates);
      setUser(updatedUser);
      setQuests(normaliseQuests(updatedUser.quests ?? []));
      return updatedUser;
    },
    [userId]
  );

  const value = useMemo(
    () => ({
      user,
      userId,
      quests,
      rewards,
      loading,
      error,
      completeQuest,
      redeemReward,
      refresh: load,
      resetProgress,
      updateProfile,
      isAuthenticated: Boolean(userId),
    }),
    [user, userId, quests, rewards, loading, error, completeQuest, redeemReward, load, resetProgress, updateProfile]
  );

  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>;
};

export const useQuestState = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuestState must be used within a QuestProvider');
  }
  return context;
};
