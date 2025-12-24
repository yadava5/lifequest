import { PrismaClient, Audience, QuestType } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const quests = [
    {
      title: 'Reconnect with a mentor',
      description: 'Schedule a 30-minute check-in with a past manager or mentor.',
      audience: Audience.LAID_OFF,
      type: QuestType.COMMUNITY,
      reward: 60,
    },
    {
      title: 'Document a new routine',
      description: 'Track your morning routine for five days straight.',
      audience: Audience.RETIRED,
      type: QuestType.WELLNESS,
      reward: 50,
    },
    {
      title: 'Share a win',
      description: 'Post a recent achievement to the LifeQuest community forum.',
      audience: Audience.SHARED,
      type: QuestType.TASK,
      reward: 40,
    },
  ];

  const rewards = [
    { name: 'Co-working day pass', description: 'Access to a local workspace for a day.', cost: 200 },
    { name: 'Wellness stipend', description: '$25 gift for fitness or wellness essentials.', cost: 250 },
    { name: 'Coffee chat credit', description: 'Buy coffee for your next networking chat.', cost: 120 },
  ];

  const meetups = [
    {
      title: 'Career transition breakfast',
      location: 'Downtown Innovation Hub',
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      audience: Audience.LAID_OFF,
      description: 'Swap leads and accountability goals with fellow explorers.',
    },
    {
      title: 'Retirement design lab',
      location: 'Community Arts Center',
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      audience: Audience.RETIRED,
      description: 'Workshop new routines and volunteering ideas.',
    },
    {
      title: 'Shared wins showcase',
      location: 'Virtual',
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      audience: Audience.SHARED,
      description: 'Celebrate redemptions and lessons learned.',
    },
  ];

  const prompts = [
    {
      title: 'Quantify your impact',
      content: 'List three metrics that improved under your leadership and what levers you pulled.',
      category: 'Resume',
    },
    {
      title: 'Bridge the gap',
      content: 'Write two sentences reframing a career pause as purposeful growth.',
      category: 'Resume',
    },
  ];

  const [demoUser] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'demo@lifequest.app' },
      update: {},
      create: {
        name: 'Demo Explorer',
        email: 'demo@lifequest.app',
        passwordHash: await hash('LifeQuest123!'),
        audience: Audience.LAID_OFF,
        coins: 1000,
      },
    }),
    ...quests.map((quest) =>
      prisma.quest.upsert({
        where: { title: quest.title },
        update: quest,
        create: quest,
      })
    ),
    ...rewards.map((reward) =>
      prisma.reward.upsert({
        where: { name: reward.name },
        update: reward,
        create: reward,
      })
    ),
    ...meetups.map((meetup) =>
      prisma.meetup.upsert({
        where: { title: meetup.title },
        update: meetup,
        create: meetup,
      })
    ),
    ...prompts.map((prompt) =>
      prisma.resumePrompt.upsert({
        where: { title: prompt.title },
        update: prompt,
        create: prompt,
      })
    ),
  ]);

  const allQuests = await prisma.quest.findMany();
  await prisma.questProgress.deleteMany({ where: { userId: demoUser.id } });
  await prisma.questProgress.createMany({
    data: allQuests.map((quest) => ({ questId: quest.id, userId: demoUser.id })),
  });

  console.log('Seeded LifeQuest data set.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
