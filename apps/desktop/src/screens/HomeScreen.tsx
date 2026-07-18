import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Coins,
  Medal,
  CheckCircle,
  Sparkle,
  Lightning,
  Compass,
} from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { useJourneyStore } from '@/store/journeyStore';
import { tierProgress } from '@/lib/tiers';
import { questTheme } from '@/lib/questTheme';
import { celebrate } from '@/lib/celebrate';
import { useQuestMutations } from '@/hooks/useQuestMutations';
import { useRitualMutations } from '@/hooks/useRitualMutations';
import type { QuestProgress } from '@lifequest/schemas';

const rituals = ['Mindful break', 'Inbox zero sprint', 'Share a win'];

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export const HomeScreen = () => {
  const user = useJourneyStore((state) => state.user);
  const { completeQuest, startQuest } = useQuestMutations();
  const { logRitual } = useRitualMutations();
  const [activeRitual, setActiveRitual] = useState<string | null>(null);

  if (!user) return null;

  const quests = user.quests;
  const coins = user.coins;
  // Journey/tier progress reads lifetime earned so it never drops when the
  // player redeems a reward; `coins` remains the spendable balance shown below.
  const lifetimeCoins = user.lifetimeCoins ?? user.coins;
  const journey = tierProgress(lifetimeCoins);
  const completedCount = quests.filter((q) => q.status === 'COMPLETED').length;
  const inProgress = quests.find((q) => q.status === 'IN_PROGRESS');
  const nextQuest = quests.find((q) => q.status === 'PENDING');
  const activeQuest = inProgress ?? nextQuest ?? quests[0];
  const openMissions = quests.filter((q) => q.status !== 'COMPLETED').slice(0, 4);

  const busy = startQuest.isLoading || completeQuest.isLoading;

  const todaysRituals = (user.ritualsToday ?? []).filter(
    (e) => new Date(e.createdAt).toDateString() === new Date().toDateString(),
  );
  const loggedRituals = new Set(todaysRituals.map((r) => r.name));

  const completeById = async (quest?: QuestProgress) => {
    if (!quest) return;
    const questId = quest.quest.id ?? quest.questId;
    if (!questId) return;
    if (quest.status === 'PENDING') await startQuest.mutateAsync(questId);
    await completeQuest.mutateAsync(questId);
    celebrate();
  };

  const handleStartQuest = async () => {
    if (!nextQuest) return;
    const questId = nextQuest.quest.id ?? nextQuest.questId;
    if (questId) await startQuest.mutateAsync(questId);
  };

  const handleRitualLog = async (ritual: string) => {
    if (loggedRituals.has(ritual)) return;
    setActiveRitual(ritual);
    try {
      await logRitual.mutateAsync(ritual);
    } finally {
      setActiveRitual(null);
    }
  };

  const stats = [
    {
      label: 'Quest Coins',
      value: coins.toLocaleString(),
      hint: 'Spendable balance',
      icon: Coins,
      ring: 'text-gold',
      chip: 'bg-gold/10 border-gold/25',
    },
    {
      label: `${journey.tier} tier`,
      value: journey.next ? `${journey.pct}%` : 'MAX',
      hint: journey.next ? `${journey.toNext} coins to ${journey.next}` : 'Peak reached',
      icon: Medal,
      ring: 'text-coral',
      chip: 'bg-coral/10 border-coral/25',
    },
    {
      label: 'Missions cleared',
      value: `${completedCount}/${quests.length}`,
      hint: 'Lifetime quests',
      icon: CheckCircle,
      ring: 'text-teal',
      chip: 'bg-teal/10 border-teal/25',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero — narrative mission control */}
      <motion.section
        custom={0}
        variants={fade}
        initial="hidden"
        animate="show"
        className="feature-frame relative overflow-hidden rounded-2xl p-6 sm:p-8"
      >
        <div className="relative z-10 max-w-2xl">
          <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.35em] text-primary">
            <Compass size={14} weight="fill" /> Mission control
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome back,{' '}
            <span className="text-coral">{user.name.split(' ')[0]}</span>.
          </h1>
          <p className="serif mt-2 text-xl text-muted-foreground">{journey.blurb}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" className="gap-2" onClick={() => completeById(activeQuest)} disabled={!activeQuest || busy}>
              <Lightning size={18} weight="fill" />
              {busy ? 'Logging win…' : 'Log today’s win'}
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={handleStartQuest} disabled={!nextQuest || startQuest.isLoading}>
              Start a quest <ArrowRight size={16} />
            </Button>
          </div>
        </div>
        <Sparkle
          size={220}
          weight="thin"
          className="pointer-events-none absolute -right-10 -top-10 text-primary/10 animate-float"
        />
      </motion.section>

      {/* Stat trio */}
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i + 1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
              <span className={`grid h-9 w-9 place-items-center rounded-lg border ${s.chip} ${s.ring}`}>
                <s.icon size={18} weight="fill" />
              </span>
            </div>
            <p className="mt-3 font-display text-4xl font-bold tabular-nums">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
          </motion.div>
        ))}
      </section>

      {/* Active mission + rituals */}
      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <motion.div custom={4} variants={fade} initial="hidden" animate="show" className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
              Active mission
            </p>
            <Link to="/quests" className="font-mono text-[0.62rem] uppercase tracking-widest text-primary hover:underline">
              Full quest log →
            </Link>
          </div>
          {activeQuest ? (
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest ${questTheme(activeQuest.quest.type).bg} ${questTheme(activeQuest.quest.type).border} ${questTheme(activeQuest.quest.type).text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${questTheme(activeQuest.quest.type).dot}`} />
                  {questTheme(activeQuest.quest.type).label}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[0.62rem] uppercase tracking-widest text-gold">
                  <Coins size={13} weight="fill" /> +{activeQuest.quest.reward}
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold">{activeQuest.quest.title}</h3>
              <p className="mt-1 text-muted-foreground">{activeQuest.quest.description}</p>
              <Button className="mt-5 gap-2" onClick={() => completeById(activeQuest)} disabled={busy}>
                <CheckCircle size={18} weight="fill" />
                {busy ? 'Completing…' : 'Complete mission'}
              </Button>
            </div>
          ) : (
            <p className="mt-6 text-muted-foreground">Every mission cleared. Legendary. 🎉</p>
          )}
        </motion.div>

        <motion.div custom={5} variants={fade} initial="hidden" animate="show" className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm">
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
            Daily rituals
          </p>
          <p className="serif mt-1 text-lg text-foreground">Small moves, big momentum.</p>
          <div className="mt-4 space-y-2.5">
            {rituals.map((ritual) => {
              const isLogged = loggedRituals.has(ritual);
              const isProcessing = activeRitual === ritual && logRitual.isLoading;
              return (
                <button
                  key={ritual}
                  onClick={() => handleRitualLog(ritual)}
                  disabled={isLogged || isProcessing}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                    isLogged
                      ? 'border-teal/30 bg-teal/10 text-foreground'
                      : 'border-border/70 hover:border-primary/40 hover:bg-secondary'
                  }`}
                >
                  <span className="font-medium">{ritual}</span>
                  {isLogged ? (
                    <CheckCircle size={18} weight="fill" className="text-teal" />
                  ) : (
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                      {isProcessing ? '…' : 'log'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Open missions */}
      <motion.section custom={6} variants={fade} initial="hidden" animate="show">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Open missions</h2>
          <Link to="/quests" className="font-mono text-[0.62rem] uppercase tracking-widest text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {openMissions.map((progress) => {
            const t = questTheme(progress.quest.type);
            return (
              <Link
                key={progress.progressId}
                to="/quests"
                className={`group rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition ${t.glow}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-widest ${t.bg} ${t.border} ${t.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
                    {t.label}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-widest text-gold">
                    <Coins size={12} weight="fill" /> +{progress.quest.reward}
                  </span>
                </div>
                <h3 className="mt-3 font-display font-semibold">{progress.quest.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{progress.quest.description}</p>
              </Link>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
};
