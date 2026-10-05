import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { Entry } from "../../lib/registry";
import PathIndex from "./PathIndex";

const work = (slug: string, title: string): Entry => ({
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
    role: "Lead",
    capabilities: ["ownership"],
  },
});

const renderIndex = (entries: readonly Entry[]) =>
  render(
    <MemoryRouter>
      <PathIndex title="Engineering" entries={entries} />
    </MemoryRouter>
  );

describe("PathIndex", () => {
  it("shows the h1 and the empty state, and no list, with zero entries", () => {
    renderIndex([]);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings.map((h) => h.textContent)).toEqual(["Engineering"]);
    expect(screen.getByText("No stories published yet.")).toBeDefined();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("lists entries in the given order, each title linking to its story above its summary", () => {
    renderIndex([work("second-first", "Zeta Story"), work("alpha", "Alpha Story")]);
    expect(screen.queryByText("No stories published yet.")).toBeNull();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(2);

    const links = items.map((item) => within(item).getByRole("link"));
    expect(links.map((a) => a.textContent)).toEqual(["Zeta Story", "Alpha Story"]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/engineering/second-first", "/engineering/alpha"]);

    const summary = within(items[0]).getByText("Zeta Story summary.");
    expect(links[0].compareDocumentPosition(summary) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("uses the type scale, role tokens and the shared text-link focus ring", () => {
    renderIndex([work("foo", "Foo Story")]);
    const classes = (el: Element) => el.className.split(/\s+/);
    expect(classes(screen.getByRole("heading", { level: 1 }))).toEqual(
      expect.arrayContaining(["type-section", "text-text-primary"])
    );
    const link = classes(screen.getByRole("link", { name: "Foo Story" }));
    expect(link).toEqual(
      expect.arrayContaining(["type-story", "text-brand-primary", "hover:underline", "focus-visible:underline", "focus-visible:ring-2"])
    );
    expect(classes(screen.getByText("Foo Story summary."))).toEqual(
      expect.arrayContaining(["type-body", "text-text-secondary"])
    );
  });
});
