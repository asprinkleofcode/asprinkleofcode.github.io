import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "flowbite-react";
import { MemoryRouter } from "react-router";
import { aSprinkleOfCodeApplyTheme, aSprinkleOfCodeTheme } from "../../theme/aSprinkleOfCodeTheme";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";
import type { Entry } from "../../lib/registry";
import PathCards from "./PathCards";

const featured: Entry = {
  key: "work/engineering/rcm",
  path: "engineering",
  slug: "rcm",
  file: "../content/work/rcm.mdx",
  listed: true,
  frontmatter: {
    type: "work",
    title: "RCM",
    path: "engineering",
    summary: "RCM summary.",
    role: "Lead",
    capabilities: ["ownership"],
    featured: 1,
    highlight: { headline: "RCM headline.", metric: "4,500", unit: "syncs a day" },
  },
};

const renderCards = (slides = { engineering: [featured], leadership: [], beyond: [] }) =>
  render(
    <ThemeProvider theme={aSprinkleOfCodeTheme} applyTheme={aSprinkleOfCodeApplyTheme}>
      <MemoryRouter>
        <PathCards slides={slides} />
      </MemoryRouter>
    </ThemeProvider>
  );

const section = () => screen.getByRole("region", { name: "Explore" });

describe("PathCards", () => {
  it("is a section named by a visually hidden Explore h2", () => {
    renderCards();
    const heading = within(section()).getByRole("heading", { level: 2, name: "Explore" });
    expect(heading.className.split(/\s+/)).toContain("sr-only");
  });

  it("renders the three path cards in the decided order", () => {
    renderCards();
    const labels = within(section())
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(labels).toEqual(["Engineering", "Leadership & Enablement", "Beyond the Code"]);
    expect(within(section()).getAllByRole("listitem")).toHaveLength(3);
  });

  it("makes a path live from its featured entries and the rest Coming soon, with their path descriptions", () => {
    renderCards();
    const links = within(section()).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/engineering/rcm"]);
    expect(within(section()).getAllByText("Coming soon")).toHaveLength(2);
    expect(screen.getByText("Onboarding, teaching, and making knowledge repeatable.")).toBeDefined();
    expect(screen.getByText("Powerlifting and birdhouses, and what each taught me.")).toBeDefined();
  });

  it("shows three Coming soon cards when no path has a story", () => {
    renderCards({ engineering: [], leadership: [], beyond: [] });
    expect(within(section()).getAllByText("Coming soon")).toHaveLength(3);
    expect(within(section()).queryAllByRole("link")).toEqual([]);
  });

  it("stacks on mobile and sits in three columns from md", () => {
    renderCards();
    const grid = within(section()).getByRole("list").className.split(/\s+/);
    expect(grid).toEqual(expect.arrayContaining(["grid", "grid-cols-1", "md:grid-cols-3"]));
  });

  it("renders no flowbite dark-mode or palette classes", () => {
    renderCards();
    expectNoFlowbiteDefaults(section());
  });
});
