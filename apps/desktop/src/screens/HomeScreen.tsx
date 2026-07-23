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
  Gift,
  Trophy,
  ClockCounterClockwise,
  Confetti,
  Target,
} from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { useJourneyStore } from '@/store/journeyStore';
import { useToastStore } from '@/store/toastStore';
import { tierProgress } from '@/lib/tiers';
import { questTheme } from '@/lib/questTheme';
import { celebrate } from '@/lib/celebrate';
import { useQuestMutations } from '@/hooks/useQuestMutations';
import { useRitualMutations } from '@/hooks/useRitualMutations';
import { cn } from '@/lib/utils';
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

const toneChip: Record<string, string> = {
  teal: 'border-teal/25 bg-teal/10 text-teal',
  gold: 'border-gold/25 bg-gold/10 text-gold',
  sky: 'border-sky/25 bg-sky/10 text-sky',
  coral: 'border-coral/25 bg-coral/10 text-coral',
};

const timeAgo = (at: number) => {
  if (!at) return '';
  const s = Math.max(0, Math.floor((Date.now() - at) / 1000));
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
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
  const completedQuests = quests.filter((q) => q.status === 'COMPLETED');
  const completedCount = completedQuests.length;
  const inProgress = quests.find((q) => q.status === 'IN_PROGRESS');
  const nextQuest = quests.find((q) => q.status === 'PENDING');
  // Only an in-progress or pending quest can be "active". Never fall back to a
  // COMPLETED quest — doing so armed the Complete button on an already-done
  // mission, and completing it a second time returns a 409 (LQ-1).
  const activeQuest = inProgress ?? nextQuest;
  const openMissions = quests.filter((q) => q.status !== 'COMPLETED').slice(0, 4);
  const allCleared = quests.length > 0 && openMissions.length === 0;

  const busy = startQuest.isPending || completeQuest.isPending;

  const todaysRituals = (user.ritualsToday ?? []).filter(
    (e) => new Date(e.createdAt).toDateString() === new Date().toDateString(),
  );
  const loggedRituals = new Set(todaysRituals.map((r) => r.name));

  // A single, real "recent activity" stream — cleared missions, claimed rewards
  // and logged rituals, newest first. Keeps Mission Control feeling alive and
  // full even when every quest is done.
  const activity = [
    ...completedQuests.map((q) => ({
      id: `q-${q.progressId}`,
      icon: CheckCircle,
      tone: 'teal',
      label: `Cleared “${q.quest.title}”`,
      delta: `+${q.quest.reward}`,
      at: q.completedAt ? Date.parse(q.completedAt) : 0,
    })),
    ...(user.redemptions ?? []).map((r) => ({
      id: `r-${r.id}`,
      icon: Gift,
      tone: 'gold',
      label: `Claimed ${r.reward.name}`,
      delta: `−${r.reward.cost}`,
      at: Date.parse(r.createdAt),
    })),
    ...(user.ritualsToday ?? []).map((r) => ({
      id: `t-${r.id}`,
      icon: Sparkle,
      tone: 'sky',
      label: `Logged ${r.name}`,
      delta: null as string | null,
      at: Date.parse(r.createdAt),
    })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 5);

  const completeById = async (quest?: QuestProgress) => {
    if (!quest || quest.status === 'COMPLETED') return;
    const questId = quest.quest.id ?? quest.questId;
    if (!questId) return;
    try {
      if (quest.status === 'PENDING') await startQuest.mutateAsync(questId);
      await completeQuest.mutateAsync(questId);
      celebrate();
    } catch {
      // The mutation surfaced a friendly toast already; swallow here so the
      // rejection never becomes an uncaught page error, and skip the confetti.
    }
  };

  const handleStartQuest = async () => {
    if (!nextQuest) return;
    const questId = nextQuest.quest.id ?? nextQuest.questId;
    if (!questId) return;
    try {
      await startQuest.mutateAsync(questId);
    } catch {
      // toast surfaced by the mutation
    }
  };

  const handleRitualLog = async (ritual: string) => {
    if (loggedRituals.has(ritual)) return;
    setActiveRitual(ritual);
    try {
      await logRitual.mutateAsync(ritual);
    } catch {
      useToastStore.getState().pushToast('Could not log that ritual. Try again.', 'error');
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
            <Button
              size="lg"
              className="gap-2"
              onClick={() => completeById(activeQuest)}
              disabled={!activeQuest || busy}
            >
              <Lightning size={18} weight="fill" />
              {busy ? 'Logging win…' : activeQuest ? 'Log today’s win' : 'All caught up'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={handleStartQuest}
              disabled={!nextQuest || startQuest.isPending}
            >
              Start a quest <ArrowRight size={16} />
            </Button>
          </div>
        </div>
        <Sparkle
          size={220}
          weight="thin"
          className="pointer-events-none absolute right-0 -top-10 text-primary/10 animate-float sm:-right-10"
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
      <section className="grid gap-6 lg:grid-cols-3">
        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
              Active mission
            </p>
            <Link
              to="/quests"
              className="-my-2 inline-flex min-h-11 items-center font-mono text-[0.62rem] uppercase tracking-widest text-primary hover:underline"
            >
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
            <div className="mt-4 flex flex-col items-start gap-4 rounded-xl border border-teal/25 bg-teal/[0.06] p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-teal/30 bg-teal/10 text-teal">
                <Confetti size={24} weight="fill" />
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold">
                  {allCleared ? 'Every mission cleared.' : 'No missions lined up.'}
                </h3>
                <p className="mt-1 max-w-md text-muted-foreground">
                  {allCleared
                    ? 'Legendary run. Spend your hard-won coins, or reset to line up a fresh set of missions.'
                    : 'Reset your progress in Settings to line up a fresh set of missions for your focus.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="gap-2">
                  <Link to="/rewards">
                    <Gift size={16} weight="fill" /> Visit the Reward Vault
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/settings">
                    <Target size={16} weight="fill" /> Reset progress
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          custom={5}
          variants={fade}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm"
        >
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
            Daily rituals
          </p>
          <p className="serif mt-1 text-lg text-foreground">Small moves, big momentum.</p>
          <div className="mt-4 space-y-2.5">
            {rituals.map((ritual) => {
              const isLogged = loggedRituals.has(ritual);
              const isProcessing = activeRitual === ritual && logRitual.isPending;
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
          <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
            {loggedRituals.size}/{rituals.length} logged today
          </p>
        </motion.div>
      </section>

      {/* Open missions + recent activity */}
      <section className="grid gap-6 lg:grid-cols-3">
        <motion.div custom={6} variants={fade} initial="hidden" animate="show" className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Open missions</h2>
            <Link
              to="/quests"
              className="-my-2 inline-flex min-h-11 items-center font-mono text-[0.62rem] uppercase tracking-widest text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          {openMissions.length ? (
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
          ) : (
            <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 bg-card/40 p-8 text-center">
              <Trophy size={28} weight="fill" className="text-gold" />
              <p className="font-display font-semibold">You’ve cleared every open mission.</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Fresh quests appear here once you reset your progress or new mission lines drop.
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          custom={7}
          variants={fade}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <ClockCounterClockwise size={15} weight="fill" className="text-primary" />
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
              Recent activity
            </p>
          </div>
          {activity.length ? (
            <ul className="mt-4 space-y-3.5">
              {activity.map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg border', toneChip[a.tone])}>
                    <a.icon size={15} weight="fill" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{a.label}</p>
                    <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
                      {timeAgo(a.at)}
                    </p>
                  </div>
                  {a.delta && (
                    <span className="shrink-0 font-mono text-xs font-semibold text-gold tabular-nums">
                      {a.delta}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Your wins show up here as you clear missions and claim rewards.
            </p>
          )}
        </motion.div>
      </section>
    </div>
  );
};
