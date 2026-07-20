import React from "react";
import { Page } from "../primitives/Page";
import { Eyebrow } from "../primitives/Eyebrow";
import { COLORS, FONTS, PAGE, SECTION, SECTION_INK, type SectionKey } from "../theme";
import { BUILD } from "../content";

/** Live area = trim height minus the top/bottom content margins. */
const LIVE_HEIGHT = `calc(${PAGE.trimH}in - ${PAGE.margin.top}in - ${PAGE.margin.bottom}in)`;

/**
 * BUILD spread (pages 24 / 25) — the ship pipeline read across the gutter.
 * Left half: CODE → SHELL → BUILD. Right half: BUILD → WEB → API. The single
 * `dist/` (the BUILD stage) is the hinge, repeated so the two halves read as
 * one continuous ribbon once bound — one codebase, two targets.
 */
export type SpreadPageProps = {
  half: "left" | "right";
  parity: "recto" | "verso";
  pageNumber: number;
  totalPages: number;
  sectionLabel: string;
  sectionColor: string;
};

/** Per-stage detail — what each ship stage is, and where it runs. Derived from
 *  BUILD.pipeline sub-copy + the INSIDE chapter; nothing invented. */
const STAGE_DETAIL: Record<string, { does: string; where: string }> = {
  CODE: { does: "One Vite + React 19 codebase — the single source of truth for both targets.", where: "React 19 · Vite 7" },
  SHELL: { does: "A Tauri 2 (Rust) shell wraps that code for the native desktop window.", where: "Tauri 2 · Rust" },
  BUILD: { does: "tsc + vite compile it once into a single dist/ — the hinge both targets share.", where: "one dist/" },
  WEB: { does: "Vercel serves that same dist/ as the SPA, live in any browser.", where: "Vercel · the SPA" },
  API: { does: "The NestJS app rides alongside as one serverless function under /api.", where: "Nest fn · serverless" },
};

export const SpreadPage: React.FC<SpreadPageProps> = ({
  half,
  parity,
  pageNumber,
  totalPages,
  sectionLabel,
  sectionColor,
}) => {
  const { pipeline } = BUILD;
  const stages = half === "left" ? pipeline.stages.slice(0, 3) : pipeline.stages.slice(2, 5);
  const headline = half === "left" ? pipeline.headlineLeft : pipeline.headlineRight;
  const sub = half === "left" ? pipeline.subLeft : pipeline.subRight;

  return (
    <Page
      parity={parity}
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionLabel={sectionLabel}
      sectionColor={sectionColor}
    >
      <div style={{ display: "flex", flexDirection: "column", minHeight: LIVE_HEIGHT }}>
        <Eyebrow color={SECTION_INK["05_BUILD"]} style={{ marginBottom: 6 }}>
          {half === "left" ? pipeline.eyebrowLeft : pipeline.eyebrowRight}
        </Eyebrow>

        <div style={{ textAlign: half === "right" ? "right" : "left" }}>
          <h1
            style={{
              fontFamily: FONTS.SANS,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: COLORS.INK,
              margin: 0,
            }}
          >
            {headline}
          </h1>
          <p
            style={{
              fontFamily: FONTS.SERIF,
              fontStyle: "italic",
              fontSize: 14,
              lineHeight: 1.4,
              color: COLORS.INK_MUTED,
              margin: "6px 0 0",
              maxWidth: "5.4in",
              marginLeft: half === "right" ? "auto" : 0,
            }}
          >
            {sub}
          </p>
        </div>

        {/* Ribbon fills the live area; the connectors grow to distribute the
            three stage cards evenly from the header down to the foot note. */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", paddingTop: 20, paddingBottom: "1.55in" }}>
          {stages.map((s, i) => {
            const accent = SECTION[s.accentKey as SectionKey];
            const bridge = s.label === "BUILD";
            const d = STAGE_DETAIL[s.label];
            return (
              <React.Fragment key={s.label}>
                <StageCard n={s.n} label={s.label} detail={s.detail} accent={accent} bridge={bridge} does={d?.does} where={d?.where} />
                {i < stages.length - 1 && <Connector />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Foot — the one-build line (left) or ship targets (right) */}
      <div style={{ position: "absolute", left: "0.75in", right: "0.75in", bottom: "1.2in" }}>
        {half === "left" ? (
          <div
            style={{
              borderTop: `1pt solid ${COLORS.INK}`,
              paddingTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 8.5,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: SECTION_INK["05_BUILD"],
                whiteSpace: "nowrap",
              }}
            >
              one dist/
            </span>
            <span style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 13, color: COLORS.INK, lineHeight: 1.35 }}>
              {pipeline.registry}
            </span>
          </div>
        ) : (
          <div
            style={{
              borderTop: `1pt solid ${COLORS.INK}`,
              paddingTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 16,
              fontFamily: FONTS.MONO,
              fontSize: 8.5,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: COLORS.INK_MUTED,
            }}
          >
            <span style={{ color: COLORS.CORAL_DEEP }}>{pipeline.liveUrl}</span>
            <span>·</span>
            <span style={{ color: COLORS.SKY_DEEP }}>{pipeline.repoUrl}</span>
          </div>
        )}
      </div>

      {/* gutter continuity marker — sits above the page-number footer band */}
      <div
        style={{
          position: "absolute",
          bottom: "0.82in",
          [half === "left" ? "right" : "left"]: "0.75in",
          fontFamily: FONTS.MONO,
          fontSize: 8,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: SECTION_INK["05_BUILD"],
        }}
      >
        {half === "left" ? "pipeline continues →" : "← the build bridges the fold"}
      </div>
    </Page>
  );
};

const StageCard: React.FC<{
  n: string;
  label: string;
  detail: string;
  accent: string;
  bridge: boolean;
  does?: string;
  where?: string;
}> = ({ n, label, detail, accent, bridge, does, where }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      border: `0.5pt solid ${bridge ? accent : COLORS.HAIRLINE}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 8,
      background: bridge ? `${accent}1f` : COLORS.PAPER_ELEVATED,
      padding: "14px 16px",
    }}
  >
    <div
      style={{
        width: 34,
        height: 34,
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
      {n}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: FONTS.SANS, fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.INK }}>
            {label}
          </span>
          {bridge && (
            <span
              style={{
                fontFamily: FONTS.MONO,
                fontSize: 7.5,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: COLORS.STONE_DEEP,
              }}
            >
              the hinge
            </span>
          )}
        </div>
        {where && (
          <span style={{ fontFamily: FONTS.MONO, fontSize: 7.5, letterSpacing: "0.04em", color: COLORS.INK_SUBTLE, whiteSpace: "nowrap" }}>{where}</span>
        )}
      </div>
      <div style={{ fontFamily: FONTS.MONO, fontSize: 9, color: COLORS.INK_MUTED, marginTop: 2 }}>{detail}</div>
      {does && (
        <div style={{ fontFamily: FONTS.SERIF, fontStyle: "italic", fontSize: 11.5, lineHeight: 1.35, color: COLORS.INK, marginTop: 7 }}>{does}</div>
      )}
    </div>
  </div>
);

/** A vertical link between stage cards that GROWS to fill the slack, so the
 *  three cards distribute evenly down the page instead of clustering. */
const Connector: React.FC = () => (
  <div style={{ flexGrow: 1, minHeight: 26, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }} aria-hidden>
    <span style={{ position: "absolute", top: 4, bottom: 4, width: 1.5, background: COLORS.HAIRLINE_STRONG }} />
    <span style={{ position: "relative", background: COLORS.PAPER, color: COLORS.HAIRLINE_STRONG, fontSize: 15, lineHeight: 1, padding: "3px 0" }}>↓</span>
  </div>
);
