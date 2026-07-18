import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { ContentSchedulerService } from '../content/content-scheduler.service.js';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class QuestsService {
  constructor(private readonly prisma: PrismaService, private readonly scheduler: ContentSchedulerService) {}

  async listForUser(userId: string) {
    await this.scheduler.ensureQuestsFresh();
    const progresses = await this.prisma.questProgress.findMany({
      where: { userId },
      include: { quest: true },
      orderBy: { quest: { createdAt: 'asc' } },
    });
    return progresses.map((progress) => ({
      id: progress.id,
      status: progress.status,
      completedAt: progress.completedAt,
      quest: {
        id: progress.quest.id,
        title: progress.quest.title,
        description: progress.quest.description,
        audience: progress.quest.audience,
        type: progress.quest.type,
        reward: progress.quest.reward,
      },
    }));
  }

  async startQuest(userId: string, questId: string) {
    const progress = await this.prisma.questProgress.findFirst({
      where: { userId, questId },
    });
    if (!progress) {
      throw new NotFoundException('Quest progress not found');
    }
    if (progress.status === 'COMPLETED') {
      throw new ConflictException('Quest already completed');
    }
    if (progress.status === 'IN_PROGRESS') {
      return progress;
    }
    return this.prisma.questProgress.update({
      where: { id: progress.id },
      data: { status: 'IN_PROGRESS' },
    });
  }

  async completeQuest(userId: string, questId: string) {
    const progress = await this.prisma.questProgress.findFirst({
      where: { userId, questId },
      include: { quest: true },
    });
    if (!progress) {
      throw new NotFoundException('Quest progress not found');
    }
    if (progress.status === 'COMPLETED') {
      throw new ConflictException('Quest already completed');
    }
    return this.prisma.$transaction(async (tx) => {
      const updatedProgress = await tx.questProgress.update({
        where: { id: progress.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
      const updatedUser = await tx.user.update({
        where: { id: userId },
        // Awarding coins also grows lifetime earned so tier progress advances
        // and never regresses when the player later spends on rewards.
        data: {
          coins: { increment: progress.quest.reward },
          lifetimeCoins: { increment: progress.quest.reward },
        },
        select: { coins: true },
      });
      return {
        id: updatedProgress.id,
        status: updatedProgress.status,
        completedAt: updatedProgress.completedAt,
        coins: updatedUser.coins,
      };
    });
  }
}
