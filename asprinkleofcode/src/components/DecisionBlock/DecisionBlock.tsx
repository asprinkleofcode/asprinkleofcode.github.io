import type { ReactNode } from "react";

interface DecisionBlockProps {
  decision: ReactNode;
  rationale: ReactNode;
  tradeoffs?: ReactNode;
}

const isEmpty = (node: ReactNode) => node === undefined || node === null || node === false || node === "";

/**
 * Makes engineering reasoning visible (DESIGN §11): the decision, set as the
 * dominant line, then its rationale and any tradeoffs, each labelled.
 */
export default function DecisionBlock({ decision, rationale, tradeoffs }: DecisionBlockProps) {
  return (
    <div className="my-6 rounded-default border border-border-default bg-background-secondary p-5">
      <dl className="flex flex-col gap-4">
        <div>
          <dt className="type-supporting">Decision</dt>
          <dd className="type-story mt-1 text-text-primary">{decision}</dd>
        </div>
        <div>
          <dt className="type-supporting">Rationale</dt>
          <dd className="type-body mt-1 text-text-primary">{rationale}</dd>
        </div>
        {!isEmpty(tradeoffs) && (
          <div>
            <dt className="type-supporting">Tradeoffs</dt>
            <dd className="type-body mt-1 text-text-primary">{tradeoffs}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
