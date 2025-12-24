import { demoMeetups } from '@/data/demo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, Medal, Sparkle, TrendUp, House, Files, Target, UsersThree, PuzzlePiece, GearSix } from 'phosphor-react';
import { Link } from 'react-router-dom';
import { useJourneyStore } from '@/store/journeyStore';
import { resolveTierHint } from '@/lib/tier';
import { useQuestMutations } from '@/hooks/useQuestMutations';
import { useRitualMutations } from '@/hooks/useRitualMutations';
import type { QuestProgress } from '@lifequest/schemas';
import { useState } from 'react';

const rituals = ['Mindful break', 'Inbox zero sprint', 'Share a win'];

const coreSections = [
  { label: 'Overview', description: 'Daily pulse on XP, rituals, and coins.', icon: House, to: '/' },
  { label: 'Quest Log', description: 'Prioritize missions and view history.', icon: Files, to: '/quests' },
  { label: 'Rewards', description: 'Redeem coins for boosts and perks.', icon: Target, to: '/rewards' },
  { label: 'Community', description: 'Coordinate rituals and meetups.', icon: UsersThree, to: '/community' },
  { label: 'Resume Boost', description: 'Ship polished wins to your CV.', icon: PuzzlePiece, to: '/resume' },
  { label: 'Settings', description: 'Personalize themes, alerts, privacy.', icon: GearSix, to: '/settings' },
];

export const HomeScreen = () => {
  const user = useJourneyStore((state) => state.user);
  const lastEvent = useJourneyStore((state) => state.lastEvent);
  const { completeQuest, startQuest } = useQuestMutations();
  const { logRitual } = useRitualMutations();
  const [activeRitual, setActiveRitual] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const quests = user.quests;
  const coins = user.coins;
  const tier = user.tier ?? 'Explorer';
  const tierHint = resolveTierHint(coins);
  const completedCount = quests.filter((quest) => quest.status === 'COMPLETED').length;
  const inProgress = quests.find((quest) => quest.status === 'IN_PROGRESS');
  const nextQuest = quests.find((quest) => quest.status === 'PENDING');
  const prioritizedQuests = quests.filter((quest) => quest.status !== 'COMPLETED').slice(0, 3);
  const quickStats = [
    { label: 'Quest Coins', value: coins.toLocaleString(), hint: 'Spendable balance', icon: Sparkle },
    { label: 'Tier Progress', value: tier, hint: tierHint, icon: Medal },
    { label: 'Quests completed', value: `${completedCount}/${quests.length}`, hint: 'Lifetime quests', icon: TrendUp },
  ];
  const todaysRituals = (user.ritualsToday ?? []).filter((entry) => {
    const entryDate = new Date(entry.createdAt);
    const today = new Date();
    return entryDate.toDateString() === today.toDateString();
  });
  const loggedRituals = new Set(todaysRituals.map((ritual) => ritual.name));
  const completedRituals = rituals.filter((ritual) => loggedRituals.has(ritual)).length;
  const questProgressPercent = quests.length ? Math.round((completedCount / quests.length) * 100) : 0;
  const activeQuest = inProgress ?? nextQuest ?? quests[0];

  const questActionBusy = startQuest.isLoading || completeQuest.isLoading;

  const ensureQuestActive = async (quest: QuestProgress) => {
    const questId = quest.quest.id ?? quest.questId;
    if (!questId) return;
    if (quest.status === 'PENDING') {
      await startQuest.mutateAsync(questId);
    }
  };

  const handleLogWin = async () => {
    const targetQuest = inProgress ?? nextQuest;
    if (!targetQuest) return;
    const questId = targetQuest.quest.id ?? targetQuest.questId;
    if (!questId) return;
    await ensureQuestActive(targetQuest);
    await completeQuest.mutateAsync(questId);
  };

  const handleStartQuest = async () => {
    if (!nextQuest) return;
    const questId = nextQuest.quest.id ?? nextQuest.questId;
    if (!questId) return;
    await startQuest.mutateAsync(questId);
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

  return (
    <div className="space-y-6">
      <Card className="border-none bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/10">
        <CardHeader>
          <CardDescription className="uppercase tracking-[0.4em] text-muted-foreground">Daily mission control</CardDescription>
          <CardTitle className="text-4xl">Welcome back, {user.name.split(' ')[0]}.</CardTitle>
          <p className="text-sm text-muted-foreground">
            Line up today’s quests, capture a win, and swap coins for momentum boosts.
          </p>
          {lastEvent && (
            <p className="text-xs text-muted-foreground">
              Last update · {lastEvent.message} · {new Date(lastEvent.timestamp).toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Button
            variant="outline"
            className="justify-between rounded-2xl border-dashed text-base"
            onClick={handleLogWin}
            disabled={(!inProgress && !nextQuest) || questActionBusy}
          >
            {questActionBusy ? 'Logging...' : 'Log daily win'}
            <ArrowUpRight size={16} />
          </Button>
          <Button
            variant="outline"
            className="justify-between rounded-2xl border-dashed text-base"
            disabled={!nextQuest || startQuest.isLoading}
            onClick={handleStartQuest}
          >
            {startQuest.isLoading ? 'Starting...' : 'Start a new quest'}
            <ArrowUpRight size={16} />
          </Button>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </div>
              <stat.icon size={22} />
            </CardHeader>
            <CardFooter className="text-xs uppercase tracking-wide text-muted-foreground">{stat.hint}</CardFooter>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardDescription>Focus quest</CardDescription>
              <CardTitle>Stay in flow</CardTitle>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/quests">View quest log</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {activeQuest ? (
                <>
                  <p className="text-lg font-semibold">{activeQuest.quest.title}</p>
                  <p className="text-sm text-muted-foreground">{activeQuest.quest.description}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">You’re all caught up for today.</p>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Quest progress</span>
                <span>{questProgressPercent}%</span>
              </div>
              <Progress value={questProgressPercent} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleLogWin} disabled={!activeQuest || questActionBusy}>
                {questActionBusy ? 'Logging...' : 'Log milestone'}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today’s rituals</CardTitle>
            <CardDescription>Micro practices to keep your energy high.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rituals.map((ritual) => {
              const isLogged = loggedRituals.has(ritual);
              const isProcessing = activeRitual === ritual && logRitual.isLoading;
              return (
                <div key={ritual} className="flex items-center justify-between rounded-2xl border px-4 py-3">
                  <p className="text-sm font-medium">{ritual}</p>
                  <Button
                    variant={isLogged ? 'outline' : 'ghost'}
                    size="sm"
                    disabled={isLogged || isProcessing}
                    onClick={() => handleRitualLog(ritual)}
                  >
                    {isLogged ? 'Logged' : isProcessing ? 'Logging...' : 'Mark done'}
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Next adventures</CardTitle>
            <CardDescription>Your suggested quests for today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {prioritizedQuests.map((progress) => (
              <div key={progress.progressId} className="rounded-2xl border px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{progress.quest.title}</p>
                    <p className="text-sm text-muted-foreground">{progress.quest.description}</p>
                  </div>
                  <Badge
                    variant={
                      progress.status === 'COMPLETED'
                        ? 'success'
                        : progress.status === 'IN_PROGRESS'
                        ? 'warning'
                        : 'muted'
                    }
                  >
                    {progress.status}
                  </Badge>
                </div>
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                  Reward · {progress.quest.reward} coins
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Momentum timeline</CardTitle>
            <CardDescription>Upcoming check-ins and meetups.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoMeetups.map((meetup) => (
              <div key={meetup.id} className="rounded-2xl border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{meetup.date}</p>
                <p className="text-base font-semibold">{meetup.title}</p>
                <p className="text-sm text-muted-foreground">{meetup.location}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Choose your next view</CardTitle>
          <CardDescription>Jump straight into any LifeQuest desktop section.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {coreSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.label}
                to={section.to}
                className="group flex items-center justify-between rounded-2xl border border-border/60 bg-background px-4 py-4 transition hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-primary/10 p-3 text-primary group-hover:bg-primary/20">
                    <Icon size={18} weight="duotone" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{section.label}</p>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary" />
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
