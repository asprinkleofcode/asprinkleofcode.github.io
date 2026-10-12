import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import { Suspense } from "react";
import type { MDXModule } from "mdx/types";
import { ThemeProvider } from "flowbite-react";
import { MemoryRouter, Route, Routes, useNavigate, type NavigateFunction } from "react-router";
import { aSprinkleOfCodeApplyTheme, aSprinkleOfCodeTheme } from "../../theme/aSprinkleOfCodeTheme";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";
import { DOCUMENT_META_ATTRIBUTE } from "../../lib/useDocumentMeta";
import { metricClasses, metricUnitClasses } from "../../lib/metricClasses";
import type { Highlight } from "../../lib/frontmatter";
import type { Entry } from "../../lib/registry";
import DecisionBlock from "../../components/DecisionBlock/DecisionBlock";
import OutcomeBlock from "../../components/OutcomeBlock/OutcomeBlock";
import StorySection from "../../components/StorySection/StorySection";
import WorkStory from "./WorkStory";

const entry = (slug: string, path: "engineering" | "leadership", date?: string, highlight?: Highlight): Entry => ({
  key: `work/${path}/${slug}`,
  path,
  slug,
  file: `../content/work/${slug}.mdx`,
  listed: true,
  frontmatter: {
    type: "work",
    title: `Fixture ${slug}`,
    path,
    summary: `Fixture ${slug} summary.`,
    role: "Fixture role",
    capabilities: ["ownership", "engineering-judgment"],
    ...(date ? { date } : {}),
    ...(highlight ? { highlight } : {}),
  },
});

const HIGHLIGHT: Highlight = { headline: "Fixture headline.", metric: "4,500", unit: "syncs a day, up from 2,000" };
const fixtures = [
  entry("story", "engineering", "2026-01-15", HIGHLIGHT),
  entry("other", "engineering"),
  entry("lead", "leadership"),
];

// A body shaped like a real story: required sections, blocks, prose subheading.
const Body = () => (
  <>
    <StorySection section="context">
      <p>Fixture context paragraph.</p>
      <h3>Fixture subheading</h3>
    </StorySection>
    <StorySection section="decision">
      <DecisionBlock decision="Fixture decision." />
    </StorySection>
    <StorySection section="outcome">
      <OutcomeBlock outcome="Fixture outcome." />
    </StorySection>
  </>
);

vi.mock("../../lib/registry", () => ({
  getEntry: (path: string, slug: string) => fixtures.find((e) => e.path === path && e.slug === slug),
  loadBody: () => Promise.resolve({ default: Body } as unknown as MDXModule),
}));

let navigate: NavigateFunction;
function NavigateProbe() {
  navigate = useNavigate();
  return null;
}

function renderAt(route: string) {
  return render(
    <ThemeProvider theme={aSprinkleOfCodeTheme} applyTheme={aSprinkleOfCodeApplyTheme}>
      <MemoryRouter initialEntries={[route]}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<p>Home</p>} />
            <Route path="/engineering/:slug" element={<WorkStory path="engineering" />} />
            <Route path="/leadership/:slug" element={<WorkStory path="leadership" />} />
          </Routes>
        </Suspense>
        <NavigateProbe />
      </MemoryRouter>
    </ThemeProvider>
  );
}

// Derived from the shared classes, so a class change can't make the "no metric" check vacuous.
const METRIC_SELECTOR = `.${metricClasses.split(" ").join(".")}`;
const h1 = (name: string) => screen.findByRole("heading", { level: 1, name });
const article = () => screen.getByRole("article");
const storyJsonLd = () => document.head.querySelector(`script[${DOCUMENT_META_ATTRIBUTE}]`);

const originalMatchMedia = window.matchMedia;
function setReducedMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    ...originalMatchMedia(query),
    matches: reduce && query === "(prefers-reduced-motion: reduce)",
  })) as typeof window.matchMedia;
}

describe("WorkStory page", () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="description" content="Static description.">';
    document.title = "Static title";
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    document.head.innerHTML = "";
  });

  it.each([
    ["/engineering/story", "Fixture story"],
    ["/leadership/lead", "Fixture lead"],
  ])("renders %s as one article with one h1 and section h2s", async (route, title) => {
    renderAt(route);
    await h1(title);
    await screen.findByText("Fixture outcome.");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(article().contains(screen.getByRole("heading", { level: 1 }))).toBe(true);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "Context",
      "Decision",
      "Outcome",
    ]);
    expect(screen.getByRole("heading", { level: 3, name: "Fixture subheading" })).toBeDefined();
    // No skipped levels: every heading is at most one below the one before it.
    const levels = [...article().querySelectorAll("h1, h2, h3, h4, h5, h6")].map((h) => Number(h.tagName[1]));
    levels.slice(1).forEach((level, i) => expect(level).toBeLessThanOrEqual(levels[i] + 1));
  });

  it("shows the summary, role and capability signals in the header", async () => {
    renderAt("/engineering/story");
    await h1("Fixture story");
    const list = screen.getByRole("list", { name: "Capabilities shown" });
    expect(within(list).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "Ownership",
      "Engineering judgment",
    ]);
    expect(screen.getByText("Fixture story summary.").className).toContain("text-text-secondary");
    expect(screen.getByText("Role: Fixture role").className).toContain("type-meta");
  });

  it("shows the frontmatter highlight's metric and unit at the top of the Outcome panel", async () => {
    renderAt("/engineering/story");
    await screen.findByText("Fixture outcome.");
    const outcome = screen.getByRole("region", { name: "Outcome" });
    const metric = within(outcome).getByText("4,500");
    const unit = within(outcome).getByText("syncs a day, up from 2,000");
    expect(metric.className).toBe(metricClasses);
    expect(unit.className).toBe(metricUnitClasses);
    const panel = metric.closest("p")!.parentElement!;
    expect(panel.firstElementChild).toBe(metric.closest("p"));
    expect(panel.lastElementChild!.textContent).toBe("Fixture outcome.");
  });

  it("shows no metric for a story without a highlight", async () => {
    renderAt("/engineering/other");
    await screen.findByText("Fixture outcome.");
    const outcome = screen.getByRole("region", { name: "Outcome" });
    expect(within(outcome).queryByText("4,500")).toBeNull();
    expect(outcome.querySelector(METRIC_SELECTOR)).toBeNull();
  });

  it("scopes prose styling to the body wrapper", async () => {
    renderAt("/engineering/story");
    const paragraph = await screen.findByText("Fixture context paragraph.");
    const wrapper = paragraph.closest("section")?.parentElement;
    expect(wrapper?.className).toContain("[&_section>p]:my-4");
    expect(wrapper?.className).toContain("[&_section>h3]:type-story");
    expect(paragraph.className).toBe("");
  });

  it("carries no flowbite dark:/palette defaults", async () => {
    renderAt("/engineering/story");
    await screen.findByText("Fixture outcome.");
    expectNoFlowbiteDefaults(article());
  });

  // Drafts never reach the registry (plugin + registry tests), so a draft slug is an unknown one here.
  it("renders not-found and sets no meta for an unknown slug", async () => {
    renderAt("/engineering/missing");
    await h1("Page not found");
    expect(document.title).toBe("Static title");
    expect(document.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.content).toBe(
      "Static description."
    );
    expect(storyJsonLd()).toBeNull();
  });

  it("replays the fade and replaces the meta on a link from one story to another", async () => {
    renderAt("/");
    await screen.findByText("Home");
    act(() => navigate("/engineering/story"));
    await h1("Fixture story");
    const first = article();
    // Same route element, so only the key makes this a fresh article.
    act(() => navigate("/engineering/other"));
    await h1("Fixture other");
    expect(article()).not.toBe(first);
    expect(article().className).toContain("animate-story-in");
    expect(document.title).toBe("Fixture other | Alisha Sprinkle Korba");
    expect(document.head.querySelectorAll(`script[${DOCUMENT_META_ATTRIBUTE}]`)).toHaveLength(1);
    expect(JSON.parse(storyJsonLd()?.textContent ?? "{}")).toMatchObject({ headline: "Fixture other" });
  });

  it("sets the tab title, description and Article JSON-LD", async () => {
    renderAt("/engineering/story");
    await h1("Fixture story");
    expect(document.title).toBe("Fixture story | Alisha Sprinkle Korba");
    expect(document.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.content).toBe(
      "Fixture story summary."
    );
    expect(JSON.parse(storyJsonLd()?.textContent ?? "{}")).toEqual({
      "@context": "https://schema.org/",
      "@type": "Article",
      headline: "Fixture story",
      description: "Fixture story summary.",
      url: "https://alishasprinklekorba.com/#/engineering/story",
      author: { "@id": "https://alishasprinklekorba.com/#person" },
      datePublished: "2026-01-15",
    });
  });

  it("omits datePublished for an undated story", async () => {
    renderAt("/leadership/lead");
    await h1("Fixture lead");
    expect(JSON.parse(storyJsonLd()?.textContent ?? "{}")).not.toHaveProperty("datePublished");
  });

  it("restores the static head after navigating away", async () => {
    renderAt("/engineering/story");
    await h1("Fixture story");
    act(() => navigate("/"));
    await screen.findByText("Home");
    expect(document.title).toBe("Static title");
    expect(document.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.content).toBe(
      "Static description."
    );
    expect(storyJsonLd()).toBeNull();
  });

  describe("arrival transition", () => {
    it("fades in a story reached by a link (PUSH)", async () => {
      renderAt("/");
      await screen.findByText("Home");
      act(() => navigate("/engineering/story"));
      await h1("Fixture story");
      expect(article().className).toContain("animate-story-in");
    });

    it("shows a story at once on cold load", async () => {
      renderAt("/engineering/story");
      await h1("Fixture story");
      expect(article().className).not.toContain("animate-story-in");
    });

    it("shows a story at once on back navigation", async () => {
      renderAt("/engineering/story");
      await h1("Fixture story");
      act(() => navigate("/"));
      await screen.findByText("Home");
      act(() => navigate(-1));
      await h1("Fixture story");
      expect(article().className).not.toContain("animate-story-in");
    });

    it("shows a story at once under reduced motion", async () => {
      setReducedMotion(true);
      renderAt("/");
      await screen.findByText("Home");
      act(() => navigate("/engineering/story"));
      await h1("Fixture story");
      expect(article().className).not.toContain("animate-story-in");
    });
  });
});
