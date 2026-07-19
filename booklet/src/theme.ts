/**
 * LifeQuest System Card — design tokens (self-contained).
 *
 * This is the deliberately WARM / LIGHT sibling of the JobTracker and AutoML
 * System Cards. Where those books ride a near-black ink ground, LifeQuest is
 * printed on warm paper: a "dawn expedition" world of cream parchment, a coral
 * sun, honey-gold coins, lagoon aqua, and powder sky. Flat colour + soft light
 * — a calm game map, nothing shouting. ABSOLUTELY NO PURPLE.
 *
 * Every value is pulled from LifeQuest's own runtime palette
 * (apps/desktop/src/index.css). The *_DEEP variants are the Day-theme accents
 * (legible on cream — eyebrows, numerals, footers, hero numbers); the bright
 * variants are the Night-theme accents, used for waypoint glows, dots, and the
 * single highlight inside each chapter diorama.
 *
 *   CORAL  #F27954 / deep #D1491F   the quest · the summit · the primary
 *   GOLD   #F7BB3B / deep #CB820B   honey — coins, rewards, the proof
 *   TEAL   #34D5B5 / deep #1D7C69   aqua — the engine, wellness, success
 *   SKY    #65BAE2 / deep #247099   powder — community, the guild, the quiet dawn
 *   STONE  #A18F78 / deep #655649   warm neutral — the workshop (BUILD)
 */

// ---------------------------------------------------------------------------
// Palette — source · apps/desktop/src/index.css (:root.light / :root.dark)
// ---------------------------------------------------------------------------

export const COLORS = {
  // Paper (warm content pages)
  PAPER: "#FDFBF7",
  PAPER_WARM: "#F9F6EE",
  PAPER_ELEVATED: "#F5F0E5",
  SURFACE: "#EEE7D8",

  // Sand — the chapter-divider parchment ground (a touch deeper than paper)
  SAND: "#EDE3D4",
  SAND_DEEP: "#E7D8C6",

  // Hairlines (warm)
  HAIRLINE: "#E2DACA",
  HAIRLINE_STRONG: "#BFB29B",

  // Ink (deep-lagoon text)
  INK: "#162C36",
  INK_SOFT: "#122630",
  INK_MUTED: "rgba(22, 44, 54, 0.64)",
  INK_SUBTLE: "rgba(22, 44, 54, 0.40)",

  // On-accent / on-dark inks (warm near-white over coral / deep grounds)
  ON_ACCENT: "#FDFBF7",
  ON_DARK: "#FDFBF7",
  ON_DARK_MUTED: "rgba(253, 251, 247, 0.70)",
  ON_DARK_SUBTLE: "rgba(253, 251, 247, 0.44)",
  ON_DARK_HAIRLINE: "rgba(253, 251, 247, 0.18)",

  // Deep-lagoon grounds — used sparingly (the summit night, the QR panel)
  GROUND: "#0C181D",
  GROUND_ELEVATED: "#14232A",
  GROUND_PANEL: "#101E23",

  // ── Dawn accents (bright — Night theme; glows, dots, diorama highlight) ──
  CORAL: "#F27954",
  GOLD: "#F7BB3B",
  TEAL: "#34D5B5",
  SKY: "#65BAE2",
  STONE: "#A18F78",

  // ── Deep variants (Day theme; legible on cream — the editorial voice) ──
  CORAL_DEEP: "#D1491F",
  GOLD_DEEP: "#CB820B",
  TEAL_DEEP: "#1D7C69",
  SKY_DEEP: "#247099",
  STONE_DEEP: "#655649",

  // ── Accent tints (fills, bands) ──
  CORAL_TINT: "rgba(242, 121, 84, 0.12)",
  GOLD_TINT: "rgba(247, 187, 59, 0.16)",
  TEAL_TINT: "rgba(52, 213, 181, 0.15)",
  SKY_TINT: "rgba(101, 186, 226, 0.15)",
  STONE_TINT: "rgba(161, 143, 120, 0.15)",

  // Status
  SUCCESS: "#1D7C69",
  DANGER: "#D03025",
  DANGER_BRIGHT: "#E15147",
  DANGER_TINT: "rgba(208, 48, 37, 0.08)",

  // Neutral scale (warm-leaning)
  NEUTRAL_300: "#D8CFBE",
  NEUTRAL_400: "#B4A88F",
  NEUTRAL_500: "#8A7E6A",
  NEUTRAL_600: "#655649",
  NEUTRAL_700: "#43392E",
} as const;

// ---------------------------------------------------------------------------
// Fonts — Instrument Serif + Plus Jakarta Sans + Monaspace Neon (mono).
// (Reused verbatim from the framework; the app ships Space Grotesk, but the
// System Card family speaks one editorial voice across every volume.)
// ---------------------------------------------------------------------------

export const FONTS = {
  SANS: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  SERIF: '"Instrument Serif", Georgia, "Times New Roman", serif',
  MONO: '"Monaspace Neon", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

// ---------------------------------------------------------------------------
// Section color map — one dawn accent per chapter. The bright variant carries
// waypoint glows + the diorama highlight; the *_INK deep variant is the
// legible-on-cream voice for eyebrows, footers, numerals, and hero numbers.
//
//   01 WHY     sky     · the quiet, isolating dawn before the climb
//   02 HOW     coral   · the quest — the playable loop, the primary
//   03 INSIDE  teal    · the engine room — the monotonic ratchet
//   04 PROOF   gold    · the coins — the receipts, real persistence
//   05 BUILD   stone   · the workshop (deliberately warm-neutral)
// ---------------------------------------------------------------------------

export const SECTION = {
  "01_WHY": COLORS.SKY,
  "02_HOW": COLORS.CORAL,
  "03_INSIDE": COLORS.TEAL,
  "04_PROOF": COLORS.GOLD,
  "05_BUILD": COLORS.STONE,
} as const;

export const SECTION_INK = {
  "01_WHY": COLORS.SKY_DEEP,
  "02_HOW": COLORS.CORAL_DEEP,
  "03_INSIDE": COLORS.TEAL_DEEP,
  "04_PROOF": COLORS.GOLD_DEEP,
  "05_BUILD": COLORS.STONE_DEEP,
} as const;

export type SectionKey = keyof typeof SECTION;

// ---------------------------------------------------------------------------
// Typography — sized for a held-in-hand 8.5"×11" page. Ported unchanged from
// the framework's proven ladder (px at 96 CSS DPI; printed pt = px ÷ 1.333).
// ---------------------------------------------------------------------------

export const TYPE = {
  // Display — cover title, divider numerals
  display: { size: 220, weight: 700, tracking: "-0.03em", lh: 0.92 },
  displayMedium: { size: 112, weight: 700, tracking: "-0.025em", lh: 1 },

  // Section title on divider pages (italic serif)
  sectionTitle: { size: 80, weight: 400, tracking: "0", lh: 1, italic: true },

  // Page headlines and subheads
  h1: { size: 36, weight: 700, tracking: "-0.02em", lh: 1.08 },
  h2: { size: 22, weight: 600, tracking: "-0.015em", lh: 1.2 },

  // Italic serif subheads
  subheadLarge: { size: 20, weight: 400, italic: true, lh: 1.2 },
  subheadMedium: { size: 18, weight: 400, italic: true, lh: 1.25 },
  subheadSmall: { size: 14, weight: 400, italic: true, lh: 1.3 },

  // Body
  body: { size: 11, weight: 400, tracking: "-0.005em", lh: 1.46 },

  // Pull quotes (serif italic)
  pullQuote: { size: 28, weight: 400, tracking: "0", lh: 1.25, italic: true },
  pullQuoteSmall: { size: 24, weight: 400, tracking: "0", lh: 1.25, italic: true },

  // Supporting
  caption: { size: 10, weight: 500, tracking: "0.02em", lh: 1.25 },
  mono: { size: 10, weight: 500, tracking: "0.04em", lh: 1.2 },
  pageNum: { size: 9, weight: 500, tracking: "0.04em", lh: 1 },

  // Monaspace UPPERCASE eyebrow
  eyebrow: { size: 10, weight: 500, tracking: "0.12em", lh: 1 },
  eyebrowLarge: { size: 14, weight: 500, tracking: "0.12em", lh: 1 },

  // Subtitle under divider number
  dividerSubtitle: { size: 24, weight: 400, tracking: "-0.01em", lh: 1.2 },

  // Small caps on badges / callouts
  approvalLabel: { size: 10, weight: 600, tracking: "0.18em", lh: 1 },

  // Metric tiers — the numeric voice (mono 700, tabular)
  metricHero: { size: 92, weight: 700, tracking: "-0.03em", lh: 0.95 },
  metricLarge: { size: 60, weight: 700, tracking: "-0.02em", lh: 1 },
  metricMedium: { size: 44, weight: 700, tracking: "-0.03em", lh: 1 },
  metricSmall: { size: 30, weight: 700, tracking: "-0.02em", lh: 1 },
} as const;

// ---------------------------------------------------------------------------
// Page geometry — 8.5"×11" trim, 0.125" bleed, asymmetric margins.
// ---------------------------------------------------------------------------

export const PAGE = {
  trimW: 8.5,
  trimH: 11,
  bleedIn: 0.125,
  margin: {
    outer: 0.75,
    top: 0.875,
    bottom: 1.0,
    inner: 0.75,
  },
  grid: {
    cols: 4,
    gutterIn: 0.25,
  },
} as const;

// ---------------------------------------------------------------------------
// Card chrome
// ---------------------------------------------------------------------------

export const CARD = {
  bg: COLORS.PAPER_ELEVATED,
  border: `1px solid ${COLORS.HAIRLINE}`,
  radius: 8,
  padding: 10,
} as const;

// ---------------------------------------------------------------------------
// Color utility — hex → rgba().
// ---------------------------------------------------------------------------

export function hexWithAlpha(hex: string, alpha: number): string {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
