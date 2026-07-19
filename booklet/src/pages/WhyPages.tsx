import React from "react";
import { BodyPage } from "../templates/BodyPage";
import { COLORS, FONTS, TYPE, SECTION, SECTION_INK } from "../theme";
import { WHY } from "../content";
import { PullQuote } from "../primitives/PullQuote";
import { SourceNote } from "../primitives/SourceNote";

type PageProps = { parity: "recto" | "verso"; pageNumber: number; totalPages: number };

const INK_ACCENT = SECTION_INK["01_WHY"];
const BRIGHT = SECTION["01_WHY"];

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p
    style={{
      fontFamily: FONTS.SANS,
      fontSize: TYPE.body.size,
      lineHeight: TYPE.body.lh,
      letterSpacing: TYPE.body.tracking,
      color: COLORS.INK,
      margin: "0 0 10px",
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

/** Page 05 — re-entry is a lonely climb. */
export const WhyReentryPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="WHY"
    sectionColor={INK_ACCENT}
    eyebrow={WHY.reentry.eyebrow}
    headline={WHY.reentry.headline}
  >
    <div style={{ maxWidth: "6.4in", marginTop: 4 }}>
      <PullQuote color={COLORS.INK} style={{ marginBottom: 18 }}>
        {WHY.reentry.pullQuote}
      </PullQuote>
      {WHY.reentry.body.map((p, i) => (
        <Body key={i}>{p}</Body>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 22 }}>
      {WHY.reentry.audiences.map((a) => (
        <div
          key={a.label}
          style={{
            border: `0.75pt solid ${COLORS.HAIRLINE}`,
            borderTop: `2.5px solid ${BRIGHT}`,
            borderRadius: 7,
            background: COLORS.PAPER_ELEVATED,
            padding: "12px 13px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.MONO,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: INK_ACCENT,
            }}
          >
            {a.label}
          </span>
          <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 13, color: COLORS.INK, lineHeight: 1.25 }}>
            {a.quote}
          </span>
        </div>
      ))}
    </div>

    <p
      style={{
        fontFamily: FONTS.SERIF,
        fontStyle: "italic",
        fontSize: 18,
        lineHeight: 1.35,
        color: COLORS.INK_MUTED,
        margin: "24px 0 0",
        maxWidth: "6in",
        borderTop: `1pt solid ${BRIGHT}`,
        paddingTop: 14,
      }}
    >
      {WHY.reentry.coda}
    </p>

    <Rail>{WHY.reentry.source}</Rail>
  </BodyPage>
);

/** Page 06 — routines are boring, missions aren't. */
export const WhyChorePage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="WHY"
    sectionColor={INK_ACCENT}
    eyebrow={WHY.chore.eyebrow}
    headline={WHY.chore.headline}
  >
    <p
      style={{
        fontFamily: FONTS.SERIF,
        fontStyle: "italic",
        fontSize: 17,
        lineHeight: 1.4,
        color: COLORS.INK_MUTED,
        margin: "2px 0 22px",
        maxWidth: "6.2in",
      }}
    >
      {WHY.chore.lede}
    </p>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <Column title={WHY.chore.beforeTitle} rows={WHY.chore.before} tone="muted" />
      <Column title={WHY.chore.withTitle} rows={WHY.chore.with} tone="accent" />
    </div>

    <p
      style={{
        fontFamily: FONTS.SERIF,
        fontStyle: "italic",
        fontSize: 16,
        lineHeight: 1.4,
        color: COLORS.INK,
        margin: "24px 0 0",
        maxWidth: "6in",
        borderLeft: `2.5px solid ${BRIGHT}`,
        paddingLeft: 14,
      }}
    >
      {WHY.chore.gate}
    </p>

    <Rail>{WHY.chore.source}</Rail>
  </BodyPage>
);

const Column: React.FC<{
  title: string;
  rows: ReadonlyArray<string>;
  tone: "muted" | "accent";
}> = ({ title, rows, tone }) => {
  const accent = tone === "accent" ? INK_ACCENT : COLORS.INK_SUBTLE;
  return (
    <div
      style={{
        border: `0.75pt solid ${COLORS.HAIRLINE}`,
        borderRadius: 8,
        background: tone === "accent" ? COLORS.SKY_TINT : COLORS.PAPER_WARM,
        padding: 14,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.MONO,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: accent,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ color: tone === "accent" ? BRIGHT : COLORS.HAIRLINE_STRONG, fontSize: 12, lineHeight: 1.3, flexShrink: 0 }}>
              {tone === "accent" ? "◆" : "—"}
            </span>
            <span style={{ fontFamily: FONTS.SANS, fontSize: 11, lineHeight: 1.4, color: COLORS.INK }}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Page 07 — momentum needs a loop (the reframe). */
export const WhyLoopPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="WHY"
    sectionColor={INK_ACCENT}
    eyebrow={WHY.loop.eyebrow}
    headline={WHY.loop.headline}
  >
    <div style={{ maxWidth: "6.4in", marginTop: 4 }}>
      {WHY.loop.body.map((p, i) => (
        <Body key={i}>{p}</Body>
      ))}
    </div>

    <PullQuote color={COLORS.INK} style={{ margin: "18px 0 22px", maxWidth: "6in" }}>
      {WHY.loop.thesis}
    </PullQuote>

    <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: "6in" }}>
      {WHY.loop.reframe.map((r, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 28px 1fr",
            alignItems: "center",
            columnGap: 12,
            padding: "11px 0",
            borderTop: i === 0 ? "none" : `0.5pt solid ${COLORS.HAIRLINE}`,
          }}
        >
          <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 15, color: COLORS.INK_MUTED, textAlign: "right" }}>
            {r.from}
          </span>
          <span style={{ color: BRIGHT, textAlign: "center", fontSize: 15 }}>→</span>
          <span style={{ fontFamily: FONTS.SANS, fontSize: 14, fontWeight: 700, color: INK_ACCENT }}>{r.to}</span>
        </div>
      ))}
    </div>

    <p
      style={{
        fontFamily: FONTS.SERIF,
        fontStyle: "italic",
        fontSize: 15,
        color: COLORS.INK_MUTED,
        margin: "24px 0 0",
      }}
    >
      {WHY.loop.handoff}
    </p>

    <Rail>{WHY.loop.source}</Rail>
  </BodyPage>
);
