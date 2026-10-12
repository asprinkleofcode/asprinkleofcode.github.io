import { useNavigationType, useParams } from "react-router";
import CapabilitySignal from "../../components/CapabilitySignal/CapabilitySignal";
import type { WorkFrontmatter, WorkPath } from "../../lib/frontmatter";
import { IDENTITY, SITE_URL } from "../../lib/identity";
import { entryHref } from "../../lib/paths";
import { storyProseClasses } from "../../lib/proseClasses";
import { getEntry, type Entry } from "../../lib/registry";
import { getStoryBody } from "../../lib/storyBody";
import { StoryHighlightContext } from "../../lib/storyHighlight";
import { useDocumentMeta } from "../../lib/useDocumentMeta";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import NotFound from "../NotFound/NotFound";

interface WorkStoryProps {
  path: WorkPath;
}

/**
 * The one work-story detail page, shared by `/engineering/:slug` and
 * `/leadership/:slug` (UX-DR10). Unknown and draft slugs render not-found:
 * drafts never reach the registry.
 */
export default function WorkStory({ path }: WorkStoryProps) {
  const { slug } = useParams();
  const entry = slug ? getEntry(path, slug) : undefined;
  if (!entry || entry.frontmatter.type !== "work") return <NotFound />;
  // Keyed per story, so a link from one story to another mounts afresh and replays the fade.
  return <WorkStoryArticle key={entry.key} entry={entry} frontmatter={entry.frontmatter} />;
}

function WorkStoryArticle({ entry, frontmatter }: { entry: Entry; frontmatter: WorkFrontmatter }) {
  const { title, summary, role, capabilities, date } = frontmatter;
  const reducedMotion = usePrefersReducedMotion();
  // Arriving from a link fades the story in (UX-018); a cold load, refresh or
  // back/forward shows it at once (EXPERIENCE §14 Cold Load).
  const fadeIn = useNavigationType() === "PUSH" && !reducedMotion;

  useDocumentMeta({
    title: `${title} | ${IDENTITY.name}`,
    description: summary,
    jsonLd: {
      "@context": "https://schema.org/",
      "@type": "Article",
      headline: title,
      description: summary,
      url: `${SITE_URL}#${entryHref(entry)}`,
      author: { "@id": `${SITE_URL}#person` },
      ...(date ? { datePublished: date } : {}),
    },
  });

  const Body = getStoryBody(entry);
  return (
    <article className={`mx-auto max-w-3xl px-4 py-12 ${fadeIn ? "animate-story-in" : ""}`}>
      <header className="border-b border-border-default pb-8">
        <h1 className="type-section text-text-primary">{title}</h1>
        <p className="type-body mt-4 text-text-secondary">{summary}</p>
        <p className="type-meta mt-4 text-text-secondary">Role: {role}</p>
        <ul aria-label="Capabilities shown" className="mt-3 flex flex-wrap gap-2">
          {capabilities.map((capability) => (
            <li key={capability}>
              <CapabilitySignal capability={capability} />
            </li>
          ))}
        </ul>
      </header>
      <div className={`mt-10 ${storyProseClasses}`}>
        {/* The Outcome Block's metric and unit come from frontmatter, never the body (retro F-6). */}
        <StoryHighlightContext value={frontmatter.highlight}>
          <Body />
        </StoryHighlightContext>
      </div>
    </article>
  );
}
