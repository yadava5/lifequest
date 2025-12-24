import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { RewardsService } from './rewards.service.js';
import { SessionGuard } from '../common/guards/session.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

const redeemParams = z.object({ rewardId: z.string().min(1) });

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  async list() {
    return this.rewardsService.list();
  }

  @Post(':rewardId/redeem')
  @UseGuards(SessionGuard)
  async redeem(@Param() params: unknown, @CurrentUser() userId: string) {
    const { rewardId } = redeemParams.parse(params);
    return this.rewardsService.redeem(userId, rewardId);
  }
}
