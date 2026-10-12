import type { ReactNode } from "react";
import { metricClasses, metricUnitClasses } from "../../lib/metricClasses";

/**
 * `metric` and `unit` mirror the frontmatter `highlight { metric, unit }` the
 * Path Card will show: a unit never appears without a metric, so `unit` alone
 * is a type error.
 */
type OutcomeBlockProps = { outcome: ReactNode } & (
  | { metric?: undefined; unit?: undefined }
  | { metric: string; unit?: string }
);

/**
 * Makes impact legible (DESIGN §11): an optional metric, large, with the unit
 * saying exactly what it counts beneath it, then what changed. An empty string
 * counts as absent. MDX bodies aren't type-checked, so a unit without a metric
 * throws rather than being dropped silently.
 */
export default function OutcomeBlock({ outcome, metric, unit }: OutcomeBlockProps) {
  const hasMetric = metric !== undefined && metric !== "";
  const hasUnit = unit !== undefined && unit !== "";
  if (hasUnit && !hasMetric) {
    throw new Error(`OutcomeBlock: unit "${unit}" needs a metric`);
  }
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
