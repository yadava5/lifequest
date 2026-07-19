import React from "react";
import { BodyPage } from "../templates/BodyPage";
import { COLORS, FONTS, TYPE, SECTION, SECTION_INK, type SectionKey } from "../theme";
import { HOW, TIERS, DEMO_REWARDS } from "../content";
import { SourceNote } from "../primitives/SourceNote";
import { MissionCardSignature, TierLadderSignature, GuildConstellation } from "../visuals/Signatures";

type PageProps = { parity: "recto" | "verso"; pageNumber: number; totalPages: number };

const INK_ACCENT = SECTION_INK["02_HOW"];
const BRIGHT = SECTION["02_HOW"];

const Body: React.FC<{ children: React.ReactNode; max?: string }> = ({ children, max = "6.4in" }) => (
  <p
    style={{
      fontFamily: FONTS.SANS,
      fontSize: TYPE.body.size,
      lineHeight: TYPE.body.lh,
      letterSpacing: TYPE.body.tracking,
      color: COLORS.INK,
      margin: "0 0 10px",
      maxWidth: max,
    }}
  >
    {children}
  </p>
);

const Rail: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: "0.75in", bottom: "1.05in" }}>
    <SourceNote>{children}</SourceNote>
  </div>
);

/** Page 09 — the loop: pick, log, claim. */
export const HowLoopPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="HOW"
    sectionColor={INK_ACCENT}
    eyebrow={HOW.loop.eyebrow}
    headline={HOW.loop.headline}
  >
    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 17, lineHeight: 1.4, color: COLORS.INK_MUTED, margin: "2px 0 22px", maxWidth: "6.2in" }}>
      {HOW.loop.lede}
    </p>

    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {HOW.loop.steps.map((s) => {
        const accent = SECTION_INK[s.accentKey as SectionKey];
        return (
          <div
            key={s.n}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              border: `0.75pt solid ${COLORS.HAIRLINE}`,
              borderLeft: `3px solid ${accent}`,
              borderRadius: 8,
              background: COLORS.PAPER_ELEVATED,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: accent,
                color: COLORS.ON_ACCENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONTS.MONO,
                fontSize: 15,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {s.n}
            </div>
            <div>
              <div style={{ fontFamily: FONTS.SANS, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK }}>
                {s.label}
              </div>
              <div style={{ fontFamily: FONTS.SANS, fontSize: 11, color: COLORS.INK_MUTED, marginTop: 2 }}>{s.detail}</div>
            </div>
          </div>
        );
      })}
    </div>

    <p style={{ fontFamily: FONTS.SANS, fontSize: 11, lineHeight: 1.5, color: COLORS.INK, margin: "22px 0 0", maxWidth: "6.2in", borderTop: `1pt solid ${BRIGHT}`, paddingTop: 14 }}>
      <b style={{ color: INK_ACCENT }}>The order matters. </b>
      {HOW.loop.orderNote}
    </p>

    <Rail>{HOW.loop.source}</Rail>
  </BodyPage>
);

/** Page 10 — a routine wearing a quest (the mission card). */
export const HowMissionPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="HOW"
    sectionColor={INK_ACCENT}
    eyebrow={HOW.mission.eyebrow}
    headline={HOW.mission.headline}
  >
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2.7in", columnGap: 26, alignItems: "start", marginTop: 4 }}>
      <div>
        {HOW.mission.body.map((p, i) => (
          <Body key={i} max="3.6in">
            {p}
          </Body>
        ))}
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
          {HOW.mission.types.map((t) => (
            <div key={t.k} style={{ display: "grid", gridTemplateColumns: "84px 1fr", alignItems: "baseline", columnGap: 10 }}>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", color: INK_ACCENT }}>{t.k}</span>
              <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 12.5, color: COLORS.INK_MUTED }}>{t.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <MissionCardSignature
          type={HOW.mission.card.type}
          title={HOW.mission.card.title}
          desc={HOW.mission.card.desc}
          reward={HOW.mission.card.reward}
          accent={INK_ACCENT}
          typeColor={COLORS.TEAL_DEEP}
        />
        <div style={{ fontFamily: FONTS.MONO, fontSize: 8, letterSpacing: "0.06em", color: COLORS.INK_SUBTLE, textAlign: "center", marginTop: 8 }}>
          the app’s live hero mission
        </div>
      </div>
    </div>

    <Rail>{HOW.mission.source}</Rail>
  </BodyPage>
);

/** Page 11 — coins you can actually spend. */
export const HowCoinsPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="HOW"
    sectionColor={INK_ACCENT}
    eyebrow={HOW.coins.eyebrow}
    headline={HOW.coins.headline}
  >
    <div style={{ maxWidth: "6.4in", marginTop: 4 }}>
      {HOW.coins.body.map((p, i) => (
        <Body key={i}>{p}</Body>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.5in 1fr", columnGap: 26, alignItems: "center", marginTop: 22 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: FONTS.MONO, fontSize: TYPE.metricLarge.size, fontWeight: 700, letterSpacing: "-0.02em", color: COLORS.GOLD_DEEP, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {HOW.coins.startBonus.value}
        </div>
        <div style={{ fontFamily: FONTS.MONO, fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.INK_MUTED }}>
          {HOW.coins.startBonus.label}
        </div>
      </div>

      <div style={{ border: `0.75pt solid ${COLORS.HAIRLINE}`, borderRadius: 8, background: COLORS.PAPER_ELEVATED, overflow: "hidden" }}>
        <div style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: INK_ACCENT, padding: "8px 12px", borderBottom: `0.5pt solid ${COLORS.HAIRLINE}` }}>
          the reward vault
        </div>
        {DEMO_REWARDS.map((r, i) => (
          <div
            key={r.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "9px 12px",
              borderTop: i === 0 ? "none" : `0.5pt solid ${COLORS.HAIRLINE}`,
            }}
          >
            <span style={{ fontFamily: FONTS.SANS, fontSize: 12, color: COLORS.INK }}>{r.name}</span>
            <span style={{ fontFamily: FONTS.MONO, fontSize: 12, fontWeight: 700, color: COLORS.GOLD_DEEP, fontVariantNumeric: "tabular-nums" }}>
              {r.cost} ◎
            </span>
          </div>
        ))}
      </div>
    </div>

    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 14, color: COLORS.INK_MUTED, margin: "20px 0 0", maxWidth: "6in" }}>
      {HOW.coins.vaultNote}
    </p>

    <Rail>{HOW.coins.source}</Rail>
  </BodyPage>
);

/** Page 12 — four tiers, earned for good. */
export const HowTiersPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="HOW"
    sectionColor={INK_ACCENT}
    eyebrow={HOW.tiers.eyebrow}
    headline={HOW.tiers.headline}
  >
    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 17, lineHeight: 1.4, color: COLORS.INK_MUTED, margin: "2px 0 20px", maxWidth: "6.2in" }}>
      {HOW.tiers.lede}
    </p>

    <TierLadderSignature tiers={TIERS} accent={INK_ACCENT} markerAt={1} />

    <p style={{ fontFamily: FONTS.SANS, fontSize: 11, lineHeight: 1.5, color: COLORS.INK, margin: "20px 0 0", maxWidth: "6.2in", borderLeft: `2.5px solid ${BRIGHT}`, paddingLeft: 14 }}>
      {HOW.tiers.note}
    </p>

    <Rail>{HOW.tiers.source}</Rail>
  </BodyPage>
);

/** Page 13 — no one levels up alone (the guild). */
export const HowGuildPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="HOW"
    sectionColor={INK_ACCENT}
    eyebrow={HOW.guild.eyebrow}
    headline={HOW.guild.headline}
  >
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2.7in", columnGap: 26, alignItems: "start", marginTop: 4 }}>
      <div>
        {HOW.guild.body.map((p, i) => (
          <Body key={i} max="3.6in">
            {p}
          </Body>
        ))}
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {HOW.guild.facts.map((f) => (
            <div key={f.k} style={{ display: "grid", gridTemplateColumns: "72px 1fr", alignItems: "baseline", columnGap: 10 }}>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", color: SECTION_INK["01_WHY"] }}>{f.k}</span>
              <span style={{ fontFamily: FONTS.SANS, fontSize: 10.5, color: COLORS.INK, lineHeight: 1.35 }}>{f.v}</span>
            </div>
          ))}
        </div>
      </div>
      <GuildConstellation accent={SECTION_INK["01_WHY"]} />
    </div>

    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 11.5, color: COLORS.INK_MUTED, margin: "18px 0 0", maxWidth: "6.2in", borderTop: `0.5pt solid ${COLORS.HAIRLINE}`, paddingTop: 12 }}>
      {HOW.guild.honest}
    </p>

    <Rail>{HOW.guild.source}</Rail>
  </BodyPage>
);
