import { describe, expect, it } from "vitest";
import type { MDXModule } from "mdx/types";
import type { Frontmatter, PersonalFrontmatter, WorkFrontmatter } from "./frontmatter";
import { buildIndex, entries, getEntry, getFeaturedEntry, getPathEntries, type BodyLoader } from "./registry";

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

describe("getFeaturedEntry", () => {
  it("returns undefined for an empty index", () => {
    expect(getFeaturedEntry("engineering", [])).toBeUndefined();
  });

  it("returns undefined when the path has only unfeatured entries", () => {
    const built = index({
      "../content/work/a.mdx": work({ title: "A" }),
      "../content/work/b.mdx": work({ title: "B", path: "leadership", featured: 1 }),
    });
    expect(getFeaturedEntry("engineering", built)).toBeUndefined();
  });

  it("picks the lowest featured number in the path", () => {
    const built = index({
      "../content/work/two.mdx": work({ title: "Two", featured: 2 }),
      "../content/work/one.mdx": work({ title: "One", featured: 1 }),
      "../content/work/plain.mdx": work({ title: "Plain" }),
    });
    expect(getFeaturedEntry("engineering", built)?.slug).toBe("one");
  });

  it("skips unlisted entries", () => {
    const built = index({
      "../content/personal/care.mdx": personal({ listed: false, featured: 1 }),
      "../content/personal/garden.mdx": personal({ featured: 2 }),
    });
    expect(getFeaturedEntry("beyond", built)?.slug).toBe("garden");
    const onlyUnlisted = index({ "../content/personal/care.mdx": personal({ listed: false, featured: 1 }) });
    expect(getFeaturedEntry("beyond", onlyUnlisted)).toBeUndefined();
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
});
