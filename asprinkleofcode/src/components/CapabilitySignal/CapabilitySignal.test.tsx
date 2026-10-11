import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "flowbite-react";
import { aSprinkleOfCodeApplyTheme, aSprinkleOfCodeTheme } from "../../theme/aSprinkleOfCodeTheme";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";
import { CAPABILITIES } from "../../lib/frontmatter";
import CapabilitySignal from "./CapabilitySignal";

const renderThemed = (ui: React.ReactNode) =>
  render(
    <ThemeProvider theme={aSprinkleOfCodeTheme} applyTheme={aSprinkleOfCodeApplyTheme}>
      {ui}
    </ThemeProvider>
  );

const classes = (el: Element) => el.className.split(/\s+/);

describe("CapabilitySignal", () => {
  it("renders the decided label for a capability", () => {
    renderThemed(<CapabilitySignal capability="business-to-engineering" />);
    expect(screen.getByText("Business-to-engineering")).toBeDefined();
  });

  it("is a periwinkle outlined pill built from role tokens", () => {
    renderThemed(<CapabilitySignal capability="engineering-judgment" />);
    const pill = screen.getByTestId("flowbite-badge");
    expect(pill.textContent).toBe("Engineering judgment");
    expect(classes(pill)).toEqual(
      expect.arrayContaining([
        "rounded-pill",
        "border",
        "border-accent-secondary",
        "text-accent-secondary",
        "bg-background-primary",
        "text-sm",
        "px-2.5",
        "py-0.5",
      ])
    );
    expect(classes(pill)).not.toContain("rounded");
    expect(classes(pill)).not.toContain("text-xs");
    expect(classes(pill)).not.toContain("p-1");
    expect(pill.className).not.toMatch(/shadow/);
  });

  it("renders no flowbite dark-mode or palette classes for any capability", () => {
    const { container } = renderThemed(
      <div>
        {CAPABILITIES.map((capability) => (
          <CapabilitySignal key={capability} capability={capability} />
        ))}
      </div>
    );
    expectNoFlowbiteDefaults(container);
  });

  it("throws on an unknown capability, naming it (MDX is not type-checked)", () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderThemed(<CapabilitySignal capability={"leadership" as never} />)).toThrow(/"leadership"/);
    quiet.mockRestore();
  });

  it("accepts only the controlled vocabulary", () => {
    // @ts-expect-error free-text capabilities are a type error
    const free = <CapabilitySignal capability="leadership" />;
    expect(free).toBeDefined();
  });
});
