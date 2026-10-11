import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DecisionBlock from "./DecisionBlock";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";

const DECISION = "Fixture decision: choose option A over option B.";
const RATIONALE = "Fixture rationale: option A fits the stated constraint.";
const TRADEOFFS = "Fixture tradeoff: option A costs more up front.";

const terms = () => screen.getAllByRole("term").map((dt) => dt.textContent);
const classes = (el: Element) => el.className.split(/\s+/);

describe("DecisionBlock", () => {
  it("shows the decision, rationale and tradeoffs as a labelled description list", () => {
    const { container } = render(<DecisionBlock decision={DECISION} rationale={RATIONALE} tradeoffs={TRADEOFFS} />);
    expect(container.querySelectorAll("dl")).toHaveLength(1);
    expect(terms()).toEqual(["Decision", "Rationale", "Tradeoffs"]);
    const values = screen.getAllByRole("definition").map((dd) => dd.textContent);
    expect(values).toEqual([DECISION, RATIONALE, TRADEOFFS]);
  });

  it("makes the decision visually dominant", () => {
    render(<DecisionBlock decision={DECISION} rationale={RATIONALE} tradeoffs={TRADEOFFS} />);
    const [decision, rationale, tradeoffs] = screen.getAllByRole("definition");
    expect(classes(decision)).toEqual(expect.arrayContaining(["type-story", "text-text-primary"]));
    expect(classes(rationale)).toContain("type-body");
    expect(classes(tradeoffs)).toContain("type-body");
    for (const dt of screen.getAllByRole("term")) expect(classes(dt)).toContain("type-supporting");
  });

  it("omits the Tradeoffs label when there are none", () => {
    render(<DecisionBlock decision={DECISION} rationale={RATIONALE} />);
    expect(terms()).toEqual(["Decision", "Rationale"]);
    expect(screen.queryByText("Tradeoffs")).toBeNull();
  });

  it("renders rich-text props as given", () => {
    render(
      <DecisionBlock
        decision={DECISION}
        rationale={
          <>
            Fixture rationale naming <code>Example.Service</code> inline.
          </>
        }
      />
    );
    const code = screen.getByText("Example.Service");
    expect(code.tagName).toBe("CODE");
    expect(screen.getAllByRole("definition")[1].contains(code)).toBe(true);
  });

  it("is a bordered panel on a background step, with role tokens only", () => {
    const { container } = render(<DecisionBlock decision={DECISION} rationale={RATIONALE} tradeoffs={TRADEOFFS} />);
    const panel = container.firstElementChild!;
    expect(classes(panel)).toEqual(
      expect.arrayContaining(["rounded-default", "border", "border-border-default", "bg-background-secondary"])
    );
    expect(panel.className).not.toMatch(/shadow/);
    expectNoFlowbiteDefaults(panel);
  });
});
