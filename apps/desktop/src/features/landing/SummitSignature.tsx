import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { celebrate } from '@/lib/celebrate';

/* -------------------------------------------------------------------------- *
 *  SummitSignature — the page's signature close, now a full-bleed panorama
 *  anchored at the very bottom of the landing (the AutoML-landing treatment,
 *  in LifeQuest's own dawn-ridge language). A trail switchbacks up a mountain
 *  range that runs edge to edge and bleeds off the page bottom, lighting each
 *  tier waypoint in turn (Explorer → Adventurer → Trailblazer → Luminary),
 *  until a coral flag plants on the summit and the sky throws a small confetti
 *  flourish. The sun keeps breathing afterwards — the band stays alive.
 *
 *  The whole band is a button: click (or Enter/Space) re-plants the flag — a
 *  wave, a coin pop, a fresh flourish. Reduced motion renders the fully
 *  resolved panorama: trail drawn, waypoints lit, flag planted, no motion.
 * -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

// switchback trail — y strictly climbs; x reverses like a real mountain path.
const TRAIL =
  'M30,352 L240,318 L196,296 L470,248 L426,226 L700,186 L656,164 L930,130 L886,108 L1150,84';

// the four tier waypoints, in climb order.
const NODES = [
  { x: 240, y: 318, name: 'Explorer', delay: 0.5 },
  { x: 470, y: 248, name: 'Adventurer', delay: 1.0 },
  { x: 700, y: 186, name: 'Trailblazer', delay: 1.5 },
  { x: 930, y: 130, name: 'Luminary', delay: 1.95 },
] as const;

const SUMMIT = { x: 1150, y: 84 } as const;

export const SummitSignature = () => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
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
    <button
      ref={ref}
      type="button"
      onClick={plant}
      aria-label="Plant the flag"
      className="block w-full cursor-pointer border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-coral/70"
    >
      <div className="flex flex-col items-center gap-1.5 pb-6 pt-16">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
          Explorer <span className="text-coral">→</span> Adventurer{' '}
          <span className="text-coral">→</span> Trailblazer{' '}
          <span className="text-coral">→</span> Luminary
        </p>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-coral">
          {reduced ? 'summit reached' : 'plant the flag ↓'}
        </p>
      </div>

      {/* the panorama — edge to edge, running off the bottom of the page */}
      <svg
        viewBox="0 0 1440 360"
        className="block h-auto w-full"
        role="img"
        aria-label="A trail climbs a dawn-lit mountain range spanning the whole page to a summit where a coral flag is planted."
      >
        <defs>
          <radialGradient id="lq-sun" cx="50%" cy="50%" r="50%">
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

        {/* rising sun behind the summit — keeps breathing once risen */}
        <motion.circle
          cx={SUMMIT.x}
          cy={120}
          r="130"
          fill="url(#lq-sun)"
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={
            inView
              ? reduced
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: [1, 1.045, 1] }
              : undefined
          }
          transition={
            reduced
              ? { duration: 0 }
              : { opacity: { duration: 1.4, ease: EASE }, scale: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.4 } }
          }
          style={{ transformOrigin: `${SUMMIT.x}px 120px` }}
        />

        {/* back range + front ridge — full width, bleeding off the bottom */}
        <path
          d="M0,268 L170,180 L330,242 L560,140 L780,208 L1000,120 L1150,84 L1290,150 L1440,110 L1440,360 L0,360 Z"
          fill="url(#lq-ridge-back)"
        />
        <path
          d="M0,336 L200,300 L430,338 L660,306 L910,340 L1160,304 L1440,332 L1440,360 L0,360 Z"
          fill="url(#lq-ridge-front)"
        />
        <path
          d="M0,268 L170,180 L330,242 L560,140 L780,208 L1000,120 L1150,84 L1290,150 L1440,110"
          fill="none"
          stroke="hsl(var(--teal))"
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />

        {/* the trail — draws on scroll-in */}
        <path
          d={TRAIL}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 7"
          opacity="0.5"
        />
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
              r="13"
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

        {/* the summit flag */}
        {/* pole */}
        <motion.line
          x1={SUMMIT.x}
          y1={SUMMIT.y}
          x2={SUMMIT.x}
          y2={SUMMIT.y - 46}
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
          d={`M${SUMMIT.x},${SUMMIT.y - 44} L${SUMMIT.x + 52},${SUMMIT.y - 32} L${SUMMIT.x},${SUMMIT.y - 18} Z`}
          fill="hsl(var(--coral))"
          style={{
            transformOrigin: `${SUMMIT.x}px ${SUMMIT.y - 31}px`,
            transformBox: 'fill-box',
          }}
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
          cx={SUMMIT.x}
          cy={SUMMIT.y}
          r="5"
          fill="hsl(var(--gold))"
          stroke="hsl(var(--background))"
          strokeWidth="1.5"
          initial={reduced ? false : { scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.4, delay: reduced ? 0 : 2.3, ease: EASE }}
          style={{ transformOrigin: `${SUMMIT.x}px ${SUMMIT.y}px` }}
        />
        {/* coin pop on re-plant */}
        {!reduced &&
          wave > 0 &&
          [-20, -2, 16].map((dx, i) => (
            <motion.circle
              key={`${wave}-${i}`}
              cx={SUMMIT.x + dx}
              cy={SUMMIT.y - 30}
              r="4"
              fill="hsl(var(--gold))"
              initial={{ opacity: 0, cy: SUMMIT.y - 22 }}
              animate={{ opacity: [0, 1, 0], cy: SUMMIT.y - 66 }}
              transition={{ duration: 0.9, delay: i * 0.05, ease: EASE }}
            />
          ))}
      </svg>
    </button>
  );
};
