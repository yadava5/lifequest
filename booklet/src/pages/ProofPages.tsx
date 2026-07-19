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

    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 11.5, lineHeight: 1.4, color: COLORS.INK_MUTED, margin: "18px 0 0", maxWidth: "6.4in", borderTop: `0.5pt solid ${COLORS.HAIRLINE}`, paddingTop: 12 }}>
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

    <p style={{ fontFamily: FONTS.SANS, fontSize: 11, lineHeight: 1.5, color: COLORS.INK, margin: "20px 0 0", maxWidth: "6.2in", borderLeft: `2.5px solid ${BRIGHT}`, paddingLeft: 14 }}>
      {PROOF.nopurple.note}
    </p>

    <Rail>{PROOF.nopurple.source}</Rail>
  </BodyPage>
);
