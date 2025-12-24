import { z } from 'zod';

export const audienceEnum = z.enum(['LAID_OFF', 'RETIRED', 'SHARED']);
export const questStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);
export const questTypeEnum = z.enum(['TASK', 'COMMUNITY', 'WELLNESS']);
export const redemptionStatusEnum = z.enum(['PENDING', 'COMPLETED', 'CANCELLED']);

export const sessionSchema = z.object({
  id: z.string(),
  expiresAt: z.string(),
});

export const rewardSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  cost: z.number(),
});

export const redemptionSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  reward: rewardSchema,
});

export const ritualLogSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
});

export const questSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  audience: audienceEnum,
  type: questTypeEnum,
  reward: z.number(),
});

export const questProgressSchema = z.object({
  progressId: z.string(),
  questId: z.string(),
  status: questStatusEnum,
  completedAt: z.string().nullable(),
  quest: questSchema,
});

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  audience: audienceEnum,
  tier: z.string().optional().default('EXPLORER'),
  coins: z.number(),
  quests: z.array(questProgressSchema),
  redemptions: z.array(redemptionSchema),
  ritualsToday: z.array(ritualLogSchema),
});

const audienceSelectionEnum = z.enum(['LAID_OFF', 'RETIRED']);

export const authSignupPayloadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Provide a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  audience: audienceSelectionEnum,
});

export const authLoginPayloadSchema = z.object({
  email: z.string().email('Provide a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const authResponseSchema = z.object({
  session: sessionSchema,
  user: userResponseSchema,
});

export const updateUserPayloadSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  audience: audienceSelectionEnum.optional(),
});

export const logRitualPayloadSchema = z.object({
  ritual: z.string().min(2).max(120),
});

export type Audience = z.infer<typeof audienceEnum>;
export type QuestStatus = z.infer<typeof questStatusEnum>;
export type QuestType = z.infer<typeof questTypeEnum>;
export type SessionPayload = z.infer<typeof sessionSchema>;
export type Reward = z.infer<typeof rewardSchema>;
export type Redemption = z.infer<typeof redemptionSchema>;
export type Quest = z.infer<typeof questSchema>;
export type QuestProgress = z.infer<typeof questProgressSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type RitualLog = z.infer<typeof ritualLogSchema>;
export type AuthSignupPayload = z.infer<typeof authSignupPayloadSchema>;
export type AuthLoginPayload = z.infer<typeof authLoginPayloadSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UpdateUserPayload = z.infer<typeof updateUserPayloadSchema>;
export type LogRitualPayload = z.infer<typeof logRitualPayloadSchema>;
