import { useState } from 'react';
import { PuzzlePiece, NotePencil, Lightning } from 'phosphor-react';
import { Button } from '@/components/ui/button';

const prompts = [
  {
    title: 'Quantify impact',
    body: 'Translate tasks into metrics that show retention, revenue, or efficiency gains.',
  },
  {
    title: 'Bridge employment gaps',
    body: 'Frame pauses as intentional growth, volunteer work, or skill sprints.',
  },
  {
    title: 'Lead with outcomes',
    body: 'Open each bullet with the result, then the action that produced it.',
  },
];

export const ResumeScreen = () => {
  const [draft, setDraft] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.35em] text-primary">
          <PuzzlePiece size={14} weight="fill" /> Resume forge
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Sharpen your story</h1>
        <p className="serif mt-1 text-lg text-muted-foreground">Turn quests into a résumé that lands interviews.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm">
          <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
            <NotePencil size={14} weight="fill" /> Brag bar
          </p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, 5000))}
            className="mt-3 min-h-[300px] w-full resize-y rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Document quantifiable outcomes, leadership stories, and skills you want to surface…"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              {draft.length} / 5000
            </span>
            <Button size="sm" className="gap-1.5">
              <Lightning size={15} weight="fill" /> Save draft
            </Button>
          </div>
        </section>

        <aside className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm">
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">Power prompts</p>
          <p className="serif mt-1 text-lg">Pair with your AI copilot.</p>
          <div className="mt-4 space-y-3">
            {prompts.map((p) => (
              <div key={p.title} className="rounded-xl border border-border/60 p-4 transition hover:border-primary/40 hover:shadow-glow">
                <p className="font-display text-sm font-semibold text-foreground">{p.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
