import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { MDXModule } from "mdx/types";
import type { Frontmatter, PersonalFrontmatter, WorkFrontmatter } from "./frontmatter";
import {
  buildIndex,
  entries,
  getEntry,
  getFeaturedEntries,
  getPathEntries,
  loadBody,
  type BodyLoader,
  type Entry,
} from "./registry";
import { metricClasses, metricUnitClasses } from "./metricClasses";
import { resolveMedia } from "./media";
import { StoryHighlightContext } from "./storyHighlight";

const loader: BodyLoader = () => Promise.resolve({ default: () => null } as unknown as MDXModule);

const work = (overrides: Partial<WorkFrontmatter> = {}): WorkFrontmatter => ({
  type: "work",
  title: "Work",
  path: "engineering",
  summary: "S.",
  role: "R",
  capabilities: ["ownership"],
  ...overrides,
});

const personal = (overrides: Partial<PersonalFrontmatter> = {}): PersonalFrontmatter => ({
  type: "personal",
  title: "Personal",
  summary: "S.",
  listed: true,
  ...overrides,
});

function index(frontmatters: Record<string, Frontmatter | null>) {
  const bodies = Object.fromEntries(Object.keys(frontmatters).map((file) => [file, loader]));
  return buildIndex(frontmatters, bodies);
}

describe("buildIndex", () => {
  it("keys a work file by type/path/slug from its file name", () => {
    const [entry] = index({ "../content/work/foo.mdx": work() });
    expect(entry).toMatchObject({ key: "work/engineering/foo", path: "engineering", slug: "foo", listed: true });
  });

  it("uses a slug override", () => {
    expect(index({ "../content/work/foo.mdx": work({ slug: "bar" }) })[0].key).toBe("work/engineering/bar");
  });

  it("keys personal entries under the beyond path", () => {
    expect(index({ "../content/personal/baz.mdx": personal() })[0].key).toBe("personal/beyond/baz");
  });

  it("skips drafts (null frontmatter)", () => {
    expect(index({ "../content/work/draft.mdx": null, "../content/work/foo.mdx": work() }).map((e) => e.slug)).toEqual([
      "foo",
    ]);
  });

  it("throws on duplicate keys, naming both files", () => {
    expect(() =>
      index({ "../content/work/foo.mdx": work(), "../content/work/other.mdx": work({ slug: "foo" }) })
    ).toThrow(/duplicate key "work\/engineering\/foo".*foo\.mdx.*other\.mdx/);
  });

  it("allows the same slug under different paths", () => {
    expect(
      index({
        "../content/work/foo.mdx": work(),
        "../content/work/foo-leadership.mdx": work({ path: "leadership", slug: "foo" }),
      })
    ).toHaveLength(2);
  });

  it("throws when a body loader is missing", () => {
    expect(() => buildIndex({ "../content/work/foo.mdx": work() }, {})).toThrow(/no body loader/);
  });

  it("sorts featured ascending (unfeatured last), then date descending (undated last), then title", () => {
    const sorted = index({
      "../content/work/a.mdx": work({ title: "B undated" }),
      "../content/work/b.mdx": work({ title: "A undated" }),
      "../content/work/c.mdx": work({ title: "Old", date: "2024-01-01" }),
      "../content/work/d.mdx": work({ title: "New", date: "2026-01-01" }),
      "../content/work/e.mdx": work({ title: "Featured 2", featured: 2 }),
      "../content/work/f.mdx": work({ title: "Featured 1", featured: 1, date: "2020-01-01" }),
    });
    expect(sorted.map((e) => e.frontmatter.title)).toEqual([
      "Featured 1",
      "Featured 2",
      "New",
      "Old",
      "A undated",
      "B undated",
    ]);
  });

  it("keeps unlisted personal entries reachable by getEntry but out of the path index", () => {
    const built = index({
      "../content/personal/care.mdx": personal({ listed: false }),
      "../content/personal/garden.mdx": personal(),
      "../content/work/foo.mdx": work(),
    });
    expect(getEntry("beyond", "care", built)).toMatchObject({ key: "personal/beyond/care", listed: false });
    expect(getPathEntries("beyond", built).map((e) => e.slug)).toEqual(["garden"]);
    expect(getPathEntries("engineering", built).map((e) => e.slug)).toEqual(["foo"]);
    expect(getEntry("leadership", "foo", built)).toBeUndefined();
  });
});

describe("getFeaturedEntries", () => {
  it("returns an empty list for an empty index", () => {
    expect(getFeaturedEntries("engineering", [])).toEqual([]);
  });

  it("returns an empty list when the path has only unfeatured entries", () => {
    const built = index({
      "../content/work/a.mdx": work({ title: "A" }),
      "../content/work/b.mdx": work({ title: "B", path: "leadership", featured: 1 }),
    });
    expect(getFeaturedEntries("engineering", built)).toEqual([]);
  });

  it("returns the path's featured entries in featured order, without unfeatured or other-path ones", () => {
    const built = index({
      "../content/work/two.mdx": work({ title: "Two", featured: 2 }),
      "../content/work/one.mdx": work({ title: "One", featured: 1 }),
      "../content/work/plain.mdx": work({ title: "Plain" }),
      "../content/work/lead.mdx": work({ title: "Lead", path: "leadership", featured: 1 }),
    });
    expect(getFeaturedEntries("engineering", built).map((e) => e.slug)).toEqual(["one", "two"]);
  });

  it("skips unlisted entries", () => {
    const built = index({
      "../content/personal/care.mdx": personal({ listed: false, featured: 1 }),
      "../content/personal/garden.mdx": personal({ featured: 2 }),
    });
    expect(getFeaturedEntries("beyond", built).map((e) => e.slug)).toEqual(["garden"]);
    const onlyUnlisted = index({ "../content/personal/care.mdx": personal({ listed: false, featured: 1 }) });
    expect(getFeaturedEntries("beyond", onlyUnlisted)).toEqual([]);
  });
});

describe("live registry", () => {
  it("returns an empty index when there are no content files", () => {
    expect(buildIndex({}, {})).toEqual([]);
  });

  // Importing the registry validates every committed content file, so this
  // fails the build on bad frontmatter or duplicate keys whatever the content.
  it("loads the committed content", () => {
    expect(Array.isArray(entries)).toBe(true);
    expect(getEntry("beyond", "no-such-entry")).toBeUndefined();
  });

  // The real globs against a committed story (Epic 1 retro A-10): dropping
  // `import: "frontmatter"` or breaking a glob pattern fails here.
  it("indexes the committed RCM story first on the engineering path card", () => {
    const entry = getEntry("engineering", "rcm-app-access-watcher");
    expect(entry).toMatchObject({
      key: "work/engineering/rcm-app-access-watcher",
      listed: true,
      frontmatter: {
        type: "work",
        title: expect.any(String),
        featured: 1,
        capabilities: expect.arrayContaining(["ownership"]),
        highlight: { headline: expect.any(String), metric: expect.any(String) },
      },
    });
    expect(getPathEntries("engineering")).toContain(entry);
    expect(getFeaturedEntries("engineering")[0]).toBe(entry);
  });

  it("indexes the committed IaC story as the path card's second slide, after RCM", () => {
    const entry = getEntry("engineering", "azure-terraform-platform");
    expect(entry).toMatchObject({
      key: "work/engineering/azure-terraform-platform",
      listed: true,
      frontmatter: {
        type: "work",
        title: expect.any(String),
        featured: 2,
        capabilities: expect.arrayContaining(["engineering-judgment"]),
        highlight: { headline: expect.any(String), metric: expect.any(String) },
      },
    });
    // Path order is featured ascending, so the path card's slides run RCM, then IaC.
    // Relative order only, so adding another story stays a one-file change.
    const slugs = getPathEntries("engineering").map((e) => e.slug);
    expect(slugs).toContain("azure-terraform-platform");
    expect(slugs.indexOf("rcm-app-access-watcher")).toBeLessThan(slugs.indexOf("azure-terraform-platform"));
    const slides = getFeaturedEntries("engineering");
    expect(slides[0]?.slug).toBe("rcm-app-access-watcher");
    expect(slides[1]).toBe(entry);
  });
});

// Every committed non-draft work story, from the real globs (Epic 2 retro A-1).
// Rendering, not just importing, catches a body that throws at render time, so
// a broken story fails here instead of on the live site. A new story is
// covered by adding its file, with no edit here.
const workEntries = entries.filter((e) => e.frontmatter.type === "work");

async function renderWorkBody(entry: Entry): Promise<Document> {
  const body = await loadBody(entry);
  // Wrapped in the story highlight the same way WorkStory wraps it.
  const html = renderToStaticMarkup(
    createElement(StoryHighlightContext, { value: entry.frontmatter.highlight }, createElement(body.default))
  );
  return new DOMParser().parseFromString(html, "text/html");
}

const sectionHeadings = (doc: Document) =>
  [...doc.querySelectorAll("section > h2")].map((h) => h.textContent);
const outcomeSection = (doc: Document) =>
  [...doc.querySelectorAll("section")].find((s) => s.querySelector(":scope > h2")?.textContent === "Outcome");

describe("live work story bodies", () => {
  it("has at least one committed work story, so the render check can't pass vacuously", () => {
    expect(workEntries.length).toBeGreaterThan(0);
  });

  it.each(workEntries.map((entry) => [entry.key, entry] as const))("renders %s", async (_, entry) => {
    const doc = await renderWorkBody(entry);
    expect(sectionHeadings(doc)).toEqual(expect.arrayContaining(["Context", "Decision", "Outcome"]));

    // The Outcome section shows the same metric and unit as the homepage path card,
    // in the shared metric elements (prose repeating the number doesn't count).
    const { highlight } = entry.frontmatter as WorkFrontmatter;
    const outcome = outcomeSection(doc)!;
    const withClass = (className: string) =>
      [...outcome.querySelectorAll("*")].filter((el) => el.className === className).map((el) => el.textContent);
    expect(withClass(metricClasses)).toEqual(highlight?.metric ? [highlight.metric] : []);
    expect(withClass(metricUnitClasses)).toEqual(highlight?.metric && highlight.unit ? [highlight.unit] : []);
  });
});

// Every committed non-draft personal entry, listed or not, from the real globs.
// Empty until Story 4.4 commits the first personal stories; a new one is
// covered by adding its file. Rendering catches a body whose Photo names an
// unknown media path, which throws.
const personalEntries = entries.filter((e) => e.frontmatter.type === "personal");

describe("live personal story bodies", () => {
  it("files every personal entry under the beyond path", () => {
    expect(personalEntries.every((e) => e.path === "beyond")).toBe(true);
  });

  for (const entry of personalEntries) {
    it(`renders ${entry.key}`, async () => {
      const body = await loadBody(entry);
      const html = renderToStaticMarkup(createElement(body.default));
      const doc = new DOMParser().parseFromString(html, "text/html");
      // The story title is the page's only h1.
      expect(doc.querySelector("h1")).toBeNull();
      for (const img of doc.querySelectorAll("img")) {
        expect(img.getAttribute("alt")).toBeTruthy();
        expect(Number(img.getAttribute("width"))).toBeGreaterThan(0);
        expect(Number(img.getAttribute("height"))).toBeGreaterThan(0);
      }
      const { hero } = entry.frontmatter as PersonalFrontmatter;
      if (hero) expect(resolveMedia(hero.src).width).toBeGreaterThan(0);
    });
  }
});
