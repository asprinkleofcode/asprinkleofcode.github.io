// Integration fixture: the same globs and options as src/lib/registry.ts.
import type { MDXModule } from "mdx/types";
import type { Frontmatter } from "../../../../../src/lib/frontmatter";

export const frontmatters = import.meta.glob<Frontmatter | null>("../content/**/*.mdx", {
  eager: true,
  query: "?frontmatter",
  import: "frontmatter",
});
export const bodies = import.meta.glob<MDXModule>("../content/**/*.mdx");
