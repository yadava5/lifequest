import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { SessionService } from '../../auth/session.service.js';
import type { RequestWithSession } from '../types/request-with-session.js';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithSession>();
    const authHeader = request.headers['authorization'] ?? request.headers['Authorization'];
    if (!authHeader || Array.isArray(authHeader)) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const session = await this.sessionService.validateSession(token);
    request.userId = session.userId;
    request.sessionId = session.id;
    return true;
  }
}
