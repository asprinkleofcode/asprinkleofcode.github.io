import { use, type ReactNode } from "react";
import { metricClasses, metricUnitClasses } from "../../lib/metricClasses";
import { StoryHighlightContext } from "../../lib/storyHighlight";

interface OutcomeBlockProps {
  outcome: ReactNode;
}

/**
 * Makes impact legible (DESIGN §11): an optional metric, large, with the unit
 * saying exactly what it counts beneath it, then what changed.
 *
 * The metric and unit are not props: they come from the story's frontmatter
 * `highlight`, which the page provides through `StoryHighlightContext`, so the
 * story and the homepage path card always show the same number. This is the
 * one component that reads non-prop data (Story 2.1 amendment, Epic 2 retro
 * F-6); it still never reads the registry (AD-7). The build rejects
 * `metric=`/`unit=` on it and more than one per body.
 *
 * No highlight, or a highlight without a metric, shows the outcome alone. An
 * empty string counts as absent, and a unit shows only with a metric (the
 * schema already rejects a unit without one). A non-featured story can still
 * show a metric: give it a `highlight` without `featured`.
 */
export default function OutcomeBlock({ outcome }: OutcomeBlockProps) {
  const { metric, unit } = use(StoryHighlightContext) ?? {};
  const hasMetric = metric !== undefined && metric !== "";
  const hasUnit = hasMetric && unit !== undefined && unit !== "";
  return (
    <div className="my-6 flex flex-col gap-3 rounded-default border border-border-default bg-background-secondary p-5">
      {hasMetric && (
        <p className="flex flex-col">
          <span className={metricClasses}>{metric}</span>
          {hasUnit && <span className={metricUnitClasses}>{unit}</span>}
        </p>
      )}
      <div className="type-body text-text-primary">{outcome}</div>
    </div>
  );
}
