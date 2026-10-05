import type { MDXModule } from "mdx/types";
import { PERSONAL_PATH, type Frontmatter, type PersonalPath, type WorkPath } from "./frontmatter";

/**
 * Content registry (AD-1, AD-6): every non-draft entry's frontmatter is
 * indexed eagerly; bodies load lazily, each in its own chunk. Validation
 * already happened at build time in `plugins/contentFrontmatter.ts`; drafts
 * arrive here as `null` frontmatter and are skipped.
 */

export type EntryPath = WorkPath | PersonalPath;

export interface Entry {
  /** `type/path/slug`, e.g. `work/engineering/foo` or `personal/beyond/bar`. */
  key: string;
  path: EntryPath;
  slug: string;
  frontmatter: Frontmatter;
  /** Glob key of the source file; used to find the lazy body. */
  file: string;
  /** Unlisted entries are reachable by `getEntry` but absent from path indexes. */
  listed: boolean;
}

export type BodyLoader = () => Promise<MDXModule>;

function compareEntries(a: Entry, b: Entry): number {
  const fa = a.frontmatter.featured ?? Number.POSITIVE_INFINITY;
  const fb = b.frontmatter.featured ?? Number.POSITIVE_INFINITY;
  if (fa !== fb) return fa < fb ? -1 : 1;
  const da = a.frontmatter.date ?? "";
  const db = b.frontmatter.date ?? "";
  if (da !== db) return da > db ? -1 : 1;
  return a.frontmatter.title.localeCompare(b.frontmatter.title, "en");
}

/**
 * Builds the sorted index: `featured` ascending (unfeatured last), then `date`
 * descending (undated last), then `title`. Throws when two files resolve to
 * the same key or a file has no body loader.
 */
export function buildIndex(
  frontmatters: Record<string, Frontmatter | null>,
  bodies: Record<string, BodyLoader>
): Entry[] {
  const byKey = new Map<string, Entry>();

  for (const [file, frontmatter] of Object.entries(frontmatters)) {
    if (frontmatter === null) continue;
    if (!bodies[file]) throw new Error(`Content registry: no body loader for ${file}`);

    const slug = frontmatter.slug ?? file.split("/").pop()!.replace(/\.mdx$/, "");
    const path: EntryPath = frontmatter.type === "work" ? frontmatter.path : PERSONAL_PATH;
    const key = `${frontmatter.type}/${path}/${slug}`;

    const existing = byKey.get(key);
    if (existing) {
      throw new Error(`Content registry: duplicate key "${key}" from ${existing.file} and ${file}`);
    }
    byKey.set(key, {
      key,
      path,
      slug,
      frontmatter,
      file,
      listed: frontmatter.type === "personal" ? frontmatter.listed : true,
    });
  }

  return [...byKey.values()].sort(compareEntries);
}

const frontmatterModules = import.meta.glob<Frontmatter | null>("../content/**/*.mdx", {
  eager: true,
  query: "?frontmatter",
  import: "frontmatter",
});
const bodyModules = import.meta.glob<MDXModule>("../content/**/*.mdx");

export const entries: readonly Entry[] = buildIndex(frontmatterModules, bodyModules);

/** Listed entries for one path, in index order. */
export function getPathEntries(path: EntryPath, index: readonly Entry[] = entries): Entry[] {
  return index.filter((entry) => entry.path === path && entry.listed);
}

/**
 * The path's homepage highlight: its first listed entry with `featured` set.
 * The index is sorted `featured` ascending, so that is the lowest number.
 */
export function getFeaturedEntry(path: EntryPath, index: readonly Entry[] = entries): Entry | undefined {
  return index.find((entry) => entry.path === path && entry.listed && entry.frontmatter.featured !== undefined);
}

/** Any non-draft entry, listed or not. */
export function getEntry(path: EntryPath, slug: string, index: readonly Entry[] = entries): Entry | undefined {
  return index.find((entry) => entry.path === path && entry.slug === slug);
}

/** Loads an entry's body chunk; the module's `default` is the MDX component. */
export function loadBody(entry: Entry): Promise<MDXModule> {
  return bodyModules[entry.file]();
}
