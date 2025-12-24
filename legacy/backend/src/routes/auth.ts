import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma.js';
import {
  buildUserResponse,
  bootstrapUserForAudience,
  userWithRelations,
} from '../services/userService.js';

const router = Router();

const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupBody = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  audience: z.enum(['LAID_OFF', 'RETIRED']),
});

router.post('/signup', async (req, res) => {
  const body = signupBody.safeParse(req.body);
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
  const hydrated = await prisma.user.findUnique({ where: { id: user.id }, include: userWithRelations });
  if (!hydrated) {
    return res.status(500).json({ message: 'Unable to load user after creation' });
  }

  return res.status(201).json(buildUserResponse(hydrated));
});

router.post('/login', async (req, res) => {
  const body = loginBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: body.error.issues });
  }

  const { email, password } = body.data;

  const existing = await prisma.user.findUnique({ where: { email }, include: userWithRelations });
  if (!existing) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, existing.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json(buildUserResponse(existing));
});

export default router;
