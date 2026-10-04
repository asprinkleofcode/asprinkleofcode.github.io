import { useParams } from "react-router";
import type { WorkPath } from "../../lib/frontmatter";
import { getEntry } from "../../lib/registry";
import { getStoryBody } from "../../lib/storyBody";
import NotFound from "../NotFound/NotFound";

interface WorkStoryProps {
  path: WorkPath;
}

// Placeholder detail page shared by both work paths (Story 1.3); Epic 2 replaces it.
export default function WorkStory({ path }: WorkStoryProps) {
  const { slug } = useParams();
  const entry = slug ? getEntry(path, slug) : undefined;
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
