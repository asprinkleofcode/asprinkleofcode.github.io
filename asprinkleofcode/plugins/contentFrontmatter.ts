import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { parse as parseYaml } from "yaml";
import {
  FrontmatterError,
  KEBAB_CASE,
  isContentType,
  parseFrontmatter,
  type Frontmatter,
} from "../src/lib/frontmatter";

/**
 * Validates and splits frontmatter for `src/content/<type>/*.mdx` (AD-1, 2, 5, 6).
 *
 * - `<file>.mdx?frontmatter` resolves to a virtual module exporting
 *   `frontmatter` (validated JSON, or `null` for drafts). Its own module id
 *   keeps eager frontmatter imports from pulling bodies into the entry chunk,
 *   and the `\0` prefix keeps MDX and React plugins off it.
 * - `<file>.mdx` has its frontmatter blanked (line numbers kept) before MDX
 *   compiles it; a draft's body is emptied so none of it ships.
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
  fileExists?: (file: string) => boolean;
}

function splitFrontmatter(source: string): { yaml: string | null; body: string } {
  const match = FENCE.exec(source);
  if (!match || match.index !== 0) return { yaml: null, body: source };
  const blank = match[0].replace(/[^\n]/g, "");
  return { yaml: match[1], body: blank + source.slice(match[0].length) };
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
  if (problems.length === 0 && !draft && "pdf" in frontmatter && frontmatter.pdf) {
    const exists = options.fileExists ?? existsSync;
    if (!exists(path.join(options.publicDir, frontmatter.pdf))) {
      problems.push(`"pdf" file public${frontmatter.pdf} does not exist`);
    }
  }
  if (problems.length > 0) throw new FrontmatterError(display, problems);

  return draft ? { frontmatter: null, draft, body: "" } : { frontmatter, draft, body };
}

export default function contentFrontmatter(): Plugin {
  let contentDir = "";
  let publicDir = "";

  const isContentFile = (file: string) =>
    file.endsWith(".mdx") && path.resolve(file).startsWith(contentDir + path.sep);

  const processFile = (file: string, source: string) => {
    try {
      return processContentFile(file, source, { contentDir, publicDir });
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
      return `export const frontmatter = ${JSON.stringify(frontmatter)};\n`;
    },

    transform(code, id) {
      const file = id.split("?")[0];
      if (id.startsWith("\0") || !isContentFile(file)) return null;
      return { code: processFile(file, code).body, map: null };
    },
  };
}
