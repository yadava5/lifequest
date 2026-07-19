import React from "react";
import { COLORS } from "../../theme";
import { SceneFrame } from "./primitives";

/**
 * HOW — the playable loop. Three beats (Pick · Log · Claim) arranged on a
 * ring with directional arrows; a coin bursts at "Log the win", where the
 * payout lands. Coral is the accent — the quest, the primary action.
 */
const LINE = COLORS.INK;
const ACCENT = COLORS.CORAL;

const NODES = [
  { a: -90, label: "PICK" },
  { a: 30, label: "LOG" },
  { a: 150, label: "CLAIM" },
];
const CX = 108;
const CY = 150;
const R = 66;

const pt = (deg: number, r = R) => ({
  x: CX + Math.cos((deg * Math.PI) / 180) * r,
  y: CY + Math.sin((deg * Math.PI) / 180) * r,
});

export const QuestLoop: React.FC = () => (
  <SceneFrame lineColor={LINE} cornerLabels={{ topLeft: "THE LOOP", bottomRight: "PICK · LOG · CLAIM" }}>
    {/* Ring */}
    <circle cx={CX} cy={CY} r={R} fill="none" stroke={LINE} strokeWidth={1.1} strokeOpacity={0.4} strokeDasharray="3 4" />

    {/* Directional arcs between nodes (in accent) */}
    {NODES.map((n, i) => {
      const next = NODES[(i + 1) % 3];
      if (!next) return null;
      const from = pt(n.a + 16);
      const to = pt(next.a - 16);
      return (
        <g key={i} style={{ color: ACCENT }}>
          <path
            d={`M ${from.x.toFixed(1)} ${from.y.toFixed(1)} A ${R} ${R} 0 0 1 ${to.x.toFixed(1)} ${to.y.toFixed(1)}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <circle cx={to.x} cy={to.y} r={2.4} fill="currentColor" />
        </g>
      );
    })}

    {/* Nodes */}
    {NODES.map((n) => {
      const p = pt(n.a);
      const isLog = n.label === "LOG";
      return (
        <g key={n.label}>
          <circle cx={p.x} cy={p.y} r={13} fill={COLORS.SAND} stroke={isLog ? ACCENT : LINE} strokeWidth={isLog ? 2 : 1.2} />
          <text x={p.x} y={p.y + 2.6} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={6} fontWeight={700} fill={isLog ? ACCENT : LINE}>
            {n.label}
          </text>
        </g>
      );
    })}

    {/* Coin burst at LOG (right node) */}
    {(() => {
      const p = pt(30);
      return (
        <g style={{ color: COLORS.GOLD }} transform={`translate(${(p.x + 26).toFixed(1)} ${(p.y - 22).toFixed(1)})`}>
          <circle r={9} fill="currentColor" fillOpacity={0.2} stroke="currentColor" strokeWidth={1.4} />
          <text x={0} y={3} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={8} fontWeight={700} fill="currentColor">
            ◎
          </text>
          {[0, 60, 120, 180, 240, 300].map((d) => {
            const rx = Math.cos((d * Math.PI) / 180);
            const ry = Math.sin((d * Math.PI) / 180);
            return <line key={d} x1={rx * 12} y1={ry * 12} x2={rx * 16} y2={ry * 16} stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeOpacity={0.8} />;
          })}
        </g>
      );
    })()}

    {/* Center label */}
    <text x={CX} y={CY - 2} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={6.5} letterSpacing="1" fill={LINE} opacity={0.6}>
      then
    </text>
    <text x={CX} y={CY + 7} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={6.5} letterSpacing="1" fill={LINE} opacity={0.6}>
      go again
    </text>
  </SceneFrame>
);
