import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import HomePage from '../pages/Home/HomePage';
import QuestLogPage from '../pages/QuestLog/QuestLogPage';
import RewardsPage from '../pages/Rewards/RewardsPage';
import SocialPage from '../pages/Social/SocialPage';
import ResumePage from '../pages/Resume/ResumePage';
import SettingsPage from '../pages/Settings/SettingsPage';
import { renderWithProviders, buildQuestState } from './testUtils';
import { fetchMeetups } from '../lib/api';

jest.mock('../lib/api', () => ({
  fetchMeetups: jest.fn(),
}));

describe('UI benchmark coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays home progress stats and next quests', () => {
    const questState = buildQuestState({
      user: { coins: 500 },
      quests: [
        {
          progressId: 'p-1',
          questId: 'q-1',
          title: 'Polish resume',
          description: 'Tighten summary statement',
          audience: 'LAID_OFF',
          type: 'TASK',
          reward: 75,
          status: 'PENDING',
        },
        {
          progressId: 'p-2',
          questId: 'q-2',
          title: 'Reach out to mentor',
          description: 'Schedule catch-up call',
          audience: 'SHARED',
          type: 'TASK',
          reward: 40,
          status: 'COMPLETED',
        },
      ],
    });

    renderWithProviders(<HomePage />, { questState });

    expect(screen.getByText(/You have 500 Quest Coins/i)).toBeInTheDocument();
    expect(screen.getByText(/Polish resume/i)).toBeInTheDocument();
  });

  it('completes a pending quest and records the action', async () => {
    const completeQuest = jest.fn().mockResolvedValue(undefined);
    const questState = buildQuestState({
      completeQuest,
      quests: [
        {
          progressId: 'p-1',
          questId: 'quest-123',
          title: 'Record a practice interview',
          description: 'Run through questions with a friend',
          audience: 'LAID_OFF',
          type: 'TASK',
          reward: 60,
          status: 'PENDING',
        },
      ],
    });

    renderWithProviders(<QuestLogPage />, { questState });

    const completeButton = await screen.findByRole('button', { name: /Complete/i });
    await userEvent.click(completeButton);

    expect(completeQuest).toHaveBeenCalledWith('quest-123');
  });

  it('redeems a reward and shows confirmation', async () => {
    const redeemReward = jest.fn().mockResolvedValue({
      id: 'redeem-1',
      createdAt: new Date().toISOString(),
      remainingCoins: 150,
      reward: { name: 'Spa voucher', description: 'Relaxing treatment' },
    });

    const questState = buildQuestState({
      user: { coins: 300, redemptions: [] },
      rewards: [
        { id: 'reward-1', name: 'Spa voucher', description: 'Relaxing treatment', cost: 200 },
      ],
      redeemReward,
    });

    renderWithProviders(<RewardsPage />, { questState });

    await userEvent.click(screen.getByRole('button', { name: /Redeem/i }));
    expect(await screen.findByText(/Confirm redemption/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(redeemReward).toHaveBeenCalledWith('reward-1');
    });

    expect(await screen.findByText(/Reward redeemed!/i)).toBeInTheDocument();
  });

  it('lists community meetups based on player audience', async () => {
    fetchMeetups.mockResolvedValueOnce([
      {
        id: 'meetup-1',
        title: 'Networking breakfast',
        location: 'Downtown hub',
        startsAt: '2030-01-01T09:00:00Z',
        audience: 'LAID_OFF',
      },
    ]);

    const questState = buildQuestState({ user: { audience: 'LAID_OFF' } });

    renderWithProviders(<SocialPage />, { questState });

    expect(await screen.findByText(/Networking breakfast/i)).toBeInTheDocument();
    expect(screen.getByText(/Downtown hub/i)).toBeInTheDocument();
    expect(screen.getByText(/Career transition/i)).toBeInTheDocument();
    expect(fetchMeetups).toHaveBeenCalledWith('LAID_OFF');
  });

  it('shows resume guidance content', () => {
    renderWithProviders(<ResumePage />);
    expect(screen.getByText(/Resume Boost/i)).toBeInTheDocument();
    expect(screen.getByText(/Prompts to try/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Insights coming soon/i })).toBeDisabled();
  });

  it('updates account settings and triggers reset', async () => {
    const updateProfile = jest.fn().mockResolvedValue({
      id: 'demo-user',
      name: 'Nova Vega',
      email: 'nova@example.com',
      audience: 'RETIRED',
      coins: 250,
      quests: [],
      redemptions: [],
    });
    const resetProgress = jest.fn().mockResolvedValue(undefined);

    const questState = buildQuestState({
      user: {
        name: 'Alex Explorer',
        email: 'alex@example.com',
        audience: 'LAID_OFF',
      },
      updateProfile,
      resetProgress,
    });

    renderWithProviders(<SettingsPage />, { questState });

    await userEvent.clear(screen.getByLabelText(/Display name/i));
    await userEvent.type(screen.getByLabelText(/Display name/i), 'Nova Vega');
    await userEvent.clear(screen.getByLabelText(/Email/i));
    await userEvent.type(screen.getByLabelText(/Email/i), 'nova@example.com');
    const audienceSelect = screen.getByLabelText(/Player focus/i);
    await userEvent.click(audienceSelect);
    await userEvent.click(screen.getByRole('option', { name: /New chapter/i }));

    await userEvent.click(screen.getByRole('button', { name: /Save changes/i }));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith({
        name: 'Nova Vega',
        email: 'nova@example.com',
        audience: 'RETIRED',
      });
    });

    await userEvent.click(screen.getByRole('button', { name: /Reset progress/i }));
    expect(resetProgress).toHaveBeenCalled();
  });
});
