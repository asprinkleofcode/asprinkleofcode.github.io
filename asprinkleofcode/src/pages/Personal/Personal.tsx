import { useParams } from "react-router";
import { PERSONAL_PATH } from "../../lib/frontmatter";
import { getEntry } from "../../lib/registry";
import { getStoryBody } from "../../lib/storyBody";
import NotFound from "../NotFound/NotFound";

// Placeholder detail page for Beyond the Code (Story 1.3); Epic 4 replaces it.
export default function Personal() {
  const { slug } = useParams();
  const entry = slug ? getEntry(PERSONAL_PATH, slug) : undefined;
  if (!entry) return <NotFound />;

  const Body = getStoryBody(entry);
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="type-section text-text-primary">{entry.frontmatter.title}</h1>
      <p className="type-body mt-4 text-text-secondary">{entry.frontmatter.summary}</p>
      <div className="type-body mt-8 text-text-primary">
        <Body />
      </div>
    </article>
  );
}
