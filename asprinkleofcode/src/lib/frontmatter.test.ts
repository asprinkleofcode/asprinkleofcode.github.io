import { describe, expect, it } from "vitest";
import { CAPABILITIES, FrontmatterError, parseFrontmatter } from "./frontmatter";

const FILE = "src/content/work/foo.mdx";

const work = {
  type: "work",
  title: "Foo",
  path: "engineering",
  summary: "A summary.",
  role: "Tech lead",
  capabilities: ["ownership"],
};

const personal = { type: "personal", title: "Bar", summary: "A summary." };

function problemsOf(fn: () => unknown): string[] {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(FrontmatterError);
    return (error as FrontmatterError).problems;
  }
  throw new Error("expected a FrontmatterError");
}

describe("parseFrontmatter", () => {
  it("accepts a valid work file with every optional key", () => {
    const data = {
      ...work,
      slug: "bar",
      date: "2026-02-28",
      hero: { src: "engineering/pipeline.webp", alt: "The sync pipeline." },
      featured: 1,
      highlight: { headline: "A headline.", metric: "4,500", unit: "syncs a day" },
      draft: false,
    };
    expect(parseFrontmatter("work", data, FILE)).toEqual(data);
  });

  it("accepts a highlight on both types, with a metric alone or no metric", () => {
    const headlineOnly = { ...personal, featured: 1, highlight: { headline: "H." } };
    expect(parseFrontmatter("personal", headlineOnly, FILE)).toMatchObject({ highlight: { headline: "H." } });
    expect(() =>
      parseFrontmatter("work", { ...work, highlight: { headline: "H.", metric: "4,500" } }, FILE)
    ).not.toThrow();
  });

  it("requires a highlight on a featured entry unless it is a draft", () => {
    expect(problemsOf(() => parseFrontmatter("work", { ...work, featured: 1 }, FILE))).toEqual([
      '"featured" needs a "highlight" block for the path card',
    ]);
    expect(problemsOf(() => parseFrontmatter("personal", { ...personal, featured: 2 }, FILE))).toHaveLength(1);
    expect(() => parseFrontmatter("work", { ...work, featured: 1, draft: true }, FILE)).not.toThrow();
  });

  it("accepts a hero on both types", () => {
    const heroImage = { src: "birdhouses/01-raw-gourd.avif", alt: "A raw gourd." };
    expect(parseFrontmatter("personal", { ...personal, hero: heroImage }, FILE)).toMatchObject({ hero: heroImage });
  });

  it("names a repeated capability", () => {
    expect(
      problemsOf(() => parseFrontmatter("work", { ...work, capabilities: ["ownership", "ambiguity", "ownership"] }, FILE))
    ).toEqual(['"capabilities" lists "ownership" more than once']);
  });

  it("accepts every capability in the vocabulary", () => {
    expect(() => parseFrontmatter("work", { ...work, capabilities: [...CAPABILITIES] }, FILE)).not.toThrow();
  });

  it("defaults personal listed to true and keeps an explicit false", () => {
    expect(parseFrontmatter("personal", personal, FILE)).toMatchObject({ listed: true });
    expect(parseFrontmatter("personal", { ...personal, listed: false }, FILE)).toMatchObject({ listed: false });
  });

  it("accepts personal links and pdf", () => {
    const data = {
      ...personal,
      links: [{ label: "Site", href: "https://example.com" }],
      pdf: "/downloads/care-guide.pdf",
    };
    expect(() => parseFrontmatter("personal", data, FILE)).not.toThrow();
  });

  it("names the file and lists every problem at once", () => {
    const { role: _role, ...noRole } = work;
    void _role;
    const data = { ...noRole, type: "personal", path: "other", capabilities: ["ownership", "wizardry"] };
    let error: unknown;
    try {
      parseFrontmatter("work", data, FILE);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(FrontmatterError);
    const { message, problems, file } = error as FrontmatterError;
    expect(file).toBe(FILE);
    expect(message).toContain(FILE);
    expect(problems).toHaveLength(4);
    expect(message).toContain('missing required key "role"');
    expect(message).toContain('"path" must be one of engineering, leadership');
    expect(message).toContain('"wizardry"');
    expect(message).toContain('"type" must be "work" to match its directory');
  });

  it("rejects unknown keys", () => {
    expect(problemsOf(() => parseFrontmatter("work", { ...work, tags: ["x"] }, FILE))).toEqual([
      'unknown key "tags"',
    ]);
    // Keys that shadow Object.prototype members are still unknown.
    expect(problemsOf(() => parseFrontmatter("work", { ...work, constructor: "x", toString: "y" }, FILE))).toEqual([
      'unknown key "constructor"',
      'unknown key "toString"',
    ]);
    // `listed` and `pdf` are personal-only.
    expect(problemsOf(() => parseFrontmatter("work", { ...work, listed: false }, FILE))).toEqual([
      'unknown key "listed"',
    ]);
  });

  it("reports every required key when there is no frontmatter", () => {
    expect(problemsOf(() => parseFrontmatter("work", undefined, FILE))).toEqual(
      ["type", "title", "path", "summary", "role", "capabilities"].map((k) => `missing required key "${k}"`)
    );
    expect(problemsOf(() => parseFrontmatter("personal", null, FILE))).toHaveLength(3);
  });

  it("rejects a non-mapping document", () => {
    expect(problemsOf(() => parseFrontmatter("work", ["a"], FILE))).toHaveLength(1);
  });

  it.each([
    ["slug", "Not_Kebab"],
    ["date", "2026-2-1"],
    ["date", "2026-02-30"],
    ["featured", 0],
    ["featured", 1.5],
    ["featured", "1"],
    ["capabilities", []],
    ["draft", "yes"],
    ["title", ""],
    ["highlight", "A headline."],
    ["highlight", {}],
    ["highlight", { headline: "" }],
    ["highlight", { headline: "H.", unit: "syncs a day" }],
    ["highlight", { headline: "H.", metric: "" }],
    ["highlight", { headline: "H.", metric: 4500 }],
    ["highlight", { headline: "H.", kicker: "x" }],
    ["hero", "engineering/pipeline.webp"],
    ["hero", { src: "engineering/pipeline.webp" }],
    ["hero", { src: "engineering/pipeline.webp", alt: "" }],
    ["hero", { src: "engineering/pipeline.webp", alt: "A.", width: 10 }],
    ["hero", { src: "../pipeline.webp", alt: "A." }],
    ["hero", { src: "engineering/../../x.webp", alt: "A." }],
    ["hero", { src: "/engineering/pipeline.webp", alt: "A." }],
    ["hero", { src: "engineering\\pipeline.webp", alt: "A." }],
    ["hero", { src: "engineering/pipeline.jpg", alt: "A." }],
    ["hero", { src: "engineering/my pipeline.webp", alt: "A." }],
    ["hero", { src: "Engineering/Pipeline.webp", alt: "A." }],
    ["hero", { src: "./engineering/pipeline.webp", alt: "A." }],
    ["hero", { src: "engineering//pipeline.webp", alt: "A." }],
    ["hero", { src: "engineering/x?raw.webp", alt: "A." }],
    ["hero", { src: "C:/engineering/pipeline.webp", alt: "A." }],
  ])("rejects work %s = %j", (key, value) => {
    expect(problemsOf(() => parseFrontmatter("work", { ...work, [key]: value }, FILE))).toHaveLength(1);
  });

  it.each([
    ["links", [{ label: "Site", href: "http://example.com" }]],
    ["links", [{ label: "", href: "https://example.com" }]],
    ["links", [{ label: "Site", href: "https://example.com", rel: "x" }]],
    ["links", "https://example.com"],
    ["pdf", "/downloads/Care Guide.pdf"],
    ["pdf", "/files/care-guide.pdf"],
    ["listed", "no"],
  ])("rejects personal %s = %j", (key, value) => {
    expect(problemsOf(() => parseFrontmatter("personal", { ...personal, [key]: value }, FILE))).toHaveLength(1);
  });
});
