import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { demoUser } from '@/data/demo';

export const SettingsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Controls</CardTitle>
        <p className="text-sm text-muted-foreground">Fine-tune your focus and reset your world.</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="rounded-2xl border border-border/40 bg-background/60 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Current audience</p>
          <p className="text-base font-semibold text-foreground">{demoUser.audience.replace('_', ' ')}</p>
        </div>
        <Button variant="outline" className="w-full">
          Adjust player focus
        </Button>
        <Button className="w-full" variant="ghost">
          Reset progress
        </Button>
      </CardContent>
    </Card>
  );
};
