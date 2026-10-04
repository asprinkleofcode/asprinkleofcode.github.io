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
    const data = { ...work, slug: "bar", date: "2026-02-28", hero: "/hero.png", featured: 1, draft: false };
    expect(parseFrontmatter("work", data, FILE)).toEqual(data);
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
