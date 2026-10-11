import type { Capability } from "./frontmatter";

/**
 * Visitor-facing wording for each capability in the controlled vocabulary
 * (decided Q1, 2026-10-11). `satisfies` makes a missing label a type error.
 */
export const CAPABILITY_LABELS = {
  "business-to-engineering": "Business-to-engineering",
  ownership: "Ownership",
  "engineering-judgment": "Engineering judgment",
  ambiguity: "Ambiguity",
  enablement: "Enablement",
} as const satisfies Record<Capability, string>;

export function capabilityLabel(capability: Capability): string {
  return CAPABILITY_LABELS[capability];
}
