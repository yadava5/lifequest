export const demoUser = {
  name: 'Nova Explorer',
  email: 'demo@lifequest.app',
  audience: 'LAID_OFF',
  coins: 1240,
  tier: 'Adventurer',
};

export const demoQuests = [
  {
    id: 'quest-1',
    title: 'Reconnect with your mentor',
    description: 'Schedule a video call to share your latest progress.',
    reward: 80,
    status: 'IN_PROGRESS',
    type: 'COMMUNITY',
  },
  {
    id: 'quest-2',
    title: 'Polish your portfolio',
    description: 'Curate three projects that show measurable outcomes.',
    reward: 120,
    status: 'PENDING',
    type: 'TASK',
  },
  {
    id: 'quest-3',
    title: 'Neighborhood walk & reflect',
    description: 'Document three observations that energized you.',
    reward: 40,
    status: 'COMPLETED',
    type: 'WELLNESS',
  },
];

export const demoRewards = [
  { id: 'reward-1', name: 'Co-working pass', description: 'Drop in at a creative studio downtown.', cost: 200 },
  { id: 'reward-2', name: 'Wellness stipend', description: 'Treat yourself to a massage or spa.', cost: 350 },
  { id: 'reward-3', name: 'Coffee chat credits', description: 'Caffeinate your next networking sprint.', cost: 150 },
];

export const demoMeetups = [
  { id: 'meet-1', title: 'Career Transition Roundtable', location: 'SF Commons Lab', date: 'Nov 15 · 6:00 PM', audience: 'LAID_OFF' },
  { id: 'meet-2', title: 'Shared Wins Open Mic', location: 'Virtual', date: 'Nov 18 · 5:00 PM', audience: 'SHARED' },
];

export const resumePrompts = [
  {
    id: 'prompt-1',
    title: 'Quantify your impact',
    body: 'Translate recent tasks into metrics that show retention, revenue, or efficiency gains.',
  },
  {
    id: 'prompt-2',
    title: 'Bridge the gap',
    body: 'Reframe a career pause as intentional development with a concise narrative.',
  },
];

export type DemoQuest = (typeof demoQuests)[number];
export type DemoReward = (typeof demoRewards)[number];
