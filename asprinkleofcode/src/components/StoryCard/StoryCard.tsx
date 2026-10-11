import { Card } from "flowbite-react";
import { Link } from "react-router";
import type { WorkFrontmatter } from "../../lib/frontmatter";
import { stretchedLinkClasses } from "../../lib/linkClasses";
import CapabilitySignal from "../CapabilitySignal/CapabilitySignal";

type StoryCardProps = Pick<WorkFrontmatter, "title" | "summary" | "role" | "capabilities"> & {
  /** The story's route, e.g. `/engineering/foo`. */
  href: string;
};

/**
 * A story at a glance, rendered from frontmatter only (AD-2, UX-DR9). The
 * title is the card's only link and is named by the title, so an index never
 * has several identical link names. Its hit area is stretched over the whole
 * card on purpose (`stretchedLinkClasses`): the card is clickable without
 * nesting interactive elements, and focus shows one ring around the card.
 */
export default function StoryCard({ title, summary, role, capabilities, href }: StoryCardProps) {
  return (
    <Card>
      <h2 className="type-story">
        <Link to={href} className={stretchedLinkClasses}>
          {title}
        </Link>
      </h2>
      <p className="type-body text-text-secondary">{summary}</p>
      <p className="type-meta text-text-secondary">Role: {role}</p>
      <ul aria-label="Capabilities shown" className="flex flex-wrap gap-2">
        {capabilities.map((capability) => (
          <li key={capability}>
            <CapabilitySignal capability={capability} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
