import { useId, type ReactNode } from "react";
import { STORY_SECTION_HEADINGS, type StorySectionName } from "../../lib/storySections";

interface StorySectionProps {
  /** One of the fixed AD-3 sections, so two stories never name one differently. */
  section: StorySectionName;
  children: ReactNode;
}

/**
 * One deep-story section: a `<section>` labelled by its `<h2>` (the page's
 * `<h1>` is the story title). MDX bodies aren't type-checked, so an unknown
 * section throws.
 */
export default function StorySection({ section, children }: StorySectionProps) {
  const headingId = useId();
  if (!Object.hasOwn(STORY_SECTION_HEADINGS, section)) {
    throw new Error(`StorySection: unknown section "${String(section)}"`);
  }
  return (
    <section aria-labelledby={headingId} className="mt-10 first:mt-0">
      <h2 id={headingId} className="type-section mb-4 text-text-primary">
        {STORY_SECTION_HEADINGS[section]}
      </h2>
      {children}
    </section>
  );
}
