import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const Audience = {
  LAID_OFF: 'LAID_OFF',
  RETIRED: 'RETIRED',
  SHARED: 'SHARED',
};

const QuestStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
};

const prisma = new PrismaClient();

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: 'alex@lifequest.app' },
    update: {},
    create: {
      id: 'demo-user',
      name: 'Alex Thompson',
      email: 'alex@lifequest.app',
      passwordHash: bcrypt.hashSync('lifequest', 10),
      audience: Audience.LAID_OFF,
      coins: 1000,
    },
  });

  const quests = await prisma.quest.createMany({
    data: [
      {
        title: 'Complete Profile',
        description: 'Fill out your LifeQuest profile to unlock personalized missions.',
        audience: Audience.LAID_OFF,
        type: 'onboarding',
        reward: 250,
      },
      {
        title: 'Upload Resume',
        description: 'Upload your resume to receive AI-powered feedback.',
        audience: Audience.LAID_OFF,
        type: 'career',
        reward: 500,
      },
      {
        title: 'Attend a Meetup',
        description: 'Join a local LifeQuest meetup and connect with other players.',
        audience: Audience.SHARED,
        type: 'social',
        reward: 300,
      },
      {
        title: 'Share a Story',
        description: 'Record a short story from your career journey to inspire others.',
        audience: Audience.RETIRED,
        type: 'reflection',
        reward: 200,
      },
      {
        title: 'Take Financial Quiz',
        description: 'Complete a budgeting quiz to sharpen your financial skills.',
        audience: Audience.SHARED,
        type: 'learning',
        reward: 350,
      },
      {
        title: 'Set Retirement Goals',
        description: 'Define three lifestyle goals for your first year of retirement.',
        audience: Audience.RETIRED,
        type: 'planning',
        reward: 400,
      },
      {
        title: 'Create a Budget',
        description: 'Build a weekly spending plan that supports your new routines.',
        audience: Audience.SHARED,
        type: 'planning',
        reward: 450,
      },
      {
        title: 'Connect with Mentor',
        description: 'Schedule a chat with a mentor in the LifeQuest network.',
        audience: Audience.LAID_OFF,
        type: 'networking',
        reward: 600,
      },
      {
        title: 'Complete Skills Assessment',
        description: 'Assess your strengths to unlock tailored skill quests.',
        audience: Audience.LAID_OFF,
        type: 'career',
        reward: 550,
      },
    ],
  });

  const allQuests = await prisma.quest.findMany();
  await prisma.questProgress.createMany({
    data: allQuests.map((quest) => ({
      questId: quest.id,
      userId: demoUser.id,
      status: QuestStatus.PENDING,
    })),
  });

  await prisma.reward.createMany({
    data: [
      {
        name: 'Spotify Subscription',
        description: '3-month premium plan to keep you motivated.',
        cost: 1500,
      },
      {
        name: 'Grocery Coupon',
        description: '10% off your next grocery run.',
        cost: 1000,
      },
      {
        name: 'Coffee Gift Card',
        description: 'Share a coffee with your meetup squad.',
        cost: 800,
      },
      {
        name: 'Premium Resume Templates',
        description: 'Polish your personal brand with ATS-friendly layouts.',
        cost: 2000,
      },
      {
        name: 'Career Coaching Session',
        description: '30-minute session with a certified coach.',
        cost: 3000,
      },
    ],
  });

  await prisma.meetup.createMany({
    data: [
      {
        title: 'Coffee & Career Stories',
        location: 'Cincinnati Public Market',
        startsAt: new Date('2025-03-21T14:00:00.000Z'),
        audience: Audience.LAID_OFF,
        description: 'Swap wins, trade intros, and earn quest credit with peers.',
      },
      {
        title: 'Morning Walkers Club',
        location: 'Eden Park Fountain',
        startsAt: new Date('2025-03-23T11:30:00.000Z'),
        audience: Audience.RETIRED,
        description: 'Start the day with movement and conversation.',
      },
      {
        title: 'Virtual Portfolio Workshop',
        location: 'Zoom',
        startsAt: new Date('2025-03-24T22:00:00.000Z'),
        audience: Audience.SHARED,
        description: 'Get resume and portfolio feedback from mentors.',
      },
    ],
  });

  console.log('Database has been seeded');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
