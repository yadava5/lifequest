import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Buildings,
  CheckCircle,
  Circle,
  Coffee,
  Coins,
  Compass,
  Database,
  DeviceMobile,
  FlagBanner,
  GraduationCap,
  Handshake,
  Heartbeat,
  Lightning,
  LockKey,
  MapPinLine,
  Moon,
  Mountains,
  Palette,
  PersonSimpleWalk,
  Sun,
  Sparkle,
  Target,
  UsersThree,
} from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { celebrate } from '@/lib/celebrate';
import { useTheme } from '@/features/theme/ThemeProvider';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Motion — every reveal is reduced-motion safe: when the user prefers less   */
/*  motion we render at the natural state with no transform, no stagger.       */
/* -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

const Reveal = ({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

/** A section waypoint header — glyph + mono eyebrow, echoing the System Card. */
const Waypoint = ({
  glyph,
  eyebrow,
  tone,
}: {
  glyph: string;
  eyebrow: string;
  tone: string;
}) => (
  <div className="flex items-center gap-3">
    <span
      className={cn(
        'grid h-9 w-9 place-items-center rounded-full border font-mono text-base',
        tone,
      )}
      aria-hidden
    >
      {glyph}
    </span>
    <p className="font-mono text-[0.62rem] uppercase tracking-[0.35em] text-muted-foreground">
      {eyebrow}
    </p>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  The hero artifact: a real, playable mission card. Press Complete and the   */
/*  page pays out — the same confetti and +60 coins as the live game. Tier     */
/*  copy reads the ACTIVE ladder (Adventurer → Trailblazer, lib/tiers.ts).     */
/* -------------------------------------------------------------------------- */

const MissionCard = () => {
  const [done, setDone] = useState(false);
  const [coins, setCoins] = useState(1000);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!done) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) celebrate();
    tickRef.current = window.setInterval(() => {
      setCoins((c) => {
        if (c >= 1060) {
          if (tickRef.current) window.clearInterval(tickRef.current);
          return 1060;
        }
        return c + 4;
      });
    }, 36);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [done]);

  return (
    <div className="w-full max-w-sm">
      {/* status chip — coins + tier, exactly as Mission Control shows them */}
      <div className="mb-3 flex items-center justify-between rounded-xl border border-border/70 bg-card/70 px-4 py-2.5 backdrop-blur-sm">
        <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Coins size={15} weight="fill" className="text-gold" />
          <span aria-live="polite" className="tabular-nums font-semibold text-foreground">
            {coins.toLocaleString()}
          </span>
          coins
        </span>
        <span className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
          tier · Adventurer
        </span>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/80 p-5 text-left shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/25 bg-teal/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-widest text-teal">
            <FlagBanner size={12} weight="fill" /> wellness · daily
          </span>
          <span className="font-mono text-xs font-semibold text-gold">+60 ◎</span>
        </div>

        <h3 className="mt-3 font-display text-xl font-bold leading-snug">
          Take the long way home — a 30-minute walk
        </h3>
        <p className="serif mt-1.5 text-muted-foreground">
          No podcast, no phone. Just the walk.
        </p>

        {/* tier progress — nudges toward the real next rung when the mission lands */}
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
            <div
              className="h-full rounded-full bg-coral transition-all duration-700 ease-out"
              style={{ width: done ? '43%' : '38%' }}
            />
          </div>
          <p className="mt-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
            {done ? '43% to Trailblazer' : '38% to Trailblazer'}
          </p>
        </div>

        <Button
          size="sm"
          className="mt-4 w-full gap-2"
          onClick={() => setDone(true)}
          disabled={done}
        >
          {done ? (
            <>
              <CheckCircle size={16} weight="fill" /> Logged — nicely done
            </>
          ) : (
            <>
              <Lightning size={16} weight="fill" /> Complete mission
            </>
          )}
        </Button>
      </div>

      <p className="mt-3 text-center font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
        {done
          ? 'that’s the whole loop — the real account remembers'
          : 'go on. press it. this card is real'}
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  The crown jewel, made tangible: a tiny monotonic ledger. Completing a      */
/*  quest raises spendable coins AND lifetime earned; redeeming a reward       */
/*  spends coins but never touches lifetime — so the tier can only climb.      */
/*  Mirrors lib/tiers.ts (thresholds) + the coins/lifetimeCoins split.         */
/* -------------------------------------------------------------------------- */

const LADDER = [
  { name: 'Explorer', at: 0 },
  { name: 'Adventurer', at: 500 },
  { name: 'Trailblazer', at: 1800 },
  { name: 'Luminary', at: 4000 },
] as const;

const tierIndex = (lifetime: number) => {
  let idx = 0;
  for (let i = 0; i < LADDER.length; i += 1) if (lifetime >= LADDER[i].at) idx = i;
  return idx;
};

const TierLadder = () => {
  const reduced = useReducedMotion();
  const [coins, setCoins] = useState(1450);
  const [lifetime, setLifetime] = useState(1450);
  const [held, setHeld] = useState(false);
  const holdRef = useRef<number | null>(null);

  const flashHold = () => {
    setHeld(true);
    if (holdRef.current) window.clearTimeout(holdRef.current);
    holdRef.current = window.setTimeout(() => setHeld(false), 1100);
  };
  useEffect(() => () => {
    if (holdRef.current) window.clearTimeout(holdRef.current);
  }, []);

  const complete = () => {
    setCoins((c) => c + 120);
    setLifetime((l) => Math.min(l + 120, 4600));
  };
  const redeem = () => {
    if (coins < 200) return;
    setCoins((c) => c - 200);
    flashHold();
  };

  const idx = tierIndex(lifetime);
  const current = LADDER[idx];
  const next = LADDER[idx + 1];
  const span = next ? next.at - current.at : 1;
  const pct = next
    ? Math.max(0, Math.min(100, Math.round(((lifetime - current.at) / span) * 100)))
    : 100;

  return (
    <div className="feature-frame rounded-2xl p-5 sm:p-7">
      {/* two counters — the whole invariant in two numbers */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gold/25 bg-gold/[0.07] px-4 py-3">
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
            Spendable coins
          </p>
          <p className="mt-1 flex items-baseline gap-1.5 font-display text-2xl font-bold tabular-nums">
            <Coins size={18} weight="fill" className="text-gold" />
            <span aria-live="polite">{coins.toLocaleString()}</span>
          </p>
          <p className="mt-0.5 font-mono text-[0.56rem] uppercase tracking-widest text-gold/80">
            up on earn · down on spend
          </p>
        </div>
        <div className="rounded-xl border border-teal/25 bg-teal/[0.07] px-4 py-3">
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
            Lifetime earned
          </p>
          <p className="mt-1 flex items-baseline gap-1.5 font-display text-2xl font-bold tabular-nums text-foreground">
            <Mountains size={18} weight="fill" className="text-teal" />
            <span aria-live="polite">{lifetime.toLocaleString()}</span>
          </p>
          <p className="mt-0.5 font-mono text-[0.56rem] uppercase tracking-widest text-teal/80">
            only ever climbs
          </p>
        </div>
      </div>

      {/* the ladder — four rungs, a trail between them, a marker on your rank */}
      <div className="relative mt-7">
        <div className="absolute left-0 right-0 top-3 h-0.5 rounded-full bg-border" aria-hidden />
        <motion.div
          className="absolute left-0 top-3 h-0.5 origin-left rounded-full bg-coral"
          style={{ width: `${(idx / (LADDER.length - 1)) * 100}%` }}
          aria-hidden
        />
        <div className="relative flex items-start justify-between">
          {LADDER.map((t, i) => {
            const reached = lifetime >= t.at;
            const isCurrent = i === idx;
            return (
              <div key={t.name} className="flex w-1/4 flex-col items-center text-center">
                <span
                  className={cn(
                    'grid h-6 w-6 place-items-center rounded-full border-2 transition-colors duration-500',
                    reached
                      ? 'border-coral bg-coral text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground',
                    isCurrent && held && 'ring-4 ring-teal/40',
                  )}
                >
                  {reached ? (
                    <CheckCircle size={12} weight="fill" />
                  ) : (
                    <Circle size={9} weight="bold" />
                  )}
                </span>
                <span
                  className={cn(
                    'mt-2 font-mono text-[0.56rem] uppercase tracking-widest',
                    isCurrent ? 'font-semibold text-coral' : 'text-muted-foreground',
                  )}
                >
                  {t.name}
                </span>
                <span className="font-mono text-[0.52rem] tabular-nums text-muted-foreground/70">
                  {t.at.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* progress to the next rung + the live invariant read-out */}
      <div className="mt-5">
        <div className="flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
          <span>
            rank · <span className="text-coral">{current.name}</span>
          </span>
          <span>{next ? `${pct}% to ${next.name}` : 'summit reached'}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border/60">
          <motion.div
            className="h-full rounded-full bg-coral"
            animate={{ width: `${pct}%` }}
            transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <Button size="sm" className="flex-1 gap-2" onClick={complete}>
          <Lightning size={15} weight="fill" /> Complete a quest
          <span className="font-mono text-[0.62rem] text-primary-foreground/80">+120</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-2"
          onClick={redeem}
          disabled={coins < 200}
        >
          <Target size={15} weight="fill" /> Redeem a reward
          <span className="font-mono text-[0.62rem] text-muted-foreground">−200</span>
        </Button>
      </div>

      <p
        className={cn(
          'mt-3 flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-widest transition-colors duration-300',
          held ? 'text-teal' : 'text-muted-foreground',
        )}
        aria-live="polite"
      >
        {held ? (
          <>
            <CheckCircle size={13} weight="fill" /> coins spent · rank held
          </>
        ) : (
          <>
            <LockKey size={13} weight="fill" /> tier = f(lifetime) · spending can’t demote you
          </>
        )}
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Verified content — every line grounded in the repo (see the System Card).  */
/* -------------------------------------------------------------------------- */

const REFRAMES = [
  { from: 'a routine', to: 'a mission', icon: FlagBanner, tone: 'text-coral' },
  { from: 'a streak', to: 'coins + a tier', icon: Coins, tone: 'text-gold' },
  { from: 'doing it alone', to: 'a guild at your back', icon: UsersThree, tone: 'text-sky' },
] as const;

const LOOP = [
  {
    n: '01',
    icon: Compass,
    title: 'Pick a mission',
    body: 'Three quest lines — Task, Community, Wellness — tuned to your season of life.',
    tone: 'text-coral bg-coral/10 border-coral/25',
  },
  {
    n: '02',
    icon: Lightning,
    title: 'Log the win',
    body: 'Complete it and the page pays out — coins land, confetti fires, your tier ticks up.',
    tone: 'text-gold bg-gold/10 border-gold/25',
  },
  {
    n: '03',
    icon: Coins,
    title: 'Claim the reward',
    body: 'Trade hard-won coins for something real. Then point yourself at the next one.',
    tone: 'text-teal bg-teal/10 border-teal/25',
  },
] as const;

const VAULT = [
  { icon: Buildings, name: 'Co-working day pass', cost: 200 },
  { icon: Coffee, name: 'Coffee-chat credits', cost: 150 },
  { icon: Heartbeat, name: 'Wellness stipend', cost: 350 },
  { icon: GraduationCap, name: 'Skill course voucher', cost: 500 },
] as const;

const ENGINE = [
  {
    icon: Lightning,
    k: 'One serverless function',
    v: 'A NestJS + Fastify app boots once at module scope and is reused across warm invocations — the whole API graph from a single Vercel function.',
    tone: 'text-coral',
  },
  {
    icon: LockKey,
    k: 'argon2-hashed accounts',
    v: 'Passwords are argon2-hashed on signup and verified on login — never stored or compared in plaintext. Real accounts, not a demo shell.',
    tone: 'text-teal',
  },
  {
    icon: Database,
    k: 'A Postgres coin ledger',
    v: 'Prisma 6 over Postgres. Every award and every spend is a transaction, so coins, tiers and redemptions are durable writes — not screen state.',
    tone: 'text-sky',
  },
] as const;

const PROOF = [
  {
    icon: Database,
    tone: 'text-teal bg-teal/10 border-teal/25',
    glow: 'hover:shadow-glow-teal',
    title: 'It persists',
    body: 'Complete a mission, reload the page — it’s still there. Redeem a reward — the coins are gone for real. An independent live audit (2026-07) verified backend persistence end to end.',
  },
  {
    icon: Lightning,
    tone: 'text-coral bg-coral/10 border-coral/25',
    glow: 'hover:shadow-glow',
    title: 'It plays',
    body: 'The hero card up top isn’t a screenshot. Press Complete and it pays out the same confetti and coins as the live game — before you sign up for anything.',
  },
  {
    icon: DeviceMobile,
    tone: 'text-sky bg-sky/10 border-sky/25',
    glow: 'hover:shadow-glow-sky',
    title: 'It travels',
    body: 'Desktop-first, genuinely mobile. On a phone the sidebar folds into a sticky six-tab bar — Home, Quests, Rewards, Guild, Forge, Settings — one thumb-reach away.',
  },
  {
    icon: Palette,
    tone: 'text-gold bg-gold/10 border-gold/25',
    glow: 'hover:shadow-glow-gold',
    title: 'It holds its colors',
    body: 'One warm identity, held by rule: coral, honey, aqua, sky. No gradients, no purple — right down to the confetti burst.',
  },
] as const;

type Props = {
  onEnterDemo: () => void;
  onSignIn: () => void;
  demoBusy?: boolean;
};

export const LandingScreen = ({ onEnterDemo, onSignIn, demoBusy }: Props) => {
  const { theme, toggle } = useTheme();
  const { scrollYProgress } = useScroll();
  const trail = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <div className="relative min-h-screen">
      <div className="haze" aria-hidden />

      {/* trail progress — how far along the expedition you’ve scrolled */}
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-coral"
        style={{ scaleX: trail }}
        aria-hidden
      />

      {/* Nav */}
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <p className="font-display text-xl font-bold tracking-tight text-foreground">
          Life<span className="text-coral">Quest</span>
        </p>
        <div className="flex items-center gap-2">
          <a
            href="/system-card/"
            className="hidden items-center gap-1.5 rounded-full border border-border px-3.5 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground transition hover:border-coral/40 hover:text-coral sm:inline-flex"
          >
            <BookOpen size={13} weight="fill" /> System Card
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground"
          >
            {theme === 'dark' ? <Sun size={18} weight="fill" /> : <Moon size={18} weight="fill" />}
          </button>
          <Button variant="outline" onClick={onSignIn}>
            Sign in
          </Button>
        </div>
      </header>

      {/* ─────────────────────────  HERO  ───────────────────────── */}
      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-24 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_auto]">
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mx-auto flex w-fit items-center gap-2 rounded-full border border-coral/30 bg-coral/10 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-coral lg:mx-0"
          >
            <Compass size={14} weight="fill" /> a quest game for real life
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
          >
            Routines are boring.
            <span className="block text-coral">Missions aren’t.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: EASE }}
            className="serif mx-auto mt-5 max-w-xl text-2xl text-muted-foreground lg:mx-0"
          >
            For the season between jobs — and the one after them. Turn the routines
            that feel like chores into missions that pay you back, and rebuild
            momentum one small win at a time.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease: EASE }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Button size="lg" className="gap-2" onClick={onEnterDemo} disabled={demoBusy}>
              <Lightning size={18} weight="fill" />
              {demoBusy ? 'Opening…' : 'Enter the live demo'}
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={onSignIn}>
              Create an account <ArrowRight size={16} />
            </Button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
            className="mt-4 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground"
          >
            one click · no signup · a real account seeded for you
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mx-auto lg:mx-0"
        >
          <MissionCard />
        </motion.div>
      </section>

      {/* ───────────────────────  §01 · PROBLEM  ─────────────────────── */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
          <Reveal>
            <Waypoint glyph="◔" eyebrow="§01 · the season" tone="border-coral/25 bg-coral/10 text-coral" />
          </Reveal>
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <Reveal delay={0.05}>
                <h2 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                  The season between jobs
                  <span className="block text-muted-foreground">is a climb taken alone.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="serif mt-6 max-w-xl text-xl leading-relaxed text-muted-foreground">
                  A layoff — or a retirement — hands you all the time in the world
                  and quietly takes back the scaffolding that used to carry a day.
                  No standup. No commute. No colleagues who notice.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                  The calendar goes blank, the days blur together, and the routines
                  that should keep you steady start to feel like joyless chores.
                  Momentum doesn’t crash — it just leaks out between the lines.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: PersonSimpleWalk, label: 'Between jobs', body: 'the layoff season — momentum, rebuilt one small win.' },
                    { icon: Sun, label: 'Newly retired', body: 'a reason to show up, minus the grind.' },
                  ].map((a) => (
                    <div
                      key={a.label}
                      className="rounded-xl border border-border/70 bg-background/50 p-4"
                    >
                      <a.icon size={20} weight="fill" className="text-coral" />
                      <p className="mt-2 font-display text-sm font-semibold">{a.label}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {a.body}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* the "before": a flat list you update out of guilt */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border/70 bg-background/40 p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                  a routine
                </p>
                <div className="mt-4 space-y-2.5">
                  {['Go for a walk', 'Message an old colleague', 'Update the resume', 'Cook something real'].map(
                    (t) => (
                      <div
                        key={t}
                        className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/40 px-3 py-2.5"
                      >
                        <Circle size={15} className="shrink-0 text-muted-foreground/50" />
                        <span className="text-sm text-muted-foreground/80">{t}</span>
                      </div>
                    ),
                  )}
                </div>
                <p className="mt-4 text-center font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground/70">
                  no reward · no streak · no witness
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────────  §02 · SOLUTION  ─────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
        <Reveal>
          <Waypoint glyph="✦" eyebrow="§02 · the reframe" tone="border-gold/25 bg-gold/10 text-gold" />
        </Reveal>
        <div className="mt-8 max-w-3xl">
          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              So we made rebuilding momentum
              <span className="text-coral"> a game.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="serif mt-6 text-xl leading-relaxed text-muted-foreground">
              The task never changes. The framing does — and the framing is the
              whole product. A checklist is a debt you owe yourself; the same task,
              wearing a coin reward, is something you <em>get</em> to do.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Finish it and the loop closes: coins, confetti, a rank that climbs —
              then it points you at the next one. Momentum stops leaking, because
              every step pays for the one after it.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {REFRAMES.map((r, i) => (
            <Reveal key={r.from} delay={0.1 + i * 0.08}>
              <div className="feature-frame flex h-full flex-col gap-3 rounded-2xl p-6">
                <r.icon size={22} weight="fill" className={r.tone} />
                <div className="font-mono text-sm">
                  <span className="text-muted-foreground line-through decoration-border">
                    {r.from}
                  </span>
                  <ArrowRight size={14} className="mx-2 inline text-coral" />
                  <span className="font-semibold text-foreground">{r.to}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────  §03 · IMPLEMENTATION  ─────────────────────── */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
          <Reveal>
            <Waypoint glyph="◈" eyebrow="§03 · how the climb works" tone="border-sky/25 bg-sky/10 text-sky" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-8 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Missions become coins. Coins become tiers.
              <span className="text-coral"> A guild carries you up.</span>
            </h2>
          </Reveal>

          {/* the loop */}
          <div className="mt-14">
            <Reveal>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.35em] text-coral">
                the loop · pick it · log it · claim it
              </p>
            </Reveal>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {LOOP.map((s, i) => (
                <Reveal key={s.n} delay={0.06 * i}>
                  <div className="h-full rounded-2xl border border-border/70 bg-background/50 p-6">
                    <div className="flex items-center justify-between">
                      <span className={cn('grid h-11 w-11 place-items-center rounded-xl border', s.tone)}>
                        <s.icon size={22} weight="fill" />
                      </span>
                      <span className="font-display text-3xl font-bold text-coral/40">{s.n}</span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground/90">
                <span className="font-semibold text-foreground">Order matters.</span> In the
                live app the server awards the coins first — the write resolves — then the
                confetti fires, then a refetch ticks your tier up. The celebration only ever
                follows a real transaction.
              </p>
            </Reveal>
          </div>

          {/* the economy — a vault of real rewards */}
          <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <Reveal>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.35em] text-gold">
                  the economy · coins you can actually spend
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                  A vault worth raiding.
                </h3>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Every quest carries a coin reward, and a new account starts with
                  <span className="font-semibold text-foreground"> 800 coins</span> in the
                  bank — so the vault is reachable from day one. It’s stocked with
                  real-world boosts, not badges. Coins are a currency, so spending has
                  to cost something.
                </p>
              </Reveal>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {VAULT.map((v, i) => (
                <Reveal key={v.name} delay={0.06 * i}>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/50 p-4 transition hover:shadow-glow-gold">
                    <span className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
                        <v.icon size={19} weight="fill" />
                      </span>
                      <span className="text-sm font-medium">{v.name}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs font-semibold text-gold">
                      {v.cost} ◎
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* the ladder — the monotonic crown jewel, interactive */}
          <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <Reveal>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.35em] text-coral">
                  the ladder · earned for good
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                  Four tiers. Spending never sets you back.
                </h3>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Rank isn’t a level you buy — it’s a reflection of everything you’ve
                  ever earned. Two counters live on every player:
                  <span className="font-semibold text-foreground"> spendable coins</span> go
                  up and down, but <span className="font-semibold text-foreground">lifetime
                  earned</span> only ever climbs. Your tier reads lifetime — so redeeming a
                  reward is a real cost that can’t undo your progress.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  try it → complete quests, then redeem. watch the rank hold.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <TierLadder />
            </Reveal>
          </div>

          {/* the guild */}
          <div className="mt-16">
            <Reveal>
              <div className="feature-frame flex flex-col gap-6 rounded-2xl p-7 sm:flex-row sm:items-center sm:p-9">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-sky/25 bg-sky/10 text-sky">
                  <UsersThree size={28} weight="fill" />
                </span>
                <div className="flex-1">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.35em] text-sky">
                    the guild · no one levels up alone
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold">A guild at your back.</h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                    The lonely part of re-entry is the fix the game takes most seriously.
                    A Guild tab sits beside the quest log — local meetups tagged by season,
                    and shared wins from people in the same climb. You climb for yourself,
                    but never by yourself.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 font-mono text-[0.6rem] uppercase tracking-widest">
                    {[
                      { icon: MapPinLine, t: 'meetups by season' },
                      { icon: Handshake, t: 'shared wins' },
                      { icon: Sparkle, t: '“a beacon for the whole guild”' },
                    ].map((c) => (
                      <span
                        key={c.t}
                        className="inline-flex items-center gap-1.5 rounded-full border border-sky/25 bg-sky/10 px-3 py-1 text-sky"
                      >
                        <c.icon size={12} weight="fill" /> {c.t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* the engine — the real backend */}
          <div className="mt-16">
            <Reveal>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.35em] text-teal">
                the engine · not a mock
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h3 className="mt-4 max-w-3xl font-display text-2xl font-bold sm:text-3xl">
                Under the dawn-warm surface, a real full-stack app.
              </h3>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {ENGINE.map((e, i) => (
                <Reveal key={e.k} delay={0.06 * i}>
                  <div className="h-full rounded-2xl border border-border/70 bg-background/50 p-6">
                    <e.icon size={24} weight="fill" className={e.tone} />
                    <h4 className="mt-3 font-display text-base font-semibold">{e.k}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{e.v}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <p className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                browser → vercel fn → nest + fastify → prisma → postgres
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────────  §04 · PROOF  ─────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
        <Reveal>
          <Waypoint glyph="◎" eyebrow="§04 · the receipts" tone="border-teal/25 bg-teal/10 text-teal" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-8 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            It persists. It plays.
            <span className="text-coral"> It ships.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {PROOF.map((p, i) => (
            <Reveal key={p.title} delay={0.06 * i}>
              <div
                className={cn(
                  'h-full rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur-sm transition',
                  p.glow,
                )}
              >
                <span className={cn('grid h-11 w-11 place-items-center rounded-xl border', p.tone)}>
                  <p.icon size={22} weight="fill" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-teal/25 bg-teal/[0.06] p-5">
            <ShieldNote />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">One honest note.</span> This public
              demo runs on in-browser fixtures that re-seed on reload, so you can click through with
              no backend at all. Point the same app at the live API with a single environment
              variable and the durable persistence above switches on — identical app code, no
              change. Read the full accounting in the System Card.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ───────────────────────  §05 · TRY IT  ─────────────────────── */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto w-full max-w-4xl px-6 py-24 text-center">
          <Reveal>
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-coral/25 bg-coral/10 font-mono text-lg text-coral">
              ▲
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Start your expedition.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="serif mx-auto mt-5 max-w-xl text-xl leading-relaxed text-muted-foreground">
              Open the live demo, complete the hero mission, and watch the page pay
              you back — coins, confetti, a tier that climbs. No signup, no wall.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="gap-2" onClick={onEnterDemo} disabled={demoBusy}>
                <Lightning size={18} weight="fill" />
                {demoBusy ? 'Opening…' : 'Enter the live demo'}
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={onSignIn}>
                Create an account <ArrowRight size={16} />
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <a
              href="/system-card/"
              className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-coral transition hover:gap-3"
            >
              <BookOpen size={15} weight="fill" /> Read the System Card <ArrowRight size={14} />
            </a>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-8 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
              missions · coins · tiers · a guild
            </p>
          </Reveal>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 border-t border-border/60 px-6 py-8 text-center font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground sm:flex-row sm:text-left">
        <span>LifeQuest · routines → missions · by Ayush Yadav</span>
        <a href="/system-card/" className="inline-flex items-center gap-1.5 transition hover:text-coral">
          <BookOpen size={13} weight="fill" /> System Card · Vol. 01
        </a>
      </footer>
    </div>
  );
};

/** Small teal shield used by the honest-note callout. */
const ShieldNote = () => (
  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-teal/25 bg-teal/10 text-teal">
    <CheckCircle size={16} weight="fill" />
  </span>
);
