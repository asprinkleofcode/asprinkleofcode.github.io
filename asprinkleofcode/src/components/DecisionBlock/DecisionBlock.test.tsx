import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DecisionBlock from "./DecisionBlock";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";

const DECISION = "Fixture decision: choose option A over option B.";

const classes = (el: Element) => el.className.split(/\s+/);

describe("DecisionBlock", () => {
  it("shows only the decision, under a single Decision label", () => {
    const { container } = render(<DecisionBlock decision={DECISION} />);
    expect(container.querySelectorAll("dl")).toHaveLength(1);
    expect(screen.getAllByRole("term").map((dt) => dt.textContent)).toEqual(["Decision"]);
    expect(screen.getAllByRole("definition").map((dd) => dd.textContent)).toEqual([DECISION]);
    expect(screen.queryByText("Rationale")).toBeNull();
    expect(screen.queryByText("Tradeoffs")).toBeNull();
  });

  it("makes the decision visually dominant", () => {
    render(<DecisionBlock decision={DECISION} />);
    expect(classes(screen.getByRole("definition"))).toEqual(
      expect.arrayContaining(["type-story", "text-text-primary"])
    );
    expect(classes(screen.getByRole("term"))).toContain("type-supporting");
  });

  it("renders a rich-text decision as given", () => {
    render(
      <DecisionBlock
        decision={
          <>
            Fixture decision naming <code>Example.Service</code> inline.
          </>
        }
      />
    );
    const code = screen.getByText("Example.Service");
    expect(code.tagName).toBe("CODE");
    expect(screen.getByRole("definition").contains(code)).toBe(true);
  });

  it("is a bordered panel on a background step, with role tokens only", () => {
    // A rich decision, so the token scan covers MDX-rendered children too
    // (and clears expectNoFlowbiteDefaults' non-vacuous element floor).
    const { container } = render(
      <DecisionBlock
        decision={
          <>
            Fixture <strong>decision</strong> naming <code>Example.Service</code>.
          </>
        }
      />
    );
    const panel = container.firstElementChild!;
    expect(classes(panel)).toEqual(
      expect.arrayContaining(["rounded-default", "border", "border-border-default", "bg-background-secondary"])
    );
    expect(panel.className).not.toMatch(/shadow/);
    expectNoFlowbiteDefaults(panel);
  });
});
