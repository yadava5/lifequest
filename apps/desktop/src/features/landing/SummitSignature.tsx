import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { celebrate } from '@/lib/celebrate';

/* -------------------------------------------------------------------------- *
 *  SummitSignature — the page's signature close: a trail switchbacks up a
 *  dawn-lit ridge, lighting each tier waypoint in turn (Explorer → Adventurer
 *  → Trailblazer → Luminary), until a coral flag plants on the summit and the
 *  sky throws a small confetti flourish. The whole climb is the LifeQuest arc
 *  in one image — routines, become a summit.
 *
 *  Click (or Enter/Space on) the flag to re-plant it: a wave, a coin pop, a
 *  fresh flourish — the on-theme easter egg. Reduced motion renders the fully
 *  resolved mark: trail drawn, waypoints lit, flag planted, no motion.
 * -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

// switchback trail — y strictly climbs; x reverses like a real mountain path.
const TRAIL =
  'M60,404 L150,372 L120,344 L270,300 L232,268 L360,224 L322,196 L452,150 L452,98';

// the four tier waypoints, in climb order.
const NODES = [
  { x: 150, y: 372, name: 'Explorer', delay: 0.5 },
  { x: 270, y: 300, name: 'Adventurer', delay: 1.0 },
  { x: 360, y: 224, name: 'Trailblazer', delay: 1.5 },
  { x: 452, y: 150, name: 'Luminary', delay: 1.95 },
] as const;

export const SummitSignature = () => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [wave, setWave] = useState(0);
  const flourished = useRef(false);
  const run = inView && !reduced;

  // the flourish, once, when the flag has planted.
  useEffect(() => {
    if (!run || flourished.current) return;
    const t = window.setTimeout(() => {
      flourished.current = true;
      celebrate();
    }, 2700);
    return () => window.clearTimeout(t);
  }, [run]);

  const plant = () => {
    setWave((w) => w + 1);
    celebrate();
  };

  const flagPlanted = reduced || inView;

  return (
    <div ref={ref} className="mx-auto w-full max-w-2xl">
      <svg
        viewBox="0 0 512 440"
        className="h-auto w-full"
        role="img"
        aria-label="A trail climbs a dawn-lit ridge to a summit where a coral flag is planted."
      >
        <defs>
          <radialGradient id="lq-sun" cx="50%" cy="26%" r="60%">
            <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity="0.5" />
            <stop offset="38%" stopColor="hsl(var(--coral))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="hsl(var(--coral))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lq-ridge-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--teal))" stopOpacity="0.22" />
            <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="lq-ridge-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--sky))" stopOpacity="0.16" />
            <stop offset="100%" stopColor="hsl(var(--sky))" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* rising sun behind the summit */}
        <motion.circle
          cx="452"
          cy="118"
          r="150"
          fill="url(#lq-sun)"
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.4, ease: EASE }}
          style={{ transformOrigin: '452px 118px' }}
        />

        {/* back range + front ridge */}
        <path
          d="M0,300 L120,214 L214,286 L318,150 L452,98 L512,150 L512,440 L0,440 Z"
          fill="url(#lq-ridge-back)"
        />
        <path
          d="M0,392 L96,336 L188,388 L300,320 L400,368 L512,300 L512,440 L0,440 Z"
          fill="url(#lq-ridge-front)"
        />
        <path d="M0,300 L120,214 L214,286 L318,150 L452,98 L512,150" fill="none" stroke="hsl(var(--teal))" strokeOpacity="0.28" strokeWidth="1.5" />

        {/* the trail — draws on scroll-in */}
        <path d={TRAIL} fill="none" stroke="hsl(var(--border))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 7" opacity="0.5" />
        <motion.path
          d={TRAIL}
          fill="none"
          stroke="hsl(var(--coral))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
        />

        {/* tier waypoints — light in climb order */}
        {NODES.map((n) => (
          <g key={n.name}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="12"
              fill="hsl(var(--gold))"
              initial={reduced ? false : { opacity: 0, scale: 0.4 }}
              animate={inView ? { opacity: 0.22, scale: 1 } : undefined}
              transition={{ duration: 0.5, delay: reduced ? 0 : n.delay, ease: EASE }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="4.5"
              fill="hsl(var(--coral))"
              stroke="hsl(var(--background))"
              strokeWidth="1.5"
              initial={reduced ? false : { opacity: 0, scale: 0.2 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.45, delay: reduced ? 0 : n.delay, ease: EASE }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
          </g>
        ))}

        {/* the summit flag — clickable easter egg */}
        <g
          role="button"
          tabIndex={0}
          aria-label="Plant the flag"
          onClick={plant}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              plant();
            }
          }}
          style={{ cursor: 'pointer', outline: 'none' }}
        >
          {/* generous invisible hit target */}
          <rect x="430" y="40" width="90" height="70" fill="transparent" />
          {/* pole */}
          <motion.line
            x1="452"
            y1="98"
            x2="452"
            y2="52"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.7"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 0.4, delay: reduced ? 0 : 2.2, ease: EASE }}
          />
          {/* pennant — unfurls, then waves on click */}
          <motion.path
            d="M452,54 L500,64 L452,78 Z"
            fill="hsl(var(--coral))"
            style={{ transformOrigin: '452px 66px', transformBox: 'fill-box' }}
            initial={reduced ? false : { scaleX: 0, opacity: 0 }}
            animate={
              flagPlanted
                ? wave > 0
                  ? { scaleX: 1, opacity: 1, rotate: [0, -6, 5, -3, 0] }
                  : { scaleX: 1, opacity: 1 }
                : undefined
            }
            transition={
              wave > 0
                ? { duration: 0.7, ease: EASE }
                : { duration: 0.5, delay: reduced ? 0 : 2.5, ease: EASE }
            }
          />
          {/* summit cap */}
          <motion.circle
            cx="452"
            cy="98"
            r="5"
            fill="hsl(var(--gold))"
            stroke="hsl(var(--background))"
            strokeWidth="1.5"
            initial={reduced ? false : { scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : undefined}
            transition={{ duration: 0.4, delay: reduced ? 0 : 2.3, ease: EASE }}
            style={{ transformOrigin: '452px 98px' }}
          />
          {/* coin pop on re-plant */}
          {!reduced &&
            wave > 0 &&
            [-18, -2, 14].map((dx, i) => (
              <motion.circle
                key={`${wave}-${i}`}
                cx={452 + dx}
                cy={70}
                r="4"
                fill="hsl(var(--gold))"
                initial={{ opacity: 0, cy: 78 }}
                animate={{ opacity: [0, 1, 0], cy: 34 }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: EASE }}
              />
            ))}
        </g>
      </svg>

      <div className="mt-4 flex flex-col items-center gap-1.5">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
          Explorer{' '}
          <span className="text-coral">→</span> Adventurer{' '}
          <span className="text-coral">→</span> Trailblazer{' '}
          <span className="text-coral">→</span> Luminary
        </p>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-coral/80">
          {reduced ? 'summit reached' : 'plant the flag ↑'}
        </p>
      </div>
    </div>
  );
};
