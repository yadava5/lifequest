import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Coins,
  Compass,
  Files,
  Lightning,
  Moon,
  ShieldCheck,
  Sun,
  Target,
  UsersThree,
} from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/features/theme/ThemeProvider';
import { cn } from '@/lib/utils';

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const FEATURES = [
  {
    icon: Files,
    title: 'Missions, not chores',
    body: 'Daily routines become quests with coin rewards — reconnect with a mentor, ship a check-in, take the walk.',
    tone: 'text-sky bg-sky/10 border-sky/25',
    glow: 'hover:shadow-glow-sky',
  },
  {
    icon: Target,
    title: 'A vault worth raiding',
    body: 'Spend hard-won coins on real-world boosts: co-working passes, wellness stipends, coffee-chat credits.',
    tone: 'text-gold bg-gold/10 border-gold/25',
    glow: 'hover:shadow-glow-gold',
  },
  {
    icon: UsersThree,
    title: 'A guild at your back',
    body: 'Meetups and shared wins for people navigating job loss or retirement — no one levels up alone.',
    tone: 'text-teal bg-teal/10 border-teal/25',
    glow: 'hover:shadow-glow-teal',
  },
];

const STEPS = [
  ['01', 'Pick a mission', 'Three quest lines — Task, Community, Wellness — tuned to your season of life.'],
  ['02', 'Log the win', 'Complete it, feel the confetti, watch coins and tier progress climb.'],
  ['03', 'Claim the reward', 'Trade momentum for something real. Then go again.'],
] as const;

type Props = {
  onEnterDemo: () => void;
  onSignIn: () => void;
  demoBusy?: boolean;
};

export const LandingScreen = ({ onEnterDemo, onSignIn, demoBusy }: Props) => {
  const { theme, toggle } = useTheme();

  return (
    <div className="relative min-h-screen">
      <div className="haze" aria-hidden />

      {/* Nav */}
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <p className="font-display text-xl font-bold tracking-tight text-foreground">
          Life<span className="text-coral">Quest</span>
        </p>
        <div className="flex items-center gap-2">
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

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 text-center sm:pt-24">
        <motion.p
          custom={0}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mx-auto flex w-fit items-center gap-2 rounded-full border border-coral/30 bg-coral/10 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-coral"
        >
          <Compass size={14} weight="fill" /> a quest game for real life
        </motion.p>
        <motion.h1
          custom={1}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
        >
          Turn routines into <span className="text-coral">missions</span>.
        </motion.h1>
        <motion.p
          custom={2}
          variants={rise}
          initial="hidden"
          animate="show"
          className="serif mx-auto mt-5 max-w-xl text-2xl text-muted-foreground"
        >
          For the seasons between jobs and after them — earn coins, climb tiers, and rebuild
          momentum one small win at a time.
        </motion.p>
        <motion.div
          custom={3}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
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
          custom={4}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-4 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground"
        >
          one click · no signup · a real account seeded for you
        </motion.p>
      </section>

      {/* Feature trio */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className={cn(
                'rounded-2xl border border-border/70 bg-card/70 p-6 backdrop-blur-sm transition',
                f.glow,
              )}
            >
              <span className={cn('grid h-11 w-11 place-items-center rounded-xl border', f.tone)}>
                <f.icon size={22} weight="fill" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="feature-frame rounded-2xl p-6 sm:p-8">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.35em] text-coral">
            How the game works
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            {STEPS.map(([n, title, body]) => (
              <div key={n}>
                <p className="font-display text-3xl font-bold text-coral/60">{n}</p>
                <h4 className="mt-1 font-display font-semibold">{title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-3 rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm sm:grid-cols-3">
          {[
            [ShieldCheck, 'Real accounts, argon2-hashed — a live NestJS + Postgres backend, not a mock.'],
            [Coins, 'Coins, tiers and rewards persist — close the tab, your journey is still here.'],
            [CheckCircle, 'Desktop-first Tauri app; this web build is the same product in your browser.'],
          ].map(([Icon, text], i) => (
            <p key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Icon size={18} weight="fill" className="mt-0.5 shrink-0 text-teal" />
              {text as string}
            </p>
          ))}
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl border-t border-border/60 px-6 py-8 text-center font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
        LifeQuest · routines → missions · by Ayush Yadav
      </footer>
    </div>
  );
};
