import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import {
  buildUserResponse,
  fetchHydratedUser,
  bootstrapUserForAudience,
  syncQuestsForAudience,
  userWithRelations,
} from '../services/userService.js';

const router = Router();

const userIdParam = z.object({
  id: z.string().min(1),
});

router.get('/:id', async (req, res) => {
  const params = userIdParam.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const user = await fetchHydratedUser(params.data.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
});

const createUserBody = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  audience: z.enum(['LAID_OFF', 'RETIRED']),
});

router.post('/', async (req, res) => {
  const body = createUserBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: body.error.issues });
  }

  const { name, email, password, audience } = body.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await bootstrapUserForAudience({ name, email, passwordHash, audience });

  return res.status(201).json({ id: user.id });
});

const updateUserBody = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  audience: z.enum(['LAID_OFF', 'RETIRED']).optional(),
});

router.patch('/:id', async (req, res) => {
  const params = userIdParam.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const body = updateUserBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: body.error.issues });
  }

  const current = await prisma.user.findUnique({ where: { id: params.data.id }, select: { id: true, audience: true } });
  if (!current) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { audience, ...rest } = body.data;

  await prisma.$transaction(async (tx) => {
    const updateData: Record<string, unknown> = {};

    if (typeof rest.name === 'string') {
      updateData.name = rest.name;
    }

    if (rest.email !== undefined) {
      updateData.email = rest.email;
    }

    if (audience) {
      updateData.audience = audience;
    }

    if (Object.keys(updateData).length > 0) {
      await tx.user.update({
        where: { id: current.id },
        data: updateData,
      });
    }

    if (audience && audience !== current.audience) {
      await tx.questProgress.deleteMany({ where: { userId: current.id } });

      const quests = await tx.quest.findMany({
        where: {
          OR: [{ audience }, { audience: 'SHARED' }],
        },
      });

      if (quests.length > 0) {
        await tx.questProgress.createMany({
          data: quests.map((quest) => ({ questId: quest.id, userId: current.id })),
        });
      }
    }
  });

  const updated = await prisma.user.findUnique({ where: { id: current.id }, include: userWithRelations });
  if (!updated) {
    return res.status(404).json({ message: 'User not found after update' });
  }

  return res.json(buildUserResponse(updated));
});

router.post('/:id/reset', async (req, res) => {
  const params = userIdParam.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const user = await prisma.user.findUnique({ where: { id: params.data.id } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await prisma.$transaction(async (tx) => {
    await tx.questProgress.deleteMany({ where: { userId: user.id } });
    await tx.redemption.deleteMany({ where: { userId: user.id } });
    await tx.user.update({ where: { id: user.id }, data: { coins: 1000 } });
  });

  await syncQuestsForAudience(user.id, user.audience as 'LAID_OFF' | 'RETIRED');

  return res.json({ message: 'Progress reset', coins: 1000 });
});

export default router;
