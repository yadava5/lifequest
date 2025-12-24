import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

const router = Router();

const querySchema = z.object({
  audience: z.enum(['LAID_OFF', 'RETIRED', 'SHARED']).optional(),
});

router.get('/', async (req, res) => {
  const query = querySchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ message: 'Invalid audience filter' });
  }

  const where = query.data.audience
    ? {
        OR: [
          { audience: query.data.audience },
          { audience: 'SHARED' },
        ],
      }
    : undefined;

  const meetups = await prisma.meetup.findMany({
    where,
    orderBy: { startsAt: 'asc' },
  });

  return res.json(
    meetups.map((meetup) => ({
      id: meetup.id,
      title: meetup.title,
      location: meetup.location,
      startsAt: meetup.startsAt,
      audience: meetup.audience,
      description: meetup.description,
    }))
  );
});

export default router;
