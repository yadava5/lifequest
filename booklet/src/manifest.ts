/**
 * The booklet's page registry — single source of truth for ordering, parity,
 * and page-kind dispatch. Pure data: the validator script and the runtime
 * `Booklet.tsx` both consume this file, so it must stay JSX-free.
 *
 * Saddle-stitch parity (28-page book = 7 folded sheets): page 01 is a recto
 * (odd index), pages alternate recto/verso, and the page count is a multiple
 * of 4. `scripts/validate-parity.mjs` enforces this at PDF-export time.
 *
 * Two-page spreads (kind: "spread") MUST be a verso+recto pair on adjacent
 * indices so they face each other once bound.
 */

import type { SectionKey } from "./theme";

export type PageKind =
  | "cover"
  | "back-cover"
  | "endpaper"
  | "toc"
  | "divider"
  | "body"
  | "spread";

/** Body-page kinds — one per unique body content module. */
export type BodyKey =
  | "why-reentry"
  | "why-chore"
  | "why-loop"
  | "how-loop"
  | "how-mission"
  | "how-coins"
  | "how-tiers"
  | "how-guild"
  | "inside-architecture"
  | "inside-monotonic"
  | "inside-tenancy"
  | "proof-persistence"
  | "proof-mission"
  | "proof-mobile"
  | "proof-nopurple"
  | "build-stack"
  | "build-tryit";

export type PageSpec =
  | { num: 1; kind: "cover"; parity: "recto"; sectionKey: null }
  | { num: 2; kind: "endpaper"; parity: "verso"; sectionKey: null }
  | { num: 3; kind: "toc"; parity: "recto"; sectionKey: null }
  | {
      num: number;
      kind: "divider";
      parity: "recto" | "verso";
      sectionKey: SectionKey;
      chapterNum: string;
      chapterTitle: string;
      subtitle: string;
      artSlot: string;
      chapterIndex: number;
      chapterTotal: number;
    }
  | {
      num: number;
      kind: "body";
      parity: "recto" | "verso";
      sectionKey: SectionKey;
      body: BodyKey;
    }
  | {
      num: number;
      kind: "spread";
      parity: "recto" | "verso";
      sectionKey: SectionKey;
      half: "left" | "right";
    }
  | { num: 28; kind: "back-cover"; parity: "verso"; sectionKey: null };

// ---------------------------------------------------------------------------
// Manifest — the 28 pages, in order.
// ---------------------------------------------------------------------------

export const PAGES: readonly PageSpec[] = [
  { num: 1, kind: "cover", parity: "recto", sectionKey: null },
  { num: 2, kind: "endpaper", parity: "verso", sectionKey: null },
  { num: 3, kind: "toc", parity: "recto", sectionKey: null },

  {
    num: 4, kind: "divider", parity: "verso", sectionKey: "01_WHY",
    chapterNum: "01", chapterTitle: "WHY",
    subtitle: "the daily job search is a demoralizing climb, taken alone",
    artSlot: "/art/div-01-why.svg",
    chapterIndex: 1, chapterTotal: 5,
  },
  { num: 5, kind: "body", parity: "recto", sectionKey: "01_WHY", body: "why-reentry" },
  { num: 6, kind: "body", parity: "verso", sectionKey: "01_WHY", body: "why-chore" },
  { num: 7, kind: "body", parity: "recto", sectionKey: "01_WHY", body: "why-loop" },

  {
    num: 8, kind: "divider", parity: "verso", sectionKey: "02_HOW",
    chapterNum: "02", chapterTitle: "HOW",
    subtitle: "a routine becomes a mission · a coin · a tier · a guild",
    artSlot: "/art/div-02-how.svg",
    chapterIndex: 2, chapterTotal: 5,
  },
  { num: 9, kind: "body", parity: "recto", sectionKey: "02_HOW", body: "how-loop" },
  { num: 10, kind: "body", parity: "verso", sectionKey: "02_HOW", body: "how-mission" },
  { num: 11, kind: "body", parity: "recto", sectionKey: "02_HOW", body: "how-coins" },
  { num: 12, kind: "body", parity: "verso", sectionKey: "02_HOW", body: "how-tiers" },
  { num: 13, kind: "body", parity: "recto", sectionKey: "02_HOW", body: "how-guild" },

  {
    num: 14, kind: "divider", parity: "verso", sectionKey: "03_INSIDE",
    chapterNum: "03", chapterTitle: "INSIDE",
    subtitle: "serverless NestJS, argon2 accounts, and a ledger that only climbs",
    artSlot: "/art/div-03-inside.svg",
    chapterIndex: 3, chapterTotal: 5,
  },
  { num: 15, kind: "body", parity: "recto", sectionKey: "03_INSIDE", body: "inside-architecture" },
  { num: 16, kind: "body", parity: "verso", sectionKey: "03_INSIDE", body: "inside-monotonic" },
  { num: 17, kind: "body", parity: "recto", sectionKey: "03_INSIDE", body: "inside-tenancy" },

  {
    num: 18, kind: "divider", parity: "verso", sectionKey: "04_PROOF",
    chapterNum: "04", chapterTitle: "PROOF",
    subtitle: "it persists, it’s playable, and it’s zero-purple",
    artSlot: "/art/div-04-proof.svg",
    chapterIndex: 4, chapterTotal: 5,
  },
  { num: 19, kind: "body", parity: "recto", sectionKey: "04_PROOF", body: "proof-persistence" },
  { num: 20, kind: "body", parity: "verso", sectionKey: "04_PROOF", body: "proof-mission" },
  { num: 21, kind: "body", parity: "recto", sectionKey: "04_PROOF", body: "proof-mobile" },
  { num: 22, kind: "body", parity: "verso", sectionKey: "04_PROOF", body: "proof-nopurple" },

  {
    num: 23, kind: "divider", parity: "recto", sectionKey: "05_BUILD",
    chapterNum: "05", chapterTitle: "BUILD",
    subtitle: "one codebase ships to the desktop and the browser",
    artSlot: "/art/div-05-build.svg",
    chapterIndex: 5, chapterTotal: 5,
  },
  { num: 24, kind: "spread", parity: "verso", sectionKey: "05_BUILD", half: "left" },
  { num: 25, kind: "spread", parity: "recto", sectionKey: "05_BUILD", half: "right" },
  { num: 26, kind: "body", parity: "verso", sectionKey: "05_BUILD", body: "build-stack" },
  { num: 27, kind: "body", parity: "recto", sectionKey: "05_BUILD", body: "build-tryit" },

  { num: 28, kind: "back-cover", parity: "verso", sectionKey: null },
] as const;

// ---------------------------------------------------------------------------
// Invariants — enforced at validate-parity.mjs time.
// ---------------------------------------------------------------------------

/** Expected parity for a given 1-based page index: recto on odd, verso on even. */
export function expectedParity(num: number): "recto" | "verso" {
  return num % 2 === 1 ? "recto" : "verso";
}

/** Assert manifest invariants. Throws the first failure it encounters. */
export function assertManifestInvariants(): void {
  if (PAGES.length % 4 !== 0) {
    throw new Error(`saddle-stitch needs a multiple of 4 pages, got ${PAGES.length}`);
  }
  for (const p of PAGES) {
    if (p.parity !== expectedParity(p.num)) {
      throw new Error(
        `page ${p.num}: expected ${expectedParity(p.num)}, manifest says ${p.parity}`,
      );
    }
  }
  const spreads = PAGES.filter((p) => p.kind === "spread");
  if (spreads.length !== 2) {
    throw new Error(`expected exactly 2 spread pages, got ${spreads.length}`);
  }
  const [l, r] = spreads;
  if (!l || !r) throw new Error("spread pages missing");
  if (l.num + 1 !== r.num) {
    throw new Error(`spread pages must be adjacent: got num=${l.num} and num=${r.num}`);
  }
  if (l.parity !== "verso" || r.parity !== "recto") {
    throw new Error(`spread pages must be verso+recto; got ${l.parity}+${r.parity}`);
  }
}
