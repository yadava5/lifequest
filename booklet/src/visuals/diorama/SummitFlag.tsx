import React from "react";
import { COLORS } from "../../theme";
import { SceneFrame } from "./primitives";

/**
 * PROOF — the summit reached. A peak with a planted flag, and a stack of coins
 * at the base: the receipts. Honey-gold is the accent — the coins, the reward,
 * the proof that the climb paid out and persisted.
 */
const LINE = COLORS.INK;
const ACCENT = COLORS.GOLD;

export const SummitFlag: React.FC = () => (
  <SceneFrame lineColor={LINE} cornerLabels={{ topLeft: "SUMMIT", bottomRight: "THE RECEIPTS" }}>
    {/* Mountain */}
    <path d="M 40 210 L 108 70 L 176 210 Z" fill="currentColor" fillOpacity={0.06} stroke={LINE} strokeWidth={1.3} strokeLinejoin="round" />
    {/* Snow cap */}
    <path d="M 92 100 L 108 70 L 124 100 L 116 96 L 108 104 L 100 96 Z" fill="currentColor" fillOpacity={0.14} stroke={LINE} strokeWidth={0.9} strokeLinejoin="round" />
    {/* A subtle secondary ridge */}
    <path d="M 62 210 L 120 128" fill="none" stroke={LINE} strokeWidth={0.7} strokeOpacity={0.3} />

    {/* Flag at the summit, in accent */}
    <g style={{ color: ACCENT }}>
      <line x1={108} y1={70} x2={108} y2={44} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M 108 46 L 132 52 L 108 60 Z" fill="currentColor" fillOpacity={0.85} stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
      <circle cx={108} cy={70} r={2.4} fill="currentColor" />
    </g>

    {/* Coin stack — the receipts — at the base */}
    <g style={{ color: ACCENT }} transform="translate(108 232)">
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={0} cy={-i * 9} rx={22} ry={7} fill="currentColor" fillOpacity={i === 3 ? 0.28 : 0.16} stroke="currentColor" strokeWidth={1.2} />
      ))}
      <text x={0} y={-24} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={9} fontWeight={700} fill="currentColor">
        ◎
      </text>
    </g>
    <text x={108} y={262} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={5.5} letterSpacing="1" fill={LINE} opacity={0.6}>
      earned · persisted
    </text>
  </SceneFrame>
);
