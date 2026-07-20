import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { BodyPage } from "../templates/BodyPage";
import { Page } from "../primitives/Page";
import { COLORS, FONTS, PAGE, SECTION_INK } from "../theme";
import { BUILD } from "../content";
import { SourceNote } from "../primitives/SourceNote";

const LIVE_HEIGHT = `calc(${PAGE.trimH}in - ${PAGE.margin.top}in - ${PAGE.margin.bottom}in)`;

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

    {/* At-a-glance stat cluster — the monorepo shape in four numbers. */}
    <div style={{ marginTop: 24 }}>
      <div style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.INK_MUTED, marginBottom: 10 }}>
        at a glance
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
        {[
          { big: "1", label: "TypeScript monorepo", accent: COLORS.STONE_DEEP },
          { big: "2", label: "apps · one build, two targets", accent: COLORS.CORAL_DEEP },
          { big: "2", label: "shared packages · schemas + client", accent: COLORS.TEAL_DEEP },
          { big: "1", label: "Vercel fn · the whole API", accent: COLORS.GOLD_DEEP },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              border: `0.75pt solid ${COLORS.HAIRLINE}`,
              borderTop: `2.5px solid ${s.accent}`,
              borderRadius: 7,
              background: COLORS.PAPER_ELEVATED,
              padding: "11px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <span style={{ fontFamily: FONTS.MONO, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: s.accent, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.big}</span>
            <span style={{ fontFamily: FONTS.SANS, fontSize: 9.5, color: COLORS.INK_MUTED, lineHeight: 1.3 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* one dist/, two targets — the shape the journey spread walks through */}
    <div style={{ marginTop: 20, borderTop: `1pt solid ${COLORS.INK}`, paddingTop: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: INK_ACCENT }}>one dist/, two targets</span>
        <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 11, color: COLORS.INK_SUBTLE }}>the journey · pp. 24–25 →</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 24px 0.9fr 24px 1.35fr", alignItems: "center", columnGap: 6 }}>
        <div style={{ border: `0.75pt solid ${COLORS.HAIRLINE}`, borderLeft: `2.5px solid ${COLORS.CORAL_DEEP}`, borderRadius: 7, background: COLORS.PAPER_ELEVATED, padding: "10px 12px" }}>
          <div style={{ fontFamily: FONTS.SANS, fontSize: 11, fontWeight: 700, color: COLORS.INK }}>one codebase</div>
          <div style={{ fontFamily: FONTS.MONO, fontSize: 8, color: COLORS.INK_MUTED, marginTop: 2 }}>React 19 · Vite 7</div>
        </div>
        <span style={{ textAlign: "center", color: COLORS.HAIRLINE_STRONG, fontSize: 14 }}>→</span>
        <div style={{ border: `0.75pt solid ${INK_ACCENT}`, borderRadius: 7, background: COLORS.STONE_TINT, padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontFamily: FONTS.MONO, fontSize: 11, fontWeight: 700, color: INK_ACCENT }}>dist/</div>
          <div style={{ fontFamily: FONTS.MONO, fontSize: 8, color: COLORS.INK_MUTED, marginTop: 2 }}>tsc + vite</div>
        </div>
        <span style={{ textAlign: "center", color: COLORS.HAIRLINE_STRONG, fontSize: 14 }}>→</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ border: `0.75pt solid ${COLORS.HAIRLINE}`, borderLeft: `2.5px solid ${COLORS.TEAL_DEEP}`, borderRadius: 6, background: COLORS.PAPER_ELEVATED, padding: "7px 11px", fontFamily: FONTS.SANS, fontSize: 10.5, fontWeight: 600, color: COLORS.INK }}>
            Tauri window <span style={{ fontFamily: FONTS.MONO, fontSize: 8, fontWeight: 400, color: COLORS.INK_MUTED }}>· desktop</span>
          </div>
          <div style={{ border: `0.75pt solid ${COLORS.HAIRLINE}`, borderLeft: `2.5px solid ${COLORS.SKY_DEEP}`, borderRadius: 6, background: COLORS.PAPER_ELEVATED, padding: "7px 11px", fontFamily: FONTS.SANS, fontSize: 10.5, fontWeight: 600, color: COLORS.INK }}>
            Vercel web <span style={{ fontFamily: FONTS.MONO, fontSize: 8, fontWeight: 400, color: COLORS.INK_MUTED }}>· any browser</span>
          </div>
        </div>
      </div>
    </div>

    <div style={{ position: "absolute", left: "0.75in", bottom: "1.05in" }}>
      <SourceNote>{BUILD.stack.source}</SourceNote>
    </div>
  </BodyPage>
);

const ADOPTER_ACCENTS = [COLORS.SKY_DEEP, COLORS.TEAL_DEEP, COLORS.GOLD_DEEP, COLORS.CORAL_DEEP];

/** Page 27 — the Try-It page: QR to the live app + the concept framing. */
export const BuildTryItPage: React.FC<PageProps> = ({ parity, pageNumber, totalPages }) => {
  const { tryit } = BUILD;
  const { concept } = tryit;
  return (
    <Page
      parity={parity}
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionLabel="BUILD"
      sectionColor={INK_ACCENT}
    >
      <div style={{ display: "flex", flexDirection: "column", minHeight: LIVE_HEIGHT }}>
        <div
          style={{
            fontFamily: FONTS.MONO,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: COLORS.CORAL_DEEP,
            marginBottom: 12,
          }}
        >
          {tryit.eyebrow}
        </div>

        <h1
          style={{
            fontFamily: FONTS.SANS,
            fontSize: 58,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 0.98,
            color: COLORS.INK,
            margin: "0 0 14px",
          }}
        >
          {tryit.headline}
        </h1>

        <p
          style={{
            fontFamily: FONTS.SERIF,
            fontStyle: "italic",
            fontSize: 18,
            lineHeight: 1.35,
            color: COLORS.INK_MUTED,
            margin: "0 0 22px",
            maxWidth: "6.2in",
          }}
        >
          {tryit.tagline}
        </p>

        {/* QR + live link band */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 22, alignItems: "center" }}>
          <div
            style={{
              background: COLORS.PAPER,
              borderRadius: 14,
              padding: 13,
              border: `1pt solid ${COLORS.HAIRLINE_STRONG}`,
              boxShadow: `0 12px 34px -18px ${COLORS.INK_SUBTLE}`,
            }}
          >
            <QRCodeSVG value={tryit.qrTarget} size={120} level="M" marginSize={0} fgColor={COLORS.INK} bgColor={COLORS.PAPER} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontFamily: FONTS.MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.CORAL_DEEP }}>
              {tryit.qrCaption}
            </div>
            <div style={{ fontFamily: FONTS.SANS, fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK }}>
              {tryit.liveUrl}
            </div>
            <div style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 12.5, color: COLORS.INK_MUTED, lineHeight: 1.35, maxWidth: "3.4in" }}>
              {tryit.demoNote}
            </div>
            <div style={{ fontFamily: FONTS.MONO, fontSize: 9, color: COLORS.INK_MUTED, display: "flex", alignItems: "center", gap: 7, marginTop: 2 }}>
              <span style={{ fontWeight: 700, letterSpacing: "0.1em", color: COLORS.SKY_DEEP }}>{tryit.repoLabel}</span>
              <span style={{ color: COLORS.SKY_DEEP }}>→</span>
              <span>{tryit.repoUrl}</span>
            </div>
          </div>
        </div>

        {/* Concept / how-society-helps block */}
        <div style={{ marginTop: 22, borderTop: `1pt solid ${COLORS.INK}`, paddingTop: 15 }}>
          <div style={{ fontFamily: FONTS.MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: INK_ACCENT, marginBottom: 8 }}>
            {concept.label}
          </div>
          <p style={{ fontFamily: FONTS.SANS, fontSize: 11, lineHeight: 1.5, color: COLORS.INK, margin: "0 0 14px", maxWidth: "6.4in" }}>
            {concept.body}
          </p>
          <div style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.INK_MUTED, marginBottom: 8 }}>
            {concept.adoptersLabel}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {concept.adopters.map((a, i) => (
              <div
                key={a}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  border: `0.75pt solid ${COLORS.HAIRLINE}`,
                  borderLeft: `3px solid ${ADOPTER_ACCENTS[i % ADOPTER_ACCENTS.length]}`,
                  borderRadius: 7,
                  background: COLORS.PAPER_ELEVATED,
                  padding: "9px 12px",
                }}
              >
                <span style={{ fontFamily: FONTS.SANS, fontSize: 11, fontWeight: 600, color: COLORS.INK }}>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* what's waiting in the demo — the loop, in four words */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: FONTS.MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.CORAL_DEEP, marginBottom: 8 }}>
            what's waiting in the demo
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {[
              { k: "missions", n: "a seeded day of quests to complete", c: COLORS.CORAL_DEEP },
              { k: "coins", n: "a reward burst on every finish", c: COLORS.GOLD_DEEP },
              { k: "tiers", n: "a rank bar that climbs as you go", c: COLORS.TEAL_DEEP },
              { k: "a guild", n: "meetups and shared wins alongside", c: COLORS.SKY_DEEP },
            ].map((x) => (
              <div key={x.k} style={{ border: `0.75pt solid ${COLORS.HAIRLINE}`, borderTop: `2.5px solid ${x.c}`, borderRadius: 7, background: COLORS.PAPER_ELEVATED, padding: "10px 11px", display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: FONTS.SANS, fontSize: 12, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK }}>{x.k}</span>
                <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 9.5, lineHeight: 1.25, color: COLORS.INK_MUTED }}>{x.n}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 10 }} />

        {/* Footer rule — mirrors the book's closing footers */}
        <div
          style={{
            borderTop: `0.75pt solid ${COLORS.HAIRLINE_STRONG}`,
            paddingTop: 12,
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
          <span>{tryit.microNote}</span>
          <span style={{ color: INK_ACCENT }}>LifeQuest · Vol. 01</span>
        </div>
      </div>
    </Page>
  );
};
