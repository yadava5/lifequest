import { Module } from '@nestjs/common';
import { QuestsController } from './quests.controller.js';
import { QuestsService } from './quests.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { ContentModule } from '../content/content.module.js';

@Module({
  imports: [AuthModule, ContentModule],
  controllers: [QuestsController],
  providers: [QuestsService],
})
export class QuestsModule {}
