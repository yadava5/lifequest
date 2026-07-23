import React from "react";
import { COLORS } from "../../theme";
import { SceneFrame, IsoCube } from "./primitives";

/**
 * INSIDE — the engine room. An isometric stack (the serverless function) beside
 * a ratchet wheel with a pawl: a gear that can only turn one way. It is the
 * monotonic lifetimeCoins ledger drawn as a mechanism — earned coins click the
 * wheel forward and a redemption can never wind it back. Teal is the accent.
 */
const LINE = COLORS.INK;
const ACCENT = COLORS.TEAL;

// Ratchet geometry
const GX = 128;
const GY = 176;
const GR = 40;
const TEETH = 12;

export const EngineRatchet: React.FC = () => {
  const teeth: React.ReactElement[] = [];
  for (let i = 0; i < TEETH; i++) {
    const a0 = (i / TEETH) * Math.PI * 2;
    const a1 = ((i + 0.5) / TEETH) * Math.PI * 2;
    const p0 = { x: GX + Math.cos(a0) * GR, y: GY + Math.sin(a0) * GR };
    const p1 = { x: GX + Math.cos(a1) * (GR - 7), y: GY + Math.sin(a1) * (GR - 7) };
    const a2 = ((i + 1) / TEETH) * Math.PI * 2;
    const p2 = { x: GX + Math.cos(a2) * GR, y: GY + Math.sin(a2) * GR };
    teeth.push(
      <path
        key={i}
        d={`M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} L ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`}
        fill="none"
        stroke={LINE}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />,
    );
  }

  return (
    <SceneFrame lineColor={LINE} cornerLabels={{ topLeft: "SERVERLESS", bottomRight: "MONOTONIC" }}>
      {/* Server stack — the one function */}
      <g transform="translate(58 96) scale(1.7)">
        <IsoCube origin={[-9, -9, 0]} size={[18, 18, 9]} strokeWidth={1} />
        <IsoCube origin={[-9, -9, 9]} size={[18, 18, 9]} strokeWidth={1} />
        <IsoCube origin={[-9, -9, 18]} size={[18, 18, 9]} strokeWidth={1} />
      </g>
      {/* label sits right of the stack with a short leader — centered it was
          overprinted by the cubes (stack spans x≈31-85, y≈35-111) */}
      <circle cx={85} cy={78} r={1.2} fill={LINE} opacity={0.6} />
      <line x1={85} y1={78} x2={91} y2={85} stroke={LINE} strokeWidth={0.5} strokeDasharray="3 2" opacity={0.5} />
      <text x={93} y={88} fontFamily="ui-monospace, monospace" fontSize={5.5} letterSpacing="1" fill={LINE} opacity={0.6}>
        api/index.ts
      </text>

      {/* Ratchet wheel */}
      <circle cx={GX} cy={GY} r={GR} fill={COLORS.SAND} stroke={LINE} strokeWidth={1.2} />
      {teeth}
      <circle cx={GX} cy={GY} r={9} fill="currentColor" fillOpacity={0.1} stroke={LINE} strokeWidth={1.1} />
      <circle cx={GX} cy={GY} r={2} fill={LINE} />

      {/* Pawl — allows only forward (up) motion, in accent */}
      <g style={{ color: ACCENT }}>
        <path d={`M ${GX + 4} ${GY - GR - 16} L ${GX + 10} ${GY - GR + 2} L ${GX - 4} ${GY - GR - 4}`} fill="currentColor" fillOpacity={0.25} stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
        {/* forward arrow around the wheel */}
        <path d={`M ${GX + GR - 2} ${GY - 14} A ${GR} ${GR} 0 0 1 ${GX + GR - 2} ${GY + 14}`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
        <path d={`M ${GX + GR - 2} ${GY + 14} l -6 -2 l 4 -5`} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Labels: lifetime only-up vs coins up/down */}
      <text x={GX} y={GY + GR + 18} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={6} fontWeight={700} fill={ACCENT}>
        lifetimeCoins ↑
      </text>
      <text x={GX} y={GY + GR + 27} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={5} letterSpacing="0.5" fill={LINE} opacity={0.6}>
        never winds back
      </text>
    </SceneFrame>
  );
};
