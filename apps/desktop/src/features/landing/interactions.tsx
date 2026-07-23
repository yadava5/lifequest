import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { Coins } from 'phosphor-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- *
 *  Landing micro-interactions — a small, restrained toolkit.
 *
 *  Every primitive is reduced-motion safe: when the visitor prefers less
 *  motion it renders at the resolved / final state with no transform, no
 *  cursor tracking, no timers. Everything is keyboard-reachable and adds no
 *  layout cost (transforms + opacity only). Warm dawn palette only — the glow
 *  colour is one of coral / gold / teal / sky, never anything cooler.
 * -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

type GlowTone = 'coral' | 'gold' | 'teal' | 'sky';
const TONE_VAR: Record<GlowTone, string> = {
  coral: '--coral',
  gold: '--gold',
  teal: '--teal',
  sky: '--sky',
};

/**
 * GlowCard — a card that answers the cursor: a warm radial glow tracks the
 * pointer, a 1px "beam" border lights where the cursor is, and (opt-in) the
 * whole card tilts a few degrees toward it. Pointer work is written straight
 * to CSS variables in a rAF, so hovering never re-renders React.
 */
export const GlowCard = ({
  children,
  className,
  glow = 'coral',
  tilt = false,
  beam = true,
  style,
  ...rest
}: ComponentProps<'div'> & {
  glow?: GlowTone;
  tilt?: boolean;
  beam?: boolean;
}) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--gx', `${px}px`);
      el.style.setProperty('--gy', `${py}px`);
      if (tilt) {
        const rx = ((py / rect.height - 0.5) * -5).toFixed(2);
        const ry = ((px / rect.width - 0.5) * 5).toFixed(2);
        el.style.setProperty('--rx', `${rx}deg`);
        el.style.setProperty('--ry', `${ry}deg`);
      }
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--go', '0');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };
  const activate = () => {
    if (reduced) return;
    ref.current?.style.setProperty('--go', '1');
  };

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    [],
  );

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={activate}
      onPointerLeave={reset}
      className={cn('group/glow relative isolate', className)}
      style={
        {
          '--glow': `var(${TONE_VAR[glow]})`,
          transform: tilt
            ? 'perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))'
            : undefined,
          transition: tilt ? 'transform 0.3s cubic-bezier(0.22,1,0.36,1)' : undefined,
          transformStyle: tilt ? 'preserve-3d' : undefined,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      {/* radial warm glow — follows the cursor, fades in on enter */}
      {!reduced && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: 'var(--go,0)',
            background:
              'radial-gradient(230px circle at var(--gx,50%) var(--gy,50%), hsl(var(--glow) / 0.14), transparent 60%)',
          }}
        />
      )}
      {/* beam border — a 1px edge that lights where the pointer is */}
      {!reduced && beam && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: 'var(--go,0)',
            padding: '1px',
            background:
              'radial-gradient(200px circle at var(--gx,50%) var(--gy,50%), hsl(var(--glow) / 0.55), transparent 62%)',
            WebkitMask:
              'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}
      {children}
    </div>
  );
};

/**
 * Magnetic — nudges its child toward the cursor while hovered, then springs
 * back on leave. Used sparingly on the primary CTA.
 */
export const Magnetic = ({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={reduced ? undefined : { x, y }}
      className={cn('inline-flex', className)}
    >
      {children}
    </motion.div>
  );
};

/**
 * CountUp — rolls a number up from `from` to `value` the first time it scrolls
 * into view, then tweens smoothly on any later change (so game stats feel
 * alive without a wall of jumping digits). Reduced motion shows the final
 * value immediately.
 */
export const CountUp = ({
  value,
  from = 0,
  duration = 1.1,
  className,
  format = (n: number) => Math.round(n).toLocaleString(),
  ...rest
}: {
  value: number;
  from?: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
} & Omit<ComponentProps<'span'>, 'children'>) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(from);
  const [display, setDisplay] = useState(() => format(reduced ? value : from));
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(format(value));
      return;
    }
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: started.current ? 0.5 : duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(format(v)),
    });
    started.current = true;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduced]);

  return (
    <span ref={ref} className={className} {...rest}>
      {display}
    </span>
  );
};

/**
 * ScrambleText — a key headline that decodes into place on first view and
 * whose letters lift toward the cursor as it passes (a restrained nod to
 * cursor-reactive display type). Reduced motion renders the plain, resolved
 * word with no timers and no pointer tracking.
 */
const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ◆◇▲●+*·';

export const ScrambleText = ({
  text,
  className,
  lift = 6,
}: {
  text: string;
  className?: string;
  lift?: number;
}) => {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: '-60px' });
  const chars = [...text];
  const randGlyph = () => SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
  const [shown, setShown] = useState<string[]>(() =>
    // Start from stable-width glyphs (not blanks) so the headline never flashes
    // an empty/collapsed layout before decoding.
    reduced ? chars : chars.map((c) => (c === ' ' ? ' ' : randGlyph())),
  );

  // decode-in: each glyph flickers through a random symbol, then locks
  // left-to-right. Settles in ~0.5s (≈ chars + 3 frames × 28ms) so the headline
  // reads clearly almost immediately — no lingering ~1s of garbled text.
  useEffect(() => {
    if (reduced || !inView) return;
    let frame = 0;
    const total = chars.length;
    const id = window.setInterval(() => {
      frame += 1;
      setShown(
        chars.map((c, i) => {
          if (c === ' ') return ' ';
          const lockAt = i + 3;
          return frame >= lockAt ? c : randGlyph();
        }),
      );
      if (frame >= total + 3) {
        window.clearInterval(id);
        setShown(chars);
      }
    }, 28);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  // cursor-reactive lift: letters near the pointer rise + warm slightly.
  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reduced || e.pointerType === 'touch') return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const letters = wrap.querySelectorAll<HTMLElement>('[data-ch]');
    letters.forEach((el) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const f = Math.max(0, 1 - dist / 90);
      el.style.transform = `translateY(${(-lift * f).toFixed(2)}px)`;
      el.style.color = f > 0.05 ? 'hsl(var(--coral))' : '';
    });
  };
  const onLeave = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.querySelectorAll<HTMLElement>('[data-ch]').forEach((el) => {
      el.style.transform = '';
      el.style.color = '';
    });
  };

  return (
    <span
      ref={wrapRef}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={text}
    >
      {chars.map((c, i) => (
        <span
          key={i}
          data-ch
          aria-hidden
          className="inline-block transition-[transform,color] duration-150 ease-out will-change-transform"
          style={{ transform: 'none' }}
        >
          {shown[i] === ' ' ? ' ' : shown[i] || ' '}
        </span>
      ))}
    </span>
  );
};

/**
 * CoinBurst — a few honey coins that pop up and fade when a quest lands.
 * Purely decorative and reduced-motion silent.
 */
export const CoinBurst = ({ fire }: { fire: number }) => {
  const reduced = useReducedMotion();
  if (reduced || fire === 0) return null;
  const coins = [-26, -8, 10, 26];
  return (
    <span className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
      {coins.map((dx, i) => (
        <motion.span
          key={`${fire}-${i}`}
          initial={{ opacity: 0, y: 6, scale: 0.6 }}
          animate={{ opacity: [0, 1, 0], y: -34, x: dx, scale: [0.6, 1, 0.9] }}
          transition={{ duration: 0.9, delay: i * 0.05, ease: EASE }}
          className="absolute"
        >
          <Coins size={16} weight="fill" className="text-gold drop-shadow" />
        </motion.span>
      ))}
    </span>
  );
};
