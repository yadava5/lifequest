import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { ContentModule } from '../content/content.module.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [AuthModule, ContentModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
