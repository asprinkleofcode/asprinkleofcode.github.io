import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Highlight } from "../../lib/frontmatter";
import { StoryHighlightContext } from "../../lib/storyHighlight";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";
import OutcomeBlock from "./OutcomeBlock";

const OUTCOME = "Fixture outcome: what changed as a result.";
const classes = (el: Element) => el.className.split(/\s+/);
const follows = (a: Node, b: Node) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

/** Renders the block the way `WorkStory` does: inside the story's highlight. */
const renderIn = (highlight: Highlight | undefined, outcome: ReactNode = OUTCOME) =>
  render(
    <StoryHighlightContext value={highlight}>
      <OutcomeBlock outcome={outcome} />
    </StoryHighlightContext>
  );

describe("OutcomeBlock", () => {
  it("shows the highlight's metric large, the unit under it, then the outcome", () => {
    renderIn({ headline: "H.", metric: "4,500", unit: "syncs a day, up from 2,000" });
    const metric = screen.getByText("4,500");
    const unit = screen.getByText("syncs a day, up from 2,000");
    const outcome = screen.getByText(OUTCOME);
    expect(follows(metric, unit)).toBe(true);
    expect(follows(unit, outcome)).toBe(true);

    expect(classes(metric)).toEqual(expect.arrayContaining(["text-4xl", "font-semibold", "text-text-primary"]));
    expect(classes(unit)).toEqual(expect.arrayContaining(["type-meta", "text-text-secondary"]));
    // Stacked: the unit sits under the metric.
    expect(classes(metric.parentElement!)).toEqual(expect.arrayContaining(["flex", "flex-col"]));
    for (const el of [metric, unit]) expect(el.className).not.toMatch(/accent-secondary/);
  });

  it("shows a metric without a unit", () => {
    renderIn({ headline: "H.", metric: "3" });
    expect(screen.getByText("3").parentElement!.children).toHaveLength(1);
  });

  it.each([
    ["no highlight", undefined],
    ["a highlight without a metric", { headline: "H." }],
  ])("renders no metric area with %s", (_, highlight) => {
    const { container } = renderIn(highlight);
    const panel = container.firstElementChild!;
    expect(panel.children).toHaveLength(1);
    expect(panel.textContent).toBe(OUTCOME);
    expect(container.querySelector(".text-4xl")).toBeNull();
  });

  it("renders no metric area outside a story page (no provider)", () => {
    const { container } = render(<OutcomeBlock outcome={OUTCOME} />);
    expect(container.firstElementChild!.children).toHaveLength(1);
    expect(container.querySelector(".text-4xl")).toBeNull();
  });

  it("renders rich-text outcomes as given", () => {
    renderIn(
      undefined,
      <>
        Fixture outcome naming <code>example-job</code> inline.
      </>
    );
    expect(screen.getByText("example-job").tagName).toBe("CODE");
  });

  it("is a bordered panel on a background step", () => {
    const { container } = renderIn(undefined);
    expect(classes(container.firstElementChild!)).toEqual(
      expect.arrayContaining(["rounded-default", "border", "border-border-default", "bg-background-secondary"])
    );
  });

  it("treats an empty metric or unit as absent, and never shows a unit alone", () => {
    const { container } = renderIn({ headline: "H.", metric: "" });
    expect(container.firstElementChild!.children).toHaveLength(1);
    expect(container.querySelector(".text-4xl")).toBeNull();

    const unitOnly = renderIn({ headline: "H.", metric: "", unit: "syncs a day" });
    expect(unitOnly.container.firstElementChild!.children).toHaveLength(1);
    expect(screen.queryByText("syncs a day")).toBeNull();

    renderIn({ headline: "H.", metric: "12", unit: "" });
    expect(screen.getByText("12").parentElement!.children).toHaveLength(1);
  });

  it("renders no flowbite dark-mode or palette classes", () => {
    const { container } = renderIn(
      { headline: "H.", metric: "4,500", unit: "syncs a day, up from 2,000" },
      <>
        <p>One</p>
        <p>Two</p>
      </>
    );
    expectNoFlowbiteDefaults(container);
  });

  it("takes no metric or unit props", () => {
    // @ts-expect-error the metric comes from frontmatter `highlight`, never a prop
    const bad = <OutcomeBlock outcome={OUTCOME} metric="4,500" />;
    expect(bad).toBeDefined();
  });
});
