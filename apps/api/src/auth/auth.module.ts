import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { SessionService } from './session.service.js';
import { SessionGuard } from '../common/guards/session.guard.js';

@Module({
  providers: [AuthService, SessionService, SessionGuard],
  controllers: [AuthController],
  exports: [SessionService, SessionGuard],
})
export class AuthModule {}
