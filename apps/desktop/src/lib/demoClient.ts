import type { ApiClient } from '@lifequest/client';

/**
 * Zero-backend demo client.
 *
 * Implements the exact @lifequest/client surface against in-memory,
 * schema-conformant fixtures so the deployed web SPA is fully clickable
 * with no API/DB. The moment a real `VITE_API_URL` is provided, apiClient
 * swaps this out for the live NestJS backend — the app code is identical
 * either way. Nothing here leaves the browser.
 */

type Audience = 'LAID_OFF' | 'RETIRED' | 'SHARED';
type QuestType = 'TASK' | 'COMMUNITY' | 'WELLNESS';
type QuestStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

type Quest = {
  id: string;
  title: string;
  description: string;
  audience: Audience;
  type: QuestType;
  reward: number;
};

type QuestProgress = {
  progressId: string;
  questId: string;
  status: QuestStatus;
  completedAt: string | null;
  quest: Quest;
};

type Reward = { id: string; name: string; description: string; cost: number };
type Redemption = { id: string; createdAt: string; reward: Reward };
type RitualLog = { id: string; name: string; createdAt: string };

const now = () => new Date().toISOString();

const QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: 'Reconnect with a mentor',
    description: 'Schedule a call and share one concrete win from this week.',
    audience: 'LAID_OFF',
    type: 'COMMUNITY',
    reward: 80,
  },
  {
    id: 'quest-2',
    title: 'Quantify a portfolio project',
    description: 'Rewrite one project bullet around a measurable outcome.',
    audience: 'LAID_OFF',
    type: 'TASK',
    reward: 120,
  },
  {
    id: 'quest-3',
    title: 'Neighborhood walk and reflect',
    description: 'Take a 20-minute walk; note three things that gave you energy.',
    audience: 'SHARED',
    type: 'WELLNESS',
    reward: 40,
  },
  {
    id: 'quest-4',
    title: 'Attend a local meetup',
    description: 'Show up to one community event and introduce yourself to two people.',
    audience: 'RETIRED',
    type: 'COMMUNITY',
    reward: 100,
  },
  {
    id: 'quest-5',
    title: 'Ship a daily check-in',
    description: 'Log today’s intention and one small step toward it.',
    audience: 'SHARED',
    type: 'TASK',
    reward: 30,
  },
];

const REWARDS: Reward[] = [
  { id: 'reward-1', name: 'Co-working day pass', description: 'A focused day at a downtown studio.', cost: 200 },
  { id: 'reward-2', name: 'Wellness stipend', description: 'Toward a massage, class, or quiet reset.', cost: 350 },
  { id: 'reward-3', name: 'Coffee-chat credits', description: 'Fuel three networking conversations.', cost: 150 },
  { id: 'reward-4', name: 'Skill course voucher', description: 'One self-paced course of your choosing.', cost: 500 },
];

// Mutable session state (re-seeds on reload — fine for a demo).
type State = {
  coins: number;
  // Cumulative coins earned; grows with quests, never shrinks on redeem, so
  // tier progress is monotonic just like the live backend.
  lifetimeCoins: number;
  progress: Map<string, QuestProgress>;
  redemptions: Redemption[];
  rituals: RitualLog[];
};

function seed(): State {
  const progress = new Map<string, QuestProgress>();
  const initial: Record<string, QuestStatus> = {
    'quest-1': 'IN_PROGRESS',
    'quest-3': 'COMPLETED',
  };
  for (const q of QUESTS) {
    const status = initial[q.id] ?? 'PENDING';
    progress.set(q.id, {
      progressId: `progress-${q.id}`,
      questId: q.id,
      status,
      completedAt: status === 'COMPLETED' ? now() : null,
      quest: q,
    });
  }
  return { coins: 320, lifetimeCoins: 320, progress, redemptions: [], rituals: [] };
}

let state = seed();

const DEMO_USER = {
  id: 'demo-user',
  name: 'Nova Explorer',
  email: 'demo@lifequest.app',
  audience: 'LAID_OFF' as Audience,
  tier: 'ADVENTURER',
};

const buildUser = () => ({
  ...DEMO_USER,
  coins: state.coins,
  lifetimeCoins: state.lifetimeCoins,
  quests: [...state.progress.values()],
  redemptions: state.redemptions,
  ritualsToday: state.rituals,
});

const session = () => ({
  id: 'demo-session',
  expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
});

const delay = <T>(value: T) => new Promise<T>((r) => setTimeout(() => r(value), 120));

export const createDemoClient = (): ApiClient => {
  const authPayload = () => ({ session: session(), user: buildUser() });

  return {
    auth: {
      // Any credentials are accepted in demo mode.
      signup: () => delay(authPayload()),
      login: () => delay(authPayload()),
      logout: () => {
        state = seed();
        return delay(undefined as unknown as void);
      },
    },
    users: {
      me: () => delay(buildUser()),
      update: (payload) => {
        if (payload.name) DEMO_USER.name = payload.name;
        if (payload.audience) DEMO_USER.audience = payload.audience;
        return delay(buildUser());
      },
      reset: () => {
        state = seed();
        return delay(buildUser());
      },
      logRitual: (payload) => {
        state.rituals = [
          { id: `ritual-${Date.now()}`, name: payload.ritual, createdAt: now() },
          ...state.rituals,
        ];
        return delay(buildUser());
      },
    },
    quests: {
      list: () => delay([...state.progress.values()]),
      start: (questId: string) => {
        const p = state.progress.get(questId);
        if (p && p.status === 'PENDING') p.status = 'IN_PROGRESS';
        return delay(p);
      },
      complete: (questId: string) => {
        const p = state.progress.get(questId);
        if (p && p.status !== 'COMPLETED') {
          p.status = 'COMPLETED';
          p.completedAt = now();
          state.coins += p.quest.reward;
          state.lifetimeCoins += p.quest.reward;
        }
        return delay(p);
      },
    },
    rewards: {
      list: () => delay([...REWARDS]),
      redeem: (rewardId: string) => {
        const reward = REWARDS.find((r) => r.id === rewardId);
        if (reward && state.coins >= reward.cost) {
          state.coins -= reward.cost;
          const redemption = { id: `redemption-${Date.now()}`, createdAt: now(), reward };
          state.redemptions = [redemption, ...state.redemptions];
          return delay(redemption);
        }
        return delay({ error: 'INSUFFICIENT_COINS' });
      },
    },
  } as unknown as ApiClient;
};
