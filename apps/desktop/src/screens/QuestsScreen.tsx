import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useJourneyStore } from '@/store/journeyStore';
import { useQuestMutations } from '@/hooks/useQuestMutations';
import type { QuestProgress } from '@lifequest/schemas';

const viewTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'progress', label: 'Progress' },
  { id: 'history', label: 'History' },
];

const statusMeta: Record<
  QuestProgress['status'],
  { label: string; variant: 'muted' | 'warning' | 'success' }
> = {
  PENDING: { label: 'Pending', variant: 'muted' },
  IN_PROGRESS: { label: 'In progress', variant: 'warning' },
  COMPLETED: { label: 'Completed', variant: 'success' },
};

export const QuestsScreen = () => {
  const quests = useJourneyStore((state) => state.user?.quests ?? []);
  const { startQuest, completeQuest } = useQuestMutations();
  const [activeView, setActiveView] = useState<'overview' | 'progress' | 'history'>('overview');

  const totalQuests = quests.length;
  const completedQuests = quests
    .filter((quest) => quest.status === 'COMPLETED')
    .sort((a, b) => {
      if (!a.completedAt) return 1;
      if (!b.completedAt) return -1;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });
  const inProgressQuests = quests.filter((quest) => quest.status === 'IN_PROGRESS');
  const pendingQuests = quests.filter((quest) => quest.status === 'PENDING');
  const nextQuest = pendingQuests[0];
  const progressPercent = totalQuests ? Math.round((completedQuests.length / totalQuests) * 100) : 0;

  const handleStart = (quest: QuestProgress) => {
    const questId = quest.quest.id ?? quest.questId;
    if (!questId) return;
    startQuest.mutate(questId);
  };

  const handleComplete = (quest: QuestProgress) => {
    const questId = quest.quest.id ?? quest.questId;
    if (!questId) return;
    completeQuest.mutate(questId);
  };

  const renderQuestCard = (quest: QuestProgress, showStatus = true) => {
    const meta = statusMeta[quest.status];
    const isPending = quest.status === 'PENDING';
    const isCompleted = quest.status === 'COMPLETED';
    return (
      <div
        key={quest.progressId}
        className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition hover:border-primary/40"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {quest.quest.type?.replace(/_/g, ' ') ?? 'Quest'}
            </p>
            <p className="text-lg font-semibold leading-tight">{quest.quest.title}</p>
          </div>
          {showStatus && <Badge variant={meta.variant}>{meta.label}</Badge>}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{quest.quest.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="space-y-1">
            <p className="font-medium">{quest.quest.reward} coins</p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Audience · {quest.quest.audience}
            </p>
          </div>
          <div className="flex gap-2">
            {isPending && (
              <Button
                size="sm"
                variant="outline"
                disabled={startQuest.isLoading}
                onClick={() => handleStart(quest)}
              >
                {startQuest.isLoading ? 'Starting…' : 'Start'}
              </Button>
            )}
            {!isCompleted && (
              <Button size="sm" disabled={completeQuest.isLoading} onClick={() => handleComplete(quest)}>
                {completeQuest.isLoading ? 'Saving…' : 'Mark done'}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total quests</CardDescription>
            <CardTitle className="text-3xl">{totalQuests}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>In progress</CardDescription>
            <CardTitle className="text-3xl">{inProgressQuests.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedQuests.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Next suggested quest</CardTitle>
            <CardDescription>Prioritized based on your audience profile.</CardDescription>
          </CardHeader>
          <CardContent>
            {nextQuest ? renderQuestCard(nextQuest, false) : <p className="text-sm text-muted-foreground">No quests waiting right now.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Quest completion</span>
          <span>{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[...inProgressQuests, ...pendingQuests].map((quest) => renderQuestCard(quest))}
        {inProgressQuests.length === 0 && pendingQuests.length === 0 && (
          <p className="text-sm text-muted-foreground">All quests are complete for now.</p>
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      {completedQuests.length === 0 && (
        <p className="text-sm text-muted-foreground">Complete a quest to start building your history.</p>
      )}
      {completedQuests.map((quest) => (
        <div key={quest.progressId} className="rounded-2xl border px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {quest.completedAt ? new Date(quest.completedAt).toLocaleString() : 'Pending timestamp'}
          </p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{quest.quest.title}</p>
              <p className="text-sm text-muted-foreground">{quest.quest.description}</p>
            </div>
            <Badge variant="success">Completed</Badge>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (activeView === 'overview') return renderOverview();
    if (activeView === 'progress') return renderProgress();
    return renderHistory();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardDescription>Quest workspace</CardDescription>
            <CardTitle>Track your missions</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            {viewTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeView === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView(tab.id as typeof activeView)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
};
