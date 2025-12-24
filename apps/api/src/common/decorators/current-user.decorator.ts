import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import type { RequestWithSession } from '../types/request-with-session.js';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithSession>();
  if (!request.userId) {
    throw new UnauthorizedException('Missing authenticated user');
  }
  return request.userId;
});
