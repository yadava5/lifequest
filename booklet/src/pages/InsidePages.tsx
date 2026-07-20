import React from "react";
import { BodyPage } from "../templates/BodyPage";
import { COLORS, FONTS, TYPE, SECTION, SECTION_INK } from "../theme";
import { INSIDE } from "../content";
import { PullQuote } from "../primitives/PullQuote";
import { SourceNote } from "../primitives/SourceNote";
import { RatchetDiagram } from "../visuals/Signatures";

type PageProps = { parity: "recto" | "verso"; pageNumber: number; totalPages: number };

const INK_ACCENT = SECTION_INK["03_INSIDE"];
const BRIGHT = SECTION["03_INSIDE"];

const Rail: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: "0.75in", bottom: "1.05in" }}>
    <SourceNote>{children}</SourceNote>
  </div>
);

const toneColor: Record<string, string> = {
  teal: COLORS.TEAL_DEEP,
  sky: COLORS.SKY_DEEP,
  coral: COLORS.CORAL_DEEP,
};

/** Page 15 — one function, the whole backend. */
export const InsideArchPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="INSIDE"
    sectionColor={INK_ACCENT}
    eyebrow={INSIDE.architecture.eyebrow}
    headline={INSIDE.architecture.headline}
  >
    <p style={{ fontFamily: FONTS.SANS, fontSize: TYPE.body.size, lineHeight: TYPE.body.lh, color: COLORS.INK, margin: "2px 0 22px", maxWidth: "6.4in" }}>
      {INSIDE.architecture.body}
    </p>

    {/* Request flow */}
    <div style={{ display: "flex", alignItems: "stretch", gap: 8, flexWrap: "nowrap" }}>
      {INSIDE.architecture.flow.map((f, i) => (
        <React.Fragment key={f.stage}>
          <div
            style={{
              flex: 1,
              border: `0.75pt solid ${COLORS.HAIRLINE}`,
              borderTop: `2.5px solid ${BRIGHT}`,
              borderRadius: 7,
              background: COLORS.PAPER_ELEVATED,
              padding: "10px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <span style={{ fontFamily: FONTS.SANS, fontSize: 11, fontWeight: 700, color: COLORS.INK, lineHeight: 1.1 }}>{f.stage}</span>
            <span style={{ fontFamily: FONTS.MONO, fontSize: 7.5, color: COLORS.INK_MUTED, lineHeight: 1.3 }}>{f.detail}</span>
          </div>
          {i < INSIDE.architecture.flow.length - 1 && (
            <span style={{ alignSelf: "center", color: INK_ACCENT, fontSize: 14 }} aria-hidden>
              →
            </span>
          )}
        </React.Fragment>
      ))}
    </div>

    {/* What's already proven */}
    <div style={{ marginTop: 26 }}>
      <div style={{ fontFamily: FONTS.MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: INK_ACCENT, marginBottom: 10 }}>
        what’s already proven
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {INSIDE.architecture.proven.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", maxWidth: "6.4in" }}>
            <span style={{ color: BRIGHT, fontSize: 12, marginTop: 1, flexShrink: 0 }}>✓</span>
            <span style={{ fontFamily: FONTS.SANS, fontSize: 11, lineHeight: 1.42, color: COLORS.INK }}>{p}</span>
          </div>
        ))}
      </div>
    </div>

    {/* why one function — boot once, reuse warm, serve the whole /api */}
    <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderTop: `1pt solid ${BRIGHT}`, borderBottom: `0.5pt solid ${COLORS.HAIRLINE}` }}>
      {[
        { v: "boot once", k: "at module scope", n: "the Nest + Fastify graph builds a single time" },
        { v: "reused", k: "warm invocations", n: "later requests skip the rebuild entirely" },
        { v: "one /api", k: "a single Vercel fn", n: "the whole backend behind one handler" },
      ].map((x, i) => (
        <div key={x.k} style={{ padding: "11px 14px", borderLeft: i === 0 ? "none" : `0.5pt solid ${COLORS.HAIRLINE}`, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: FONTS.MONO, fontSize: 14, fontWeight: 700, color: INK_ACCENT, letterSpacing: "-0.01em", lineHeight: 1 }}>{x.v}</span>
          <span style={{ fontFamily: FONTS.MONO, fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.INK_MUTED }}>{x.k}</span>
          <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 9.5, lineHeight: 1.25, color: COLORS.INK_SUBTLE }}>{x.n}</span>
        </div>
      ))}
    </div>

    <Rail>{INSIDE.architecture.source}</Rail>
  </BodyPage>
);

/** Page 16 — the monotonic ratchet (the crown jewel). */
export const InsideMonotonicPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="INSIDE"
    sectionColor={INK_ACCENT}
    eyebrow={INSIDE.monotonic.eyebrow}
    headline={INSIDE.monotonic.headline}
  >
    <PullQuote color={COLORS.INK} style={{ margin: "2px 0 18px", maxWidth: "6.2in" }}>
      {INSIDE.monotonic.lede}
    </PullQuote>

    <p style={{ fontFamily: FONTS.SANS, fontSize: TYPE.body.size, lineHeight: TYPE.body.lh, color: COLORS.INK, margin: "0 0 22px", maxWidth: "6.4in" }}>
      {INSIDE.monotonic.body}
    </p>

    <RatchetDiagram up={INSIDE.monotonic.up} down={INSIDE.monotonic.down} />

    <div
      style={{
        marginTop: 22,
        borderTop: `1pt solid ${COLORS.INK}`,
        paddingTop: 14,
        fontFamily: FONTS.MONO,
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: INK_ACCENT,
      }}
    >
      {INSIDE.monotonic.invariant}
    </div>

    <Rail>{INSIDE.monotonic.source}</Rail>
  </BodyPage>
);

/** Page 17 — real accounts, isolated tables. */
export const InsideTenancyPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => (
  <BodyPage
    parity={parity}
    pageNumber={pageNumber}
    totalPages={totalPages}
    sectionLabel="INSIDE"
    sectionColor={INK_ACCENT}
    eyebrow={INSIDE.tenancy.eyebrow}
    headline={INSIDE.tenancy.headline}
  >
    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 17, lineHeight: 1.4, color: COLORS.INK_MUTED, margin: "2px 0 22px", maxWidth: "6.2in" }}>
      {INSIDE.tenancy.lede}
    </p>

    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {INSIDE.tenancy.facts.map((f) => {
        const c = toneColor[f.tone] ?? INK_ACCENT;
        return (
          <div
            key={f.k}
            style={{
              border: `0.75pt solid ${COLORS.HAIRLINE}`,
              borderLeft: `3px solid ${c}`,
              borderRadius: 8,
              background: COLORS.PAPER_ELEVATED,
              padding: "13px 15px",
              display: "grid",
              gridTemplateColumns: "1.05in 1fr",
              columnGap: 14,
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: c }}>{f.k}</span>
              <span style={{ fontFamily: FONTS.MONO, fontSize: 7, color: COLORS.INK_SUBTLE }}>{f.cite}</span>
            </div>
            <span style={{ fontFamily: FONTS.SANS, fontSize: 11, lineHeight: 1.42, color: COLORS.INK }}>{f.v}</span>
          </div>
        );
      })}
    </div>

    {/* what a toy skips — the three details that make it a real product */}
    <div style={{ marginTop: 18, borderTop: `1pt solid ${BRIGHT}`, paddingTop: 14 }}>
      <div style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: INK_ACCENT, marginBottom: 10 }}>
        what a toy skips
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {[
          { was: "plaintext passwords", now: "argon2 hashing", c: COLORS.TEAL_DEEP },
          { was: "one shared table", now: "per-app schema", c: COLORS.SKY_DEEP },
          { was: "a demo anyone can brick", now: "frozen identity", c: COLORS.CORAL_DEEP },
        ].map((x) => (
          <div key={x.now} style={{ border: `0.75pt solid ${COLORS.HAIRLINE}`, borderLeft: `2.5px solid ${x.c}`, borderRadius: 7, background: COLORS.PAPER_ELEVATED, padding: "10px 13px", display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontFamily: FONTS.MONO, fontSize: 8.5, color: COLORS.INK_SUBTLE, textDecoration: "line-through" }}>{x.was}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: x.c, fontSize: 12 }}>→</span>
              <span style={{ fontFamily: FONTS.SANS, fontSize: 11.5, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK }}>{x.now}</span>
            </span>
          </div>
        ))}
      </div>
    </div>

    <p style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 11.5, color: COLORS.INK_MUTED, margin: "14px 0 0", maxWidth: "6.2in" }}>
      {INSIDE.tenancy.honest}
    </p>

    <Rail>source · see cites above</Rail>
  </BodyPage>
);
