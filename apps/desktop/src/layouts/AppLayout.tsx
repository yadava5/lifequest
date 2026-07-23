import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Moon,
  Sun,
  House,
  Files,
  UsersThree,
  Target,
  GearSix,
  Coins,
  SignOut,
} from 'phosphor-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/features/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/Toaster';
import { useJourneyStore } from '@/store/journeyStore';
import { useLogout } from '@/features/auth/AuthGate';
import { tierProgress } from '@/lib/tiers';

const navItems = [
  { label: 'Mission Control', short: 'Home', to: '/', icon: House },
  { label: 'Quest Log', short: 'Quests', to: '/quests', icon: Files },
  { label: 'Reward Vault', short: 'Rewards', to: '/rewards', icon: Target },
  { label: 'Guild', short: 'Guild', to: '/community', icon: UsersThree },
  { label: 'Settings', short: 'Settings', to: '/settings', icon: GearSix },
];

const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground hover:shadow-glow',
        className,
      )}
    >
      {theme === 'dark' ? <Sun size={18} weight="fill" /> : <Moon size={18} weight="fill" />}
    </button>
  );
};

const PlayerCard = () => {
  const name = useJourneyStore((s) => s.user?.name ?? 'Explorer');
  const coins = useJourneyStore((s) => s.user?.coins ?? 0);
  // Tier progress tracks lifetime earned (monotonic), not the spendable balance,
  // so redeeming a reward never lowers the journey bar. Fall back to `coins` only
  // for legacy payloads that predate the lifetimeCoins field.
  const lifetimeCoins = useJourneyStore((s) => s.user?.lifetimeCoins ?? s.user?.coins ?? 0);
  const { tier, next, pct, toNext } = tierProgress(lifetimeCoins);
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="feature-frame rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-coral font-display text-sm font-bold text-primary-foreground shadow-glow">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-foreground">{name}</p>
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-primary">{tier} tier</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
        <span>Journey</span>
        <span>{next ? `${toNext} to ${next}` : 'Max tier'}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-coral"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-gold/25 bg-gold/10 px-3 py-2">
        <Coins size={18} weight="fill" className="text-gold" />
        <span className="font-display text-lg font-bold text-foreground tabular-nums">
          {coins.toLocaleString()}
        </span>
        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
          quest coins
        </span>
      </div>
    </div>
  );
};

export const AppLayout = () => {
  const location = useLocation();
  const currentPath = useMemo(() => location.pathname || '/', [location.pathname]);
  const logout = useLogout();

  return (
    // App shell is exactly one viewport tall (h-dvh), so <main> is the scroll
    // container and the mobile bottom nav stays truly pinned at the bottom.
    // With `min-h-screen` the body scrolled instead, which let tall page content
    // overlap the sticky nav and swallow taps on its links (e.g. Settings).
    <div className="relative flex h-dvh text-foreground">
      <div className="haze" aria-hidden />

      <aside className="hidden w-72 flex-col border-r border-border/70 bg-card/50 backdrop-blur-xl lg:flex">
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <p className="font-display text-xl font-bold tracking-tight text-foreground">Life<span className="text-coral">Quest</span></p>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
              routines → missions
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="px-4">
          <PlayerCard />
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-4 py-6" aria-label="Primary">
          <p className="mb-2 px-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
            Navigate
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl border border-primary/40 bg-primary/10 shadow-glow"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  size={19}
                  weight={isActive ? 'fill' : 'regular'}
                  className={cn('relative z-10', isActive && 'text-primary')}
                />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 pb-6">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <SignOut size={18} /> Sign out
          </Button>
        </div>
      </aside>

      {/* min-w-0 lets this flex column shrink to the viewport; without it the
          default min-width:auto on a flex item lets <main> grow to its content's
          min-content width and spill ~24px past a 375px screen (horizontal
          scroll). overflow-x-hidden on <main> is the belt-and-suspenders. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border/60 bg-card/30 px-4 py-4 backdrop-blur-xl lg:px-8">
          <div className="lg:hidden">
            <p className="font-display text-lg font-bold text-foreground">Life<span className="text-coral">Quest</span></p>
          </div>
          <p className="hidden font-mono text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground lg:block">
            Your journey, one mission at a time
          </p>
          <div className="flex items-center gap-2">
            <ThemeToggle className="lg:hidden" />
            {/* The desktop sidebar already carries its own Sign out button
                (below the nav list) — mirror ThemeToggle's pattern above and
                show this one on mobile only, where the sidebar is hidden.
                It was previously `hidden lg:inline-flex` (desktop-only),
                which both duplicated the sidebar's control on desktop AND
                left mobile with no sign-out affordance anywhere in the UI. */}
            {/* Mobile-only: keep the tap target ≥44px (h-11) — `size="sm"` alone
                is 36px tall, which fails the 44px touch-target guideline. */}
            <Button variant="outline" size="sm" onClick={logout} className="h-11 px-4 lg:hidden">
              Sign out
            </Button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <Outlet />
          </div>
        </main>

        <nav
          className="sticky bottom-0 z-20 flex items-center justify-around border-t border-border/60 bg-card/80 px-2 py-2 backdrop-blur-xl lg:hidden"
          aria-label="Primary mobile"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[0.6rem] font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                {item.short}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <Toaster />
    </div>
  );
};
