import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';

import { PrismaService } from '../database/prisma.service.js';
import { buildUserResponse, userWithRelations } from '../users/user.presenter.js';
import { serializeSession,SessionService } from './session.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService
  ) {}

  async signup(payload: { name: string; email: string; password: string; audience: 'LAID_OFF' | 'RETIRED' }) {
    const existing = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await hash(payload.password);
    const user = await this.prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        audience: payload.audience,
        passwordHash,
        coins: 800,
        lifetimeCoins: 800,
      },
    });

    await this.bootstrapQuests(user.id, payload.audience);
    const hydrated = await this.prisma.user.findUnique({ where: { id: user.id }, include: userWithRelations });
    const session = await this.sessionService.issueSession(user.id);
    return {
      session: serializeSession(session),
      user: buildUserResponse(hydrated!),
    };
  }

  async login(payload: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: payload.email }, include: userWithRelations });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await verify(user.passwordHash, payload.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const session = await this.sessionService.issueSession(user.id);
    return {
      session: serializeSession(session),
      user: buildUserResponse(user),
    };
  }

  async logout(sessionId: string) {
    await this.sessionService.revokeSession(sessionId);
  }

  private async bootstrapQuests(userId: string, audience: 'LAID_OFF' | 'RETIRED') {
    const quests = await this.prisma.quest.findMany({
      where: {
        OR: [{ audience }, { audience: 'SHARED' }],
      },
    });
    if (quests.length === 0) return;
    await this.prisma.questProgress.createMany({
      data: quests.map((quest) => ({ questId: quest.id, userId })),
    });
  }
}
