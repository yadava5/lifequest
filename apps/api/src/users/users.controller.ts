import { logRitualPayloadSchema,updateUserPayloadSchema } from '@lifequest/schemas';
import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { SessionGuard } from '../common/guards/session.guard.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(SessionGuard)
  async getMe(@CurrentUser() userId: string) {
    return this.usersService.getById(userId);
  }

  @Patch('me')
  @UseGuards(SessionGuard)
  async updateMe(@CurrentUser() userId: string, @Body() body: unknown) {
    const updates = updateUserPayloadSchema.parse(body);
    return this.usersService.update(userId, updates);
  }

  @Post('me/reset')
  @UseGuards(SessionGuard)
  async resetMe(@CurrentUser() userId: string) {
    return this.usersService.resetProgress(userId);
  }

  @Post('me/rituals')
  @UseGuards(SessionGuard)
  async logRitual(@CurrentUser() userId: string, @Body() body: unknown) {
    const payload = logRitualPayloadSchema.parse(body);
    return this.usersService.logRitual(userId, payload.ritual);
  }
}
