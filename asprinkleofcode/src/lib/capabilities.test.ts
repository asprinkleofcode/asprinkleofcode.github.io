import { describe, expect, it } from "vitest";
import { CAPABILITIES } from "./frontmatter";
import { CAPABILITY_LABELS, capabilityLabel } from "./capabilities";

describe("capability labels", () => {
  it("labels every capability in the vocabulary, and nothing else", () => {
    expect(Object.keys(CAPABILITY_LABELS).sort()).toEqual([...CAPABILITIES].sort());
    for (const capability of CAPABILITIES) {
      expect(capabilityLabel(capability).trim(), capability).not.toBe("");
    }
  });

  it("uses the decided wording", () => {
    expect(CAPABILITIES.map(capabilityLabel)).toEqual([
      "Business-to-engineering",
      "Ownership",
      "Engineering judgment",
      "Ambiguity",
      "Enablement",
    ]);
  });
});
