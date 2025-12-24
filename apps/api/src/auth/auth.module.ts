import { Module } from '@nestjs/common';

import { SessionGuard } from '../common/guards/session.guard.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { SessionService } from './session.service.js';

@Module({
  providers: [AuthService, SessionService, SessionGuard],
  controllers: [AuthController],
  exports: [SessionService, SessionGuard],
})
export class AuthModule {}
