const tierLadder = [
  { min: 1800, tier: 'Trailblazer', hint: 'Top tier unlocked' },
  { min: 1200, tier: 'Adventurer', hint: 'Earn 600 more coins to reach Trailblazer' },
  { min: 800, tier: 'Pathfinder', hint: 'Earn 400 more coins to reach Adventurer' },
  { min: 0, tier: 'Explorer', hint: 'Earn 800 coins to reach Pathfinder' },
];

export const resolveTierHint = (coins: number) => {
  const stage = tierLadder.find((entry) => coins >= entry.min) ?? tierLadder.at(-1)!;
  if (stage.tier === 'Trailblazer') {
    return stage.hint;
  }
  const higherStage = tierLadder.find((entry) => entry.min > stage.min);
  return higherStage ? `${higherStage.min - coins} coins to reach ${higherStage.tier}` : stage.hint;
};
