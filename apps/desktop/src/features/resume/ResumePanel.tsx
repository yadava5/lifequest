import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { resumePrompts } from '@/data/demo';
import { Button } from '@/components/ui/button';

export const ResumePanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Boost Lab</CardTitle>
        <p className="text-sm text-muted-foreground">Guided prompts until the AI assistant ships.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {resumePrompts.map((prompt) => (
          <div key={prompt.id} className="rounded-2xl border border-border/40 bg-background/50 p-4">
            <p className="text-sm font-semibold">{prompt.title}</p>
            <p className="text-sm text-muted-foreground">{prompt.body}</p>
          </div>
        ))}
        <Button variant="secondary">Open notes workspace</Button>
      </CardContent>
    </Card>
  );
};
