import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";
import OutcomeBlock from "./OutcomeBlock";

const OUTCOME = "Fixture outcome: what changed as a result.";
const classes = (el: Element) => el.className.split(/\s+/);
const follows = (a: Node, b: Node) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

describe("OutcomeBlock", () => {
  it("shows the metric large, the unit under it, then the outcome", () => {
    render(<OutcomeBlock outcome={OUTCOME} metric="4,500" unit="syncs a day, up from 2,000" />);
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
    render(<OutcomeBlock outcome={OUTCOME} metric="3" />);
    expect(screen.getByText("3").parentElement!.children).toHaveLength(1);
  });

  it("renders no empty metric area without a metric", () => {
    const { container } = render(<OutcomeBlock outcome={OUTCOME} />);
    const panel = container.firstElementChild!;
    expect(panel.children).toHaveLength(1);
    expect(panel.textContent).toBe(OUTCOME);
    expect(container.querySelector(".text-4xl")).toBeNull();
  });

  it("renders rich-text outcomes as given", () => {
    render(
      <OutcomeBlock
        outcome={
          <>
            Fixture outcome naming <code>example-job</code> inline.
          </>
        }
      />
    );
    expect(screen.getByText("example-job").tagName).toBe("CODE");
  });

  it("is a bordered panel on a background step", () => {
    const { container } = render(<OutcomeBlock outcome={OUTCOME} />);
    expect(classes(container.firstElementChild!)).toEqual(
      expect.arrayContaining(["rounded-default", "border", "border-border-default", "bg-background-secondary"])
    );
  });

  it("treats an empty metric or unit as absent", () => {
    const { container } = render(<OutcomeBlock outcome={OUTCOME} metric="" />);
    expect(container.firstElementChild!.children).toHaveLength(1);
    expect(container.querySelector(".text-4xl")).toBeNull();

    render(<OutcomeBlock outcome={OUTCOME} metric="12" unit="" />);
    expect(screen.getByText("12").parentElement!.children).toHaveLength(1);
  });

  it("throws on a unit without a metric, naming it (MDX is not type-checked)", () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    const unitOnly = { outcome: OUTCOME, unit: "syncs a day" } as unknown as { outcome: string };
    expect(() => render(<OutcomeBlock {...unitOnly} />)).toThrow(/"syncs a day"/);
    expect(() => render(<OutcomeBlock outcome={OUTCOME} metric="" unit="syncs a day" />)).toThrow(/"syncs a day"/);
    quiet.mockRestore();
  });

  it("renders no flowbite dark-mode or palette classes", () => {
    const { container } = render(
      <OutcomeBlock
        outcome={
          <>
            <p>One</p>
            <p>Two</p>
          </>
        }
        metric="4,500"
        unit="syncs a day, up from 2,000"
      />
    );
    expectNoFlowbiteDefaults(container);
  });

  it("rejects a unit without a metric at the type level", () => {
    // @ts-expect-error `unit` requires `metric`
    const bad = <OutcomeBlock outcome={OUTCOME} unit="syncs a day" />;
    expect(bad).toBeDefined();
  });
});
