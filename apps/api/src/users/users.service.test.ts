/**
 * The first tests this package has ever had.
 *
 * `apps/api` shipped `"test": "vitest --passWithNoTests"` with ZERO authored
 * test files, so `npm run test:api` exited 0 in CI having executed nothing —
 * a green tick that asserted no behaviour at all. jetpack-compress and
 * jobtracker both guard against exactly that; this package did not.
 *
 * These cover the demo-account identity freeze, which is the invariant in this
 * service with a real consequence behind it. The credentials for
 * demo@lifequest.app are published in the repo and on the landing page, so
 * anyone on the internet can sign in as it. If a visitor could rename it or
 * change its email, the shared demo login would break permanently for everyone
 * else — and nothing would fail loudly, because the write would succeed.
 *
 * The service is exercised through a stub PrismaService rather than a database:
 * the freeze is a decision the service makes before it writes, so the
 * assertion worth making is about the `data` it hands Prisma.
 */
import { describe, expect, it, vi } from 'vitest';

import { UsersService } from './users.service.js';

type UpdateCall = { where: { id: string }; data: Record<string, unknown> };

/**
 * Minimal stand-in for the Prisma client. `getById` runs after every update, so
 * `findUnique` has to answer twice: once for the identity check, once for the
 * re-read, the second time with the relations `buildUserResponse` walks.
 */
const makePrisma = (user: { id: string; email: string; name: string; audience: string }) => {
  const updates: UpdateCall[] = [];
  const client: Record<string, unknown> = {
    updates,
    /* An audience change re-syncs the user's quests inside a transaction. The
       stub runs the callback against itself, which is faithful enough here:
       these tests are about what `update` decides, not about atomicity. */
    $transaction: async (fn: (tx: unknown) => Promise<unknown>) => fn(client),
    user: {
      findUnique: vi.fn(async () => ({
        ...user,
        tier: 'ADVENTURER',
        coins: 1000,
        lifetimeCoins: 1000,
        quests: [],
        redemptions: [],
      })),
      update: vi.fn(async (call: UpdateCall) => {
        updates.push(call);
        return user;
      }),
    },
    ritualLog: { findMany: vi.fn(async () => []) },
    questProgress: {
      findMany: vi.fn(async () => []),
      createMany: vi.fn(async () => ({})),
      deleteMany: vi.fn(async () => ({})),
    },
    quest: { findMany: vi.fn(async () => []) },
  };
  return client as typeof client & { updates: UpdateCall[] };
};

const scheduler = {
  ensureQuestsFresh: vi.fn(async () => undefined),
  ensureRewardsFresh: vi.fn(async () => undefined),
};

const build = (email: string) => {
  const prisma = makePrisma({ id: 'u1', email, name: 'Original Name', audience: 'LAID_OFF' });
  // The service's constructor signature is (prisma, scheduler); both are
  // structurally typed here rather than mocked through Nest's DI, because the
  // behaviour under test needs neither the container nor a database.
  const service = new UsersService(prisma as never, scheduler as never);
  return { service, prisma };
};

describe('UsersService.update — demo account identity freeze', () => {
  it('refuses to rename the shared demo account', async () => {
    const { service, prisma } = build('demo@lifequest.app');
    await service.update('u1', { name: 'Renamed By A Visitor' });
    expect(prisma.updates).toHaveLength(1);
    expect(prisma.updates[0].data).not.toHaveProperty('name');
  });

  it('refuses to change the shared demo account’s email', async () => {
    const { service, prisma } = build('demo@lifequest.app');
    await service.update('u1', { email: 'attacker@example.com' });
    expect(prisma.updates[0].data).not.toHaveProperty('email');
  });

  it('matches the demo account case-insensitively', async () => {
    // The stored address is compared lowercased on both sides. A row written as
    // Demo@LifeQuest.app must still be frozen, or the freeze is one INSERT away
    // from being bypassed.
    const { service, prisma } = build('Demo@LifeQuest.app');
    await service.update('u1', { name: 'Renamed', email: 'attacker@example.com' });
    expect(prisma.updates[0].data).not.toHaveProperty('name');
    expect(prisma.updates[0].data).not.toHaveProperty('email');
  });

  it('still lets the demo account switch audience — a non-destructive toggle', async () => {
    const { service, prisma } = build('demo@lifequest.app');
    await service.update('u1', { audience: 'RETIRED' });
    expect(prisma.updates[0].data.audience).toBe('RETIRED');
  });

  it('leaves ordinary accounts fully editable', async () => {
    const { service, prisma } = build('someone@example.com');
    await service.update('u1', { name: 'New Name', email: 'new@example.com' });
    expect(prisma.updates[0].data.name).toBe('New Name');
    expect(prisma.updates[0].data.email).toBe('new@example.com');
  });

  it('does not invent an audience when none was supplied', async () => {
    const { service, prisma } = build('someone@example.com');
    await service.update('u1', { name: 'New Name' });
    expect(prisma.updates[0].data.audience).toBe('LAID_OFF');
  });
});
