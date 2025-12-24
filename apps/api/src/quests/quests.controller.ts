import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { QuestsService } from './quests.service.js';
import { SessionGuard } from '../common/guards/session.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

const questParam = z.object({ questId: z.string().min(1) });

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get()
  @UseGuards(SessionGuard)
  async list(@CurrentUser() userId: string) {
    return this.questsService.listForUser(userId);
  }

  @Post(':questId/start')
  @UseGuards(SessionGuard)
  async start(@Param() params: unknown, @CurrentUser() userId: string) {
    const { questId } = questParam.parse(params);
    return this.questsService.startQuest(userId, questId);
  }

  @Post(':questId/complete')
  @UseGuards(SessionGuard)
  async complete(@Param() params: unknown, @CurrentUser() userId: string) {
    const { questId } = questParam.parse(params);
    return this.questsService.completeQuest(userId, questId);
  }
}
