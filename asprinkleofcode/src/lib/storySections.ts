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
