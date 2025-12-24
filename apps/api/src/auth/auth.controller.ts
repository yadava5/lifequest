import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SessionGuard } from '../common/guards/session.guard.js';
import { CurrentSession } from '../common/decorators/current-session.decorator.js';
import { authLoginPayloadSchema, authSignupPayloadSchema } from '@lifequest/schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: unknown) {
    const payload = authSignupPayloadSchema.parse(body);
    if (!this.authService) {
      throw new Error('AuthService not initialized');
    }
    return this.authService.signup(payload);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: unknown) {
    const payload = authLoginPayloadSchema.parse(body);
    return this.authService.login(payload);
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(SessionGuard)
  async logout(@CurrentSession() sessionId: string) {
    await this.authService.logout(sessionId);
  }
}
