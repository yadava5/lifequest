import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service.js';

const SESSION_TTL_HOURS = 24 * 7; // 7 days

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async issueSession(userId: string) {
    const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000);
    return this.prisma.session.create({
      data: {
        userId,
        expiresAt,
      },
    });
  }

  async validateSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.prisma.session.delete({ where: { id: sessionId } }).catch(() => undefined);
      }
      throw new UnauthorizedException('Session expired or invalid');
    }
    return session;
  }

  async revokeSession(sessionId: string) {
    await this.prisma.session.delete({ where: { id: sessionId } }).catch(() => undefined);
  }
}

export const serializeSession = (session: { id: string; expiresAt: Date }) => ({
  id: session.id,
  expiresAt: session.expiresAt,
});
