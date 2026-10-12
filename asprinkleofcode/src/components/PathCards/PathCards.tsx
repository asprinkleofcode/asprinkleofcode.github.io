import { useId } from "react";
import type { EntryPath, Entry } from "../../lib/registry";
import { EXPLORATION_PATHS } from "../../lib/paths";
import PathCard from "../PathCard/PathCard";

interface PathCardsProps {
  /** Each path's featured entries in index order (`getFeaturedEntries`). */
  slides: Record<EntryPath, readonly Entry[]>;
}

/**
 * Homepage path cards (UX-031): always all three paths, in the decided order,
 * named by a visually hidden "Explore" heading. Cards stack on mobile and sit
 * in three columns from `md`.
 */
export default function PathCards({ slides }: PathCardsProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="mx-auto max-w-5xl px-4 pb-12 md:pb-18">
      <h2 id={headingId} className="sr-only">
        Explore
      </h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {EXPLORATION_PATHS.map(({ path, label, description }) => (
          <li key={path} className="flex *:grow">
            <PathCard label={label} description={description} slides={slides[path]} />
          </li>
        ))}
      </ul>
    </section>
  );
}
