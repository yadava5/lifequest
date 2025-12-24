import { prisma } from '../utils/prisma.js';
import type { Prisma } from '@prisma/client';

export const userWithRelations = {
  quests: {
    include: {
      quest: true,
    },
  },
  redemptions: {
    include: {
      reward: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  },
} satisfies Prisma.UserInclude;

export const buildUserResponse = (user: Prisma.UserGetPayload<{ include: typeof userWithRelations }>) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  audience: user.audience,
  coins: user.coins,
  quests: user.quests.map((progress) => ({
    progressId: progress.id,
    questId: progress.questId,
    status: progress.status,
    completedAt: progress.completedAt,
    quest: {
      id: progress.quest.id,
      title: progress.quest.title,
      description: progress.quest.description,
      audience: progress.quest.audience,
      reward: progress.quest.reward,
      type: progress.quest.type,
    },
  })),
  redemptions: user.redemptions.map((redemption) => ({
    id: redemption.id,
    reward: {
      id: redemption.reward.id,
      name: redemption.reward.name,
      description: redemption.reward.description,
      cost: redemption.reward.cost,
    },
    createdAt: redemption.createdAt,
  })),
});

export const fetchHydratedUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: userWithRelations });
  return user ? buildUserResponse(user) : null;
};

export const bootstrapUserForAudience = async ({
  name,
  email,
  passwordHash,
  audience,
  coins = 800,
}: {
  name: string;
  email: string;
  passwordHash: string;
  audience: 'LAID_OFF' | 'RETIRED';
  coins?: number;
}) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        passwordHash,
        audience,
        coins,
      },
    });

    const quests = await tx.quest.findMany({
      where: {
        OR: [{ audience }, { audience: 'SHARED' }],
      },
    });

    if (quests.length > 0) {
      await tx.questProgress.createMany({
        data: quests.map((quest) => ({ questId: quest.id, userId: user.id })),
      });
    }

    return user;
  });
};

export const syncQuestsForAudience = async (userId: string, audience: 'LAID_OFF' | 'RETIRED') => {
  await prisma.$transaction(async (tx) => {
    await tx.questProgress.deleteMany({ where: { userId } });

    const quests = await tx.quest.findMany({
      where: {
        OR: [{ audience }, { audience: 'SHARED' }],
      },
    });

    if (quests.length > 0) {
      await tx.questProgress.createMany({
        data: quests.map((quest) => ({ questId: quest.id, userId })),
      });
    }
  });
};
