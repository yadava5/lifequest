import React from "react";
import { COLORS, FONTS, PAGE } from "../theme";
import { BACK_COVER } from "../content";
import { TrailField } from "../visuals/TrailField";

/**
 * Back cover (page 28) — a PURE CLOSING that mirrors the front cover: the same
 * full-bleed dawn-map (reseeded so it reads as a wraparound), a quiet closing
 * line, and the colophon. No QR, no CTA, no live URL — the Try-It page (27)
 * owns those now. This page just closes the book, the way a real book's last
 * page does: a bookend to the cover.
 */
export const BackCoverPage: React.FC = () => (
  <section
    className="page"
    data-bleed="true"
    style={{
      background: COLORS.PAPER,
      color: COLORS.INK,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <TrailField widthIn={8.75} heightIn={11.25} variant="back" />

    {/* Masthead — top-left, mirrors the cover */}
    <div
      style={{
        position: "absolute",
        top: "0.7in",
        left: "0.7in",
        fontFamily: FONTS.MONO,
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: COLORS.INK_MUTED,
      }}
    >
      LifeQuest · System Card
    </div>

    {/* Vertical margin callout — right edge, mirrors the cover */}
    <div
      style={{
        position: "absolute",
        right: "0.4in",
        bottom: `${PAGE.margin.bottom}in`,
        writingMode: "vertical-rl",
        fontFamily: FONTS.MONO,
        fontSize: 8.5,
        fontWeight: 500,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: COLORS.INK_SUBTLE,
      }}
    >
      an idea, offered to society
    </div>

    {/* Scrim behind the closing block */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "4.2in",
        background: `linear-gradient(to top, ${COLORS.PAPER} 14%, rgba(253,251,247,0.85) 48%, rgba(253,251,247,0) 100%)`,
        pointerEvents: "none",
      }}
    />

    {/* Closing block — lower-left, mirrors the cover's title block */}
    <div
      style={{
        position: "absolute",
        left: "0.7in",
        bottom: "0.95in",
        right: "0.7in",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.SERIF,
          fontStyle: "italic",
          fontSize: 30,
          lineHeight: 1.22,
          color: COLORS.INK,
          maxWidth: "5.7in",
        }}
      >
        {BACK_COVER.closingStatement}
      </div>
      <div
        style={{
          fontFamily: FONTS.SERIF,
          fontStyle: "italic",
          fontSize: 16,
          color: COLORS.CORAL_DEEP,
        }}
      >
        {BACK_COVER.closingLine}
      </div>
      <div
        style={{
          marginTop: 6,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: FONTS.MONO,
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: COLORS.INK,
        }}
      >
        {BACK_COVER.colophon.map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ width: 20, height: 1, background: COLORS.HAIRLINE_STRONG }} />}
            <span style={{ color: i === 0 ? COLORS.INK : COLORS.INK_SUBTLE }}>{line}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);
