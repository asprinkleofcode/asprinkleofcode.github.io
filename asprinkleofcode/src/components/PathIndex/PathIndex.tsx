import { Link } from "react-router";
import type { Entry } from "../../lib/registry";
import { textLinkClasses } from "../../lib/linkClasses";
import { entryHref } from "../../lib/paths";
import "./PathIndex.css";

interface PathIndexProps {
  /** The path's decided label, rendered as the page's only h1. */
  title: string;
  /** Listed entries for the path, already in registry order. */
  entries: readonly Entry[];
}

/**
 * One path's story index (EXPERIENCE §14 Missing Content): a graceful empty
 * state with zero entries, otherwise each entry's frontmatter title (linking to
 * its story) and summary, in the order given. Story 2.3 swaps the list item for
 * a Story Card; the pages that render this stay unchanged.
 */
export default function PathIndex({ title, entries }: PathIndexProps) {
  return (
    <section className="path-index mx-auto max-w-3xl px-4 py-12">
      <h1 className="type-section text-text-primary">{title}</h1>
      {entries.length === 0 ? (
        <p className="type-body mt-4 text-text-secondary">No stories published yet.</p>
      ) : (
        <ul className="mt-6 flex flex-col">
          {entries.map((entry) => (
            <li key={entry.key} className="border-t border-border-default py-4.5 last:border-b">
              <Link to={entryHref(entry)} className={`type-story ${textLinkClasses}`}>
                {entry.frontmatter.title}
              </Link>
              <p className="type-body mt-1 text-text-secondary">{entry.frontmatter.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
