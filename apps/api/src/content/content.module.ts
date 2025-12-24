import { Module } from '@nestjs/common';

import { AiContentService } from './ai-content.service.js';
import { ContentSchedulerService } from './content-scheduler.service.js';

@Module({
  providers: [ContentSchedulerService, AiContentService],
  exports: [ContentSchedulerService],
})
export class ContentModule {}
