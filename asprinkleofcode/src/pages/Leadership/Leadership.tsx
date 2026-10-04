import { getPathEntries } from "../../lib/registry";

// Placeholder index (Story 1.3). Story 1.7 replaces it with the real path index.
export default function Leadership() {
  const hasStories = getPathEntries("leadership").length > 0;
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="type-section text-text-primary">Leadership &amp; Enablement</h1>
      {!hasStories && <p className="type-body mt-4 text-text-secondary">No stories published yet.</p>}
    </section>
  );
}
