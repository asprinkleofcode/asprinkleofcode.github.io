import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { Entry } from "../../lib/registry";
import type { WorkPath } from "../../lib/frontmatter";
import EvidenceHighlights from "./EvidenceHighlights";

const work = (path: WorkPath, slug: string, title: string): Entry => ({
  key: `work/${path}/${slug}`,
  path,
  slug,
  file: `../content/work/${slug}.mdx`,
  listed: true,
  frontmatter: {
    type: "work",
    title,
    path,
    summary: `${title} summary.`,
    role: "Lead",
    capabilities: ["ownership"],
    featured: 1,
  },
});

const garden: Entry = {
  key: "personal/beyond/garden",
  path: "beyond",
  slug: "garden",
  file: "../content/personal/garden.mdx",
  listed: true,
  frontmatter: { type: "personal", title: "Garden", summary: "I grow tomatoes.", listed: true, featured: 1 },
};

const engineering = work("engineering", "eng-story", "Eng Story");
const leadership = work("leadership", "lead-story", "Lead Story");

const renderSection = (props: Parameters<typeof EvidenceHighlights>[0]) =>
  render(
    <MemoryRouter>
      <EvidenceHighlights {...props} />
    </MemoryRouter>
  );

const rows = () => within(screen.getByRole("region", { name: "Highlights" })).getAllByRole("listitem");

describe("EvidenceHighlights", () => {
  it("renders nothing, heading included, when no slot has an entry", () => {
    const { container } = renderSection({});
    expect(container.innerHTML).toBe("");
    expect(screen.queryByRole("heading", { name: "Highlights" })).toBeNull();
  });

  it("renders the heading and only the Engineering slot when only it is featured", () => {
    renderSection({ engineering });
    const heading = screen.getByRole("heading", { level: 2, name: "Highlights" });
    expect(heading.className.split(/\s+/)).toContain("type-supporting");
    expect(rows()).toHaveLength(1);
    expect(screen.queryByText("Leadership & Enablement")).toBeNull();
    expect(screen.queryByText("Beyond the Code")).toBeNull();
  });

  it("shows label, title link and summary for each professional slot, in path order", () => {
    renderSection({ engineering, leadership });
    const [eng, lead] = rows();
    expect(within(eng).getByText("Engineering").className).toContain("type-supporting");
    const engLink = within(eng).getByRole("link", { name: "Eng Story" });
    expect(engLink.getAttribute("href")).toBe("/engineering/eng-story");
    expect(engLink.className.split(/\s+/)).toEqual(
      expect.arrayContaining(["type-story", "text-brand-primary", "hover:underline", "focus-visible:underline", "focus-visible:ring-2"])
    );
    expect(within(eng).getByText("Eng Story summary.").className).toContain("type-body");

    expect(within(lead).getByText("Leadership & Enablement")).toBeDefined();
    expect(within(lead).getByRole("link", { name: "Lead Story" }).getAttribute("href")).toBe("/leadership/lead-story");
    expect(within(lead).getByText("Lead Story summary.")).toBeDefined();
  });

  it("shows the Beyond slot as its label with the summary as the link, not labelled as evidence", () => {
    renderSection({ engineering, leadership, beyond: garden });
    const all = rows();
    expect(all).toHaveLength(3);
    const btc = all[2];
    expect(within(btc).getByText("Beyond the Code")).toBeDefined();
    const link = within(btc).getByRole("link");
    expect(link.textContent).toBe("I grow tomatoes.");
    expect(link.getAttribute("href")).toBe("/beyond/garden");
    expect(within(btc).queryByText("Garden")).toBeNull();
    expect(btc.textContent).not.toMatch(/evidence/i);
  });

  it("renders the Beyond hint on its own", () => {
    renderSection({ beyond: garden });
    expect(rows()).toHaveLength(1);
    expect(screen.getByRole("link", { name: "I grow tomatoes." })).toBeDefined();
  });
});
