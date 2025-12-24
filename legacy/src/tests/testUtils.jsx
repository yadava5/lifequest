import React from 'react';
import { render } from '@testing-library/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../styles/theme';
import { QuestContext } from '../features/quests/QuestContext';
import { AuthContext } from '../features/auth/AuthContext';

export const buildQuestState = (overrides = {}) => {
  const user = {
    name: 'Alex Explorer',
    email: 'alex@example.com',
    coins: 250,
    audience: 'LAID_OFF',
    redemptions: [],
    ...overrides.user,
  };
  const defaultState = {
    userId: overrides.userId ?? 'demo-user',
    user,
    quests: overrides.quests ?? [],
    rewards: overrides.rewards ?? [],
    loading: overrides.loading ?? false,
    error: overrides.error ?? null,
    completeQuest: overrides.completeQuest ?? jest.fn().mockResolvedValue(undefined),
    redeemReward:
      overrides.redeemReward ??
      jest.fn().mockResolvedValue({
        id: 'mock-redemption',
        createdAt: new Date().toISOString(),
        remainingCoins: 200,
        reward: { name: 'Mock reward', description: '' },
      }),
    refresh: overrides.refresh ?? jest.fn(),
    resetProgress: overrides.resetProgress ?? jest.fn(),
    updateProfile: overrides.updateProfile ?? jest.fn().mockResolvedValue(user),
    isAuthenticated: overrides.isAuthenticated ?? true,
  };

  return defaultState;
};

export const renderWithProviders = (ui, { questState: questStateOverride, authValue } = {}) => {
  const questState = buildQuestState(questStateOverride ?? {});

  const defaultAuthValue = authValue ?? {
    session: {
      userId: questState.userId,
      name: questState.user?.name ?? '',
      email: questState.user?.email ?? '',
      audience: questState.user?.audience ?? 'LAID_OFF',
    },
    isAuthenticated: true,
    authLoading: false,
    authError: null,
    login: jest.fn(),
    logout: jest.fn(),
    syncUser: jest.fn(),
  };

  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={defaultAuthValue}>
        <QuestContext.Provider value={questState}>{children}</QuestContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper }),
    questState,
  };
};
