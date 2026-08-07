import React from "react";
import { COLORS } from "../theme";

/**
 * QuestRing — the LifeQuest mark, hand-transcribed from logos/lifequest.svg so
 * the PDF exporter and the offline print path never depend on a fetch.
 *
 * The source is an always-dark app chip: a #0A0A0B rounded tile under a
 * near-white ring. On this book's warm parchment that tile would be the
 * darkest object on the page — a night-theme UI chip dropped onto a dawn map —
 * so the tile is deliberately dropped and the glyph stands alone. The source's
 * `currentColor` / `prefers-color-scheme` rules are meaningless in a fixed
 * print artifact; every colour resolves explicitly to the Day-theme inks the
 * theme documents as "legible on cream": ring → INK, amber arrow → GOLD_DEEP
 * (Lc 55 on paper), sparkle → TEAL_DEEP (Lc 72).
 *
 * The geometry is the argument: an almost-closed loop (the routine) with an
 * arrow breaking out of its lower right (the quest) — which is why it earns a
 * place on a cover making that argument.
 */
export const QuestRing: React.FC<{
  size: number;
  ring?: string;
  arrow?: string;
  sparkle?: string;
}> = ({ size, ring = COLORS.INK, arrow = COLORS.GOLD_DEEP, sparkle = COLORS.TEAL_DEEP }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    aria-hidden="true"
    style={{ display: "block" }}
  >
    {/* the open ring — r 11.5 about (24,24), broken at the lower right */}
    <path
      d="M26.98,35.11 A11.5,11.5 0 1 1 35.11,26.98"
      fill="none"
      stroke={ring}
      strokeWidth={3.8}
      strokeLinecap="round"
    />
    {/* the arrow escaping through the gap */}
    <path
      d="M29.3,29.3 L35.8,35.8"
      fill="none"
      stroke={arrow}
      strokeWidth={3.8}
      strokeLinecap="round"
    />
    <path
      d="M34.1,31.1 L35.8,35.8 L31.1,34.1"
      fill="none"
      stroke={arrow}
      strokeWidth={3.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* four-point sparkle, upper left */}
    <path
      d="M12,8.6 C12.34,10.81 13.19,11.66 15.4,12 C13.19,12.34 12.34,13.19 12,15.4 C11.66,13.19 10.81,12.34 8.6,12 C10.81,11.66 11.66,10.81 12,8.6 Z"
      fill={sparkle}
    />
  </svg>
);
