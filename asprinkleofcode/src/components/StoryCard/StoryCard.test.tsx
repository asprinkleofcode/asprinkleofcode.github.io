import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "flowbite-react";
import { MemoryRouter, useLocation } from "react-router";
import { aSprinkleOfCodeApplyTheme, aSprinkleOfCodeTheme } from "../../theme/aSprinkleOfCodeTheme";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";
import type { WorkFrontmatter } from "../../lib/frontmatter";
import StoryCard from "./StoryCard";

const story: WorkFrontmatter = {
  type: "work",
  title: "Fixture story title",
  path: "engineering",
  summary: "Fixture one-line summary of the problem and why it mattered.",
  role: "Lead engineer",
  capabilities: ["engineering-judgment", "business-to-engineering", "ownership"],
};

let pathname = "";
function LocationProbe() {
  pathname = useLocation().pathname;
  return null;
}

const renderCard = (frontmatter: WorkFrontmatter = story) =>
  render(
    <ThemeProvider theme={aSprinkleOfCodeTheme} applyTheme={aSprinkleOfCodeApplyTheme}>
      <MemoryRouter>
        <StoryCard
          title={frontmatter.title}
          summary={frontmatter.summary}
          role={frontmatter.role}
          capabilities={frontmatter.capabilities}
          href="/engineering/fixture-story"
        />
        <LocationProbe />
      </MemoryRouter>
    </ThemeProvider>
  );

const card = () => screen.getByTestId("flowbite-card");
const classes = (el: Element) => el.className.split(/\s+/);
const follows = (a: Node, b: Node) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

describe("StoryCard", () => {
  it("renders the title link, then the summary, the role and the signals in order", () => {
    renderCard();
    const heading = screen.getByRole("heading", { level: 2, name: story.title });
    const link = within(heading).getByRole("link", { name: story.title });
    expect(link.getAttribute("href")).toBe("/engineering/fixture-story");

    const summary = screen.getByText(story.summary);
    const role = screen.getByText("Role: Lead engineer");
    const list = screen.getByRole("list", { name: "Capabilities shown" });
    expect(follows(link, summary) && follows(summary, role) && follows(role, list)).toBe(true);

    const items = within(list).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(["Engineering judgment", "Business-to-engineering", "Ownership"]);
    expect(classes(role)).toContain("type-meta");
  });

  it("has exactly one link and one tab stop, named by the story title", () => {
    renderCard();
    const links = within(card()).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual([story.title]);
    const focusable = card().querySelectorAll("a[href], button, input, select, textarea, [tabindex]");
    expect(focusable).toHaveLength(1);
    expect(screen.queryByText(/Read the story/)).toBeNull();
  });

  it("stretches the link over the whole card, and the card anchors it", () => {
    renderCard();
    const link = screen.getByRole("link", { name: story.title });
    expect(classes(link)).toEqual(
      expect.arrayContaining(["after:absolute", "after:inset-0", "text-brand-primary", "hover:underline", "focus-visible:underline"])
    );
    expect(classes(card())).toContain("relative");
    // Nothing in the card is positioned above the overlay.
    expect(card().querySelector(".relative .relative, [class*='z-']")).toBeNull();
  });

  it("navigates to the story when the link is clicked", () => {
    renderCard();
    fireEvent.click(screen.getByRole("link", { name: story.title }));
    expect(pathname).toBe("/engineering/fixture-story");
  });

  it("draws one focus ring around the card, not the link", () => {
    renderCard();
    expect(classes(card())).toEqual(
      expect.arrayContaining([
        "has-[a:focus-visible]:ring-2",
        "has-[a:focus-visible]:ring-focus-ring",
        "has-[a:focus-visible]:ring-offset-2",
        "has-[a:focus-visible]:ring-offset-background-primary",
      ])
    );
    const link = classes(screen.getByRole("link", { name: story.title }));
    expect(link).toContain("focus:outline-hidden");
    expect(link.some((cls) => cls.startsWith("focus-visible:ring"))).toBe(false);
  });

  it("sits on the primary background with a border that steps up on hover, and no shadow or button styling", () => {
    renderCard();
    expect(classes(card())).toEqual(
      expect.arrayContaining([
        "bg-background-primary",
        "border",
        "border-border-default",
        "hover:border-border-essential",
        "rounded-default",
      ])
    );
    expect(card().className).not.toMatch(/shadow|bg-brand-primary-fill/);
  });

  it("renders no flowbite dark-mode or palette classes", () => {
    renderCard();
    expectNoFlowbiteDefaults(card());
  });
});
