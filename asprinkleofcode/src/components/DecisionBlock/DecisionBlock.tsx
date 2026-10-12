import type { ReactNode } from "react";

interface DecisionBlockProps {
  decision: ReactNode;
}

/**
 * Makes engineering reasoning visible (DESIGN §11) by foregrounding the
 * decision as one labelled, dominant line. The block carries only the
 * decision: its rationale and tradeoffs are entries in the story's own
 * Rationale and Tradeoffs sections, never block props (AD-3; the build
 * rejects `rationale=`/`tradeoffs=` on a DecisionBlock).
 */
export default function DecisionBlock({ decision }: DecisionBlockProps) {
  return (
    <div className="my-6 rounded-default border border-border-default bg-background-secondary p-5">
      <dl>
        <dt className="type-supporting">Decision</dt>
        <dd className="type-story mt-1 text-text-primary">{decision}</dd>
      </dl>
    </div>
  );
}
