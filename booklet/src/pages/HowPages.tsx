import React from "react";
import { BodyPage } from "../templates/BodyPage";
import { COLORS, FONTS, TYPE, SECTION, SECTION_INK, type SectionKey } from "../theme";
import { HOW, TIERS, DEMO_REWARDS } from "../content";
import { SourceNote } from "../primitives/SourceNote";
import { MissionCardSignature, TierLadderSignature, TierGapTrail, GuildConstellation } from "../visuals/Signatures";

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

    {/* what step 1 offers — the three lines a day balances across */}
    <div style={{ marginTop: 18 }}>
      <div style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: INK_ACCENT, marginBottom: 10 }}>
        three lines to pick from
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {HOW.mission.types.map((t) => {
          const col = t.k === "COMMUNITY" ? COLORS.SKY_DEEP : t.k === "WELLNESS" ? COLORS.TEAL_DEEP : COLORS.CORAL_DEEP;
          return (
            <div key={t.k} style={{ border: `0.75pt solid ${COLORS.HAIRLINE}`, borderTop: `2.5px solid ${col}`, borderRadius: 7, background: COLORS.PAPER_ELEVATED, padding: "11px 13px", display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: col }}>{t.k}</span>
              <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 11.5, lineHeight: 1.3, color: COLORS.INK_MUTED }}>{t.v}</span>
            </div>
          );
        })}
      </div>
    </div>

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

    {/* the card, field by field — every visible part of the hero card is a
        column on the Quest model (or its per-user QuestProgress row) */}
    <div style={{ marginTop: 20, borderTop: `1pt solid ${BRIGHT}`, paddingTop: 12 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 9 }}>
        <span style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: INK_ACCENT }}>
          the card, field by field
        </span>
        <span style={{ fontFamily: FONTS.MONO, fontSize: 7.5, color: COLORS.INK_SUBTLE }}>schema.prisma:32-42 · model Quest</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {[
          { part: "type chip", field: "type · audience", n: "QuestType + Audience enums — which line it feeds, who it’s for" },
          { part: "title", field: "title (unique)", n: "one canonical mission per name" },
          { part: "italic line", field: "description", n: "the how, in one sentence" },
          { part: "progress bar", field: "QuestProgress", n: "a per-user row; Complete flips its status to COMPLETED" },
          { part: "+60 ◎", field: "reward (Int)", n: "coins paid into the ledger on completion" },
          { part: "Complete", field: "the mutation", n: "same flow as in-app — coins land, confetti fires (order: p.20)" },
        ].map((r, i) => (
          <div key={r.part} style={{ display: "grid", gridTemplateColumns: "1.15in 1.45in 1fr", columnGap: 14, alignItems: "baseline", padding: "5.5px 0", borderTop: i === 0 ? "none" : `0.5pt solid ${COLORS.HAIRLINE}` }}>
            <span style={{ fontFamily: FONTS.SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK }}>{r.part}</span>
            <span style={{ fontFamily: FONTS.MONO, fontSize: 9, fontWeight: 700, color: COLORS.TEAL_DEEP }}>{r.field}</span>
            <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 10.5, lineHeight: 1.3, color: COLORS.INK_MUTED }}>{r.n}</span>
          </div>
        ))}
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

    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 14, color: COLORS.INK_MUTED, margin: "18px 0 0", maxWidth: "6in" }}>
      {HOW.coins.vaultNote}
    </p>

    {/* the coin flow — earn from quests, bank the start bonus, spend in the vault */}
    <div style={{ marginTop: 18, borderTop: `1pt solid ${BRIGHT}`, paddingTop: 14 }}>
      <div style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: INK_ACCENT, marginBottom: 10 }}>
        the coin flow · earn → bank → spend
      </div>
      <div style={{ display: "flex", alignItems: "stretch", gap: 10 }}>
        {[
          { k: "EARN", v: "+30 → +120", n: "each quest pays a coin reward" },
          { k: "BANK", v: "800", n: "granted at signup; grows on completion" },
          { k: "SPEND", v: "150 → 500", n: "real-world boosts in the vault" },
        ].map((x, i) => (
          <React.Fragment key={x.k}>
            <div style={{ flex: 1, border: `0.75pt solid ${COLORS.HAIRLINE}`, borderLeft: `2.5px solid ${COLORS.GOLD_DEEP}`, borderRadius: 7, background: COLORS.PAPER_ELEVATED, padding: "10px 13px", display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", color: COLORS.GOLD_DEEP }}>{x.k}</span>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 16, fontWeight: 700, color: COLORS.INK, letterSpacing: "-0.01em", lineHeight: 1 }}>{x.v}</span>
              <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 9.5, lineHeight: 1.25, color: COLORS.INK_MUTED }}>{x.n}</span>
            </div>
            {i < 2 && <span style={{ alignSelf: "center", color: COLORS.HAIRLINE_STRONG, fontSize: 15 }}>→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>

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

    <p style={{ fontFamily: FONTS.SANS, fontSize: 11, lineHeight: 1.5, color: COLORS.INK, margin: "18px 0 16px", maxWidth: "6.2in", borderLeft: `2.5px solid ${BRIGHT}`, paddingLeft: 14 }}>
      {HOW.tiers.note}
    </p>

    <TierGapTrail tiers={TIERS} />

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

    {/* what the guild is — and isn't: community, not competition */}
    <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderTop: `1pt solid ${SECTION["01_WHY"]}`, borderBottom: `0.5pt solid ${COLORS.HAIRLINE}` }}>
      {[
        { tag: "IT IS", v: "meetups", n: "local events, tagged by audience, with RSVPs" },
        { tag: "IT IS", v: "shared wins", n: "completions others in the same climb can see" },
        { tag: "IT ISN’T", v: "a leaderboard", n: "you climb for yourself, never by yourself" },
      ].map((x, i) => (
        <div key={x.v} style={{ padding: "11px 14px", borderLeft: i === 0 ? "none" : `0.5pt solid ${COLORS.HAIRLINE}`, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: FONTS.MONO, fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: i === 2 ? COLORS.CORAL_DEEP : SECTION_INK["01_WHY"] }}>{x.tag}</span>
          <span style={{ fontFamily: FONTS.SANS, fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK }}>{x.v}</span>
          <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 9.5, lineHeight: 1.25, color: COLORS.INK_MUTED }}>{x.n}</span>
        </div>
      ))}
    </div>

    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 11.5, color: COLORS.INK_MUTED, margin: "14px 0 0", maxWidth: "6.2in" }}>
      {HOW.guild.honest}
    </p>

    <Rail>{HOW.guild.source}</Rail>
  </BodyPage>
);
