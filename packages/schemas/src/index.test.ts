/**
 * Contract tests for the shared schemas.
 *
 * This package is the boundary between the API and every client, and it had no
 * tests — the repository's only `test` script was `vitest --passWithNoTests`
 * over zero test files, which is a green check that asserts nothing.
 *
 * Schemas are the right place to start rather than an arbitrary place to start.
 * They are pure, they need no database or running server, and they are exactly
 * the kind of code that breaks *silently*: a loosened field or a widened enum
 * does not throw, it just starts accepting data the rest of the system was
 * written on the assumption it would never see.
 *
 * These test the properties that would be invisible in review, not that zod
 * works.
 */

import { describe, expect, it } from 'vitest';

import {
  audienceEnum,
  authLoginPayloadSchema,
  authSignupPayloadSchema,
  logRitualPayloadSchema,
  questProgressSchema,
  questSchema,
  updateUserPayloadSchema,
  userResponseSchema,
} from './index';

describe('audience: what a user may choose vs what a quest may target', () => {
  /**
   * The load-bearing asymmetry in this file. `audienceEnum` carries three
   * values and signup accepts only two — SHARED describes a quest visible to
   * everyone, and was never a thing a person signs up as.
   *
   * Nothing in the source states that, and the two enums sit fifty lines apart.
   * Anyone "tidying up the duplication" by pointing signup at `audienceEnum`
   * would let users register as SHARED, and no type error would appear.
   */
  it('accepts SHARED as a quest audience', () => {
    expect(audienceEnum.safeParse('SHARED').success).toBe(true);
  });

  it('refuses SHARED as a signup choice', () => {
    const result = authSignupPayloadSchema.safeParse({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'hunter2',
      audience: 'SHARED',
    });
    expect(result.success).toBe(false);
  });

  it('refuses SHARED when updating a profile too', () => {
    expect(updateUserPayloadSchema.safeParse({ audience: 'SHARED' }).success).toBe(false);
    expect(updateUserPayloadSchema.safeParse({ audience: 'RETIRED' }).success).toBe(true);
  });

  it('accepts both real signup audiences', () => {
    for (const audience of ['LAID_OFF', 'RETIRED'] as const) {
      const result = authSignupPayloadSchema.safeParse({
        name: 'Ada',
        email: 'ada@example.com',
        password: 'hunter2',
        audience,
      });
      expect(result.success).toBe(true);
    }
  });
});

describe('credential rules', () => {
  const valid = {
    name: 'Ada',
    email: 'ada@example.com',
    password: 'hunter2',
    audience: 'RETIRED' as const,
  };

  it('enforces the six-character password minimum', () => {
    expect(authSignupPayloadSchema.safeParse({ ...valid, password: '12345' }).success).toBe(false);
    expect(authSignupPayloadSchema.safeParse({ ...valid, password: '123456' }).success).toBe(true);
  });

  it('enforces the two-character name minimum', () => {
    expect(authSignupPayloadSchema.safeParse({ ...valid, name: 'A' }).success).toBe(false);
  });

  it('rejects a malformed email', () => {
    expect(authSignupPayloadSchema.safeParse({ ...valid, email: 'ada@' }).success).toBe(false);
  });

  it('holds login to the same password floor as signup', () => {
    // If these two ever drift, an account can be created that cannot log in.
    expect(
      authLoginPayloadSchema.safeParse({ email: 'a@b.co', password: '12345' }).success,
    ).toBe(false);
    expect(
      authLoginPayloadSchema.safeParse({ email: 'a@b.co', password: '123456' }).success,
    ).toBe(true);
  });
});

describe('userResponseSchema: the defaults clients rely on', () => {
  const base = {
    id: 'u1',
    name: 'Ada',
    email: 'ada@example.com',
    audience: 'RETIRED' as const,
    coins: 10,
    quests: [],
    redemptions: [],
    ritualsToday: [],
  };

  it("supplies tier 'EXPLORER' when the server omits it", () => {
    const parsed = userResponseSchema.parse(base);
    expect(parsed.tier).toBe('EXPLORER');
  });

  it('accepts a payload with no lifetimeCoins, for pre-migration data', () => {
    // Documented in the schema as backward compatibility. Pinned here because
    // making it required would break older payloads at runtime, not at compile
    // time.
    expect(userResponseSchema.safeParse(base).success).toBe(true);
  });

  it('refuses negative or fractional lifetimeCoins', () => {
    // It is a cumulative total that drives tier progress, so it must never
    // regress below zero or arrive as a fraction.
    expect(userResponseSchema.safeParse({ ...base, lifetimeCoins: -1 }).success).toBe(false);
    expect(userResponseSchema.safeParse({ ...base, lifetimeCoins: 1.5 }).success).toBe(false);
    expect(userResponseSchema.safeParse({ ...base, lifetimeCoins: 0 }).success).toBe(true);
  });
});

describe('quest progress', () => {
  const quest = {
    id: 'q1',
    title: 'Walk',
    description: 'A walk',
    audience: 'SHARED' as const,
    type: 'WELLNESS' as const,
    reward: 5,
  };

  it('accepts a nested quest', () => {
    expect(questSchema.safeParse(quest).success).toBe(true);
  });

  it('allows completedAt to be null while a quest is unfinished', () => {
    const result = questProgressSchema.safeParse({
      progressId: 'p1',
      questId: 'q1',
      status: 'IN_PROGRESS',
      completedAt: null,
      quest,
    });
    expect(result.success).toBe(true);
  });

  it('requires completedAt to be present, even as null', () => {
    // Nullable, not optional. Omitting the key is a different bug from an
    // incomplete quest, and the schema distinguishes them.
    const result = questProgressSchema.safeParse({
      progressId: 'p1',
      questId: 'q1',
      status: 'PENDING',
      quest,
    });
    expect(result.success).toBe(false);
  });

  it('refuses an unknown status', () => {
    const result = questProgressSchema.safeParse({
      progressId: 'p1',
      questId: 'q1',
      status: 'ABANDONED',
      completedAt: null,
      quest,
    });
    expect(result.success).toBe(false);
  });
});

describe('logRitualPayloadSchema', () => {
  it('enforces both ends of the length range', () => {
    expect(logRitualPayloadSchema.safeParse({ ritual: 'a' }).success).toBe(false);
    expect(logRitualPayloadSchema.safeParse({ ritual: 'ab' }).success).toBe(true);
    expect(logRitualPayloadSchema.safeParse({ ritual: 'x'.repeat(120) }).success).toBe(true);
    expect(logRitualPayloadSchema.safeParse({ ritual: 'x'.repeat(121) }).success).toBe(false);
  });
});
