/**
 * Tier ladder — a player's tier and journey progress derive from Quest
 * Coins earned, so advancement feels continuous and game-like.
 */
export type Tier = {
  name: string;
  at: number;
  blurb: string;
};

export const TIERS: Tier[] = [
  { name: 'EXPLORER', at: 0, blurb: 'Every journey starts with a single step.' },
  { name: 'ADVENTURER', at: 500, blurb: 'Momentum is yours. Keep the streak alive.' },
  { name: 'TRAILBLAZER', at: 1800, blurb: 'You lead where others follow.' },
  { name: 'LUMINARY', at: 4000, blurb: 'A beacon for the whole guild.' },
];

export function tierProgress(coins: number): {
  tier: string;
  next: string | null;
  pct: number;
  toNext: number;
  blurb: string;
} {
  let idx = 0;
  for (let i = 0; i < TIERS.length; i += 1) {
    if (coins >= TIERS[i].at) idx = i;
  }
  const current = TIERS[idx];
  const next = TIERS[idx + 1];
  if (!next) {
    return { tier: current.name, next: null, pct: 100, toNext: 0, blurb: current.blurb };
  }
  const span = next.at - current.at;
  const pct = Math.max(0, Math.min(100, Math.round(((coins - current.at) / span) * 100)));
  return { tier: current.name, next: next.name, pct, toNext: next.at - coins, blurb: current.blurb };
}
