import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "flowbite-react";
import { MemoryRouter, useLocation } from "react-router";
import { aSprinkleOfCodeApplyTheme, aSprinkleOfCodeTheme } from "../../theme/aSprinkleOfCodeTheme";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";
import type { Capability } from "../../lib/frontmatter";
import type { Entry } from "../../lib/registry";
import PathIndex from "./PathIndex";

const work = (slug: string, title: string, capabilities: Capability[] = ["ownership"]): Entry => ({
  key: `work/engineering/${slug}`,
  path: "engineering",
  slug,
  file: `../content/work/${slug}.mdx`,
  listed: true,
  frontmatter: {
    type: "work",
    title,
    path: "engineering",
    summary: `${title} summary.`,
    role: `${title} role`,
    capabilities,
  },
});

const personal = (slug: string, title: string): Entry => ({
  key: `personal/beyond/${slug}`,
  path: "beyond",
  slug,
  file: `../content/personal/${slug}.mdx`,
  listed: true,
  frontmatter: {
    type: "personal",
    title,
    summary: `${title} summary.`,
    listed: true,
  },
});

let pathname = "";
function LocationProbe() {
  pathname = useLocation().pathname;
  return null;
}

const renderIndex = (entries: readonly Entry[], title = "Engineering") =>
  render(
    <ThemeProvider theme={aSprinkleOfCodeTheme} applyTheme={aSprinkleOfCodeApplyTheme}>
      <MemoryRouter>
        <PathIndex title={title} entries={entries} />
        <LocationProbe />
      </MemoryRouter>
    </ThemeProvider>
  );

const classes = (el: Element) => el.className.split(/\s+/);
const topList = () => screen.getAllByRole("list").filter((ul) => !ul.hasAttribute("aria-label"))[0];
const topItems = () => Array.from(topList().children) as HTMLElement[];

describe("PathIndex", () => {
  beforeEach(() => {
    pathname = "";
  });

  it("shows the h1 and the empty state, and no list, with zero entries", () => {
    renderIndex([]);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings.map((h) => h.textContent)).toEqual(["Engineering"]);
    expect(screen.getByText("No stories published yet.")).toBeDefined();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("renders one Story Card per work entry, in the given order, each title linking to its story", () => {
    renderIndex([work("second-first", "Zeta Story"), work("alpha", "Alpha Story"), work("mid", "Mid Story")]);
    expect(screen.queryByText("No stories published yet.")).toBeNull();
    const items = topItems();
    expect(items.map((li) => li.tagName)).toEqual(["LI", "LI", "LI"]);
    expect(screen.getAllByTestId("flowbite-card")).toHaveLength(3);

    const links = items.map((item) => within(item).getByRole("link"));
    expect(links.map((a) => a.textContent)).toEqual(["Zeta Story", "Alpha Story", "Mid Story"]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/engineering/second-first",
      "/engineering/alpha",
      "/engineering/mid",
    ]);
  });

  it("shows each card's title, summary, role and one signal per capability", () => {
    renderIndex([work("foo", "Foo Story", ["engineering-judgment", "ambiguity"]), work("bar", "Bar Story")]);
    const [foo, bar] = topItems();

    expect(within(foo).getByRole("heading", { level: 2, name: "Foo Story" })).toBeDefined();
    expect(within(foo).getByText("Foo Story summary.")).toBeDefined();
    expect(within(foo).getByText("Role: Foo Story role")).toBeDefined();
    const fooSignals = within(within(foo).getByRole("list", { name: "Capabilities shown" })).getAllByRole("listitem");
    expect(fooSignals.map((li) => li.textContent)).toEqual(["Engineering judgment", "Ambiguity"]);

    expect(within(bar).getByText("Role: Bar Story role")).toBeDefined();
    const barSignals = within(within(bar).getByRole("list", { name: "Capabilities shown" })).getAllByRole("listitem");
    expect(barSignals.map((li) => li.textContent)).toEqual(["Ownership"]);
  });

  it("keeps a single h1 (the path label) with card titles as h2s", () => {
    renderIndex([work("foo", "Foo Story"), work("bar", "Bar Story")]);
    expect(screen.getAllByRole("heading", { level: 1 }).map((h) => h.textContent)).toEqual(["Engineering"]);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(["Foo Story", "Bar Story"]);
    expect(classes(screen.getByRole("heading", { level: 1 }))).toEqual(
      expect.arrayContaining(["type-section", "text-text-primary"])
    );
  });

  it("stacks cards with a gap, without divider rules, and gives each card one tab stop", () => {
    renderIndex([work("foo", "Foo Story"), work("bar", "Bar Story")]);
    expect(classes(topList())).toEqual(expect.arrayContaining(["flex", "flex-col", "gap-4"]));
    for (const li of topItems()) {
      expect(li.className).not.toMatch(/border/);
      expect(li.querySelectorAll("a[href], button, input, select, textarea, [tabindex]")).toHaveLength(1);
    }
  });

  it("navigates to the story when a card's link is clicked", () => {
    renderIndex([work("foo", "Foo Story")]);
    fireEvent.click(screen.getByRole("link", { name: "Foo Story" }));
    expect(pathname).toBe("/engineering/foo");
  });

  it("renders no flowbite dark-mode or palette classes under the app theme", () => {
    const { container } = renderIndex([work("foo", "Foo Story"), work("bar", "Bar Story")]);
    expectNoFlowbiteDefaults(container);
  });

  it("keeps the title link and summary item for personal entries, with no role or capabilities", () => {
    renderIndex([personal("hobby", "Hobby Story"), personal("other", "Other Story")], "Beyond the Code");
    expect(screen.queryByTestId("flowbite-card")).toBeNull();
    expect(screen.queryByRole("list", { name: "Capabilities shown" })).toBeNull();
    expect(screen.queryByText(/^Role:/)).toBeNull();
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();

    const list = screen.getByRole("list");
    expect(classes(list)).not.toContain("gap-4");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(classes(items[0])).toEqual(expect.arrayContaining(["border-t", "border-border-default", "last:border-b"]));

    const links = items.map((item) => within(item).getByRole("link"));
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/beyond/hobby", "/beyond/other"]);
    const link = classes(links[0]);
    expect(link).toEqual(
      expect.arrayContaining(["type-story", "text-brand-primary", "hover:underline", "focus-visible:underline", "focus-visible:ring-2"])
    );
    const summary = within(items[0]).getByText("Hobby Story summary.");
    expect(classes(summary)).toEqual(expect.arrayContaining(["type-body", "text-text-secondary"]));
    expect(links[0].compareDocumentPosition(summary) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
