import type { Entry } from "../../lib/registry";
import { entryHref } from "../../lib/paths";
import StoryCard from "../StoryCard/StoryCard";

interface PathIndexProps {
  /** The path's decided label, rendered as the page's only h1. */
  title: string;
  /** Listed entries for the path, already in registry order. */
  entries: readonly Entry[];
}

/**
 * One path's story index (EXPERIENCE §14 Missing Content, DESIGN §12): a
 * graceful empty state with zero entries, otherwise one Story Card per entry
 * in the order given (never re-sorted here). Cards carry their own border, so
 * the list is gapped rather than ruled. A `work` card always shows its role
 * and capability signals; a `personal` card is text-only, with the title and
 * summary and no role, signals or image (A-9, DESIGN §14, Story 4.2).
 */
export default function PathIndex({ title, entries }: PathIndexProps) {
  return (
    <section className="path-index mx-auto max-w-3xl px-4 py-12">
      <h1 className="type-section text-text-primary">{title}</h1>
      {entries.length === 0 ? (
        <p className="type-body mt-4 text-text-secondary">No stories published yet.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {entries.map((entry) => {
            const { key, frontmatter } = entry;
            const href = entryHref(entry);
            return (
              <li key={key}>
                {frontmatter.type === "work" ? (
                  <StoryCard
                    title={frontmatter.title}
                    summary={frontmatter.summary}
                    role={frontmatter.role}
                    capabilities={frontmatter.capabilities}
                    href={href}
                  />
                ) : (
                  <StoryCard title={frontmatter.title} summary={frontmatter.summary} href={href} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
