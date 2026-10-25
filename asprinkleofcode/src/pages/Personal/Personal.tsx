import { useNavigationType, useParams } from "react-router";
import Photo from "../../components/Photo/Photo";
import { PERSONAL_PATH, type PersonalFrontmatter } from "../../lib/frontmatter";
import { IDENTITY, SITE_URL } from "../../lib/identity";
import { entryHref } from "../../lib/paths";
import { storyProseClasses } from "../../lib/proseClasses";
import { getEntry, type Entry } from "../../lib/registry";
import { getStoryBody } from "../../lib/storyBody";
import { useDocumentMeta } from "../../lib/useDocumentMeta";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import NotFound from "../NotFound/NotFound";

/**
 * The Beyond the Code detail page, `/beyond/:slug` (AD-5's PersonalPage). A
 * freeform, media-first body: no section menu, capability signals, role or
 * evidence blocks. Unknown and draft slugs render not-found (drafts never
 * reach the registry); an unlisted entry still renders at its route.
 */
export default function Personal() {
  const { slug } = useParams();
  const entry = slug ? getEntry(PERSONAL_PATH, slug) : undefined;
  if (!entry || entry.frontmatter.type !== "personal") return <NotFound />;
  // Keyed per story, so a link from one story to another mounts afresh and replays the fade.
  return <PersonalArticle key={entry.key} entry={entry} frontmatter={entry.frontmatter} />;
}

function PersonalArticle({ entry, frontmatter }: { entry: Entry; frontmatter: PersonalFrontmatter }) {
  const { title, summary, hero, date } = frontmatter;
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
      <header>
        <h1 className="type-section text-text-primary">{title}</h1>
        <p className="type-body mt-4 text-text-secondary">{summary}</p>
      </header>
      {/* Placement is provisional until real photos land (Story 4.4). */}
      {hero && (
        <div className="mt-8">
          <Photo src={hero.src} alt={hero.alt} priority />
        </div>
      )}
      <div className={`mt-10 ${storyProseClasses}`}>
        <Body />
      </div>
    </article>
  );
}
