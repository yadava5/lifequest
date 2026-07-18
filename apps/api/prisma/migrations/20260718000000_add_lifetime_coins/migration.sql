-- Tier/rank progress must be monotonic: it now derives from cumulative coins
-- ever earned, not the current spendable balance. Redeeming a reward decrements
-- `coins` but must never move a player backward on the tier track.

-- Adding a NOT NULL column with a constant default is a metadata-only change on
-- Postgres 11+ (no table rewrite); safe on the shared/co-tenant `lifequest` schema.
ALTER TABLE "User" ADD COLUMN "lifetimeCoins" INTEGER NOT NULL DEFAULT 0;

-- Backfill: lifetime earned = current balance + everything ever spent on
-- redemptions (each Redemption row is a past coin deduction). This reconstructs
-- true lifetime for existing users and guarantees lifetimeCoins >= coins.
UPDATE "User" u
SET "lifetimeCoins" = u."coins" + COALESCE((
  SELECT SUM(r."cost")
  FROM "Redemption" red
  JOIN "Reward" r ON r."id" = red."rewardId"
  WHERE red."userId" = u."id"
), 0);
