import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  const rewards = await prisma.reward.findMany({
    orderBy: { cost: 'asc' },
  });

  return res.json(
    rewards.map((reward) => ({
      id: reward.id,
      name: reward.name,
      description: reward.description,
      cost: reward.cost,
    }))
  );
});

const redeemParamsSchema = z.object({
  rewardId: z.string().min(1),
});

const redeemBodySchema = z.object({
  userId: z.string().min(1),
});

router.post('/:rewardId/redeem', async (req, res) => {
  const params = redeemParamsSchema.safeParse(req.params);
  const body = redeemBodySchema.safeParse(req.body);

  if (!params.success || !body.success) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const { rewardId } = params.data;
  const { userId } = body.data;

  const [user, reward] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.reward.findUnique({ where: { id: rewardId } }),
  ]);

  if (!user || !reward) {
    return res.status(404).json({ message: 'User or reward not found' });
  }

  if (user.coins < reward.cost) {
    return res.status(400).json({ message: 'Insufficient coins' });
  }

  const redemption = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { coins: { decrement: reward.cost } },
      select: { coins: true },
    });

    const record = await tx.redemption.create({
      data: {
        userId,
        rewardId,
      },
      include: {
        reward: true,
      },
    });

    return { record, updatedUser };
  });

  return res.status(201).json({
    id: redemption.record.id,
    createdAt: redemption.record.createdAt,
    remainingCoins: redemption.updatedUser.coins,
    reward: {
      id: reward.id,
      name: reward.name,
      description: reward.description,
      cost: reward.cost,
    },
  });
});

export default router;
