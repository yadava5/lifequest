import React from "react";
import { COLORS, FONTS, TYPE, PAGE, SECTION_INK, type SectionKey } from "../theme";
import { DIORAMAS } from "../visuals/diorama";

/**
 * Full-bleed chapter divider. LifeQuest's identity inverts the dark sibling
 * books: instead of near-black ink, the ground is warm parchment (SAND) lit by
 * a soft dawn glow. The giant numeral rides the chapter's DEEP accent (legible
 * on cream); the bright accent carries the glow, the counter, and the single
 * highlight inside the line-art diorama. The title stays ink italic serif.
 */

export type DividerPageProps = {
  chapterNum: string;
  chapterTitle: string;
  subtitle: string;
  color: string;
  sectionKey: SectionKey;
  chapterIndex: number;
  chapterTotal: number;
};

export const DividerPage: React.FC<DividerPageProps> = ({
  chapterNum,
  chapterTitle,
  subtitle,
  color,
  sectionKey,
  chapterIndex,
  chapterTotal,
}) => {
  const Diorama = DIORAMAS[sectionKey];
  const deep = SECTION_INK[sectionKey];
  return (
    <section
      className="page"
      data-bleed="true"
      style={{
        background: COLORS.SAND,
        color: COLORS.INK,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* soft dawn glow, top */}
      <DawnGlow accent={color} />
      {/* faint dotted map texture */}
      <GroundGrid />

      {/* Chapter number — massive, top-left, in the deep accent. */}
      <div
        style={{
          position: "absolute",
          top: `${PAGE.margin.top}in`,
          left: `${PAGE.margin.outer}in`,
          fontFamily: FONTS.SANS,
          fontSize: TYPE.display.size,
          fontWeight: TYPE.display.weight,
          letterSpacing: TYPE.display.tracking,
          lineHeight: TYPE.display.lh,
          color: deep,
        }}
      >
        {chapterNum}
      </div>

      {/* Chapter title — serif italic ink, just below the numeral. */}
      <div
        style={{
          position: "absolute",
          top: `calc(${PAGE.margin.top}in + ${TYPE.display.size * TYPE.display.lh}pt - 22pt)`,
          left: `${PAGE.margin.outer}in`,
          fontFamily: FONTS.SERIF,
          fontStyle: "italic",
          fontSize: TYPE.sectionTitle.size,
          fontWeight: TYPE.sectionTitle.weight,
          letterSpacing: TYPE.sectionTitle.tracking,
          lineHeight: TYPE.sectionTitle.lh,
          color: COLORS.INK,
        }}
      >
        {chapterTitle}
      </div>

      {/* Accent rule under the title */}
      <div
        style={{
          position: "absolute",
          top: `calc(${PAGE.margin.top}in + ${TYPE.display.size * TYPE.display.lh}pt + ${TYPE.sectionTitle.size}pt - 10pt)`,
          left: `${PAGE.margin.outer}in`,
          width: "1.6in",
          height: 3,
          borderRadius: 2,
          background: deep,
        }}
      />

      {/* Subtitle — serif, dimmed ink, two lines max. */}
      <div
        style={{
          position: "absolute",
          top: `calc(${PAGE.margin.top}in + ${TYPE.display.size * TYPE.display.lh}pt + ${TYPE.sectionTitle.size}pt + 12pt)`,
          left: `${PAGE.margin.outer}in`,
          right: `${PAGE.margin.outer}in`,
          fontFamily: FONTS.SERIF,
          fontStyle: "normal",
          fontSize: TYPE.dividerSubtitle.size + 2,
          fontWeight: 400,
          letterSpacing: TYPE.dividerSubtitle.tracking,
          lineHeight: TYPE.dividerSubtitle.lh,
          color: COLORS.INK_MUTED,
          maxWidth: "5.5in",
        }}
      >
        {subtitle}
      </div>

      {/* Diorama — line-art in ink + the section accent. */}
      <div
        style={{
          position: "absolute",
          right: `${PAGE.margin.outer}in`,
          bottom: `${PAGE.margin.bottom + 0.05}in`,
          width: "3.5in",
          height: "4.6in",
        }}
      >
        {Diorama ? <Diorama /> : null}
      </div>

      {/* Chapter counter — bottom band. */}
      <div
        style={{
          position: "absolute",
          left: `${PAGE.margin.outer}in`,
          bottom: "0.5in",
          fontFamily: FONTS.MONO,
          fontSize: TYPE.eyebrowLarge.size,
          fontWeight: TYPE.eyebrowLarge.weight,
          letterSpacing: TYPE.eyebrowLarge.tracking,
          textTransform: "uppercase",
          color: deep,
        }}
      >
        {String(chapterIndex).padStart(2, "0")} / {String(chapterTotal).padStart(2, "0")}
      </div>
    </section>
  );
};

/** Soft dawn wash near the top, in the chapter's bright accent. */
const DawnGlow: React.FC<{ accent: string }> = ({ accent }) => (
  <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
    <defs>
      <radialGradient id="divider-dawn" cx="70%" cy="8%" r="70%">
        <stop offset="0%" stopColor={accent} stopOpacity={0.16} />
        <stop offset="55%" stopColor={accent} stopOpacity={0.04} />
        <stop offset="100%" stopColor={COLORS.SAND} stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#divider-dawn)" />
  </svg>
);

/** Faint dotted measurement grid — a map texture on the parchment. */
const GroundGrid: React.FC = () => (
  <svg
    aria-hidden
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
  >
    <defs>
      <pattern id="divider-dots" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill={COLORS.INK} opacity={0.06} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#divider-dots)" />
  </svg>
);
