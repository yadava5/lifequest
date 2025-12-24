import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../database/prisma.service.js';
import { AiContentService } from './ai-content.service.js';

const QUEST_KEY = 'quests';
const REWARD_KEY = 'rewards';

@Injectable()
export class ContentSchedulerService {
  private readonly logger = new Logger(ContentSchedulerService.name);

  constructor(private readonly prisma: PrismaService, private readonly ai: AiContentService) {}

  async ensureQuestsFresh() {
    const meta = await this.getMeta(QUEST_KEY);
    const isStale = !meta || Date.now() - meta.lastGeneratedAt.getTime() > 1000 * 60 * 60 * 24;
    if (!isStale) return;

    const generated = await this.ai.generateQuests();
    if (!generated) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.questProgress.deleteMany({});
      await tx.quest.deleteMany({});

      const quests = [...generated.daily, ...generated.weekly];
      const createdQuests = await tx.quest.createManyAndReturn({
        data: quests.map((quest) => ({
          title: quest.title,
          description: quest.description,
          audience: quest.audience,
          type: quest.type,
          reward: quest.reward,
        })),
      });

      const users = await tx.user.findMany({ select: { id: true } });
      for (const user of users) {
        await tx.questProgress.createMany({
          data: createdQuests.map((quest) => ({ questId: quest.id, userId: user.id })),
        });
      }

      await this.setMeta(tx, QUEST_KEY);
    });

    this.logger.log('Quests regenerated via AI content service');
  }

  async ensureRewardsFresh() {
    const meta = await this.getMeta(REWARD_KEY);
    const isStale = !meta || Date.now() - meta.lastGeneratedAt.getTime() > 1000 * 60 * 60 * 24 * 30;
    if (!isStale) return;

    const generated = await this.ai.generateRewards();
    if (!generated) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.redemption.deleteMany({});
      await tx.reward.deleteMany({});
      await tx.reward.createMany({
        data: generated.map((reward) => ({
          name: reward.name,
          description: reward.description,
          cost: reward.cost,
        })),
      });
      await this.setMeta(tx, REWARD_KEY);
    });

    this.logger.log('Rewards regenerated via AI content service');
  }

  private async getMeta(key: string) {
    return this.prisma.contentGeneration.findUnique({ where: { key } });
  }

  private async setMeta(tx: Prisma.TransactionClient, key: string) {
    await tx.contentGeneration.upsert({
      where: { key },
      update: { lastGeneratedAt: new Date() },
      create: { key },
    });
  }
}
