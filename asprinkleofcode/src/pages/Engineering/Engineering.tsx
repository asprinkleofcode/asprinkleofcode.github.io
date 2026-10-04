import { getPathEntries } from "../../lib/registry";

// Placeholder index (Story 1.3). Story 1.7 replaces it with the real path index.
export default function Engineering() {
  const hasStories = getPathEntries("engineering").length > 0;
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="type-section text-text-primary">Engineering</h1>
      {!hasStories && <p className="type-body mt-4 text-text-secondary">No stories published yet.</p>}
    </section>
  );
}
