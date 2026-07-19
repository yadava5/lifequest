import React from "react";
import { COLORS, FONTS } from "../theme";

/**
 * Per-section "signature" visuals — one distinct diagram per body page so the
 * chapters don't read as one template. Each is project-specific to LifeQuest:
 *
 *   MissionCardSignature — a real quest card (type · title · reward · Complete).
 *   TierLadderSignature  — the four-rung lifetime-coins ladder.
 *   GuildConstellation   — the community layer as a linked constellation.
 *   RatchetDiagram       — coins (up & down) vs lifetimeCoins (only up).
 *   MobileTabBar         — the phone with the sticky bottom tab bar.
 *   HueDial              — the dawn palette on a hue wheel, purple band empty.
 */

// ── shared card chrome ──────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
  border: `0.75pt solid ${COLORS.HAIRLINE}`,
  borderRadius: 10,
  background: COLORS.PAPER_ELEVATED,
  padding: 14,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

export const SignatureCaption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 10.5, color: COLORS.INK_MUTED, lineHeight: 1.35 }}>
    {children}
  </div>
);

// ── Mission card ────────────────────────────────────────────────────────────

export const MissionCardSignature: React.FC<{
  type: string;
  title: string;
  desc: string;
  reward: string;
  accent?: string;
  typeColor?: string;
}> = ({ type, title, desc, reward, accent = COLORS.CORAL_DEEP, typeColor = COLORS.TEAL_DEEP }) => (
  <div style={{ ...CARD, gap: 12, borderColor: COLORS.HAIRLINE_STRONG }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 9px",
          borderRadius: 999,
          border: `0.75pt solid ${typeColor}`,
          background: `${typeColor}14`,
          fontFamily: FONTS.MONO,
          fontSize: 7.5,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: typeColor,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: typeColor }} />
        {type}
      </span>
      <span style={{ fontFamily: FONTS.MONO, fontSize: 12, fontWeight: 700, color: COLORS.GOLD_DEEP }}>
        {reward} ◎
      </span>
    </div>

    <div style={{ fontFamily: FONTS.SANS, fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK, lineHeight: 1.2 }}>
      {title}
    </div>
    <div style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 12.5, color: COLORS.INK_MUTED }}>{desc}</div>

    {/* tier progress nudge */}
    <div style={{ marginTop: 2 }}>
      <div style={{ height: 6, borderRadius: 999, background: COLORS.SURFACE, overflow: "hidden" }}>
        <div style={{ width: "52%", height: "100%", background: accent, borderRadius: 999 }} />
      </div>
    </div>

    {/* Complete button */}
    <div
      style={{
        marginTop: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        padding: "9px 0",
        borderRadius: 8,
        background: accent,
        color: COLORS.ON_ACCENT,
        fontFamily: FONTS.SANS,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      ✓ Complete
    </div>
  </div>
);

// ── Tier ladder ─────────────────────────────────────────────────────────────

export const TierLadderSignature: React.FC<{
  tiers: ReadonlyArray<{ name: string; at: number; blurb: string }>;
  accent?: string;
  markerAt?: number;
}> = ({ tiers, accent = COLORS.CORAL_DEEP, markerAt = 1 }) => (
  <div style={{ ...CARD, gap: 0, paddingTop: 16, paddingBottom: 16 }}>
    {tiers.map((t, i) => {
      const reached = i <= markerAt;
      return (
        <div
          key={t.name}
          style={{
            display: "grid",
            gridTemplateColumns: "26px 1fr auto",
            alignItems: "center",
            columnGap: 12,
            padding: "10px 0",
            borderTop: i === 0 ? "none" : `0.5pt solid ${COLORS.HAIRLINE}`,
          }}
        >
          {/* rung node on a rail */}
          <div style={{ position: "relative", height: 22, display: "flex", justifyContent: "center" }}>
            {i < tiers.length - 1 && (
              <span style={{ position: "absolute", top: 11, width: 2, height: 32, background: reached ? accent : COLORS.HAIRLINE_STRONG }} />
            )}
            <span
              style={{
                zIndex: 1,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: reached ? accent : COLORS.PAPER,
                border: `2px solid ${reached ? accent : COLORS.HAIRLINE_STRONG}`,
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontFamily: FONTS.MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", color: COLORS.INK }}>
              {t.name}
            </span>
            <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 11, color: COLORS.INK_MUTED, lineHeight: 1.2 }}>
              {t.blurb}
            </span>
          </div>
          <span style={{ fontFamily: FONTS.MONO, fontSize: 13, fontWeight: 700, color: reached ? accent : COLORS.INK_SUBTLE, fontVariantNumeric: "tabular-nums" }}>
            {t.at.toLocaleString()}
          </span>
        </div>
      );
    })}
  </div>
);

// ── Guild constellation ─────────────────────────────────────────────────────

export const GuildConstellation: React.FC<{ accent?: string }> = ({ accent = COLORS.SKY_DEEP }) => {
  const NODES = [
    { x: 46, y: 60, r: 8, hero: true },
    { x: 120, y: 40, r: 5 },
    { x: 178, y: 74, r: 6 },
    { x: 96, y: 104, r: 5 },
    { x: 158, y: 128, r: 5 },
    { x: 40, y: 130, r: 5 },
    { x: 204, y: 40, r: 4 },
  ];
  const EDGES: Array<[number, number]> = [
    [0, 1], [0, 3], [1, 2], [2, 4], [3, 4], [0, 5], [1, 6],
  ];
  return (
    <div style={CARD}>
      <svg viewBox="0 0 240 160" width="100%" style={{ display: "block" }}>
        {EDGES.map(([a, b], i) => {
          const na = NODES[a];
          const nb = NODES[b];
          if (!na || !nb) return null;
          return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={accent} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="3 3" />;
        })}
        {NODES.map((n, i) => (
          <g key={i}>
            {n.hero && <circle cx={n.x} cy={n.y} r={n.r * 2} fill={accent} fillOpacity={0.12} />}
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.hero ? accent : COLORS.PAPER} stroke={accent} strokeWidth={1.6} />
            {n.hero && <circle cx={n.x} cy={n.y} r={n.r * 0.4} fill={COLORS.PAPER} />}
          </g>
        ))}
        <text x={46} y={40} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={7} fontWeight={700} fill={accent}>
          you
        </text>
      </svg>
      <SignatureCaption>
        A guild is the people, not a leaderboard — meetups and shared wins link a season of life into a constellation.
      </SignatureCaption>
    </div>
  );
};

// ── Monotonic ratchet — two counters ────────────────────────────────────────

export const RatchetDiagram: React.FC<{
  up: { field: string; label: string; note: string };
  down: { field: string; label: string; note: string };
}> = ({ up, down }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    {/* spendable — up and down */}
    <div style={{ ...CARD, borderColor: COLORS.HAIRLINE_STRONG }}>
      <div style={{ fontFamily: FONTS.MONO, fontSize: 11, fontWeight: 700, color: COLORS.INK }}>{down.field}</div>
      <svg viewBox="0 0 120 60" width="100%" style={{ display: "block" }}>
        <polyline points="6,44 30,26 54,38 78,18 102,40 114,30" fill="none" stroke={COLORS.STONE_DEEP} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="30,26 30,44 54,38 54,20" fill={COLORS.STONE_DEEP} fillOpacity={0.08} stroke="none" />
      </svg>
      <div style={{ fontFamily: FONTS.MONO, fontSize: 8, letterSpacing: "0.06em", color: COLORS.INK_MUTED, textTransform: "uppercase" }}>{down.label}</div>
      <div style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 10.5, color: COLORS.INK_MUTED }}>{down.note}</div>
    </div>

    {/* lifetime — only up */}
    <div style={{ ...CARD, borderColor: COLORS.TEAL_DEEP, background: COLORS.TEAL_TINT }}>
      <div style={{ fontFamily: FONTS.MONO, fontSize: 11, fontWeight: 700, color: COLORS.TEAL_DEEP }}>{up.field}</div>
      <svg viewBox="0 0 120 60" width="100%" style={{ display: "block" }}>
        <polyline points="6,50 30,44 54,34 78,26 102,14 114,8" fill="none" stroke={COLORS.TEAL_DEEP} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="6,50 30,44 54,34 78,26 102,14 114,8 114,54 6,54" fill={COLORS.TEAL_DEEP} fillOpacity={0.1} stroke="none" />
        <path d="M 108 4 l 8 4 l -6 5" fill="none" stroke={COLORS.TEAL_DEEP} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ fontFamily: FONTS.MONO, fontSize: 8, letterSpacing: "0.06em", color: COLORS.TEAL_DEEP, textTransform: "uppercase" }}>{up.label}</div>
      <div style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 10.5, color: COLORS.INK_MUTED }}>{up.note}</div>
    </div>
  </div>
);

// ── Mobile tab bar ──────────────────────────────────────────────────────────

const GLYPH: Record<string, string> = {
  Home: "⌂",
  Quests: "✦",
  Rewards: "◎",
  Guild: "❖",
  Forge: "⚒",
  Settings: "⚙",
};

export const MobileTabBar: React.FC<{ tabs: ReadonlyArray<string>; accent?: string }> = ({ tabs, accent = COLORS.CORAL_DEEP }) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <div
      style={{
        width: 188,
        height: 372,
        borderRadius: 28,
        border: `3px solid ${COLORS.INK}`,
        background: COLORS.PAPER,
        padding: 8,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: `0 10px 30px -14px ${COLORS.INK_SUBTLE}`,
      }}
    >
      {/* notch */}
      <div style={{ alignSelf: "center", width: 54, height: 5, borderRadius: 999, background: COLORS.HAIRLINE_STRONG, marginTop: 2, marginBottom: 8 }} />
      {/* faux content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, padding: "0 4px" }}>
        <div style={{ height: 20, borderRadius: 6, background: COLORS.SURFACE }} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ borderRadius: 10, border: `0.75pt solid ${COLORS.HAIRLINE}`, background: COLORS.PAPER_ELEVATED, padding: 8, display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ height: 6, width: "70%", borderRadius: 3, background: COLORS.HAIRLINE_STRONG }} />
            <div style={{ height: 5, width: "45%", borderRadius: 3, background: COLORS.HAIRLINE }} />
            <div style={{ alignSelf: "flex-end", fontFamily: FONTS.MONO, fontSize: 8, fontWeight: 700, color: COLORS.GOLD_DEEP }}>+{[80, 40, 120][i]} ◎</div>
          </div>
        ))}
      </div>
      {/* bottom tab bar */}
      <div
        style={{
          marginTop: 8,
          borderTop: `0.75pt solid ${COLORS.HAIRLINE}`,
          paddingTop: 7,
          display: "grid",
          gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
          gap: 2,
        }}
      >
        {tabs.map((t, i) => (
          <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 13, lineHeight: 1, color: i === 1 ? accent : COLORS.INK_SUBTLE }}>{GLYPH[t] ?? "•"}</span>
            <span style={{ fontFamily: FONTS.MONO, fontSize: 5.6, letterSpacing: "0.02em", color: i === 1 ? accent : COLORS.INK_SUBTLE }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Hue dial — the dawn palette, purple band empty ──────────────────────────

export const HueDial: React.FC<{
  swatches: ReadonlyArray<{ name: string; hue: string; role: string }>;
}> = ({ swatches }) => {
  const HUES = [
    { deg: 14, c: COLORS.CORAL, name: "coral" },
    { deg: 41, c: COLORS.GOLD, name: "honey" },
    { deg: 168, c: COLORS.TEAL, name: "aqua" },
    { deg: 199, c: COLORS.SKY, name: "sky" },
  ];
  const cx = 70;
  const cy = 70;
  const r = 52;
  return (
    <div style={{ ...CARD, flexDirection: "row", alignItems: "center", gap: 16 }}>
      <svg viewBox="0 0 140 140" width={128} height={128} style={{ flexShrink: 0 }}>
        {/* wheel base */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.HAIRLINE} strokeWidth={10} />
        {/* the empty purple band, marked */}
        {(() => {
          const a0 = ((260 - 90) * Math.PI) / 180;
          const a1 = ((320 - 90) * Math.PI) / 180;
          const x0 = cx + Math.cos(a0) * r;
          const y0 = cy + Math.sin(a0) * r;
          const x1 = cx + Math.cos(a1) * r;
          const y1 = cy + Math.sin(a1) * r;
          return <path d={`M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`} fill="none" stroke={COLORS.DANGER} strokeWidth={10} strokeOpacity={0.16} strokeLinecap="butt" />;
        })()}
        {HUES.map((h) => {
          const a = ((h.deg - 90) * Math.PI) / 180;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          return <circle key={h.name} cx={x} cy={y} r={9} fill={h.c} stroke={COLORS.PAPER} strokeWidth={2} />;
        })}
        {/* purple X */}
        {(() => {
          const a = ((290 - 90) * Math.PI) / 180;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          return (
            <g stroke={COLORS.DANGER} strokeWidth={1.6} strokeLinecap="round" opacity={0.7}>
              <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} />
              <line x1={x + 4} y1={y - 4} x2={x - 4} y2={y + 4} />
            </g>
          );
        })()}
        <text x={cx} y={cy - 2} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={13} fontWeight={700} fill={COLORS.INK}>0</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={6.5} letterSpacing="1" fill={COLORS.INK_MUTED}>PURPLE</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
        {swatches.map((s) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: hueColor(s.name), flexShrink: 0 }} />
            <span style={{ fontFamily: FONTS.MONO, fontSize: 9.5, fontWeight: 700, color: COLORS.INK, minWidth: 42 }}>{s.name}</span>
            <span style={{ fontFamily: FONTS.MONO, fontSize: 9, color: COLORS.INK_SUBTLE, minWidth: 30 }}>{s.hue}</span>
            <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 10.5, color: COLORS.INK_MUTED }}>{s.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function hueColor(name: string): string {
  switch (name) {
    case "coral":
      return COLORS.CORAL;
    case "honey":
      return COLORS.GOLD;
    case "aqua":
      return COLORS.TEAL;
    case "sky":
      return COLORS.SKY;
    default:
      return COLORS.INK;
  }
}
