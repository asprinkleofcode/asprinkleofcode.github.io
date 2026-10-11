import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { parse as parseYaml } from "yaml";
import {
  FrontmatterError,
  KEBAB_CASE,
  PERSONAL_PATH,
  isContentType,
  parseFrontmatter,
  type Frontmatter,
} from "../src/lib/frontmatter";
import { REQUIRED_STORY_SECTIONS, STORY_SECTION_ORDER, type StorySectionName } from "../src/lib/storySections";

/**
 * Validates and splits frontmatter for `src/content/<type>/*.mdx` (AD-1, 2, 5, 6).
 *
 * - `<file>.mdx?frontmatter` resolves to a virtual module exporting
 *   `frontmatter` (validated JSON, or `null` for drafts). Its own module id
 *   keeps eager frontmatter imports from pulling bodies into the entry chunk,
 *   and the `\0` prefix keeps MDX and React plugins off it.
 * - `<file>.mdx` has its frontmatter blanked (line numbers kept) before MDX
 *   compiles it; a draft's body is emptied so none of it ships.
 * - A non-draft work story's body must follow the AD-3 section rules
 *   (`storyBodyProblems`), or the build fails naming the file.
 * - A non-draft entry's `hero.src` must exist under `src/assets/media/`, and
 *   no two non-draft entries in one path may share a `featured` value
 *   (`featuredClash`); either failure names the file(s).
 */

const QUERY = "frontmatter";
const VIRTUAL_PREFIX = "\0content-frontmatter:";
const FENCE = /^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n?^---[ \t]*(?:\r?\n|$)/m;

export interface ProcessedContent {
  /** `null` for drafts. */
  frontmatter: Frontmatter | null;
  draft: boolean;
  /** MDX source with frontmatter blanked; empty for drafts. */
  body: string;
}

export interface ProcessOptions {
  /** Absolute `src/content` directory. */
  contentDir: string;
  /** Absolute Vite `publicDir`. */
  publicDir: string;
  /** Absolute `src/assets/media`; `hero.src` resolves inside it. */
  mediaDir: string;
  fileExists?: (file: string) => boolean;
}

/** Where a non-draft featured entry sits: its path and `featured` value. */
export interface FeaturedSlot {
  path: string;
  featured: number;
}

export function featuredSlot(frontmatter: Frontmatter | null): FeaturedSlot | null {
  if (frontmatter === null || frontmatter.featured === undefined) return null;
  return {
    path: frontmatter.type === "work" ? frontmatter.path : PERSONAL_PATH,
    featured: frontmatter.featured,
  };
}

/**
 * The other file already holding `slot` (same path, same `featured`), or null.
 * `featured` picks each path's homepage highlight, so a tie would be broken
 * silently by the registry's date/title order.
 */
export function featuredClash(
  seen: ReadonlyMap<string, FeaturedSlot>,
  file: string,
  slot: FeaturedSlot | null
): string | null {
  if (slot === null) return null;
  for (const [other, taken] of seen) {
    if (other !== file && taken.path === slot.path && taken.featured === slot.featured) return other;
  }
  return null;
}

function splitFrontmatter(source: string): { yaml: string | null; body: string } {
  const match = FENCE.exec(source);
  if (!match || match.index !== 0) return { yaml: null, body: source };
  const blank = match[0].replace(/[^\n]/g, "");
  return { yaml: match[1], body: blank + source.slice(match[0].length) };
}

// A closing fence repeats the opening run (or a longer one) with nothing after it.
const CODE_FENCE = /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[`~]*[ \t]*$/gm;
const INLINE_CODE = /`[^`\n]*`/g;
const MDX_COMMENT = /\{\/\*[\s\S]*?\*\/\}/g;
// An ATX heading, optionally behind blockquote or list markers.
const ATX_H1 = /^ {0,3}(?:(?:>|[*+-]|\d+[.)])[ \t]*)*#(?:[ \t]|$)/m;
const ATX_H2 = /^ {0,3}(?:(?:>|[*+-]|\d+[.)])[ \t]*)*##(?:[ \t]|$)/m;
// A paragraph line underlined with `=`.
const SETEXT_H1 = /^ {0,3}\S[^\n]*\n {0,3}=+[ \t]*$/m;
const STORY_SECTION_TAG = /<StorySection\b([^>]*)>/g;
const LITERAL_SECTION = /^\s*section=(?:"([^"]*)"|'([^']*)')\s*\/?\s*$/;

/**
 * A work story's body structure (AD-3, AD-15): every `<StorySection>` names a
 * literal section, sections follow the canonical order without repeats,
 * Context, Decision and Outcome are present, and nothing competes with the
 * page's one `<h1>` (the story title) or the section `<h2>`s. Code fences,
 * inline code and MDX comments are ignored.
 */
export function storyBodyProblems(body: string): string[] {
  const source = body.replace(CODE_FENCE, "").replace(MDX_COMMENT, "").replace(INLINE_CODE, "");
  const problems: string[] = [];
  const seen: StorySectionName[] = [];

  for (const [, attributes] of source.matchAll(STORY_SECTION_TAG)) {
    const literal = LITERAL_SECTION.exec(attributes);
    const name = literal ? (literal[1] ?? literal[2]) : undefined;
    if (name === undefined) {
      problems.push(`<StorySection${attributes}> must have exactly one literal section="…" attribute`);
    } else if (!(STORY_SECTION_ORDER as readonly string[]).includes(name)) {
      problems.push(`unknown story section "${name}"; allowed: ${STORY_SECTION_ORDER.join(", ")}`);
    } else {
      seen.push(name as StorySectionName);
    }
  }

  const duplicates = [...new Set(seen.filter((name, i) => seen.indexOf(name) !== i))];
  for (const name of duplicates) problems.push(`story section "${name}" appears more than once`);
  const order = seen.map((name) => STORY_SECTION_ORDER.indexOf(name));
  if (duplicates.length === 0 && order.some((index, i) => i > 0 && index < order[i - 1])) {
    problems.push(`story sections must follow the order ${STORY_SECTION_ORDER.join(", ")} (got ${seen.join(", ")})`);
  }
  const missing = REQUIRED_STORY_SECTIONS.filter((name) => !seen.includes(name));
  if (missing.length > 0) problems.push(`missing required story section(s): ${missing.join(", ")}`);
  if (ATX_H1.test(source) || SETEXT_H1.test(source) || /<h1\b/.test(source)) {
    problems.push("the body must not contain an h1; the story title is the page's only h1 (use ### for subheadings)");
  }
  if (ATX_H2.test(source) || /<h2\b/.test(source)) {
    problems.push("the body must not contain its own h2; section headings come from <StorySection> (use ### for subheadings)");
  }
  return problems;
}

/** Validates one content file. Throws `FrontmatterError` naming the file and every problem. */
export function processContentFile(file: string, source: string, options: ProcessOptions): ProcessedContent {
  const relative = path.relative(options.contentDir, file).split(path.sep).join("/");
  const display = `src/content/${relative}`;
  const [typeDir, ...rest] = relative.split("/");

  if (rest.length === 0 || !isContentType(typeDir)) {
    throw new FrontmatterError(display, [
      `unknown content type "${rest.length === 0 ? "" : typeDir}"; content files live in src/content/work/ or src/content/personal/`,
    ]);
  }
  if (rest.length > 1) {
    throw new FrontmatterError(display, [
      `nested folders are not allowed; content files live directly in src/content/work/ or src/content/personal/`,
    ]);
  }

  const { yaml, body } = splitFrontmatter(source);
  let data: unknown;
  if (yaml !== null) {
    try {
      data = parseYaml(yaml);
    } catch (error) {
      throw new FrontmatterError(display, [`frontmatter is not valid YAML: ${(error as Error).message}`]);
    }
  }

  let frontmatter: Frontmatter;
  const problems: string[] = [];
  try {
    frontmatter = parseFrontmatter(typeDir, data, display);
  } catch (error) {
    if (!(error instanceof FrontmatterError)) throw error;
    problems.push(...error.problems);
    frontmatter = (data ?? {}) as Frontmatter;
  }

  const draft = frontmatter.draft === true;
  const basename = path.basename(file, ".mdx");
  if (frontmatter.slug === undefined && !KEBAB_CASE.test(basename)) {
    problems.push(`file name "${basename}" is not kebab-case; rename it or set "slug"`);
  }
  const exists = options.fileExists ?? existsSync;
  if (problems.length === 0 && !draft && "pdf" in frontmatter && frontmatter.pdf) {
    if (!exists(path.join(options.publicDir, frontmatter.pdf))) {
      problems.push(`"pdf" file public${frontmatter.pdf} does not exist`);
    }
  }
  if (problems.length === 0 && !draft && frontmatter.hero) {
    if (!exists(path.join(options.mediaDir, ...frontmatter.hero.src.split("/")))) {
      problems.push(`"hero.src" file src/assets/media/${frontmatter.hero.src} does not exist`);
    }
  }
  if (problems.length === 0 && !draft && frontmatter.type === "work") {
    problems.push(...storyBodyProblems(body));
  }
  if (problems.length > 0) throw new FrontmatterError(display, problems);

  return draft ? { frontmatter: null, draft, body: "" } : { frontmatter, draft, body };
}

export default function contentFrontmatter(): Plugin {
  let contentDir = "";
  let publicDir = "";
  let mediaDir = "";
  // Every loaded non-draft featured entry, keyed by display path, for the cross-file `featured` check.
  const featuredSlots = new Map<string, FeaturedSlot>();

  const isContentFile = (file: string) =>
    file.endsWith(".mdx") && path.resolve(file).startsWith(contentDir + path.sep);
  const displayPath = (file: string) =>
    `src/content/${path.relative(contentDir, file).split(path.sep).join("/")}`;

  const processFile = (file: string, source: string) => {
    try {
      return processContentFile(file, source, { contentDir, publicDir, mediaDir });
    } catch (error) {
      if (error instanceof FrontmatterError) {
        // Drop Vite's stack noise; the message already names the file and every problem.
        error.stack = error.message;
      }
      throw error;
    }
  };

  return {
    name: "content-frontmatter",
    enforce: "pre",

    configResolved(config) {
      contentDir = path.resolve(config.root, "src/content");
      publicDir = config.publicDir;
      mediaDir = path.resolve(config.root, "src/assets/media");
      // The plugin instance can be reused for another root (the integration tests share vite.config's plugins).
      featuredSlots.clear();
    },

    watchChange(id, change) {
      if (change.event === "delete" && isContentFile(id)) featuredSlots.delete(displayPath(id));
    },

    async resolveId(source, importer) {
      const [bare, query] = source.split("?");
      if (query === undefined || !new URLSearchParams(query).has(QUERY)) return null;
      const resolved = await this.resolve(bare, importer, { skipSelf: true });
      if (!resolved || !isContentFile(resolved.id.split("?")[0])) return null;
      return VIRTUAL_PREFIX + resolved.id.split("?")[0];
    },

    load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) return null;
      const file = id.slice(VIRTUAL_PREFIX.length);
      this.addWatchFile(file);
      const { frontmatter } = processFile(file, readFileSync(file, "utf8"));
      const display = displayPath(file);
      const slot = featuredSlot(frontmatter);
      const clash = featuredClash(featuredSlots, display, slot);
      if (slot && clash) {
        const error = new FrontmatterError(display, [
          `"featured: ${slot.featured}" is already used by ${clash} in the ${slot.path} path; each featured value must be unique per path`,
        ]);
        error.stack = error.message;
        throw error;
      }
      if (slot) featuredSlots.set(display, slot);
      else featuredSlots.delete(display);
      return `export const frontmatter = ${JSON.stringify(frontmatter)};\n`;
    },

    transform(code, id) {
      const file = id.split("?")[0];
      if (id.startsWith("\0") || !isContentFile(file)) return null;
      return { code: processFile(file, code).body, map: null };
    },
  };
}
