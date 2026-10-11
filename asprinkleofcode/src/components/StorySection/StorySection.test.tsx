import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";
import { STORY_SECTION_HEADINGS, type StorySectionName } from "../../lib/storySections";
import StorySection from "./StorySection";

describe("StorySection", () => {
  it("lists the AD-3 sections in canonical order", () => {
    expect(Object.values(STORY_SECTION_HEADINGS)).toEqual([
      "Context",
      "Problem & ambiguity",
      "Constraints",
      "Ownership",
      "Decision",
      "Rationale",
      "Tradeoffs",
      "Collaboration",
      "Outcome",
      "Reflection",
    ]);
  });

  it.each(Object.entries(STORY_SECTION_HEADINGS) as [StorySectionName, string][])(
    "renders %s as a section labelled by its h2",
    (section, heading) => {
      render(
        <StorySection section={section}>
          <p>Body text.</p>
        </StorySection>
      );
      const region = screen.getByRole("region", { name: heading });
      expect(region.tagName).toBe("SECTION");
      const h2 = screen.getByRole("heading", { level: 2, name: heading });
      expect(region.getAttribute("aria-labelledby")).toBe(h2.id);
      expect(region.contains(screen.getByText("Body text."))).toBe(true);
    }
  );

  it("gives each section a unique heading id", () => {
    render(
      <>
        <StorySection section="context">One</StorySection>
        <StorySection section="decision">Two</StorySection>
      </>
    );
    const ids = screen.getAllByRole("heading", { level: 2 }).map((h) => h.id);
    expect(new Set(ids).size).toBe(2);
    expect(screen.getByRole("region", { name: "Decision" }).textContent).toContain("Two");
  });

  it("styles the heading with the type scale and role tokens", () => {
    render(<StorySection section="outcome">Text</StorySection>);
    expect(screen.getByRole("heading", { level: 2 }).className.split(/\s+/)).toEqual(
      expect.arrayContaining(["type-section", "text-text-primary"])
    );
  });

  it("renders no flowbite dark-mode or palette classes", () => {
    const { container } = render(
      <StorySection section="context">
        <p>One</p>
        <p>Two</p>
        <ul>
          <li>Three</li>
          <li>Four</li>
        </ul>
      </StorySection>
    );
    expectNoFlowbiteDefaults(container);
  });

  it("throws on an unknown section, naming it (MDX is not type-checked)", () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<StorySection section={"Background" as never}>Text</StorySection>)).toThrow(/"Background"/);
    quiet.mockRestore();
  });

  it("accepts only the fixed section names", () => {
    // @ts-expect-error free-text section names are a type error
    const free = <StorySection section="Background">Text</StorySection>;
    expect(free).toBeDefined();
  });
});
