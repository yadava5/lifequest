import type { Prisma, RitualLog } from '@prisma/client';

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

export type HydratedUser = Prisma.UserGetPayload<{ include: typeof userWithRelations }>;

export const buildUserResponse = (user: HydratedUser, ritualsToday: RitualLog[] = []) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  audience: user.audience,
  tier: user.tier,
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
    createdAt: redemption.createdAt,
    reward: {
      id: redemption.reward.id,
      name: redemption.reward.name,
      description: redemption.reward.description,
      cost: redemption.reward.cost,
    },
  })),
  ritualsToday: ritualsToday.map((ritual) => ({
    id: ritual.id,
    name: ritual.name,
    createdAt: ritual.createdAt,
  })),
});
