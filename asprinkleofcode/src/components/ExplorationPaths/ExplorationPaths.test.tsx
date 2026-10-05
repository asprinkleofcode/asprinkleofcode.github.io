import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ExplorationPaths from "./ExplorationPaths";

const renderSection = () =>
  render(
    <MemoryRouter>
      <ExplorationPaths />
    </MemoryRouter>
  );

describe("ExplorationPaths", () => {
  it("is a region named by its h2 Explore kicker", () => {
    renderSection();
    const region = screen.getByRole("region", { name: "Explore" });
    const heading = within(region).getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Explore");
    expect(heading.className.split(/\s+/)).toContain("type-supporting");
  });

  it("renders the three path tiles, label-only, in order", () => {
    renderSection();
    const links = within(screen.getByRole("region", { name: "Explore" })).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual([
      "Engineering→",
      "Leadership & Enablement→",
      "Beyond the Code→",
    ]);
    // The arrow is decorative, so each tile's accessible name is its label alone.
    expect(screen.getByRole("link", { name: "Leadership & Enablement" }).getAttribute("href")).toBe("/leadership");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/engineering", "/leadership", "/beyond"]);
    for (const link of links) {
      const arrow = link.lastElementChild;
      expect(arrow?.getAttribute("aria-hidden")).toBe("true");
      expect(arrow?.className).toContain("text-accent-secondary");
    }
  });

  it("stacks tiles on mobile and forms three columns from md", () => {
    renderSection();
    const grid = screen.getByRole("list").className.split(/\s+/);
    expect(grid).toEqual(expect.arrayContaining(["grid", "grid-cols-1", "md:grid-cols-3"]));
  });

  it("gives every tile the focus ring, hover/focus underline and role-token surfaces", () => {
    renderSection();
    for (const link of screen.getAllByRole("link")) {
      const classes = link.className.split(/\s+/);
      expect(classes).toEqual(
        expect.arrayContaining([
          "type-story",
          "text-text-primary",
          "bg-background-primary",
          "border-border-essential",
          "focus-visible:ring-2",
          "focus-visible:ring-focus-ring",
        ])
      );
      // The label, not the decorative arrow, underlines on hover and focus.
      expect(link.firstElementChild?.className.split(/\s+/)).toEqual(
        expect.arrayContaining(["group-hover:underline", "group-focus-visible:underline"])
      );
    }
    const band = screen.getByRole("region", { name: "Explore" }).className.split(/\s+/);
    expect(band).toEqual(expect.arrayContaining(["bg-background-recessed", "border-y", "border-border-default"]));
  });
});
