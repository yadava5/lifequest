if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

import { prisma } from '../dist/utils/prisma.js';
import {
  bootstrapUserForAudience,
  fetchHydratedUser,
  syncQuestsForAudience,
} from '../dist/services/userService.js';
import bcrypt from 'bcryptjs';

const log = (...args) => console.log('[backend-smoke]', ...args);

const run = async () => {
  const testEmail = `benchmark-${Date.now()}@lifequest.app`;
  log('Creating user via service layer');
  const user = await bootstrapUserForAudience({
    name: 'Benchmark Runner',
    audience: 'LAID_OFF',
    email: testEmail,
    passwordHash: await bcrypt.hash('benchmark', 10),
  });

  const hydratedInitial = await fetchHydratedUser(user.id);
  if (!hydratedInitial) {
    throw new Error('Hydrated user not found after bootstrap');
  }
  log('Initial quests', hydratedInitial.quests.length, 'rewards', hydratedInitial.redemptions?.length ?? 0);

  await prisma.user.update({
    where: { id: user.id },
    data: { name: 'Benchmark Runner Updated', audience: 'RETIRED' },
  });

  await syncQuestsForAudience(user.id, 'RETIRED');

  const hydratedAfterUpdate = await fetchHydratedUser(user.id);
  log('Updated audience', hydratedAfterUpdate?.audience, 'quests', hydratedAfterUpdate?.quests.length ?? 0);

  const rewards = await prisma.reward.findMany();
  log('Reward catalog size', rewards.length);

  await prisma.redemption.deleteMany({ where: { userId: user.id } });
  await prisma.questProgress.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });

  console.table({
    userId: user.id,
    audience: hydratedAfterUpdate?.audience,
    quests: hydratedAfterUpdate?.quests.length ?? 0,
    rewards: rewards.length,
  });
};

run()
  .then(async () => {
    await prisma.$disconnect();
    log('Smoke test passed');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('[backend-smoke] FAILED', error);
    await prisma.$disconnect();
    process.exit(1);
  });
