import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, CheckCircle, Sword, Scroll, ClockCounterClockwise } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { useJourneyStore } from '@/store/journeyStore';
import { useQuestMutations } from '@/hooks/useQuestMutations';
import { questTheme } from '@/lib/questTheme';
import { celebrate } from '@/lib/celebrate';
import { cn } from '@/lib/utils';
import type { QuestProgress } from '@lifequest/schemas';

type View = 'active' | 'history';

const statusMeta: Record<QuestProgress['status'], { label: string; cls: string }> = {
  PENDING: { label: 'Ready', cls: 'border-border text-muted-foreground' },
  IN_PROGRESS: { label: 'In progress', cls: 'border-gold/40 bg-gold/10 text-gold' },
  COMPLETED: { label: 'Cleared', cls: 'border-teal/40 bg-teal/10 text-teal' },
};

export const QuestsScreen = () => {
  const quests = useJourneyStore((state) => state.user?.quests ?? []);
  const { startQuest, completeQuest } = useQuestMutations();
  const [view, setView] = useState<View>('active');

  const completed = quests
    .filter((q) => q.status === 'COMPLETED')
    .sort((a, b) => new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime());
  const inProgress = quests.filter((q) => q.status === 'IN_PROGRESS');
  const pending = quests.filter((q) => q.status === 'PENDING');
  const active = [...inProgress, ...pending];
  const pct = quests.length ? Math.round((completed.length / quests.length) * 100) : 0;

  const busy = startQuest.isLoading || completeQuest.isLoading;

  const handleStart = (q: QuestProgress) => {
    const id = q.quest.id ?? q.questId;
    if (id) startQuest.mutate(id);
  };
  const handleComplete = async (q: QuestProgress) => {
    const id = q.quest.id ?? q.questId;
    if (!id) return;
    await completeQuest.mutateAsync(id);
    celebrate();
  };

  const stats = [
    { label: 'Total quests', value: quests.length, ring: 'text-violet', chip: 'bg-violet/10 border-violet/25', icon: Scroll },
    { label: 'In progress', value: inProgress.length, ring: 'text-gold', chip: 'bg-gold/10 border-gold/25', icon: Sword },
    { label: 'Cleared', value: completed.length, ring: 'text-teal', chip: 'bg-teal/10 border-teal/25', icon: CheckCircle },
  ];

  const MissionCard = ({ q, i }: { q: QuestProgress; i: number }) => {
    const t = questTheme(q.quest.type);
    const meta = statusMeta[q.status];
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition',
          q.status !== 'COMPLETED' && t.glow,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-widest', t.bg, t.border, t.text)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', t.dot)} />
            {t.label}
          </span>
          <span className={cn('rounded-full border px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest', meta.cls)}>
            {meta.label}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold leading-tight">{q.quest.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{q.quest.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-gold">
            <Coins size={14} weight="fill" /> +{q.quest.reward}
          </span>
          <div className="flex gap-2">
            {q.status === 'PENDING' && (
              <Button size="sm" variant="outline" disabled={busy} onClick={() => handleStart(q)}>
                {startQuest.isLoading ? 'Starting…' : 'Accept'}
              </Button>
            )}
            {q.status !== 'COMPLETED' && (
              <Button size="sm" className="gap-1.5" disabled={busy} onClick={() => handleComplete(q)}>
                <CheckCircle size={15} weight="fill" /> Complete
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.35em] text-primary">
          <Scroll size={14} weight="fill" /> Quest log
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Track your missions</h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <span className={cn('grid h-9 w-9 place-items-center rounded-lg border', s.chip, s.ring)}>
                <s.icon size={18} weight="fill" />
              </span>
            </div>
            <p className="mt-3 font-display text-4xl font-bold tabular-nums">{s.value}</p>
          </div>
        ))}
      </section>

      {/* Journey completion bar */}
      <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
          <span>Journey completion</span>
          <span className="text-foreground">{pct}%</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full rounded-full grad-energy" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex gap-1 rounded-xl border border-border/70 bg-card/50 p-1">
        {([['active', 'Active', Sword], ['history', 'History', ClockCounterClockwise]] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 font-mono text-[0.62rem] uppercase tracking-widest transition',
              view === id ? 'bg-primary/15 text-primary shadow-glow' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon size={13} weight="fill" /> {label}
          </button>
        ))}
      </div>

      {view === 'active' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {active.length ? (
            active.map((q, i) => <MissionCard key={q.progressId} q={q} i={i} />)
          ) : (
            <p className="col-span-full rounded-2xl border border-border/70 bg-card/40 p-8 text-center text-muted-foreground">
              Every mission cleared. You’re a legend. 🏆
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {completed.length ? (
            completed.map((q, i) => (
              <motion.div
                key={q.progressId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card/60 px-5 py-4 backdrop-blur-sm"
              >
                <CheckCircle size={22} weight="fill" className="shrink-0 text-teal" />
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold">{q.quest.title}</p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    {q.completedAt ? new Date(q.completedAt).toLocaleString() : 'recently'}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-gold">
                  <Coins size={13} weight="fill" /> +{q.quest.reward}
                </span>
              </motion.div>
            ))
          ) : (
            <p className="rounded-2xl border border-border/70 bg-card/40 p-8 text-center text-muted-foreground">
              Complete a mission to start your legend.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
