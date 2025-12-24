import { Module } from '@nestjs/common';
import { RewardsController } from './rewards.controller.js';
import { RewardsService } from './rewards.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { ContentModule } from '../content/content.module.js';

@Module({
  imports: [AuthModule, ContentModule],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}
