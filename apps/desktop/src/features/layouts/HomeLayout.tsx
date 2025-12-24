import { HomeDashboard } from '@/features/home/HomeDashboard';
import { QuestListPanel } from '@/features/quests/QuestListPanel';
import { RewardsPanel } from '@/features/rewards/RewardsPanel';
import { CommunityPanel } from '@/features/community/CommunityPanel';
import { ResumePanel } from '@/features/resume/ResumePanel';
import { SettingsPanel } from '@/features/settings/SettingsPanel';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/features/theme/ThemeProvider';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun } from 'lucide-react';

export const HomeLayout = () => {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen flex">
      <aside className="hidden w-64 border-r border-border/60 bg-card/60 p-6 md:block">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">LifeQuest</p>
            <p className="text-base font-semibold">Desktop</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
        <Separator className="my-6" />
        <nav className="space-y-3 text-sm text-muted-foreground">
          <span className="block font-semibold text-foreground">Overview</span>
          <p>Home dashboard</p>
          <p>Quest log</p>
          <p>Rewards store</p>
          <p>Community</p>
          <p>Resume boost</p>
          <p>Settings</p>
        </nav>
      </aside>
      <main className="flex-1 bg-gradient-to-b from-background via-background/90 to-background/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-10">
          <section>
            <HomeDashboard />
          </section>
          <section className="grid gap-6 lg:grid-cols-7">
            <div className="space-y-6 lg:col-span-4">
              <QuestListPanel />
              <ResumePanel />
            </div>
            <div className="space-y-6 lg:col-span-3">
              <RewardsPanel />
              <CommunityPanel />
              <SettingsPanel />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
