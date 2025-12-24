import { Injectable } from '@nestjs/common';
import { Audience } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class MeetupsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(audience?: Audience) {
    const where = audience
      ? {
          OR: [{ audience }, { audience: Audience.SHARED }],
        }
      : undefined;
    return this.prisma.meetup.findMany({
      where,
      orderBy: { startsAt: 'asc' },
    });
  }
}
