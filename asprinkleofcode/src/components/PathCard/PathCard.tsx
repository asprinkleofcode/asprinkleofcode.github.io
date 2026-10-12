import { useState } from "react";
import { Button, Card } from "flowbite-react";
import { Link } from "react-router";
import { stretchedLinkClasses } from "../../lib/linkClasses";
import { metricClasses, metricUnitClasses } from "../../lib/metricClasses";
import { entryHref } from "../../lib/paths";
import type { Entry } from "../../lib/registry";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

interface PathCardProps {
  /** The decided path label, e.g. "Leadership & Enablement". */
  label: string;
  /** The path's one-line description, shown only while it has no story. */
  description: string;
  /** The path's featured entries in index order; empty renders "Coming soon". */
  slides: readonly Entry[];
}

/**
 * A homepage path card (UX-031), rendered from frontmatter only (AD-2). A path
 * with featured stories shows the current slide's `highlight` and `summary`
 * and one "Read the story" link; a path with none shows a non-interactive
 * "Coming soon" card. The live or soon state comes from `slides`, never a flag.
 */
export default function PathCard({ label, description, slides }: PathCardProps) {
  if (slides.length === 0) return <SoonCard label={label} description={description} />;
  return <LiveCard label={label} slides={slides} />;
}

function SoonCard({ label, description }: Pick<PathCardProps, "label" | "description">) {
  // Recessed with a dashed edge and no hover step: it isn't a link, and must not look like one.
  return (
    <Card className="border-dashed bg-background-recessed hover:border-border-default">
      <h3 className="type-supporting">{label}</h3>
      <p className="type-meta w-fit rounded-control border border-border-essential px-2 text-text-primary">
        Coming soon
      </p>
      <p className="type-body text-text-secondary">{description}</p>
    </Card>
  );
}

/** One slide's content: optional metric and unit, headline, then summary. */
function Slide({ entry }: { entry: Entry }) {
  const { summary, highlight } = entry.frontmatter;
  // Beyond the Code is a personality signal, not evidence (UX-007): never a metric.
  const metric = entry.frontmatter.type === "work" ? highlight?.metric : undefined;
  const unit = metric ? highlight?.unit : undefined;
  return (
    <>
      {metric && (
        <p className="flex flex-col">
          <span className={metricClasses}>{metric}</span>
          {unit && <span className={metricUnitClasses}>{unit}</span>}
        </p>
      )}
      {highlight?.headline && <p className="type-story text-text-primary">{highlight.headline}</p>}
      <p className="type-body text-text-secondary">{summary}</p>
    </>
  );
}

function LiveCard({ label, slides }: Pick<PathCardProps, "label" | "slides">) {
  const [index, setIndex] = useState(0);
  // Set by the visitor's first change: gates both the fade and the announcement,
  // so the first render neither animates nor speaks.
  const [changed, setChanged] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const entry = slides[index];
  const { summary, highlight } = entry.frontmatter;
  const headline = highlight?.headline;
  const count = slides.length;
  const rotates = count > 1;

  const go = (step: 1 | -1) => {
    setIndex((current) => (current + step + count) % count);
    setChanged(true);
  };

  return (
    <Card>
      <h3 className="type-supporting">{label}</h3>
      {/* Every slide is stacked in one grid cell, so the card keeps the tallest slide's
          height and the controls never move. Inactive slides are `invisible`
          (visibility: hidden), so they're unreachable by keyboard and AT. Only the
          active slide fades in, and only after a visitor's change. */}
      <div className="grid">
        {slides.map((slide, i) => {
          const active = i === index;
          const fade = active && changed && !reducedMotion ? "animate-story-in" : "";
          return (
            <div
              key={slide.key}
              aria-hidden={active ? undefined : true}
              className={`flex flex-col gap-2 [grid-area:1/1] ${active ? fade : "invisible"}`}
            >
              <Slide entry={slide} />
            </div>
          );
        })}
      </div>
      {/* Intentional overlay: the card's only link is stretched over the whole card
          (`stretchedLinkClasses`), so blank card space opens the story without nesting
          interactive elements. The buttons below sit above it with `relative z-10`. */}
      <Link to={entryHref(entry)} className={`type-body mt-auto w-fit ${stretchedLinkClasses}`}>
        Read the story <span aria-hidden="true">→</span>
      </Link>
      {rotates && (
        // Above the stretched-link overlay as a whole, so the count and gaps don't open the story either.
        <div className="relative z-10 flex w-fit items-center gap-2">
          <Button
            color="secondary"
            size="sm"
            className="min-h-6 min-w-6 shadow-none"
            aria-label={`Previous ${label} highlight`}
            onClick={() => go(-1)}
          >
            <span aria-hidden="true">←</span>
          </Button>
          <span className="type-meta text-text-secondary">
            {index + 1} of {count}
          </span>
          <Button
            color="secondary"
            size="sm"
            className="min-h-6 min-w-6 shadow-none"
            aria-label={`Next ${label} highlight`}
            onClick={() => go(1)}
          >
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      )}
      {rotates && (
        <p aria-live="polite" className="sr-only">
          {changed ? `${label} highlight ${index + 1} of ${count}: ${headline ?? summary}` : ""}
        </p>
      )}
    </Card>
  );
}
