import React from "react";
import { COLORS } from "../theme";

/**
 * TrailField — the cover motif: a dawn expedition map. A single mission trail
 * climbs from a lower "you are here" cairn through glowing waypoints — sky
 * (community), teal (wellness), honey (reward) — resolving toward a CORAL
 * summit beacon at the top. Warm parchment ground with a faint dotted map
 * grid and a soft dawn glow; no topographic contours, no envelopes.
 *
 *   front    — the full route resolving to the summit.
 *   back     — reseeded + shifted so the spread reads as one continuous map.
 *   endpaper — sparse and faint.
 *
 * All vector: strokes + discs on a #FDFBF7 ground with a low-alpha grain.
 * No blend-modes, masks, or external images (PDF-safe).
 */

export type TrailFieldProps = {
  widthIn: number;
  heightIn: number;
  variant: "front" | "back" | "endpaper";
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

// The front route + its waypoints, hand-placed so the climb reads intentional.
const TRAIL =
  "M 612 1016 C 560 902 706 846 644 744 C 592 656 430 668 470 548 C 502 456 646 476 604 366 C 574 286 476 306 456 212";

type WP = { x: number; y: number; r: number; c: string };
const WAYPOINTS: WP[] = [
  { x: 612, y: 1010, r: 13, c: COLORS.SKY },
  { x: 650, y: 838, r: 13, c: COLORS.SKY },
  { x: 505, y: 648, r: 14, c: COLORS.TEAL },
  { x: 604, y: 470, r: 14, c: COLORS.TEAL },
  { x: 512, y: 392, r: 15, c: COLORS.GOLD },
  { x: 472, y: 302, r: 15, c: COLORS.GOLD },
];
const SUMMIT = { x: 456, y: 212, r: 19, c: COLORS.CORAL };

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
  const endpaper = variant === "endpaper";
  const grainId = `trail-grain-${variant}`;
  const glowId = `dawn-glow-${variant}`;

  // back reads as a continuation: shift + mirror-ish, dimmed.
  const routeTransform = variant === "back" ? "translate(120 0) scale(-1 1) translate(-875 0)" : undefined;
  const routeOpacity = endpaper ? 0.28 : variant === "back" ? 0.5 : 1;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={glowId} cx="52%" cy="20%" r="62%">
          <stop offset="0%" stopColor={COLORS.CORAL} stopOpacity={endpaper ? 0.06 : 0.16} />
          <stop offset="42%" stopColor={COLORS.GOLD} stopOpacity={endpaper ? 0.03 : 0.08} />
          <stop offset="100%" stopColor={COLORS.PAPER} stopOpacity="0" />
        </radialGradient>
        <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" seed={variant === "front" ? 7 : variant === "back" ? 13 : 21} />
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

      {/* Soft ridgelines (a couple, faint — terrain, not contours) */}
      <g stroke={COLORS.INK} strokeOpacity={0.12} fill="none" strokeLinejoin="round">
        <path d="M -10 470 L 150 380 L 300 440 L 470 330 L 640 420 L 885 320" strokeWidth={1.4} />
        <path d="M -10 620 L 190 560 L 360 610 L 560 520 L 760 590 L 885 540" strokeWidth={1.2} strokeOpacity={0.09} />
      </g>

      {/* The route + waypoints + summit */}
      <g opacity={routeOpacity} transform={routeTransform}>
        {/* dashed trail */}
        <path d={TRAIL} fill="none" stroke={COLORS.INK} strokeWidth={2.4} strokeOpacity={0.42} strokeDasharray="7 8" strokeLinecap="round" />
        {/* lit first leg (coral-warm) */}
        <path d="M 612 1016 C 588 968 636 940 648 902" fill="none" stroke={COLORS.CORAL} strokeWidth={3} strokeOpacity={0.8} strokeLinecap="round" />

        {/* cairn at the trailhead */}
        <g transform="translate(612 1016)">
          <ellipse cx={0} cy={16} rx={20} ry={7} fill={COLORS.INK} fillOpacity={0.08} stroke={COLORS.INK} strokeWidth={1.6} strokeOpacity={0.5} />
          <ellipse cx={0} cy={5} rx={15} ry={6} fill={COLORS.INK} fillOpacity={0.06} stroke={COLORS.INK} strokeWidth={1.6} strokeOpacity={0.5} />
          <ellipse cx={0} cy={-4} rx={10} ry={5} fill={COLORS.SKY} fillOpacity={0.4} stroke={COLORS.SKY} strokeWidth={1.6} />
        </g>

        {!endpaper && WAYPOINTS.map((w, i) => <Waypoint key={i} {...w} />)}

        {/* Summit beacon (coral) */}
        <g>
          <circle cx={SUMMIT.x} cy={SUMMIT.y} r={SUMMIT.r * 2.6} fill={COLORS.CORAL} fillOpacity={0.1} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={SUMMIT.x + Math.cos(a) * (SUMMIT.r + 6)}
                y1={SUMMIT.y + Math.sin(a) * (SUMMIT.r + 6)}
                x2={SUMMIT.x + Math.cos(a) * (SUMMIT.r + 18)}
                y2={SUMMIT.y + Math.sin(a) * (SUMMIT.r + 18)}
                stroke={COLORS.CORAL}
                strokeWidth={2}
                strokeOpacity={0.6}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={SUMMIT.x} cy={SUMMIT.y} r={SUMMIT.r} fill={COLORS.CORAL} fillOpacity={0.9} />
          {/* flag on the summit */}
          <line x1={SUMMIT.x} y1={SUMMIT.y - SUMMIT.r} x2={SUMMIT.x} y2={SUMMIT.y - SUMMIT.r - 26} stroke={COLORS.INK} strokeWidth={2.4} strokeLinecap="round" />
          <path d={`M ${SUMMIT.x} ${SUMMIT.y - SUMMIT.r - 24} l 26 6 l -26 8 z`} fill={COLORS.CORAL} stroke={COLORS.INK} strokeWidth={1.2} strokeLinejoin="round" />
        </g>
      </g>

      {/* Grain (last, over everything) */}
      <rect x={0} y={0} width={VB_W} height={VB_H} filter={`url(#${grainId})`} pointerEvents="none" opacity={0.85} />
    </svg>
  );
};
