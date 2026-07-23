import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- *
 *  LifeQuestLogo — the LifeQuest wordmark, refined from concept A.
 *
 *  The mark is a Q drawn as a ¾ progress-ring: an amber arrow-tail breaks out
 *  of the gap, pointing on to the next quest, and a teal sparkle sits in the
 *  corner. The wordmark carries the same voice — an amber sparkle dots the "i"
 *  and an amber tail finishes the Q. Every colour is a live palette token
 *  (foreground / gold / teal / card / border), so the whole lockup re-themes
 *  itself between the dawn Day and lagoon Night palettes and stays strictly
 *  amber + teal — no purple, no gradients.
 *
 *  Micro-interaction (see `.lq-logo` in index.css): on hover/focus the ring
 *  fills gold — a quest completing — the arrow nudges toward the next one, and
 *  the two sparkles twinkle. It is entirely CSS-driven and disables itself
 *  under `prefers-reduced-motion: reduce`, rendering the calm resting mark.
 * -------------------------------------------------------------------------- */

const RING = 'M26.98,35.11 A11.5,11.5 0 1 1 35.11,26.98';

type Props = {
  /** Sizes the lockup — set a height (e.g. `h-7`); width follows the ratio. */
  className?: string;
  /** Accessible name for the mark. */
  title?: string;
};

export const LifeQuestLogo = ({ className, title = 'LifeQuest' }: Props) => (
  <span className="lq-logo">
    <svg
      viewBox="0 0 184.1 48"
      className={cn('h-7 w-auto text-foreground', className)}
      role="img"
      aria-label={title}
      focusable="false"
    >
      <title>{title}</title>

      {/* ── the mark: a quest-ring Q on a soft, theme-aware tile ── */}
      <rect
        x="0.75"
        y="0.75"
        width="46.5"
        height="46.5"
        rx="12"
        fill="hsl(var(--card))"
        stroke="hsl(var(--border))"
        strokeWidth="1.5"
      />

      {/* the ¾ ring — the resting Q, in ink */}
      <path d={RING} fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" />
      {/* the progress sweep — fills the ring gold on hover, hidden at rest */}
      <path
        className="lq-ring-sweep"
        d={RING}
        pathLength={1}
        fill="none"
        stroke="hsl(var(--gold))"
        strokeWidth="3.8"
        strokeLinecap="round"
      />

      {/* the arrow-tail breaking out to the next quest */}
      <g className="lq-arrow">
        <path
          d="M29.3,29.3 L35.8,35.8"
          stroke="hsl(var(--gold))"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M34.1,31.1 L35.8,35.8 L31.1,34.1"
          fill="none"
          stroke="hsl(var(--gold))"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* teal sparkle in the corner */}
      <path
        className="lq-spark lq-spark-teal"
        fill="hsl(var(--teal))"
        stroke="none"
        d="M12,8.6 C12.34,10.81 13.19,11.66 15.4,12 C13.19,12.34 12.34,13.19 12,15.4 C11.66,13.19 10.81,12.34 8.6,12 C10.81,11.66 11.66,10.81 12,8.6 Z"
      />

      {/* ── the wordmark: LifeQuest, outlined in ink ── */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0,14)"
      >
        <g transform="translate(64,0)">
          <path d="M0,0 L0,20 L11,20" />
        </g>
        <g transform="translate(78.4,0)">
          <path d="M1.6,7 L1.6,20" />
        </g>
        <g transform="translate(85,0)">
          <path d="M7.6,2.4 A4.2,4.2 0 0 0 3.4,6.6 L3.4,20" />
          <path d="M0,8.8 L7.6,8.8" />
        </g>
        <g transform="translate(96,0)">
          <path d="M0.28,12.1 L10.72,12.1 A5.35,6.5 0 1 0 8.57,18.82" />
        </g>
        <g transform="translate(110.4,0)">
          <path d="M0,5.75 A5.75,5.75 0 0 1 11.5,5.75 L11.5,14.25 A5.75,5.75 0 0 1 0,14.25 Z" />
        </g>
        <g transform="translate(125.3,0)">
          <path d="M0.15,7 L0.15,14.6 A5.35,5.4 0 0 0 10.85,14.6" />
          <path d="M10.85,7 L10.85,20" />
        </g>
        <g transform="translate(139.7,0)">
          <path d="M0.28,12.1 L10.72,12.1 A5.35,6.5 0 1 0 8.57,18.82" />
        </g>
        <g transform="translate(154.1,0)">
          <path d="M9.6,8.7 C8.4,6.9 2.0,6.4 1.85,9.75 C1.7,13.1 9.9,12.1 9.9,16.2 C9.9,19.8 2.8,20.5 1.15,18.1" />
        </g>
        <g transform="translate(168.5,0)">
          <path d="M3.4,2.6 L3.4,16.4 A3.6,3.6 0 0 0 7,20" />
          <path d="M0,7 L7.6,7" />
        </g>
      </g>

      {/* amber sparkle dotting the "i" */}
      <path
        className="lq-spark lq-spark-amber"
        fill="hsl(var(--gold))"
        stroke="none"
        d="M80,11.9 C80.4,14.5 81.4,15.5 84,15.9 C81.4,16.3 80.4,17.3 80,19.9 C79.6,17.3 78.6,16.3 76,15.9 C78.6,15.5 79.6,14.5 80,11.9 Z"
      />
      {/* amber tail finishing the Q */}
      <path
        d="M117.8,29.2 L122.4,34.8"
        stroke="hsl(var(--gold))"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </span>
);
