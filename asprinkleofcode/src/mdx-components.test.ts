import { describe, expect, it } from "vitest";
import * as blocks from "./mdx-components";

describe("MDX block whitelist (AD-8)", () => {
  it("exports exactly the sanctioned blocks", () => {
    expect(Object.keys(blocks).sort()).toEqual([
      "CapabilitySignal",
      "DecisionBlock",
      "OutcomeBlock",
      "Photo",
      "StorySection",
    ]);
    for (const block of Object.values(blocks)) expect(typeof block).toBe("function");
  });
});
