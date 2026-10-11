import { focusRing } from "../theme/aSprinkleOfCodeTheme";

/** Standalone text link: brand colour, underlined on hover and focus, solid focus ring. */
export const textLinkClasses = `inline-block py-0.5 text-brand-primary underline-offset-4 hover:underline focus-visible:underline rounded-control ${focusRing}`;

/**
 * A card's one link, stretched over the whole card (UX-031 / EXPERIENCE §6.3).
 * Intentional: an `::after` overlay gives the link the card's hit area, so the
 * card is clickable without nesting interactive elements. The container needs
 * `relative` and draws the focus ring itself (`focusWithinRing`), so the link
 * suppresses its own; anything that must stay clickable above the overlay
 * needs `relative z-10`. Used by StoryCard; Story 2.6's Path Card will reuse it.
 */
export const stretchedLinkClasses =
  "text-brand-primary underline-offset-4 hover:underline focus-visible:underline focus:outline-hidden after:absolute after:inset-0 after:rounded-default after:content-['']";
