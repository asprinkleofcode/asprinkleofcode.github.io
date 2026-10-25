import { Card } from "flowbite-react";
import { Link } from "react-router";
import type { Capability } from "../../lib/frontmatter";
import { stretchedLinkClasses } from "../../lib/linkClasses";
import CapabilitySignal from "../CapabilitySignal/CapabilitySignal";

interface StoryCardProps {
  title: string;
  summary: string;
  /** The story's route, e.g. `/engineering/foo` or `/beyond/foo`. */
  href: string;
  /** Work stories only; a personal card never shows a role. */
  role?: string;
  /** Work stories only; a personal card never shows capability signals. */
  capabilities?: readonly Capability[];
}

/**
 * A story at a glance, rendered from frontmatter only (AD-2, UX-DR9). One
 * card serves both content types: a work card adds its role and capability
 * signals, a personal card shows only the title and summary (A-9, DESIGN
 * §14). The title is the card's only link and is named by the title, so an
 * index never has several identical link names. Its hit area is stretched
 * over the whole card on purpose (`stretchedLinkClasses`): the card is
 * clickable without nesting interactive elements, and focus shows one ring
 * around the card.
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
      {role !== undefined && <p className="type-meta text-text-secondary">Role: {role}</p>}
      {capabilities !== undefined && (
        <ul aria-label="Capabilities shown" className="flex flex-wrap gap-2">
          {capabilities.map((capability) => (
            <li key={capability}>
              <CapabilitySignal capability={capability} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
