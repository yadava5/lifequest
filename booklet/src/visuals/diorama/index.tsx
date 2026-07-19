import React from "react";
import type { SectionKey } from "../../theme";
import { TrailheadDawn } from "./TrailheadDawn";
import { QuestLoop } from "./QuestLoop";
import { EngineRatchet } from "./EngineRatchet";
import { SummitFlag } from "./SummitFlag";
import { Workshop } from "./Workshop";

/**
 * Barrel + SectionKey → diorama component map. Each chapter divider pulls its
 * line-art from here: the dawn trailhead (WHY), the playable loop (HOW), the
 * serverless engine + monotonic ratchet (INSIDE), the summit + coins (PROOF),
 * and the one-build-two-targets workshop (BUILD).
 */

export const DIORAMAS: Record<SectionKey, React.FC> = {
  "01_WHY": TrailheadDawn,
  "02_HOW": QuestLoop,
  "03_INSIDE": EngineRatchet,
  "04_PROOF": SummitFlag,
  "05_BUILD": Workshop,
};

export { TrailheadDawn, QuestLoop, EngineRatchet, SummitFlag, Workshop };
