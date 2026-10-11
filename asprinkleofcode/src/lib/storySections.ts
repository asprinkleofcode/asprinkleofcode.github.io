/**
 * The fixed deep-story sections (AD-3), in canonical order, with their
 * headings. Context, Decision and Outcome are always present; the others
 * appear only when a story has real evidence for them.
 */
export const STORY_SECTION_HEADINGS = {
  context: "Context",
  problem: "Problem & ambiguity",
  constraints: "Constraints",
  ownership: "Ownership",
  decision: "Decision",
  rationale: "Rationale",
  tradeoffs: "Tradeoffs",
  collaboration: "Collaboration",
  outcome: "Outcome",
  reflection: "Reflection",
} as const;

export type StorySectionName = keyof typeof STORY_SECTION_HEADINGS;

/** Every section, in canonical order. */
export const STORY_SECTION_ORDER = Object.keys(STORY_SECTION_HEADINGS) as StorySectionName[];

/** Sections every work story has (AD-3); the content plugin fails the build without them. */
export const REQUIRED_STORY_SECTIONS: readonly StorySectionName[] = ["context", "decision", "outcome"];
