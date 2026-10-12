import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "flowbite-react";
import { MemoryRouter, useLocation } from "react-router";
import { aSprinkleOfCodeApplyTheme, aSprinkleOfCodeTheme } from "../../theme/aSprinkleOfCodeTheme";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";
import type { Highlight, PersonalFrontmatter, WorkFrontmatter } from "../../lib/frontmatter";
import type { Entry } from "../../lib/registry";
import { metricClasses, metricUnitClasses } from "../../lib/metricClasses";
import PathCard from "./PathCard";

const reducedMotion = vi.hoisted(() => ({ value: false }));
vi.mock("../../lib/usePrefersReducedMotion", () => ({ usePrefersReducedMotion: () => reducedMotion.value }));

const workEntry = (slug: string, featured: number, highlight: Highlight): Entry => ({
  key: `work/engineering/${slug}`,
  path: "engineering",
  slug,
  file: `../content/work/${slug}.mdx`,
  listed: true,
  frontmatter: {
    type: "work",
    title: `${slug} title`,
    path: "engineering",
    summary: `${slug} summary.`,
    role: "Lead",
    capabilities: ["ownership"],
    featured,
    highlight,
  } satisfies WorkFrontmatter,
});

const rcm = workEntry("rcm", 1, { headline: "RCM headline.", metric: "4,500", unit: "syncs a day" });
const iac = workEntry("iac", 2, { headline: "IaC headline.", metric: "~3 months", unit: "to three environments" });
const noMetric = workEntry("plain", 1, { headline: "Plain headline." });
const lifting: Entry = {
  key: "personal/beyond/lifting",
  path: "beyond",
  slug: "lifting",
  file: "../content/personal/lifting.mdx",
  listed: true,
  frontmatter: {
    type: "personal",
    title: "Lifting",
    summary: "Lifting summary.",
    listed: true,
    featured: 1,
    highlight: { headline: "Lifting headline.", metric: "200", unit: "kg" },
  } satisfies PersonalFrontmatter,
};

let pathname = "";
function LocationProbe() {
  pathname = useLocation().pathname;
  return null;
}

const renderCard = (slides: readonly Entry[], label = "Engineering") =>
  render(
    <ThemeProvider theme={aSprinkleOfCodeTheme} applyTheme={aSprinkleOfCodeApplyTheme}>
      <MemoryRouter>
        <PathCard label={label} description="Fixture path description." slides={slides} />
        <LocationProbe />
      </MemoryRouter>
    </ThemeProvider>
  );

const card = () => screen.getByTestId("flowbite-card");
const classes = (el: Element) => el.className.split(/\s+/);
const follows = (a: Node, b: Node) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
const link = () => screen.getByRole("link", { name: /Read the story/ });
const next = () => screen.getByRole("button", { name: "Next Engineering highlight" });
const previous = () => screen.getByRole("button", { name: "Previous Engineering highlight" });
const liveRegion = () => card().querySelector("[aria-live='polite']")!;
const focusable = () => card().querySelectorAll("a[href], button, input, select, textarea, [tabindex]");

afterEach(() => {
  reducedMotion.value = false;
});

describe("PathCard, live", () => {
  it("shows the label, metric and unit, headline, summary, then the link", () => {
    renderCard([rcm]);
    const heading = screen.getByRole("heading", { level: 3, name: "Engineering" });
    const metric = screen.getByText("4,500");
    const unit = screen.getByText("syncs a day");
    const headline = screen.getByText("RCM headline.");
    const summary = screen.getByText("rcm summary.");
    expect(follows(heading, metric) && follows(metric, unit) && follows(unit, headline)).toBe(true);
    expect(follows(headline, summary) && follows(summary, link())).toBe(true);
    expect(metric.className).toBe(metricClasses);
    expect(unit.className).toBe(metricUnitClasses);
    expect(link().textContent).toBe("Read the story →");
    expect(link().querySelector("[aria-hidden='true']")?.textContent).toBe("→");
    expect(link().getAttribute("href")).toBe("/engineering/rcm");
  });

  it("with one featured story, has a single link and no buttons or count", () => {
    renderCard([rcm]);
    expect(within(card()).getAllByRole("link")).toHaveLength(1);
    expect(within(card()).queryAllByRole("button")).toEqual([]);
    expect(screen.queryByText(/of 1/)).toBeNull();
    expect(focusable()).toHaveLength(1);
  });

  it("renders no metric or unit element when the highlight has no metric", () => {
    renderCard([noMetric]);
    expect(screen.getByText("Plain headline.")).toBeDefined();
    expect(card().querySelector(`[class="${metricClasses}"], [class="${metricUnitClasses}"]`)).toBeNull();
  });

  it("never shows a metric or unit for Beyond the Code", () => {
    renderCard([lifting], "Beyond the Code");
    expect(screen.getByText("Lifting headline.")).toBeDefined();
    expect(screen.getByText("Lifting summary.")).toBeDefined();
    expect(link().getAttribute("href")).toBe("/beyond/lifting");
    expect(screen.queryByText("200")).toBeNull();
    expect(screen.queryByText("kg")).toBeNull();
  });

  it("stretches the link over the card; clicking it opens the current story", () => {
    renderCard([rcm]);
    expect(classes(link())).toEqual(
      expect.arrayContaining(["after:absolute", "after:inset-0", "text-brand-primary", "hover:underline", "focus-visible:underline"])
    );
    expect(classes(card())).toContain("relative");
    fireEvent.click(link());
    expect(pathname).toBe("/engineering/rcm");
  });

  it("draws one focus ring around the card for the link, with a border step on hover and no shadow or button styling", () => {
    renderCard([rcm, iac]);
    expect(classes(card())).toEqual(
      expect.arrayContaining([
        "has-[a:focus-visible]:ring-2",
        "has-[a:focus-visible]:ring-focus-ring",
        "border",
        "border-border-default",
        "hover:border-border-essential",
        "bg-background-primary",
      ])
    );
    expect(card().className).not.toMatch(/shadow|bg-brand-primary-fill/);
    expect(classes(link())).toContain("focus:outline-hidden");
    expect(classes(link()).some((cls) => cls.startsWith("focus-visible:ring"))).toBe(false);
    // Each button keeps its own ring.
    for (const button of [previous(), next()]) {
      expect(classes(button)).toEqual(expect.arrayContaining(["focus-visible:ring-2", "focus-visible:ring-focus-ring"]));
    }
  });

  it("renders no flowbite dark-mode or palette classes", () => {
    renderCard([rcm, iac]);
    expectNoFlowbiteDefaults(card());
  });
});

describe("PathCard, rotating", () => {
  it("starts on the first slide with 1 of 2 and wraps both ways", () => {
    renderCard([rcm, iac]);
    expect(screen.getByText("RCM headline.")).toBeDefined();
    expect(screen.getByText("1 of 2")).toBeDefined();

    fireEvent.click(next());
    expect(screen.getByText("IaC headline.")).toBeDefined();
    expect(screen.getByText("~3 months")).toBeDefined();
    expect(screen.getByText("2 of 2")).toBeDefined();
    expect(link().getAttribute("href")).toBe("/engineering/iac");

    fireEvent.click(next());
    expect(screen.getByText("RCM headline.")).toBeDefined();
    expect(screen.getByText("1 of 2")).toBeDefined();

    fireEvent.click(previous());
    expect(screen.getByText("IaC headline.")).toBeDefined();
    expect(screen.getByText("2 of 2")).toBeDefined();
  });

  it("stacks every slide in one cell; inactive slides are invisible, hidden from AT and hold nothing focusable", () => {
    renderCard([rcm, iac]);
    const slideOf = (text: string) => screen.getByText(text).parentElement!;
    const check = (activeText: string, inactiveText: string) => {
      const active = slideOf(activeText);
      const inactive = slideOf(inactiveText);
      expect(classes(active)).toContain("[grid-area:1/1]");
      expect(classes(active)).not.toContain("invisible");
      expect(active.hasAttribute("aria-hidden")).toBe(false);
      expect(classes(inactive)).toEqual(expect.arrayContaining(["[grid-area:1/1]", "invisible"]));
      expect(inactive.getAttribute("aria-hidden")).toBe("true");
      expect(inactive.querySelector("a[href], button, input, select, textarea, [tabindex]")).toBeNull();
    };
    check("RCM headline.", "IaC headline.");
    fireEvent.click(next());
    check("IaC headline.", "RCM headline.");
    expect(within(card()).getAllByRole("link")).toHaveLength(1);
  });

  it("orders focus link, Previous, Next, with the controls above the overlay", () => {
    renderCard([rcm, iac]);
    expect([...focusable()]).toEqual([link(), previous(), next()]);
    // The wrapper, not each button, sits above the overlay, so the count and gaps don't open the story.
    const controls = previous().parentElement!;
    expect(controls).toBe(next().parentElement);
    expect(controls.textContent).toContain("1 of 2");
    expect(classes(controls)).toEqual(expect.arrayContaining(["relative", "z-10"]));
    for (const button of [previous(), next()]) {
      expect(classes(button)).toContain("shadow-none");
      expect(button.getAttribute("type")).toBe("button");
    }
  });

  it("keeps targets at least 24px", () => {
    renderCard([rcm, iac]);
    for (const button of [previous(), next()]) {
      expect(classes(button)).toEqual(expect.arrayContaining(["min-h-6", "min-w-6"]));
    }
  });

  it("does not announce or fade on first render, then does both after a change", () => {
    renderCard([rcm, iac]);
    expect(liveRegion().textContent).toBe("");
    expect(card().querySelector(".animate-story-in")).toBeNull();

    fireEvent.click(next());
    expect(liveRegion().textContent).toBe("Engineering highlight 2 of 2: IaC headline.");
    expect(screen.getByText("IaC headline.").closest(".animate-story-in")).not.toBeNull();
  });

  it("does not fade under reduced motion, but still announces", () => {
    reducedMotion.value = true;
    renderCard([rcm, iac]);
    fireEvent.click(next());
    expect(card().querySelector(".animate-story-in")).toBeNull();
    expect(liveRegion().textContent).toBe("Engineering highlight 2 of 2: IaC headline.");
  });

  it("never advances on its own", () => {
    vi.useFakeTimers();
    try {
      renderCard([rcm, iac]);
      vi.advanceTimersByTime(60_000);
      expect(screen.getByText("1 of 2")).toBeDefined();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("PathCard, coming soon", () => {
  it("is a non-interactive card with the label, Coming soon and the path description", () => {
    renderCard([], "Leadership & Enablement");
    expect(screen.getByRole("heading", { level: 3, name: "Leadership & Enablement" })).toBeDefined();
    expect(screen.getByText("Coming soon")).toBeDefined();
    expect(screen.getByText("Fixture path description.")).toBeDefined();
    expect(within(card()).queryAllByRole("link")).toEqual([]);
    expect(within(card()).queryAllByRole("button")).toEqual([]);
    expect(focusable()).toHaveLength(0);
    expect(card().querySelector("[aria-disabled]")).toBeNull();
    expect(card().hasAttribute("aria-disabled")).toBe(false);
    // No hover step on something that can't be clicked.
    expect(classes(card())).not.toContain("hover:border-border-essential");
  });

  it("renders no flowbite dark-mode or palette classes", () => {
    // The render container too: the soon card alone has too few elements for the helper's floor.
    const { container } = renderCard([], "Beyond the Code");
    expectNoFlowbiteDefaults(container);
  });
});
