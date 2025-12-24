import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/features/theme/ThemeProvider';
import { useMemo } from 'react';
import { Moon, Sun, House, Files, PuzzlePiece, UsersThree, Target, GearSix } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { useJourneyStore } from '@/store/journeyStore';
import { useLogout } from '@/features/auth/AuthGate';

const navItems = [
  { label: 'Overview', to: '/', icon: House },
  { label: 'Quest Log', to: '/quests', icon: Files },
  { label: 'Rewards', to: '/rewards', icon: Target },
  { label: 'Community', to: '/community', icon: UsersThree },
  { label: 'Resume Boost', to: '/resume', icon: PuzzlePiece },
  { label: 'Settings', to: '/settings', icon: GearSix },
];

export const AppLayout = () => {
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const currentPath = useMemo(() => location.pathname || '/', [location.pathname]);
  const name = useJourneyStore((state) => state.user?.name ?? 'Explorer');
  const audience = useJourneyStore((state) => state.user?.audience ?? 'LAID_OFF');
  const logout = useLogout();

  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground">
      <aside className="hidden w-72 flex-col border-r border-border/60 bg-card lg:flex">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">LifeQuest</p>
            <p className="text-lg font-semibold">{name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggle}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-2 px-4 py-6">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Explore</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition',
                    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
          <div className="mt-auto px-4 pb-6">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-4 text-sm text-muted-foreground">
              Focus audience
              <p className="text-lg font-semibold text-foreground">{audience.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card/80 px-4 py-4 shadow-sm lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Experience</p>
            <p className="text-2xl font-semibold">LifeQuest Desktop</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:text-foreground"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button variant="outline" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/40 px-4 py-6 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <Outlet />
          </div>
        </main>
        <nav className="sticky bottom-0 flex items-center justify-around border-t border-border bg-card px-2 py-2 shadow-lg lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center text-xs font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                {item.label.split(' ')[0]}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
