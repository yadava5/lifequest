import React from "react";
import { BodyPage } from "../templates/BodyPage";
import { COLORS, FONTS, TYPE, SECTION, SECTION_INK } from "../theme";
import { PROOF, HOW } from "../content";
import { SourceNote } from "../primitives/SourceNote";
import { MissionCardSignature, MobileTabBar, HueDial } from "../visuals/Signatures";

type PageProps = { parity: "recto" | "verso"; pageNumber: number; totalPages: number };

const INK_ACCENT = SECTION_INK["04_PROOF"];
const BRIGHT = SECTION["04_PROOF"];

const Rail: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: "0.75in", bottom: "1.05in" }}>
    <SourceNote>{children}</SourceNote>
  </div>
);

/** Page 19 — close the tab, it's still there (persistence). */
export const ProofPersistencePage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="PROOF"
    sectionColor={INK_ACCENT}
    eyebrow={PROOF.persistence.eyebrow}
    headline={PROOF.persistence.headline}
  >
    {/* Hero */}
    <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginTop: 6 }}>
      <div style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 66, lineHeight: 0.95, color: INK_ACCENT }}>
        {PROOF.persistence.hero}
      </div>
      <div style={{ paddingBottom: 10, fontFamily: FONTS.MONO, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.INK_MUTED, maxWidth: "2.4in", lineHeight: 1.35 }}>
        {PROOF.persistence.heroLabel}
      </div>
    </div>

    <p style={{ fontFamily: FONTS.SANS, fontSize: TYPE.body.size, lineHeight: TYPE.body.lh, color: COLORS.INK, margin: "20px 0 0", maxWidth: "6.4in" }}>
      {PROOF.persistence.body}
    </p>

    {/* Code path */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 22 }}>
      {PROOF.persistence.codePath.map((c) => (
        <div key={c.k} style={{ border: `0.75pt solid ${COLORS.HAIRLINE}`, borderLeft: `3px solid ${INK_ACCENT}`, borderRadius: 8, background: COLORS.PAPER_ELEVATED, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontFamily: FONTS.MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: INK_ACCENT }}>{c.k}</span>
          <span style={{ fontFamily: FONTS.MONO, fontSize: 9, color: COLORS.INK, lineHeight: 1.4 }}>{c.v}</span>
          <span style={{ fontFamily: FONTS.MONO, fontSize: 7.5, color: COLORS.INK_SUBTLE }}>{c.cite}</span>
        </div>
      ))}
    </div>

    {/* what actually persists — three durable writes, not screen state */}
    <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderTop: `1pt solid ${BRIGHT}`, borderBottom: `0.5pt solid ${COLORS.HAIRLINE}` }}>
      {[
        { v: "quests", k: "progress", n: "COMPLETED, written in a transaction" },
        { v: "coins", k: "the ledger", n: "spendable + lifetime, both saved" },
        { v: "redemptions", k: "a real row", n: "one Redemption per reward spent" },
      ].map((x, i) => (
        <div key={x.v} style={{ padding: "11px 14px", borderLeft: i === 0 ? "none" : `0.5pt solid ${COLORS.HAIRLINE}`, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: FONTS.SANS, fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK }}>{x.v}</span>
          <span style={{ fontFamily: FONTS.MONO, fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: INK_ACCENT }}>{x.k}</span>
          <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 9.5, lineHeight: 1.25, color: COLORS.INK_MUTED }}>{x.n}</span>
        </div>
      ))}
    </div>

    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 11.5, lineHeight: 1.4, color: COLORS.INK_MUTED, margin: "14px 0 0", maxWidth: "6.4in" }}>
      {PROOF.persistence.honest}
    </p>

    <Rail>{PROOF.persistence.source}</Rail>
  </BodyPage>
);

/** Page 20 — the hero card is real. */
export const ProofMissionPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="PROOF"
    sectionColor={INK_ACCENT}
    eyebrow={PROOF.mission.eyebrow}
    headline={PROOF.mission.headline}
  >
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2.7in", columnGap: 26, alignItems: "start", marginTop: 4 }}>
      <div>
        {PROOF.mission.body.map((p, i) => (
          <p key={i} style={{ fontFamily: FONTS.SANS, fontSize: TYPE.body.size, lineHeight: TYPE.body.lh, color: COLORS.INK, margin: "0 0 10px", maxWidth: "3.6in" }}>
            {p}
          </p>
        ))}
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {PROOF.mission.facts.map((f) => (
            <div key={f.k} style={{ display: "grid", gridTemplateColumns: "78px 1fr", alignItems: "baseline", columnGap: 10 }}>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", color: INK_ACCENT }}>{f.k}</span>
              <span style={{ fontFamily: FONTS.SANS, fontSize: 10.5, color: COLORS.INK, lineHeight: 1.35 }}>{f.v}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 15, color: COLORS.INK, margin: "16px 0 0", borderLeft: `2.5px solid ${BRIGHT}`, paddingLeft: 12, maxWidth: "3.6in" }}>
          {PROOF.mission.quote}
        </p>
      </div>

      <div>
        <MissionCardSignature
          type={HOW.mission.card.type}
          title={HOW.mission.card.title}
          desc={HOW.mission.card.desc}
          reward={HOW.mission.card.reward}
          accent={COLORS.CORAL_DEEP}
          typeColor={COLORS.TEAL_DEEP}
        />
        <div style={{ fontFamily: FONTS.MONO, fontSize: 8, letterSpacing: "0.06em", color: COLORS.INK_SUBTLE, textAlign: "center", marginTop: 8 }}>
          press Complete → coins + confetti
        </div>
      </div>
    </div>

    {/* what one press fires — the exact order the live app runs it */}
    <div style={{ marginTop: 18, borderTop: `1pt solid ${BRIGHT}`, paddingTop: 14 }}>
      <div style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: INK_ACCENT, marginBottom: 10 }}>
        one press · in order
      </div>
      <div style={{ display: "flex", alignItems: "stretch", gap: 10 }}>
        {[
          { s: "1", v: "coins land", note: "the server mutation resolves first" },
          { s: "2", v: "confetti fires", note: "the reward burst — coral/honey/aqua/sky" },
          { s: "3", v: "tier ticks", note: "a refetch nudges the rank bar up" },
        ].map((x, i) => (
          <React.Fragment key={x.s}>
            <div style={{ flex: 1, border: `0.75pt solid ${COLORS.HAIRLINE}`, borderLeft: `2.5px solid ${BRIGHT}`, borderRadius: 7, background: COLORS.PAPER_ELEVATED, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 8, fontWeight: 700, color: INK_ACCENT }}>{x.s}</span>
              <span style={{ fontFamily: FONTS.SANS, fontSize: 11.5, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK }}>{x.v}</span>
              <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 9.5, lineHeight: 1.25, color: COLORS.INK_MUTED }}>{x.note}</span>
            </div>
            {i < 2 && <span style={{ alignSelf: "center", color: COLORS.HAIRLINE_STRONG, fontSize: 14 }}>→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>

    <Rail>{PROOF.mission.source}</Rail>
  </BodyPage>
);

/** Page 21 — a tab bar that travels (mobile). */
export const ProofMobilePage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="PROOF"
    sectionColor={INK_ACCENT}
    eyebrow={PROOF.mobile.eyebrow}
    headline={PROOF.mobile.headline}
  >
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5in", columnGap: 26, alignItems: "center", marginTop: 4 }}>
      <div>
        <p style={{ fontFamily: FONTS.SANS, fontSize: TYPE.body.size, lineHeight: TYPE.body.lh, color: COLORS.INK, margin: "0 0 16px", maxWidth: "3.5in" }}>
          {PROOF.mobile.body}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {PROOF.mobile.tabs.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: COLORS.INK,
                border: `0.75pt solid ${COLORS.HAIRLINE_STRONG}`,
                borderRadius: 999,
                padding: "4px 11px",
                background: COLORS.PAPER_ELEVATED,
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 13, color: COLORS.INK_MUTED, margin: 0, maxWidth: "3.5in", borderLeft: `2.5px solid ${BRIGHT}`, paddingLeft: 12 }}>
          {PROOF.mobile.note}
        </p>
      </div>
      <MobileTabBar tabs={PROOF.mobile.tabs} accent={COLORS.CORAL_DEEP} />
    </div>

    {/* one layout, two homes — the same five destinations, either device */}
    <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {[
        { k: "≥ lg · desktop", v: "a left sidebar", n: "the five live down the side of the window" },
        { k: "< lg · mobile", v: "a sticky bottom bar", n: "the same five, one thumb-reach away" },
      ].map((x) => (
        <div key={x.k} style={{ border: `0.75pt solid ${COLORS.HAIRLINE}`, borderLeft: `2.5px solid ${COLORS.CORAL_DEEP}`, borderRadius: 7, background: COLORS.PAPER_ELEVATED, padding: "11px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: FONTS.MONO, fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.CORAL_DEEP }}>{x.k}</span>
          <span style={{ fontFamily: FONTS.SANS, fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK }}>{x.v}</span>
          <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 10.5, lineHeight: 1.3, color: COLORS.INK_MUTED }}>{x.n}</span>
        </div>
      ))}
    </div>

    <Rail>{PROOF.mobile.source}</Rail>
  </BodyPage>
);

/** Page 22 — zero purple, by rule. */
export const ProofNoPurplePage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="PROOF"
    sectionColor={INK_ACCENT}
    eyebrow={PROOF.nopurple.eyebrow}
    headline={PROOF.nopurple.headline}
  >
    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 17, lineHeight: 1.4, color: COLORS.INK_MUTED, margin: "2px 0 22px", maxWidth: "6.2in" }}>
      {PROOF.nopurple.lede}
    </p>

    <HueDial swatches={PROOF.nopurple.swatches} />

    <p style={{ fontFamily: FONTS.SANS, fontSize: 11, lineHeight: 1.5, color: COLORS.INK, margin: "18px 0 0", maxWidth: "6.2in", borderLeft: `2.5px solid ${BRIGHT}`, paddingLeft: 14 }}>
      {PROOF.nopurple.note}
    </p>

    <HueLine />

    <Rail>{PROOF.nopurple.source}</Rail>
  </BodyPage>
);

/**
 * The rule, drawn on the hue wheel unrolled: every accent lands in 14–201°,
 * and the violet band (~260–320°) is struck out. Numbers straight from
 * PROOF.nopurple; no gradient fill (that would break the rule itself).
 */
const HueLine: React.FC = () => {
  const X0 = 20;
  const X1 = 580;
  const x = (h: number) => X0 + (h / 360) * (X1 - X0);
  const dots = [
    { h: 14, c: COLORS.CORAL, label: "coral" },
    { h: 41, c: COLORS.GOLD, label: "honey" },
    { h: 168, c: COLORS.TEAL, label: "aqua" },
    { h: 199, c: COLORS.SKY, label: "sky" },
  ];
  const ticks = [0, 90, 180, 270, 360];
  return (
    <div style={{ marginTop: 18, border: `0.75pt solid ${COLORS.HAIRLINE}`, borderRadius: 8, background: COLORS.PAPER_ELEVATED, padding: 14, maxWidth: "6.4in" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: INK_ACCENT }}>the hue line · 14–201° only</span>
        <span style={{ fontFamily: FONTS.MONO, fontSize: 7.5, color: COLORS.INK_SUBTLE }}>0–360° · index.css</span>
      </div>
      <svg viewBox="0 0 600 96" width="100%" style={{ display: "block", overflow: "visible" }}>
        {/* the excluded violet band 260–320° */}
        <rect x={x(260)} y={30} width={x(320) - x(260)} height={20} rx={3} fill="none" stroke={COLORS.HAIRLINE_STRONG} strokeWidth={0.8} strokeDasharray="3 2" />
        <line x1={x(260)} y1={30} x2={x(320)} y2={50} stroke={COLORS.HAIRLINE_STRONG} strokeWidth={0.8} />
        <line x1={x(260)} y1={50} x2={x(320)} y2={30} stroke={COLORS.HAIRLINE_STRONG} strokeWidth={0.8} />
        <text x={x(290)} y={24} textAnchor="middle" fontFamily={FONTS.MONO} fontSize={7.5} fill={COLORS.INK_MUTED}>violet — excluded</text>
        {/* the accent band 14–201 */}
        <rect x={x(14)} y={33} width={x(201) - x(14)} height={14} rx={7} fill={COLORS.SURFACE} />
        {/* axis */}
        <line x1={X0} y1={68} x2={X1} y2={68} stroke={COLORS.HAIRLINE} strokeWidth={0.8} />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={68} x2={x(t)} y2={72} stroke={COLORS.HAIRLINE_STRONG} strokeWidth={0.6} />
            <text x={x(t)} y={84} textAnchor="middle" fontFamily={FONTS.MONO} fontSize={7} fill={COLORS.INK_SUBTLE}>{t}°</text>
          </g>
        ))}
        {/* accent dots */}
        {dots.map((d) => (
          <g key={d.label}>
            <line x1={x(d.h)} y1={40} x2={x(d.h)} y2={68} stroke={d.c} strokeWidth={1} strokeOpacity={0.5} />
            <circle cx={x(d.h)} cy={40} r={6} fill={d.c} stroke={COLORS.PAPER} strokeWidth={1.2} />
            <text x={x(d.h)} y={14} textAnchor="middle" fontFamily={FONTS.MONO} fontSize={7.5} fontWeight={700} fill={COLORS.INK}>{d.label}</text>
            <text x={x(d.h)} y={62} textAnchor="middle" fontFamily={FONTS.MONO} fontSize={6.5} fill={COLORS.INK_MUTED}>{d.h}°</text>
          </g>
        ))}
      </svg>
    </div>
  );
};
