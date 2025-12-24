import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { demoRewards, demoUser } from '@/data/demo';

export const RewardsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards Store</CardTitle>
        <p className="text-sm text-muted-foreground">{demoUser.coins} coins available</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {demoRewards.map((reward) => (
          <div key={reward.id} className="rounded-2xl border border-border/40 bg-background/60 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{reward.name}</p>
                <p className="text-sm text-muted-foreground">{reward.description}</p>
              </div>
              <span className="text-sm font-medium text-primary">{reward.cost} coins</span>
            </div>
            <Button className="mt-3 w-full" disabled={reward.cost > demoUser.coins}>
              {reward.cost > demoUser.coins ? 'Keep earning' : 'Redeem'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
