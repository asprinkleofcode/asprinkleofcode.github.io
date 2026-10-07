import { useId } from "react";
import { Link } from "react-router";
import { EXPLORATION_PATHS } from "../../lib/paths";
import { focusRing } from "../../theme/aSprinkleOfCodeTheme";

/**
 * Homepage Exploration (EXPERIENCE §6.3): the three path entries, label-only,
 * always all three. A recessed band with an "Explore" kicker; tiles stack on
 * mobile and sit in three columns from `md`.
 */
export default function ExplorationPaths() {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className="exploration-paths border-y border-border-default bg-background-recessed"
    >
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <h2 id={headingId} className="type-supporting mb-3.5">
          Explore
        </h2>
        <ul className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
          {EXPLORATION_PATHS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`group type-story flex h-full items-center justify-between gap-2.5 rounded-default border border-border-essential bg-background-primary px-5 py-4.5 text-text-primary hover:bg-background-secondary ${focusRing}`}
              >
                {/* Underline the label only, not the decorative arrow. */}
                <span className="underline-offset-4 group-hover:underline group-focus-visible:underline">{label}</span>
                <span aria-hidden="true" className="text-accent-secondary">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
