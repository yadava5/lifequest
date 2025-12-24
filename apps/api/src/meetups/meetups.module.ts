import { Module } from '@nestjs/common';
import { MeetupsController } from './meetups.controller.js';
import { MeetupsService } from './meetups.service.js';

@Module({
  controllers: [MeetupsController],
  providers: [MeetupsService],
})
export class MeetupsModule {}
