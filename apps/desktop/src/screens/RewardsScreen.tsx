import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJourneyStore } from '@/store/journeyStore';
import { useRewardsQuery } from '@/hooks/useRewardsQuery';
import { useRewardMutations } from '@/hooks/useRewardMutations';
import { useEffect, useMemo, useState } from 'react';

export const RewardsScreen = () => {
  const user = useJourneyStore((state) => state.user);
  const { data: rewards = [] } = useRewardsQuery();
  const { redeemReward } = useRewardMutations();
  const [activeRewardId, setActiveRewardId] = useState<string | null>(null);
  const [lastRedeemed, setLastRedeemed] = useState<string | null>(null);
  const redemptionHistory = user?.redemptions ?? [];

  const redeemedRewardIds = useMemo(
    () => new Set(redemptionHistory.map((entry) => entry.reward.id)),
    [redemptionHistory]
  );
  const availableRewards = rewards.filter((reward) => !redeemedRewardIds.has(reward.id));

  useEffect(() => {
    if (!lastRedeemed) return;
    const timeout = setTimeout(() => setLastRedeemed(null), 4000);
    return () => clearTimeout(timeout);
  }, [lastRedeemed]);

  if (!user) {
    return null;
  }

  const handleRedeem = (reward: (typeof rewards)[number]) => {
    setActiveRewardId(reward.id);
    redeemReward.mutate(reward, {
      onSuccess: () => setLastRedeemed(`Redeemed ${reward.name}`),
      onSettled: () => setActiveRewardId(null),
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardDescription>Rewards marketplace</CardDescription>
            <CardTitle>Redeem perks with purpose</CardTitle>
          </div>
          <Badge className="rounded-full bg-primary/10 text-primary">
            {user.coins} coins available
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {lastRedeemed && (
            <div className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900">
              {lastRedeemed}
            </div>
          )}
          {availableRewards.length === 0 && (
            <p className="md:col-span-2 text-sm text-muted-foreground">
              You’ve redeemed everything for now. Check back soon for new boosts.
            </p>
          )}
          {availableRewards.map((reward) => {
            const isRedeeming = activeRewardId === reward.id && redeemReward.isLoading;
            return (
              <Card key={reward.id} className="border border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-muted-foreground">{reward.cost} coins</p>
                  <Button
                    size="sm"
                    disabled={reward.cost > user.coins || isRedeeming}
                    onClick={() => handleRedeem(reward)}
                  >
                    {reward.cost > user.coins ? 'Keep earning' : isRedeeming ? 'Redeeming...' : 'Redeem'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent redemptions</CardTitle>
          <CardDescription>Stories from LifeQuest explorers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {redemptionHistory.length === 0 && (
            <p className="text-sm text-muted-foreground">Redeem your first reward to see it here.</p>
          )}
          {redemptionHistory.map((reward) => (
            <div key={reward.id} className="rounded-2xl border px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {new Date(reward.createdAt).toLocaleDateString()}
              </p>
              <p className="font-semibold">{reward.reward.name}</p>
              <p className="text-sm text-muted-foreground">{reward.reward.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
