import { Module } from '@nestjs/common';
import { ContentSchedulerService } from './content-scheduler.service.js';
import { AiContentService } from './ai-content.service.js';

@Module({
  providers: [ContentSchedulerService, AiContentService],
  exports: [ContentSchedulerService],
})
export class ContentModule {}
