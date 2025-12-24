import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

const router = Router();

const listQuerySchema = z.object({
  userId: z.string().min(1),
});

router.get('/', async (req, res) => {
  const query = listQuerySchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ message: 'userId query parameter is required' });
  }

  const { userId } = query.data;

  const progresses = await prisma.questProgress.findMany({
    where: {
      userId,
    },
    include: {
      quest: true,
    },
    orderBy: {
      quest: { createdAt: 'asc' },
    },
  });

  return res.json(
    progresses.map((progress) => ({
      id: progress.id,
      status: progress.status,
      completedAt: progress.completedAt,
      quest: {
        id: progress.quest.id,
        title: progress.quest.title,
        description: progress.quest.description,
        audience: progress.quest.audience,
        type: progress.quest.type,
        reward: progress.quest.reward,
      },
    }))
  );
});

const completeParamsSchema = z.object({
  questId: z.string().min(1),
});

const completeBodySchema = z.object({
  userId: z.string().min(1),
});

router.post('/:questId/complete', async (req, res) => {
  const params = completeParamsSchema.safeParse(req.params);
  const body = completeBodySchema.safeParse(req.body);

  if (!params.success || !body.success) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const { questId } = params.data;
  const { userId } = body.data;

  const progress = await prisma.questProgress.findFirst({
    where: {
      questId,
      userId,
    },
    include: {
      quest: true,
    },
  });

  if (!progress) {
    return res.status(404).json({ message: 'Quest progress not found' });
  }

  if (progress.status === 'COMPLETED') {
    return res.status(409).json({ message: 'Quest already completed' });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedProgress = await tx.questProgress.update({
      where: { id: progress.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        coins: { increment: progress.quest.reward },
      },
      select: { coins: true },
    });

    return { updatedProgress, updatedUser };
  });

  return res.json({
    id: updated.updatedProgress.id,
    status: 'COMPLETED',
    completedAt: updated.updatedProgress.completedAt,
    coins: updated.updatedUser.coins,
  });
});

export default router;
