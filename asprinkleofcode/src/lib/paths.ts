import type { Entry, EntryPath } from "./registry";

/** Decided path labels (PRD D-15). Keyed by every `EntryPath`, so a missing label is a type error. */
const PATH_LABELS = {
  engineering: "Engineering",
  leadership: "Leadership & Enablement",
  beyond: "Beyond the Code",
} as const satisfies Record<EntryPath, string>;

/**
 * The three exploration paths (PRD D-15, EXPERIENCE §6.3): fixed product
 * structure, so they always render whether or not any story exists. The one
 * source for the header nav, the homepage path cards and the path index
 * titles. `description` is the one line a path card shows while the path has
 * no story yet ("Coming soon").
 */
export const EXPLORATION_PATHS = [
  {
    path: "engineering",
    to: "/engineering",
    label: PATH_LABELS.engineering,
    description: "Systems I designed and delivered, and the decisions behind them.",
  },
  {
    path: "leadership",
    to: "/leadership",
    label: PATH_LABELS.leadership,
    description: "Onboarding, teaching, and making knowledge repeatable.",
  },
  {
    path: "beyond",
    to: "/beyond",
    label: PATH_LABELS.beyond,
    description: "Powerlifting and birdhouses, and what each taught me.",
  },
] as const satisfies readonly { path: EntryPath; to: string; label: string; description: string }[];

/** The decided label for a path, e.g. "Leadership & Enablement". */
export function pathLabel(path: EntryPath): string {
  return PATH_LABELS[path];
}

/** An entry's story URL: `/{path}/{slug}`. */
export function entryHref(entry: Entry): string {
  return `/${entry.path}/${entry.slug}`;
}
