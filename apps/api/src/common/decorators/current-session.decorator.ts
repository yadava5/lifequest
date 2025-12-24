import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import type { RequestWithSession } from '../types/request-with-session.js';

export const CurrentSession = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithSession>();
  if (!request.sessionId) {
    throw new UnauthorizedException('Missing active session');
  }
  return request.sessionId;
});
