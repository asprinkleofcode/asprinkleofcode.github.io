import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import type { MDXModule } from "mdx/types";
import { ThemeProvider } from "flowbite-react";
import { MemoryRouter, Route, Routes, useNavigate, type NavigateFunction } from "react-router";
import { aSprinkleOfCodeApplyTheme, aSprinkleOfCodeTheme } from "../../theme/aSprinkleOfCodeTheme";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";
import { DOCUMENT_META_ATTRIBUTE } from "../../lib/useDocumentMeta";
import type { PersonalFrontmatter } from "../../lib/frontmatter";
import type { Entry } from "../../lib/registry";
import Photo from "../../components/Photo/Photo";
import Personal from "./Personal";

const HERO_ALT = "Fixture hero: the garden in late summer.";
const BODY_ALT = "Fixture body photo: a raised bed.";

const personal = (slug: string, extra: Partial<PersonalFrontmatter> = {}, listed = true): Entry => ({
  key: `personal/beyond/${slug}`,
  path: "beyond",
  slug,
  file: `../content/personal/${slug}.mdx`,
  listed,
  frontmatter: {
    type: "personal",
    title: `Fixture ${slug}`,
    summary: `Fixture ${slug} summary.`,
    listed,
    ...extra,
  },
});

const fixtures: Entry[] = [
  personal("garden", {
    date: "2026-05-01",
    hero: { src: "garden/hero.webp", alt: HERO_ALT },
    featured: 1,
    highlight: { headline: "Fixture headline." },
  }),
  personal("hidden", {}, false),
  // A work entry wrongly filed under the beyond path must not render here.
  {
    key: "work/beyond/misfiled",
    path: "beyond",
    slug: "misfiled",
    file: "../content/work/misfiled.mdx",
    listed: true,
    frontmatter: {
      type: "work",
      title: "Fixture misfiled",
      path: "engineering",
      summary: "S.",
      role: "R",
      capabilities: ["ownership"],
    },
  },
];

// A freeform body with a photo between paragraphs, the way a personal story is written.
const Body = () => (
  <>
    <p>Fixture body paragraph.</p>
    <Photo src="garden/raised-bed.webp" alt={BODY_ALT} caption="Fixture caption." />
    <p>Fixture closing paragraph.</p>
  </>
);

vi.mock("../../lib/registry", () => ({
  getEntry: (path: string, slug: string) => fixtures.find((e) => e.path === path && e.slug === slug),
  loadBody: () => Promise.resolve({ default: Body } as unknown as MDXModule),
}));

vi.mock("../../lib/media", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../lib/media")>();
  const media = {
    "../assets/media/garden/hero.webp": { src: "/fixture/hero.webp", width: 2000, height: 1333 },
    "../assets/media/garden/raised-bed.webp": { src: "/fixture/raised-bed.webp", width: 1600, height: 1200 },
  };
  return { ...actual, resolveMedia: (src: string) => actual.resolveMedia(src, media) };
});

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
            <Route path="/beyond/:slug" element={<Personal />} />
          </Routes>
        </Suspense>
        <NavigateProbe />
      </MemoryRouter>
    </ThemeProvider>
  );
}

const h1 = (name: string) => screen.findByRole("heading", { level: 1, name });
const article = () => screen.getByRole("article");
const storyJsonLd = () => document.head.querySelector(`script[${DOCUMENT_META_ATTRIBUTE}]`);
const follows = (a: Node, b: Node) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
const description = () => document.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.content;

const originalMatchMedia = window.matchMedia;
function setReducedMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    ...originalMatchMedia(query),
    matches: reduce && query === "(prefers-reduced-motion: reduce)",
  })) as typeof window.matchMedia;
}

describe("Personal page", () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="description" content="Static description.">';
    document.title = "Static title";
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    document.head.innerHTML = "";
  });

  it("renders one article with one h1, the summary, the eager hero, then the body", async () => {
    renderAt("/beyond/garden");
    const title = await h1("Fixture garden");
    await screen.findByText("Fixture body paragraph.");
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(article().contains(title)).toBe(true);
    expect(article().className).toContain("max-w-3xl");
    expect(title.className).toContain("type-section");

    const summary = screen.getByText("Fixture garden summary.");
    expect(summary.className).toContain("text-text-secondary");
    const hero = screen.getByRole("img", { name: HERO_ALT });
    expect(hero.getAttribute("loading")).toBe("eager");
    expect(hero.getAttribute("width")).toBe("2000");
    expect(hero.getAttribute("height")).toBe("1333");
    expect(follows(summary, hero)).toBe(true);
    expect(follows(hero, screen.getByText("Fixture body paragraph."))).toBe(true);
  });

  it("lazy-loads body photos with their alt, size and caption", async () => {
    renderAt("/beyond/garden");
    await screen.findByText("Fixture body paragraph.");
    const photo = screen.getByRole("img", { name: BODY_ALT });
    expect(photo.getAttribute("loading")).toBe("lazy");
    expect(photo.getAttribute("width")).toBe("1600");
    expect(photo.getAttribute("height")).toBe("1200");
    expect(photo.closest("figure")?.querySelector("figcaption")?.textContent).toBe("Fixture caption.");
    // Every image fills the padded column at its own ratio, so nothing overflows a 375px phone.
    for (const img of screen.getAllByRole("img")) {
      expect(img.className.split(" ")).toEqual(expect.arrayContaining(["block", "h-auto", "w-full"]));
      expect(img.hasAttribute("width") && img.hasAttribute("height")).toBe(true);
    }
    expect(article().className).toContain("px-4");
    // The body's photos get the prose spacing; the hero sits outside it.
    expect(photo.closest("figure")?.parentElement?.className).toContain("[&>figure]:my-8");
  });

  it("shows no capability, role, highlight or evidence markup", async () => {
    renderAt("/beyond/garden");
    await screen.findByText("Fixture body paragraph.");
    expect(screen.queryByRole("list", { name: "Capabilities shown" })).toBeNull();
    expect(screen.queryByText(/^Role:/)).toBeNull();
    expect(screen.queryByText("Fixture headline.")).toBeNull();
    expect(screen.queryAllByRole("heading", { level: 2 })).toEqual([]);
    expect(screen.queryByRole("region")).toBeNull();
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("renders an entry without a hero, and an unlisted entry at its route", async () => {
    renderAt("/beyond/hidden");
    await h1("Fixture hidden");
    await screen.findByText("Fixture body paragraph.");
    expect(screen.queryByRole("img", { name: HERO_ALT })).toBeNull();
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("carries no flowbite dark:/palette defaults", async () => {
    renderAt("/beyond/garden");
    await screen.findByText("Fixture body paragraph.");
    expectNoFlowbiteDefaults(article());
  });

  it.each(["/beyond/missing", "/beyond/misfiled"])("renders not-found and sets no meta for %s", async (route) => {
    renderAt(route);
    await h1("Page not found");
    expect(screen.queryByRole("article")).toBeNull();
    expect(document.title).toBe("Static title");
    expect(description()).toBe("Static description.");
    expect(storyJsonLd()).toBeNull();
  });

  it("sets the tab title, description and Article JSON-LD, and restores them on leaving", async () => {
    renderAt("/beyond/garden");
    await h1("Fixture garden");
    expect(document.title).toBe("Fixture garden | Alisha Sprinkle Korba");
    expect(description()).toBe("Fixture garden summary.");
    expect(JSON.parse(storyJsonLd()?.textContent ?? "{}")).toEqual({
      "@context": "https://schema.org/",
      "@type": "Article",
      headline: "Fixture garden",
      description: "Fixture garden summary.",
      url: "https://alishasprinklekorba.com/#/beyond/garden",
      author: { "@id": "https://alishasprinklekorba.com/#person" },
      datePublished: "2026-05-01",
    });

    act(() => navigate("/"));
    await screen.findByText("Home");
    expect(document.title).toBe("Static title");
    expect(description()).toBe("Static description.");
    expect(storyJsonLd()).toBeNull();
  });

  it("omits datePublished for an undated entry", async () => {
    renderAt("/beyond/hidden");
    await h1("Fixture hidden");
    expect(JSON.parse(storyJsonLd()?.textContent ?? "{}")).not.toHaveProperty("datePublished");
  });

  describe("arrival transition", () => {
    it("fades in a story reached by a link (PUSH)", async () => {
      renderAt("/");
      await screen.findByText("Home");
      act(() => navigate("/beyond/garden"));
      await h1("Fixture garden");
      expect(article().className).toContain("animate-story-in");
    });

    it("replays the fade and replaces the meta on a link from one story to another", async () => {
      renderAt("/");
      await screen.findByText("Home");
      act(() => navigate("/beyond/garden"));
      await h1("Fixture garden");
      const first = article();
      act(() => navigate("/beyond/hidden"));
      await h1("Fixture hidden");
      expect(article()).not.toBe(first);
      expect(article().className).toContain("animate-story-in");
      expect(document.title).toBe("Fixture hidden | Alisha Sprinkle Korba");
      expect(document.head.querySelectorAll(`script[${DOCUMENT_META_ATTRIBUTE}]`)).toHaveLength(1);
    });

    it("shows a story at once on cold load", async () => {
      renderAt("/beyond/garden");
      await h1("Fixture garden");
      expect(article().className).not.toContain("animate-story-in");
    });

    it("shows a story at once under reduced motion", async () => {
      setReducedMotion(true);
      renderAt("/");
      await screen.findByText("Home");
      act(() => navigate("/beyond/garden"));
      await h1("Fixture garden");
      expect(article().className).not.toContain("animate-story-in");
    });
  });
});
