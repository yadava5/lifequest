import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ResumeScreen = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Resume boost lab</CardTitle>
          <CardDescription>Capture brag bar bullets and iteration notes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            className="min-h-[280px] w-full rounded-2xl border px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="Document quantifiable outcomes, leadership stories, and skills you want to surface."
          />
          <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
            <span>5000 characters max</span>
            <Button size="sm">Save draft</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Prompts & nudges</CardTitle>
          <CardDescription>Use these with your favorite AI copilot.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="rounded-2xl border px-4 py-3">
            <p className="font-semibold text-foreground">Quantify impact</p>
            <p>Translate tasks into metrics that show retention, revenue, or efficiency gains.</p>
          </div>
          <div className="rounded-2xl border px-4 py-3">
            <p className="font-semibold text-foreground">Bridge employment gaps</p>
            <p>Frame pauses as intentional growth, volunteer work, or skill sprints.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
