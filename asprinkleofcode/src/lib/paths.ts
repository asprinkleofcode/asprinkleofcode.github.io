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
 * source for the header nav, the homepage Exploration tiles and the path
 * index titles.
 */
export const EXPLORATION_PATHS = [
  { path: "engineering", to: "/engineering", label: PATH_LABELS.engineering },
  { path: "leadership", to: "/leadership", label: PATH_LABELS.leadership },
  { path: "beyond", to: "/beyond", label: PATH_LABELS.beyond },
] as const satisfies readonly { path: EntryPath; to: string; label: string }[];

/** The decided label for a path, e.g. "Leadership & Enablement". */
export function pathLabel(path: EntryPath): string {
  return PATH_LABELS[path];
}

/** An entry's story URL: `/{path}/{slug}`. */
export function entryHref(entry: Entry): string {
  return `/${entry.path}/${entry.slug}`;
}
