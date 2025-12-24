import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ContentSchedulerService } from '../content/content-scheduler.service.js';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService, private readonly scheduler: ContentSchedulerService) {}

  async list() {
    await this.scheduler.ensureRewardsFresh();
    return this.prisma.reward.findMany({
      orderBy: { cost: 'asc' },
    });
  }

  async redeem(userId: string, rewardId: string) {
    const [user, reward] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.reward.findUnique({ where: { id: rewardId } }),
    ]);
    if (!user || !reward) {
      throw new NotFoundException('User or reward not found');
    }
    if (user.coins < reward.cost) {
      throw new BadRequestException('Insufficient coins');
    }
    return this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { coins: { decrement: reward.cost } },
        select: { coins: true },
      });
      const record = await tx.redemption.create({
        data: { userId, rewardId },
        include: { reward: true },
      });
      return {
        id: record.id,
        createdAt: record.createdAt,
        remainingCoins: updatedUser.coins,
        reward: {
          id: reward.id,
          name: reward.name,
          description: reward.description,
          cost: reward.cost,
        },
      };
    });
  }
}
