import React from "react";
import { BodyPage } from "../templates/BodyPage";
import { Page } from "../primitives/Page";
import { COLORS, FONTS, SECTION_INK } from "../theme";
import { BUILD } from "../content";
import { SourceNote } from "../primitives/SourceNote";

type PageProps = { parity: "recto" | "verso"; pageNumber: number; totalPages: number };

const INK_ACCENT = SECTION_INK["05_BUILD"];

/** Page 26 — what it is built on (the stack). */
export const BuildStackPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="BUILD"
    sectionColor={INK_ACCENT}
    eyebrow={BUILD.stack.eyebrow}
    headline={BUILD.stack.headline}
  >
    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 16, lineHeight: 1.4, color: COLORS.INK_MUTED, margin: "2px 0 20px", maxWidth: "6.2in" }}>
      {BUILD.stack.lede}
    </p>

    <div style={{ borderTop: `1pt solid ${COLORS.INK}` }}>
      {BUILD.stack.rows.map((r) => (
        <div
          key={r.area}
          style={{
            display: "grid",
            gridTemplateColumns: "1.1in 2.5in 1fr",
            columnGap: 16,
            alignItems: "baseline",
            padding: "12px 0",
            borderBottom: `0.5pt solid ${COLORS.HAIRLINE}`,
          }}
        >
          <span style={{ fontFamily: FONTS.MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", color: INK_ACCENT }}>{r.area}</span>
          <span style={{ fontFamily: FONTS.SANS, fontSize: 12.5, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK }}>{r.tech}</span>
          <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 12, color: COLORS.INK_MUTED, lineHeight: 1.3 }}>{r.note}</span>
        </div>
      ))}
    </div>

    <div style={{ position: "absolute", left: "0.75in", bottom: "1.05in" }}>
      <SourceNote>{BUILD.stack.source}</SourceNote>
    </div>
  </BodyPage>
);

/** Page 27 — play it (closing). */
export const BuildClosingPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => {
  const { closing } = BUILD;
  return (
    <Page
      parity={parity}
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionLabel="BUILD"
      sectionColor={INK_ACCENT}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1 }} />

        <div
          style={{
            fontFamily: FONTS.MONO,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: INK_ACCENT,
            marginBottom: 14,
          }}
        >
          {closing.eyebrow}
        </div>

        <h1
          style={{
            fontFamily: FONTS.SANS,
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: COLORS.INK,
            margin: "0 0 18px",
          }}
        >
          {closing.headline}
        </h1>

        <p
          style={{
            fontFamily: FONTS.SERIF,
            fontStyle: "italic",
            fontSize: 20,
            lineHeight: 1.35,
            color: COLORS.INK_MUTED,
            margin: "0 0 34px",
            maxWidth: "6in",
          }}
        >
          {closing.tagline}
        </p>

        {/* Two link blocks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: "6.4in" }}>
          <LinkBlock label={closing.liveLabel} url={closing.liveUrl} arrow={closing.leftArrowLabel} accent={COLORS.CORAL_DEEP} />
          <LinkBlock label={closing.repoLabel} url={closing.repoUrl} arrow={closing.rightArrowLabel} accent={COLORS.SKY_DEEP} />
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            borderTop: `1pt solid ${COLORS.INK}`,
            paddingTop: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: FONTS.MONO,
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: COLORS.INK_MUTED,
          }}
        >
          <span>{closing.microNote}</span>
          <span style={{ color: INK_ACCENT }}>LifeQuest · Vol. 01</span>
        </div>
      </div>
    </Page>
  );
};

const LinkBlock: React.FC<{ label: string; url: string; arrow: string; accent: string }> = ({ label, url, arrow, accent }) => (
  <div
    style={{
      border: `0.75pt solid ${COLORS.HAIRLINE}`,
      borderTop: `3px solid ${accent}`,
      borderRadius: 8,
      background: COLORS.PAPER_ELEVATED,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}
  >
    <span style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: accent }}>
      {label}
    </span>
    <span style={{ fontFamily: FONTS.SANS, fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK, wordBreak: "break-word" }}>
      {url}
    </span>
    <span style={{ fontFamily: FONTS.MONO, fontSize: 9, color: COLORS.INK_MUTED, display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ color: accent }}>→</span> {arrow}
    </span>
  </div>
);
