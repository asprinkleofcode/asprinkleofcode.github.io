// @vitest-environment node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { findColorViolations } from "../src/test/semanticTokenRules";

/*
 * AD-10 gate for story bodies, beside src/test/semanticTokens.test.ts. Stories
 * are read from disk rather than through `import.meta.glob(…?raw)`, which
 * would run them through the content and MDX plugins.
 */

const contentDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/content");

function storyFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return storyFiles(full);
    return entry.name.endsWith(".mdx") ? [full] : [];
  });
}

// Prose can say "PR #123" or "ticket #4500", so a story is scanned only where colour can live:
// className/class/style and SVG colour attribute values.
const STORY_COLOR_ATTRIBUTE =
  /(?<![\w-])(?:className|class|style|fill|stroke|color)=(?:"[^"]*"|'[^']*'|\{\{[\s\S]*?\}\}|\{[^{}]*\})/g;
const storyMarkup = (source: string) => [...source.matchAll(STORY_COLOR_ATTRIBUTE)].map((m) => m[0]).join("\n");

describe("AD-10 semantic tokens in story bodies", () => {
  it("finds no primitive, raw colour or palette utility in story markup", () => {
    const offenders = storyFiles(contentDir).flatMap((file) => {
      const relative = path.relative(contentDir, file).split(path.sep).join("/");
      return findColorViolations(storyMarkup(readFileSync(file, "utf8"))).map((v) => `src/content/${relative}: ${v}`);
    });
    expect(offenders).toEqual([]);
  });

  it("scans story markup, not prose", () => {
    const story =
      'summary: Shipped in PR #123.\n\nTicket #4500 and #add.\n\n<span className="text-red-500" style={{ color: "#fff" }} />\n<path fill="#E48FB1" />';
    expect(findColorViolations(storyMarkup(story))).toEqual(["text-red-500", "#fff", "#E48FB1"]);
  });

  it("finds story files in nested folders", () => {
    const fixtures = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "__fixtures__/valid/src/content");
    expect(storyFiles(fixtures).map((file) => path.basename(file)).sort()).toEqual([
      "draft-work.mdx",
      "valid-personal.mdx",
      "valid-work.mdx",
    ]);
  });
});
