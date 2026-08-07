import React from "react";
import { COLORS } from "../theme";

/**
 * TrailField — the cover motif: a dawn expedition map on warm parchment with a
 * faint dotted map grid, soft ridgelines, and a dawn glow. Two variants that
 * bracket the book rather than mirror each other:
 *
 *   front — the ASK. A dashed route switchbacks the full width of the page,
 *           from a "you are here" cairn lower-right through glowing waypoints
 *           to a coral summit beacon. Only the first leg is lit: the climb is
 *           still ahead. (The old route hugged one narrow column and left the
 *           whole left half of the cover dead; the switchbacks now swing to
 *           x≈250 so the page composes edge to edge.)
 *
 *   back  — the ANSWER. The same journey, completed: one calm solid line
 *           enters from the spine edge — out of the book itself — with every
 *           waypoint collected (small, solid, quiet) and the flag planted.
 *           Past the summit a dashed coral leg carries on through the top
 *           bleed: the idea handed onward, which is what the closing line on
 *           that page says in words.
 *
 * All vector: strokes + discs on a #FDFBF7 ground with a low-alpha grain.
 * No blend-modes, masks, or external images (PDF-safe).
 */

export type TrailFieldProps = {
  widthIn: number;
  heightIn: number;
  variant: "front" | "back";
  seed?: string;
};

const VB_W = 875;
const VB_H = 1125;

// --- deterministic PRNG (for the faint map dots only) ----------------------
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}
function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// FRONT — the ask. Hand-placed so the climb reads intentional. The trailhead
// sits at y≈846 — ABOVE the cover's title-block scrim — so the cairn, the lit
// first leg, and every waypoint stay fully readable; nothing half-drowns
// behind the title. Waypoints sit on the curve: the two mid-sweep ones are the
// exact t=0.5 points of their cubics, the others are the turn endpoints.
// ---------------------------------------------------------------------------
const FRONT_TRAIL =
  "M 650 834 C 622 794 668 772 640 740" + // lit first leg → sky waypoint
  " C 560 660 330 660 250 560" + //          long sweep to the far-left turn
  " C 170 460 430 470 610 400" + //          switchback across to the right turn
  " C 690 368 560 300 470 196"; //           final approach to the summit
/** First curve of FRONT_TRAIL — re-stroked solid (partial) as the lit first leg. */
const FRONT_FIRST_LEG = "M 650 834 C 622 794 668 772 640 740";

type WP = { x: number; y: number; r: number; c: string };
const FRONT_WAYPOINTS: WP[] = [
  { x: 640, y: 740, r: 13, c: COLORS.SKY },
  { x: 445, y: 657, r: 14, c: COLORS.TEAL },
  { x: 250, y: 560, r: 14, c: COLORS.TEAL },
  { x: 332, y: 469, r: 15, c: COLORS.GOLD },
  { x: 610, y: 400, r: 15, c: COLORS.GOLD },
];
const FRONT_SUMMIT = { x: 470, y: 196, r: 19 };

// ---------------------------------------------------------------------------
// BACK — the answer. One smooth arc from the spine edge to the summit ("in
// retrospect the climb looks simple"), waypoints at computed on-curve points.
// ONWARD starts just clear of the planted flag and exits through the top
// bleed, so the trim itself cuts the line mid-stride.
// ---------------------------------------------------------------------------
// Bleed-crossing geometry stays just inside the 875×1125 viewBox: the trim
// edge is 12.5 units in from every side, so a path ending at x=872 / y=2 still
// runs off the *printed* page once trimmed — without tripping clipcheck's
// escapes-page gate the way literal out-of-box coordinates would.
const BACK_TRAIL = "M 872 700 C 700 690 560 640 470 540 C 380 440 420 330 520 260";
const BACK_WAYPOINTS: WP[] = [
  { x: 759, y: 685, r: 12, c: COLORS.SKY_DEEP },
  { x: 602, y: 637, r: 13, c: COLORS.TEAL_DEEP },
  { x: 498, y: 568, r: 13, c: COLORS.TEAL_DEEP },
  { x: 420, y: 434, r: 14, c: COLORS.GOLD_DEEP },
  { x: 448, y: 333, r: 14, c: COLORS.GOLD_DEEP },
];
const BACK_SUMMIT = { x: 520, y: 260, r: 17 };
const ONWARD = "M 560 226 C 616 172 620 108 600 2";

/** Front waypoint: glowing halo ring — a station still ahead. */
const Waypoint: React.FC<WP> = ({ x, y, r, c }) => (
  <g>
    {/* soft glow */}
    <circle cx={x} cy={y} r={r * 2.1} fill={c} fillOpacity={0.08} />
    {/* halo ring */}
    <circle cx={x} cy={y} r={r * 1.35} fill="none" stroke={c} strokeWidth={1.6} strokeOpacity={0.5} />
    {/* core */}
    <circle cx={x} cy={y} r={r} fill={COLORS.PAPER} stroke={c} strokeWidth={2.4} />
    <circle cx={x} cy={y} r={r * 0.42} fill={c} />
  </g>
);

/** Back waypoint: collected — a solid deep-ink seal, no glow left to give. */
const Collected: React.FC<WP> = ({ x, y, r, c }) => (
  <g>
    <circle cx={x} cy={y} r={r * 1.3} fill="none" stroke={c} strokeWidth={1.2} strokeOpacity={0.45} />
    <circle cx={x} cy={y} r={r * 0.72} fill={c} />
  </g>
);

function buildDots(seed: string, variant: TrailFieldProps["variant"]) {
  const rand = mulberry32(xmur3(`${seed}::${variant}::dots`)());
  const dots: { x: number; y: number; o: number }[] = [];
  const cols = 11;
  const rows = 15;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rand() < 0.4) continue;
      const x = (c + 0.5) * (VB_W / cols) + (rand() - 0.5) * 20;
      const y = (r + 0.5) * (VB_H / rows) + (rand() - 0.5) * 20;
      dots.push({ x, y, o: 0.05 + rand() * 0.06 });
    }
  }
  return dots;
}

export const TrailField: React.FC<TrailFieldProps> = ({ widthIn, heightIn, variant, seed = "lifequest-2026" }) => {
  void widthIn;
  void heightIn;
  const dots = React.useMemo(() => buildDots(seed, variant), [seed, variant]);
  const front = variant === "front";
  const grainId = `trail-grain-${variant}`;
  const glowId = `dawn-glow-${variant}`;
  // The dawn glow tracks each variant's own summit.
  const summit = front ? FRONT_SUMMIT : BACK_SUMMIT;
  const glowCx = `${Math.round((summit.x / VB_W) * 100)}%`;
  const glowCy = `${Math.round(((summit.y + 30) / VB_H) * 100)}%`;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={glowId} cx={glowCx} cy={glowCy} r="62%">
          <stop offset="0%" stopColor={COLORS.CORAL} stopOpacity={0.16} />
          <stop offset="42%" stopColor={COLORS.GOLD} stopOpacity={0.08} />
          <stop offset="100%" stopColor={COLORS.PAPER} stopOpacity="0" />
        </radialGradient>
        <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" seed={front ? 7 : 13} />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.50  0 0 0 0 0.42  0 0 0 0.05 0" />
        </filter>
      </defs>

      {/* Warm parchment ground */}
      <rect x={0} y={0} width={VB_W} height={VB_H} fill={COLORS.PAPER} />
      {/* Dawn glow near the summit */}
      <rect x={0} y={0} width={VB_W} height={VB_H} fill={`url(#${glowId})`} />

      {/* Faint dotted map grid */}
      <g>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={1.4} fill={COLORS.INK} fillOpacity={d.o} />
        ))}
      </g>

      {/* Soft ridgelines (a couple, faint — terrain, not contours). Endpoints
          sit at x=2/873 — inside the viewBox but past the trim at 12.5/862.5,
          so they still bleed off the printed page (see BACK_TRAIL note). */}
      {front ? (
        <g stroke={COLORS.INK} strokeOpacity={0.12} fill="none" strokeLinejoin="round">
          <path d="M 2 470 L 150 380 L 300 440 L 470 330 L 640 420 L 873 320" strokeWidth={1.4} />
          <path d="M 2 660 L 190 600 L 360 650 L 560 560 L 760 630 L 873 580" strokeWidth={1.2} strokeOpacity={0.09} />
        </g>
      ) : (
        <g stroke={COLORS.INK} strokeOpacity={0.12} fill="none" strokeLinejoin="round">
          <path d="M 2 540 L 160 460 L 330 520 L 520 420 L 700 500 L 873 400" strokeWidth={1.4} />
          <path d="M 2 840 L 200 780 L 400 830 L 600 740 L 780 800 L 873 760" strokeWidth={1.2} strokeOpacity={0.09} />
        </g>
      )}

      {front ? (
        // ── FRONT: the ask ──────────────────────────────────────────────────
        <g>
          {/* dashed trail */}
          <path d={FRONT_TRAIL} fill="none" stroke={COLORS.INK} strokeWidth={2.4} strokeOpacity={0.42} strokeDasharray="7 8" strokeLinecap="round" />
          {/* lit first leg (coral-warm) — the first ~64 units of the trail's own
              first curve, so the lit stretch lies exactly on the route */}
          <path d={FRONT_FIRST_LEG} fill="none" stroke={COLORS.CORAL} strokeWidth={3} strokeOpacity={0.8} strokeLinecap="round" strokeDasharray="64 999" />

          {/* cairn at the trailhead */}
          <g transform="translate(650 846)">
            <ellipse cx={0} cy={16} rx={20} ry={7} fill={COLORS.INK} fillOpacity={0.08} stroke={COLORS.INK} strokeWidth={1.6} strokeOpacity={0.5} />
            <ellipse cx={0} cy={5} rx={15} ry={6} fill={COLORS.INK} fillOpacity={0.06} stroke={COLORS.INK} strokeWidth={1.6} strokeOpacity={0.5} />
            <ellipse cx={0} cy={-4} rx={10} ry={5} fill={COLORS.SKY} fillOpacity={0.4} stroke={COLORS.SKY} strokeWidth={1.6} />
          </g>

          {FRONT_WAYPOINTS.map((w, i) => (
            <Waypoint key={i} {...w} />
          ))}

          {/* Summit beacon (coral, rayed — still calling) */}
          <g>
            <circle cx={FRONT_SUMMIT.x} cy={FRONT_SUMMIT.y} r={FRONT_SUMMIT.r * 2.6} fill={COLORS.CORAL} fillOpacity={0.1} />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={FRONT_SUMMIT.x + Math.cos(a) * (FRONT_SUMMIT.r + 6)}
                  y1={FRONT_SUMMIT.y + Math.sin(a) * (FRONT_SUMMIT.r + 6)}
                  x2={FRONT_SUMMIT.x + Math.cos(a) * (FRONT_SUMMIT.r + 18)}
                  y2={FRONT_SUMMIT.y + Math.sin(a) * (FRONT_SUMMIT.r + 18)}
                  stroke={COLORS.CORAL}
                  strokeWidth={2}
                  strokeOpacity={0.6}
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx={FRONT_SUMMIT.x} cy={FRONT_SUMMIT.y} r={FRONT_SUMMIT.r} fill={COLORS.CORAL} fillOpacity={0.9} />
            {/* flag on the summit */}
            <line x1={FRONT_SUMMIT.x} y1={FRONT_SUMMIT.y - FRONT_SUMMIT.r} x2={FRONT_SUMMIT.x} y2={FRONT_SUMMIT.y - FRONT_SUMMIT.r - 26} stroke={COLORS.INK} strokeWidth={2.4} strokeLinecap="round" />
            <path d={`M ${FRONT_SUMMIT.x} ${FRONT_SUMMIT.y - FRONT_SUMMIT.r - 24} l 26 6 l -26 8 z`} fill={COLORS.CORAL} stroke={COLORS.INK} strokeWidth={1.2} strokeLinejoin="round" />
          </g>
        </g>
      ) : (
        // ── BACK: the answer ────────────────────────────────────────────────
        <g>
          {/* the completed route — solid, calm */}
          <path d={BACK_TRAIL} fill="none" stroke={COLORS.INK} strokeWidth={2.6} strokeOpacity={0.5} strokeLinecap="round" />

          {BACK_WAYPOINTS.map((w, i) => (
            <Collected key={i} {...w} />
          ))}

          {/* Summit, arrived: glow but no rays — it no longer needs to call */}
          <g>
            <circle cx={BACK_SUMMIT.x} cy={BACK_SUMMIT.y} r={BACK_SUMMIT.r * 2.6} fill={COLORS.CORAL} fillOpacity={0.1} />
            <circle cx={BACK_SUMMIT.x} cy={BACK_SUMMIT.y} r={BACK_SUMMIT.r} fill={COLORS.CORAL} fillOpacity={0.9} />
            <line x1={BACK_SUMMIT.x} y1={BACK_SUMMIT.y - BACK_SUMMIT.r} x2={BACK_SUMMIT.x} y2={BACK_SUMMIT.y - BACK_SUMMIT.r - 26} stroke={COLORS.INK} strokeWidth={2.4} strokeLinecap="round" />
            <path d={`M ${BACK_SUMMIT.x} ${BACK_SUMMIT.y - BACK_SUMMIT.r - 24} l 26 6 l -26 8 z`} fill={COLORS.CORAL} stroke={COLORS.INK} strokeWidth={1.2} strokeLinejoin="round" />
          </g>

          {/* the onward leg — dashed coral, out through the top bleed */}
          <path d={ONWARD} fill="none" stroke={COLORS.CORAL} strokeWidth={2.6} strokeOpacity={0.7} strokeDasharray="7 8" strokeLinecap="round" />
        </g>
      )}

      {/* Grain (last, over everything) */}
      <rect x={0} y={0} width={VB_W} height={VB_H} filter={`url(#${grainId})`} pointerEvents="none" opacity={0.85} />
    </svg>
  );
};
