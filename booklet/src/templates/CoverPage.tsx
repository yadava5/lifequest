import React from "react";
import { COLORS, FONTS, PAGE } from "../theme";
import { BRAND, MASTHEAD } from "../content";
import { TrailField } from "../visuals/TrailField";

/**
 * Front cover (page 01). A full-bleed warm-parchment dawn-expedition map
 * (TrailField): a mission trail climbing through glowing waypoints toward a
 * coral summit — the whole product as one image. A waypoint legend seeds the
 * book's color language; the title block lands lower-left over a soft cream
 * scrim; a vertical mono callout runs the right edge.
 */
export const CoverPage: React.FC = () => (
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
    <TrailField widthIn={8.75} heightIn={11.25} variant="front" />

    {/* Masthead — top-left */}
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

    {/* Waypoint legend — top-right, seeds the color language. */}
    <div
      style={{
        position: "absolute",
        top: "0.6in",
        right: "0.62in",
        display: "flex",
        gap: 13,
        alignItems: "center",
        padding: "7px 12px",
        borderRadius: 999,
        background: "rgba(253, 251, 247, 0.7)",
        border: `0.5pt solid ${COLORS.HAIRLINE}`,
      }}
    >
      {[
        { c: COLORS.SKY_DEEP, l: "community" },
        { c: COLORS.TEAL_DEEP, l: "wellness" },
        { c: COLORS.GOLD_DEEP, l: "reward" },
        { c: COLORS.CORAL_DEEP, l: "summit" },
      ].map((x) => (
        <span
          key={x.l}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontFamily: FONTS.MONO,
            fontSize: 8,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: COLORS.INK,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: x.c }} />
          {x.l}
        </span>
      ))}
    </div>

    {/* Vertical margin callout — right edge */}
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
      a quest game for real life
    </div>

    {/* Scrim behind the title block */}
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

    {/* Title block — lower-left */}
    <div
      style={{
        position: "absolute",
        left: "0.7in",
        bottom: "0.95in",
        right: "0.7in",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.SANS,
          fontSize: 78,
          fontWeight: 700,
          letterSpacing: "-0.035em",
          lineHeight: 0.92,
          color: COLORS.INK,
        }}
      >
        Life<span style={{ color: COLORS.CORAL_DEEP }}>Quest</span>
      </div>
      <div
        style={{
          fontFamily: FONTS.SERIF,
          fontStyle: "italic",
          fontSize: 23,
          lineHeight: 1.22,
          color: COLORS.INK_MUTED,
          maxWidth: "5.4in",
        }}
      >
        {BRAND.subtitle}
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
        <span>
          {BRAND.author} · {BRAND.year}
        </span>
        <span style={{ width: 28, height: 1, background: COLORS.HAIRLINE_STRONG }} />
        <span style={{ color: COLORS.INK_SUBTLE }}>{MASTHEAD.volume}</span>
      </div>
    </div>
  </section>
);
