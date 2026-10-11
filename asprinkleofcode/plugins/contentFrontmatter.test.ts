import path from "node:path";
import { describe, expect, it } from "vitest";
import { FrontmatterError } from "../src/lib/frontmatter";
import contentFrontmatter, { featuredClash, featuredSlot, processContentFile, type FeaturedSlot } from "./contentFrontmatter";

const root = path.resolve("/project");
const contentDir = path.join(root, "src", "content");
const publicDir = path.join(root, "public");
const mediaDir = path.join(root, "src", "assets", "media");
const existing = new Set([
  path.join(publicDir, "downloads", "care-guide.pdf"),
  path.join(mediaDir, "engineering", "pipeline.webp"),
]);
const options = { contentDir, publicDir, mediaDir, fileExists: (file: string) => existing.has(file) };

const file = (relative: string) => path.join(contentDir, ...relative.split("/"));

const WORK = `---
type: work
title: Foo
path: engineering
summary: A summary.
role: Tech lead
capabilities: [ownership]
---

<StorySection section="context">Foo body</StorySection>
<StorySection section="decision">D</StorySection>
<StorySection section="outcome">O</StorySection>
`;

function problemsOf(relative: string, source: string): string[] {
  try {
    processContentFile(file(relative), source, options);
  } catch (error) {
    expect(error).toBeInstanceOf(FrontmatterError);
    expect((error as Error).message).toContain(`src/content/${relative}`);
    return (error as FrontmatterError).problems;
  }
  throw new Error("expected a FrontmatterError");
}

describe("processContentFile", () => {
  it("returns validated frontmatter and blanks it in the body, keeping line numbers", () => {
    const result = processContentFile(file("work/foo.mdx"), WORK, options);
    expect(result.frontmatter).toMatchObject({ type: "work", path: "engineering", title: "Foo" });
    expect(result.draft).toBe(false);
    expect(result.body).toBe("\n".repeat(8) + WORK.slice(WORK.indexOf("\n<StorySection")));
    expect(result.body.split("\n")).toHaveLength(WORK.split("\n").length);
  });

  it("handles CRLF line endings and a BOM", () => {
    const result = processContentFile(file("work/foo.mdx"), "\uFEFF" + WORK.replace(/\n/g, "\r\n"), options);
    expect(result.frontmatter).toMatchObject({ title: "Foo" });
    expect(result.body).not.toContain("type: work");
    expect(result.body).toContain("Foo body");
  });

  it("accepts a kebab-case slug override and rejects a non-kebab one", () => {
    expect(
      processContentFile(file("work/foo.mdx"), WORK.replace("type: work", "type: work\nslug: bar"), options).frontmatter
    ).toMatchObject({ slug: "bar" });
    expect(problemsOf("work/foo.mdx", WORK.replace("type: work", "type: work\nslug: Bar_Baz"))).toHaveLength(1);
  });

  it("rejects a non-kebab file name without a slug override", () => {
    expect(problemsOf("work/My Story.mdx", WORK)).toEqual([
      'file name "My Story" is not kebab-case; rename it or set "slug"',
    ]);
  });

  it("lists every missing or invalid key", () => {
    const source = WORK.replace("role: Tech lead\n", "")
      .replace("path: engineering", "path: other")
      .replace("[ownership]", "[ownership, wizardry]")
      .replace("type: work", "type: personal");
    expect(problemsOf("work/foo.mdx", source)).toHaveLength(4);
  });

  it("rejects unknown keys", () => {
    expect(problemsOf("work/foo.mdx", WORK.replace("type: work", "type: work\ntags: [a, b]"))).toEqual([
      'unknown key "tags"',
    ]);
  });

  it("fails a file with no frontmatter on missing required keys", () => {
    const problems = problemsOf("work/foo.mdx", "# Just a body\n");
    expect(problems).toContain('missing required key "title"');
    expect(problems.every((p) => p.startsWith("missing required key"))).toBe(true);
  });

  it("reports invalid YAML", () => {
    expect(problemsOf("work/foo.mdx", "---\ntitle: [unclosed\n---\n")[0]).toMatch(/not valid YAML/);
  });

  it("returns null frontmatter and an empty body for drafts", () => {
    const source = WORK.replace("type: work", "type: work\ndraft: true") + "\nDRAFT-MARKER\n";
    expect(processContentFile(file("work/foo.mdx"), source, options)).toEqual({
      frontmatter: null,
      draft: true,
      body: "",
    });
  });

  it("requires a non-draft pdf to exist under public/downloads/", () => {
    const personal = (pdf: string, extra = "") =>
      `---\ntype: personal\ntitle: Care\nsummary: Guide.\npdf: ${pdf}\n${extra}---\n`;
    expect(processContentFile(file("personal/care.mdx"), personal("/downloads/care-guide.pdf"), options).frontmatter)
      .toMatchObject({ pdf: "/downloads/care-guide.pdf", listed: true });
    expect(problemsOf("personal/care.mdx", personal("/downloads/missing.pdf"))).toEqual([
      '"pdf" file public/downloads/missing.pdf does not exist',
    ]);
    expect(
      processContentFile(file("personal/care.mdx"), personal("/downloads/missing.pdf", "draft: true\n"), options)
        .frontmatter
    ).toBeNull();
  });

  it("requires a non-draft hero to exist under src/assets/media/", () => {
    const withHero = (src: string, extra = "") =>
      WORK.replace("type: work", `type: work\nhero:\n  src: ${src}\n  alt: The pipeline.\n${extra}`);
    expect(processContentFile(file("work/foo.mdx"), withHero("engineering/pipeline.webp"), options).frontmatter)
      .toMatchObject({ hero: { src: "engineering/pipeline.webp", alt: "The pipeline." } });
    expect(problemsOf("work/foo.mdx", withHero("engineering/missing.webp"))).toEqual([
      '"hero.src" file src/assets/media/engineering/missing.webp does not exist',
    ]);
    expect(
      processContentFile(file("work/foo.mdx"), withHero("engineering/missing.webp", "draft: true"), options).frontmatter
    ).toBeNull();
  });

  it.each(["other/x.mdx", "x.mdx"])("rejects a file outside a known type directory: %s", (relative) => {
    expect(problemsOf(relative, WORK)[0]).toMatch(/unknown content type/);
  });

  it("rejects files nested below a type directory", () => {
    expect(problemsOf("work/a/foo.mdx", WORK)[0]).toMatch(
      /nested folders are not allowed; content files live directly in src\/content\/work\/ or src\/content\/personal\//
    );
  });
});

describe("work story body structure (AD-3)", () => {
  const FRONTMATTER = WORK.slice(0, WORK.indexOf("\n<StorySection") + 1);
  const section = (name: string, quote = '"') => `<StorySection section=${quote}${name}${quote}>Text</StorySection>\n`;
  const withBody = (body: string) => FRONTMATTER + body;

  it("accepts the required sections with optional ones in canonical order, either quote style", () => {
    const body = ["context", "problem", "decision", "tradeoffs", "outcome", "reflection"]
      .map((name, i) => section(name, i % 2 ? "'" : '"'))
      .join("\n### A subheading\n\n");
    expect(processContentFile(file("work/foo.mdx"), withBody(body), options).frontmatter).not.toBeNull();
  });

  it("names every missing required section", () => {
    expect(problemsOf("work/foo.mdx", withBody(section("context")))).toEqual([
      "missing required story section(s): decision, outcome",
    ]);
  });

  it("rejects sections out of canonical order", () => {
    const problems = problemsOf("work/foo.mdx", withBody(section("decision") + section("context") + section("outcome")));
    expect(problems).toEqual([expect.stringContaining("must follow the order")]);
    expect(problems[0]).toContain("(got decision, context, outcome)");
  });

  it("rejects a repeated section", () => {
    expect(
      problemsOf("work/foo.mdx", withBody(section("context") + section("context") + section("decision") + section("outcome")))
    ).toEqual(['story section "context" appears more than once']);
  });

  it.each([
    ["an expression", "<StorySection section={name}>"],
    ["no section", "<StorySection>"],
    ["an extra attribute", '<StorySection section="context" id="x">'],
  ])("requires a literal section attribute, not %s", (_, tag) => {
    expect(problemsOf("work/foo.mdx", withBody(`${tag}T</StorySection>\n` + WORK.slice(FRONTMATTER.length)))).toEqual([
      expect.stringContaining('must have exactly one literal section="…" attribute'),
    ]);
  });

  it("rejects an unknown section name", () => {
    expect(problemsOf("work/foo.mdx", WORK + section("summary"))).toEqual([
      expect.stringContaining('unknown story section "summary"'),
    ]);
  });

  it.each([
    ["a markdown h1", "# Heading\n"],
    ["an indented markdown h1", "   # Heading\n"],
    ["an empty markdown h1", "\n#\n"],
    ["a setext h1", "\nHeading\n===\n"],
    ["an h1 in a blockquote", "\n> # Heading\n"],
    ["an h1 in a list item", "\n- # Heading\n"],
    ["a JSX h1", "<h1>Heading</h1>\n"],
  ])("rejects %s in the body", (_, h1) => {
    expect(problemsOf("work/foo.mdx", WORK + h1)).toEqual([expect.stringContaining("must not contain an h1")]);
  });

  it.each([
    ["a markdown h2", "\n## Heading\n"],
    ["a JSX h2", "<h2>Heading</h2>\n"],
  ])("rejects %s beside the section headings", (_, h2) => {
    expect(problemsOf("work/foo.mdx", WORK + h2)).toEqual([expect.stringContaining("must not contain its own h2")]);
  });

  it("accepts a self-closing section tag", () => {
    const body = WORK.slice(FRONTMATTER.length).replace("<StorySection section=\"decision\">D</StorySection>", '<StorySection section="decision" />');
    expect(processContentFile(file("work/foo.mdx"), withBody(body), options).frontmatter).not.toBeNull();
  });

  it("ignores sections and headings inside code fences, inline code and MDX comments", () => {
    const ignored = [
      '\n```mdx\n# Not a heading\n<StorySection section="context">x</StorySection>\n```\n',
      // A line that starts like the fence but carries an info string does not close it.
      "\n```md\n```js\n# Still code\n```\n",
      '\nMentions `<h1>` and `<StorySection section="context">` in prose.\n',
      "\n{/* # not a heading <StorySection section=\"outcome\"> */}\n",
    ].join("");
    expect(processContentFile(file("work/foo.mdx"), WORK + ignored, options).frontmatter).not.toBeNull();
  });

  it("skips body checks for drafts and personal entries", () => {
    const draft = FRONTMATTER.replace("type: work", "type: work\ndraft: true") + "# Draft\n";
    expect(processContentFile(file("work/foo.mdx"), draft, options).frontmatter).toBeNull();
    const personal = "---\ntype: personal\ntitle: P\nsummary: S.\n---\n\n# Heading\n";
    expect(processContentFile(file("personal/p.mdx"), personal, options).frontmatter).toMatchObject({ title: "P" });
  });
});

describe("featured uniqueness per path", () => {
  const highlight = { headline: "H." };
  const work = (path: "engineering" | "leadership", featured?: number) => ({
    type: "work" as const,
    title: "T",
    path,
    summary: "S.",
    role: "R",
    capabilities: ["ownership" as const],
    featured,
    highlight,
  });
  const seen = new Map<string, FeaturedSlot>([["src/content/work/a.mdx", { path: "engineering", featured: 1 }]]);

  it("maps an entry to its path and featured value, or null", () => {
    expect(featuredSlot(work("leadership", 2))).toEqual({ path: "leadership", featured: 2 });
    expect(featuredSlot({ type: "personal", title: "P", summary: "S.", listed: true, featured: 1, highlight })).toEqual(
      { path: "beyond", featured: 1 }
    );
    expect(featuredSlot(work("engineering"))).toBeNull();
    expect(featuredSlot(null)).toBeNull();
  });

  it("names the other file holding the same featured value in the same path", () => {
    expect(featuredClash(seen, "src/content/work/b.mdx", { path: "engineering", featured: 1 })).toBe(
      "src/content/work/a.mdx"
    );
  });

  it("allows another path, another value, no slot, or the same file reloading", () => {
    expect(featuredClash(seen, "src/content/work/b.mdx", { path: "leadership", featured: 1 })).toBeNull();
    expect(featuredClash(seen, "src/content/work/b.mdx", { path: "engineering", featured: 2 })).toBeNull();
    expect(featuredClash(seen, "src/content/work/b.mdx", null)).toBeNull();
    expect(featuredClash(seen, "src/content/work/a.mdx", { path: "engineering", featured: 1 })).toBeNull();
  });
});

describe("contentFrontmatter plugin hooks", () => {
  type Hook = (this: unknown, ...args: unknown[]) => unknown;

  function setup() {
    const plugin = contentFrontmatter();
    (plugin.configResolved as Hook).call({}, { root, publicDir });
    return plugin;
  }

  it("runs before other plugins", () => {
    expect(setup().enforce).toBe("pre");
  });

  it("transforms content .mdx and ignores everything else", () => {
    const plugin = setup();
    const transform = plugin.transform as Hook;
    const id = file("work/foo.mdx").split(path.sep).join("/");
    expect(transform.call({}, WORK, id)).toMatchObject({ code: expect.stringContaining("Foo body") });
    expect(transform.call({}, WORK, path.join(root, "src", "other.mdx"))).toBeNull();
    expect(transform.call({}, "x", path.join(root, "src", "App.tsx"))).toBeNull();
    expect(() => transform.call({}, WORK.replace("type: work", "type: work\ntags: [a]"), id)).toThrow(
      /src\/content\/work\/foo\.mdx[\s\S]*unknown key "tags"/
    );
  });

  it("ignores modules that are not ?frontmatter requests", async () => {
    const plugin = setup();
    const resolveId = plugin.resolveId as Hook;
    expect(await resolveId.call({}, "./foo.mdx", file("index.ts"))).toBeNull();
    expect(await resolveId.call({}, "./foo.mdx?raw", file("index.ts"))).toBeNull();
    expect((plugin.load as Hook).call({}, file("work/foo.mdx"))).toBeNull();
  });
});
