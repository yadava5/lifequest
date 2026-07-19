import React from "react";
import { COLORS } from "../../theme";
import { SceneFrame } from "./primitives";

/**
 * WHY — the quiet climb. A dawn sun rises over a ridge; a switchback trail
 * climbs from a "you are here" cairn toward a distant summit. Ink linework on
 * the warm divider ground; sky is the single accent — the cold, hopeful light
 * before the ascent. The trail is mostly dashed (not yet walked); only the
 * first segment, at the trailhead, is lit.
 */
const LINE = COLORS.INK;
const ACCENT = COLORS.SKY;

export const TrailheadDawn: React.FC = () => (
  <SceneFrame lineColor={LINE} cornerLabels={{ topLeft: "DAWN", bottomRight: "TRAILHEAD" }}>
    {/* Sun — low on the horizon, in sky accent, with soft rays */}
    <g style={{ color: ACCENT }}>
      <circle cx={108} cy={92} r={26} fill="currentColor" fillOpacity={0.14} stroke="currentColor" strokeWidth={1.4} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (Math.PI * (i + 0.5)) / 10; // upper half rays
        const x1 = 108 + Math.cos(a) * 33;
        const y1 = 92 - Math.sin(a) * 33;
        const x2 = 108 + Math.cos(a) * 41;
        const y2 = 92 - Math.sin(a) * 41;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={1.1} strokeOpacity={0.7} strokeLinecap="round" />;
      })}
    </g>

    {/* Distant ridgeline */}
    <path d="M 12 118 L 60 96 L 96 112 L 138 84 L 176 108 L 204 96" fill="none" stroke={LINE} strokeWidth={1} strokeOpacity={0.35} strokeLinejoin="round" />

    {/* Horizon */}
    <line x1={10} y1={140} x2={206} y2={140} stroke={LINE} strokeWidth={0.8} strokeOpacity={0.4} />

    {/* Switchback trail — climbing from the cairn (bottom) toward the summit */}
    <path
      d="M 96 258 C 96 236 150 232 150 210 C 150 190 78 190 78 168 C 78 150 132 150 138 132"
      fill="none"
      stroke={LINE}
      strokeWidth={1.3}
      strokeOpacity={0.6}
      strokeDasharray="4 4"
      strokeLinecap="round"
    />
    {/* First (lit) trail segment, in accent */}
    <path d="M 96 258 C 96 244 118 240 130 236" fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" />

    {/* Summit marker at trail's end */}
    <g>
      <path d="M 138 132 l 0 -14 l 12 5 l -12 5" fill={ACCENT} stroke={ACCENT} strokeWidth={1} strokeLinejoin="round" />
      <circle cx={138} cy={132} r={2} fill={LINE} />
    </g>

    {/* Cairn — stacked stones at the trailhead (you are here) */}
    <g>
      <ellipse cx={96} cy={262} rx={13} ry={5} fill="currentColor" fillOpacity={0.1} stroke={LINE} strokeWidth={1.1} />
      <ellipse cx={96} cy={253} rx={10} ry={4.5} fill="currentColor" fillOpacity={0.12} stroke={LINE} strokeWidth={1.1} />
      <ellipse cx={96} cy={245} rx={7} ry={4} fill="currentColor" fillOpacity={0.14} stroke={LINE} strokeWidth={1.1} />
      <ellipse cx={96} cy={238} rx={4.5} ry={3.2} fill={ACCENT} fillOpacity={0.5} stroke={ACCENT} strokeWidth={1} />
    </g>
    <g style={{ color: ACCENT }}>
      <circle cx={96} cy={275} r={7} fill="none" stroke="currentColor" strokeWidth={0.8} strokeOpacity={0.5} />
      <circle cx={96} cy={275} r={2.4} fill="currentColor" />
    </g>
  </SceneFrame>
);
