import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { demoUser, demoQuests } from '@/data/demo';
import { Trophy, Target, Coins } from 'lucide-react';

const statCards = [
  {
    label: 'Quest Coins',
    value: `${demoUser.coins.toLocaleString()}`,
    icon: Coins,
  },
  {
    label: 'Current Tier',
    value: demoUser.tier,
    icon: Trophy,
  },
  {
    label: 'Active Quests',
    value: demoQuests.filter((quest) => quest.status !== 'COMPLETED').length,
    icon: Target,
  },
];

export const HomeDashboard = () => {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {statCards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>{card.label}</CardDescription>
            <card.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Next adventures</CardTitle>
          <CardDescription>Personalized missions to keep momentum high.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {demoQuests.slice(0, 3).map((quest) => (
            <div key={quest.id} className="rounded-2xl border border-border/50 bg-background/60 p-4">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>{quest.title}</span>
                <Badge variant={quest.status === 'COMPLETED' ? 'success' : quest.status === 'IN_PROGRESS' ? 'warning' : 'muted'}>
                  {quest.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{quest.description}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">Reward · {quest.reward} coins</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
