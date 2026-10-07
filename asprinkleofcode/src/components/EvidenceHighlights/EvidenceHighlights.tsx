import { useId } from "react";
import { Link } from "react-router";
import type { Entry } from "../../lib/registry";
import { textLinkClasses } from "../../lib/linkClasses";
import { entryHref, pathLabel } from "../../lib/paths";

interface EvidenceHighlightsProps {
  engineering?: Entry;
  leadership?: Entry;
  beyond?: Entry;
}

const rowClasses =
  "grid grid-cols-1 gap-2 border-t border-border-default py-4.5 last:border-b md:grid-cols-[12.5rem_1fr] md:items-baseline md:gap-5";

/** A professional evidence teaser: path label, then the story title (linked) over its summary. */
function EvidenceRow({ entry }: { entry: Entry }) {
  return (
    <li className={rowClasses}>
      <span className="type-supporting">{pathLabel(entry.path)}</span>
      <div>
        <Link to={entryHref(entry)} className={`type-story ${textLinkClasses}`}>
          {entry.frontmatter.title}
        </Link>
        <p className="type-body mt-1 text-text-secondary">{entry.frontmatter.summary}</p>
      </div>
    </li>
  );
}

/**
 * Homepage Evidence & Highlights (EXPERIENCE §6.4): one teaser per professional
 * path and one personal-dimension hint for Beyond the Code (a personality
 * signal, not evidence; UX-007). Text comes only from frontmatter. A slot with
 * no entry is omitted, and with no entries at all the section, heading
 * included, is not rendered (EXPERIENCE §14 Missing Content).
 */
export default function EvidenceHighlights({ engineering, leadership, beyond }: EvidenceHighlightsProps) {
  const headingId = useId();
  if (!engineering && !leadership && !beyond) return null;

  return (
    <section aria-labelledby={headingId} className="evidence-highlights mx-auto max-w-5xl px-4 py-10 md:py-14">
      <h2 id={headingId} className="type-supporting mb-3.5">
        Highlights
      </h2>
      <ul className="flex flex-col">
        {engineering && <EvidenceRow entry={engineering} />}
        {leadership && <EvidenceRow entry={leadership} />}
        {beyond && (
          <li className={rowClasses}>
            <span className="type-supporting">{pathLabel(beyond.path)}</span>
            <div>
              <Link to={entryHref(beyond)} className={`type-body ${textLinkClasses}`}>
                {beyond.frontmatter.summary}
              </Link>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
}
