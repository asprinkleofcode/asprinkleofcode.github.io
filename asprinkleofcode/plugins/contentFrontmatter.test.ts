import path from "node:path";
import { describe, expect, it } from "vitest";
import { FrontmatterError } from "../src/lib/frontmatter";
import contentFrontmatter, { processContentFile } from "./contentFrontmatter";

const root = path.resolve("/project");
const contentDir = path.join(root, "src", "content");
const publicDir = path.join(root, "public");
const existing = new Set([path.join(publicDir, "downloads", "care-guide.pdf")]);
const options = { contentDir, publicDir, fileExists: (file: string) => existing.has(file) };

const file = (relative: string) => path.join(contentDir, ...relative.split("/"));

const WORK = `---
type: work
title: Foo
path: engineering
summary: A summary.
role: Tech lead
capabilities: [ownership]
---

# Foo body
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
    expect(result.body).toBe("\n".repeat(8) + "\n# Foo body\n");
    expect(result.body.split("\n")).toHaveLength(WORK.split("\n").length);
  });

  it("handles CRLF line endings and a BOM", () => {
    const result = processContentFile(file("work/foo.mdx"), "\uFEFF" + WORK.replace(/\n/g, "\r\n"), options);
    expect(result.frontmatter).toMatchObject({ title: "Foo" });
    expect(result.body).not.toContain("type: work");
    expect(result.body).toContain("# Foo body");
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

  it.each(["other/x.mdx", "x.mdx"])("rejects a file outside a known type directory: %s", (relative) => {
    expect(problemsOf(relative, WORK)[0]).toMatch(/unknown content type/);
  });

  it("rejects files nested below a type directory", () => {
    expect(problemsOf("work/a/foo.mdx", WORK)[0]).toMatch(
      /nested folders are not allowed; content files live directly in src\/content\/work\/ or src\/content\/personal\//
    );
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
    expect(transform.call({}, WORK, id)).toMatchObject({ code: expect.stringContaining("# Foo body") });
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
