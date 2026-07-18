import { Injectable, NotFoundException } from '@nestjs/common';

import { ContentSchedulerService } from '../content/content-scheduler.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { buildUserResponse, userWithRelations } from './user.presenter.js';

type Audience = 'LAID_OFF' | 'RETIRED';

// The demo account is shared and its credentials are publicly documented.
// Anyone can sign in as it, so its identity fields must be immutable — a single
// visitor changing the email would permanently break the public demo login.
const DEMO_EMAIL = (process.env.DEMO_EMAIL ?? 'demo@lifequest.app').toLowerCase();

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly scheduler: ContentSchedulerService) {}

  async getById(id: string) {
    await this.ensureFreshContent();
    const user = await this.prisma.user.findUnique({ where: { id }, include: userWithRelations });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const ritualsToday = await this.getRitualsForToday(id);
    return buildUserResponse(user, ritualsToday);
  }

  async create(payload: { name: string; email: string; passwordHash: string; audience: Audience }) {
    const user = await this.prisma.user.create({
      data: {
        ...payload,
        coins: 800,
        lifetimeCoins: 800,
      },
    });
    await this.syncQuestsForAudience(user.id, payload.audience);
    return this.getById(user.id);
  }

  async update(id: string, updates: { name?: string; email?: string | null; audience?: Audience }) {
    await this.ensureFreshContent();
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { audience, ...rest } = updates;
    // Freeze identity (email/name) for the shared demo account; audience is a
    // legitimate, non-destructive demo toggle so it stays editable.
    const isDemo = user.email.toLowerCase() === DEMO_EMAIL;
    await this.prisma.user.update({
      where: { id },
      data: {
        ...(!isDemo && typeof rest.name === 'string' ? { name: rest.name } : {}),
        ...(!isDemo && typeof rest.email === 'string'
          ? { email: rest.email }
          : {}),
        audience: audience ?? user.audience,
      },
    });
    if (audience && audience !== user.audience) {
      await this.syncQuestsForAudience(id, audience);
    }
    return this.getById(id);
  }

  async resetProgress(id: string) {
    await this.ensureFreshContent();
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.questProgress.deleteMany({ where: { userId: id } });
      await tx.redemption.deleteMany({ where: { userId: id } });
      await tx.ritualLog.deleteMany({ where: { userId: id } });
      // A full reset restores the default coin baseline, so lifetime earned is
      // rebased to match (keeps the invariant lifetimeCoins >= coins).
      await tx.user.update({ where: { id }, data: { coins: 1000, lifetimeCoins: 1000 } });
    });
    await this.syncQuestsForAudience(id, user.audience as Audience);
    return this.getById(id);
  }

  async syncQuestsForAudience(userId: string, audience: Audience) {
    await this.prisma.$transaction(async (tx) => {
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
  }

  async logRitual(userId: string, name: string) {
    await this.prisma.ritualLog.create({
      data: { userId, name },
    });
    return this.getById(userId);
  }

  private async ensureFreshContent() {
    await this.scheduler.ensureQuestsFresh();
    await this.scheduler.ensureRewardsFresh();
  }

  private async getRitualsForToday(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.prisma.ritualLog.findMany({
      where: { userId, createdAt: { gte: today } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
