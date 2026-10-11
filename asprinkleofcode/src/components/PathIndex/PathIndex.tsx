import { Link } from "react-router";
import type { Entry } from "../../lib/registry";
import { textLinkClasses } from "../../lib/linkClasses";
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
 * graceful empty state with zero entries, otherwise the entries in the order
 * given (never re-sorted here). A `work` entry renders as a Story Card, which
 * carries its own border, so the list is gapped rather than ruled. A
 * `personal` entry keeps the title link and summary item until Epic 4 builds
 * the personal card.
 */
export default function PathIndex({ title, entries }: PathIndexProps) {
  const hasCards = entries.some((entry) => entry.frontmatter.type === "work");
  return (
    <section className="path-index mx-auto max-w-3xl px-4 py-12">
      <h1 className="type-section text-text-primary">{title}</h1>
      {entries.length === 0 ? (
        <p className="type-body mt-4 text-text-secondary">No stories published yet.</p>
      ) : (
        <ul className={`mt-6 flex flex-col${hasCards ? " gap-4" : ""}`}>
          {entries.map((entry) => {
            const { key, frontmatter } = entry;
            const href = entryHref(entry);
            if (frontmatter.type === "work") {
              return (
                <li key={key}>
                  <StoryCard
                    title={frontmatter.title}
                    summary={frontmatter.summary}
                    role={frontmatter.role}
                    capabilities={frontmatter.capabilities}
                    href={href}
                  />
                </li>
              );
            }
            return (
              <li key={key} className="border-t border-border-default py-4.5 last:border-b">
                <Link to={href} className={`type-story ${textLinkClasses}`}>
                  {frontmatter.title}
                </Link>
                <p className="type-body mt-1 text-text-secondary">{frontmatter.summary}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
