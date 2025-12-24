import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { demoQuests } from '@/data/demo';

export const QuestListPanel = () => {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Quest Log</CardTitle>
          <p className="text-sm text-muted-foreground">Track progress and celebrate each completion.</p>
        </div>
        <Badge variant="muted">{demoQuests.length} total</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {demoQuests.map((quest) => (
          <div
            key={quest.id}
            className="rounded-2xl border border-border/50 bg-background/50 p-4 transition hover:border-primary/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{quest.title}</p>
                <p className="text-sm text-muted-foreground">{quest.description}</p>
              </div>
              <Badge variant={quest.status === 'COMPLETED' ? 'success' : quest.status === 'IN_PROGRESS' ? 'warning' : 'muted'}>
                {quest.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>{quest.reward} coins</span>
              <Button size="sm" variant={quest.status === 'PENDING' ? 'default' : 'ghost'} disabled={quest.status === 'COMPLETED'}>
                {quest.status === 'COMPLETED' ? 'Claimed' : 'Mark complete'}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
