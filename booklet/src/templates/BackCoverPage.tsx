import React from "react";
import { COLORS, FONTS, PAGE } from "../theme";
import { BACK_COVER } from "../content";
import { TrailField } from "../visuals/TrailField";
import { QuestRing } from "../visuals/QuestRing";

/**
 * Back cover (page 28) — a CLOSING ANSWER to the front, not a mirror of it.
 * The front asks (a dashed route, waypoints still glowing, only the first leg
 * lit); this page answers: the same journey completed — one calm solid line in
 * from the spine edge, every waypoint collected, the flag planted, and a
 * dashed coral leg carrying on past the summit through the top bleed — the
 * idea handed onward, which is what the closing statement says in words. The
 * quest-ring mark sits above that statement as the book's closing device; the
 * colophon carries the identity, so the front's masthead is not repeated.
 * No QR, no CTA, no live URL — the Try-It page (27) owns those.
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

    {/* Vertical margin callout — right edge. Painted after the scrim so it
        cannot dissolve mid-word, and in INK_MUTED (APCA Lc 70 on paper;
        INK_SUBTLE measured Lc 45, below the Lc 60 dim-text floor). */}
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
        color: COLORS.INK_MUTED,
      }}
    >
      an idea, offered to society
    </div>

    {/* Closing block — lower-left: device, statement, sign-off, colophon */}
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
      <QuestRing size={52} />
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
