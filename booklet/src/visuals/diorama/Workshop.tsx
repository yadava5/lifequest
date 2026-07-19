import React from "react";
import { COLORS } from "../../theme";
import { SceneFrame, IsoPlane } from "./primitives";

/**
 * BUILD — the workshop. One workbench, two outputs: a native desktop window
 * (the Tauri shell) and a browser window (the Vercel web build), forged from a
 * single `dist/`. Warm stone is the accent — the deliberately neutral bench.
 */
const LINE = COLORS.INK;
const ACCENT = COLORS.STONE_DEEP;

const Window: React.FC<{ x: number; y: number; w: number; h: number; label: string; browser?: boolean }> = ({ x, y, w, h, label, browser }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={3} fill={COLORS.SAND} stroke={LINE} strokeWidth={1.2} />
    <rect x={x} y={y} width={w} height={9} rx={3} fill="currentColor" fillOpacity={0.08} stroke={LINE} strokeWidth={0.8} />
    {browser ? (
      <rect x={x + 16} y={y + 2.6} width={w - 22} height={4} rx={2} fill="none" stroke={LINE} strokeWidth={0.6} opacity={0.5} />
    ) : null}
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={x + 5 + i * 4} cy={y + 4.5} r={1.1} fill={LINE} opacity={0.55} />
    ))}
    {/* content lines */}
    {[0, 1, 2].map((i) => (
      <line key={i} x1={x + 7} y1={y + 18 + i * 7} x2={x + w - 8 - i * 6} y2={y + 18 + i * 7} stroke={LINE} strokeWidth={0.8} opacity={0.4} />
    ))}
    <text x={x + w / 2} y={y + h + 10} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={5.5} fontWeight={700} letterSpacing="0.5" fill={LINE} opacity={0.75}>
      {label}
    </text>
  </g>
);

export const Workshop: React.FC = () => (
  <SceneFrame lineColor={LINE} cornerLabels={{ topLeft: "ONE BUILD", bottomRight: "TWO TARGETS" }}>
    {/* Bench top (iso plane) */}
    <g transform="translate(108 232) scale(2.1)" style={{ color: LINE }}>
      <IsoPlane origin={[-30, -20, 0]} size={[60, 40]} fillOpacity={0.05} strokeOpacity={0.5} strokeWidth={1} />
    </g>

    {/* The single dist/ box feeding both */}
    <g style={{ color: ACCENT }}>
      <rect x={92} y={150} width={32} height={20} rx={3} fill="currentColor" fillOpacity={0.14} stroke="currentColor" strokeWidth={1.4} />
      <text x={108} y={163} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={6} fontWeight={700} fill="currentColor">
        dist/
      </text>
      {/* feed lines up to the two windows */}
      <path d="M 96 150 C 90 120 70 108 60 96" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      <path d="M 120 150 C 126 120 146 108 156 96" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      <circle cx={60} cy={96} r={2} fill="currentColor" />
      <circle cx={156} cy={96} r={2} fill="currentColor" />
    </g>

    {/* Desktop window (left) + browser window (right) */}
    <Window x={26} y={54} w={62} h={42} label="TAURI · DESKTOP" />
    <Window x={128} y={54} w={62} h={42} label="VERCEL · WEB" browser />
  </SceneFrame>
);
