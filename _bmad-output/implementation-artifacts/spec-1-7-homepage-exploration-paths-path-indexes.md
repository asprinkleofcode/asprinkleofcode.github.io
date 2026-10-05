---
title: 'Story 1.7: Homepage Exploration Paths & Path Indexes'
type: 'feature'
created: '2026-10-05'
status: 'done'
baseline_commit: 'fcb5a035bd553b50e3f0742a4504bd7e8fa1b564'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The homepage stops after Recognition (Story 1.6), so only the header leads into the three paths. `/engineering`, `/leadership` and `/beyond` are Story 1.3 placeholders that show an empty state but cannot list stories once they exist.

**Approach:** Below Recognition, add a label-only Exploration section and a registry-driven Evidence & Highlights section. Replace the three placeholder pages with one generic `PathIndex` component that shows "No stories published yet." with zero entries and lists entries once they exist. Epics 2–4 then add content (and later Story Cards) without touching the index pages.

## Boundaries & Constraints

**Always:**
- Labels are exactly "Engineering", "Leadership & Enablement" and "Beyond the Code", linking to `/engineering`, `/leadership` and `/beyond`. Exploration always renders all three and carries no teaser copy.
- Components get data through props and never import the registry at runtime (a type-only `Entry` import is fine). Pages call the registry.
- Teaser and index text comes only from frontmatter `title` and `summary`.
- Use role tokens, the `type-*` scale and the shared `focusRing`. Targets are at least 24×24px. Links are underlined on hover and focus.
- One `<h1>` per page. Homepage sections use `<h2>` kickers.
- Every width shows the same order and content. Tiles stack on mobile and form 3 columns from `md`.

**Never:**
- Build Story Card, capability tags or the cross-fade (Epic 2).
- Hide a path because it has no content.
- Render an empty card, an empty list, or a heading with nothing under it.
- Change routes, the registry sort or the frontmatter schema.
- Touch media or legacy `.jsx`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Empty path | `getPathEntries(path)` is `[]` | Index shows h1 + "No stories published yet."; no list | N/A |
| Populated path | ≥1 listed entry | List in registry order; title links to `/{path}/{slug}`, summary below | N/A |
| Unlisted personal | `listed: false` | Absent from `/beyond` and the hint slot | N/A |
| Nothing featured | No listed entry has `featured` | Evidence & Highlights renders nothing, heading included | N/A |
| Partly featured | Only an Engineering entry is `featured` | Section with heading and only the Engineering slot | N/A |
| Two featured | Engineering `featured: 2` and `featured: 1` | Slot uses the `featured: 1` entry | N/A |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/pages/Landing/Landing.tsx` -- renders only `<Recognition {...IDENTITY} />`. Append the two new sections after it and drop the "Story 1.7 adds…" comment.
- `asprinkleofcode/src/components/Recognition/Recognition.{tsx,css}` -- the pattern to follow: `mx-auto max-w-5xl px-4` container, `type-*` utilities, and a section-scoped `revert-layer` reset in its CSS.
- `asprinkleofcode/src/App.css` -- unlayered bare `h1`/`h2`/`p` rules beat Tailwind utilities (3rem text, text-shadow, `p` margin and colour). Every new component and the index pages need the Recognition-style reset, or the `type-*` classes do nothing.
- `asprinkleofcode/src/pages/{Engineering,Leadership,Beyond}/*.tsx` -- placeholders built on `getPathEntries`. Keep the h1 text and the "No stories published yet." copy, which App tests assert.
- `asprinkleofcode/src/lib/registry.ts` -- `entries` is already sorted (`featured` ascending, unfeatured last). `getPathEntries` filters to listed entries. Add the featured helper next to it.
- `asprinkleofcode/src/components/Header/Header.tsx:29` -- `NAV_ITEMS` duplicates the three labels and routes; source them from one module.
- `asprinkleofcode/src/pages/NotFound/NotFound.tsx`, `src/lib/linkClasses.ts` -- `Link` + `textLinkClasses` is the in-app link idiom.
- `asprinkleofcode/src/App.test.tsx:77` -- the `vi.mock("./lib/registry")` needs the new helper.
- `_bmad-output/mockups/key-homepage.html` -- visual reference. Exploration: an "Explore" kicker (`type-supporting`) over bordered tiles with an `accent.secondary` → on a `background.recessed` band with `border.default` top and bottom. Highlights: a "Highlights" kicker over a bordered row list with a label column. Spines win on conflict.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/paths.ts` -- export `EXPLORATION_PATHS` (`{ path, to, label }` × 3, `as const`); `Header.tsx` builds `NAV_ITEMS` from Home + it, with no visible change.
- [x] `src/lib/registry.ts` + `registry.test.ts` -- add `getFeaturedEntry(path, index = entries)`: the first listed entry of the path with `featured` set, or `undefined`. Test empty, unfeatured-only, lowest-wins and unlisted-skipped.
- [x] `src/components/PathIndex/PathIndex.{tsx,css,test.tsx}` -- props `{ title, entries }`. Behaves per the matrix; test empty and populated fixtures.
- [x] `src/pages/{Engineering,Leadership,Beyond}/*.tsx` -- render `<PathIndex>` with the path label and `getPathEntries(path)`.
- [x] `src/components/ExplorationPaths/ExplorationPaths.{tsx,css,test.tsx}` -- a `<section aria-labelledby>` with an h2 "Explore" and one `Link` tile per `EXPLORATION_PATHS` entry. The arrow is `aria-hidden`.
- [x] `src/components/EvidenceHighlights/EvidenceHighlights.{tsx,css,test.tsx}`:
  - Props `{ engineering?, leadership?, beyond? }` (each an `Entry`), under an h2 "Highlights".
  - Engineering and Leadership slots show the label, a title link and the summary.
  - The Beyond slot shows its label with the summary as the link: a personal hint, not labelled as evidence.
  - Returns `null` when all three are absent.
- [x] `src/pages/Landing/Landing.tsx` -- Recognition, then ExplorationPaths, then EvidenceHighlights fed by `getFeaturedEntry` per path.
- [x] `src/App.test.tsx` -- extend the mock. On `/`, assert the three path links in order, no "Highlights" heading, and that each link navigates to its index h1.

**Acceptance Criteria:**
- Given zero content, when `/` loads, then Exploration lists the three paths below Recognition and each lands on an index showing "No stories published yet."
- Given `npm run preview` at 375px and at desktop width, when the homepage is viewed, then section order and paths are identical, and every tile is keyboard-reachable with a visible ring and readable `type-*` text (no App.css bleed).

## Implementation Notes

- `src/lib/paths.ts` also exports `pathLabel(path)`, which the three index pages and the Highlights slot labels use, so the labels live in one place.
- Exploration tiles underline only the label span (`group-hover`/`group-focus-visible`), so the decorative arrow isn't underlined.
- The existing App test "navigates through header path links" now scopes its `Leadership & Enablement` lookup to the Main nav. The homepage's Explore tile has the same accessible name.
- Index pages now show `type-section` (22px) titles. Before, App.css bled through at 3rem with a text-shadow.
- Verified with `npm run build` (179 tests pass) and `npm run preview` at 1280px and 375px. Checked: section order, the tile focus ring and underline, no horizontal scroll at 375px, computed kicker and tile styles free of App.css bleed, and the `/beyond` empty state with the h1 focused.

## Spec Change Log

## Review Triage Log

Pass 1 (blind, edge-case, verification-gap):

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 1 | Landing's per-path `getFeaturedEntry` wiring and Highlights-after-Explore order are untested (verification-gap, blind) | medium | Pre-verified gap: `App.test.tsx` mocks `getFeaturedEntry: () => undefined`, so a swapped slot argument or a moved/dropped `<EvidenceHighlights>` passes every test | patch |
| 2 | Index pages' `getPathEntries(path)` wiring is untested (verification-gap) | medium | Pre-verified gap: same path-blind mock (`getPathEntries: () => []`); `Leadership.tsx` calling `getPathEntries("engineering")` would pass. Same root cause as 1, fixed together | patch |
| 3 | `pathLabel` uses `find(...)!`, so a new `EntryPath` member without a label throws at runtime (edge-case, blind) | low | `satisfies readonly {path: EntryPath}[]` does not enforce exhaustiveness; a `Record<EntryPath, string>` makes it a compile error | patch |
| 4 | Story URL `/${path}/${slug}` built in both `EvidenceHighlights` and `PathIndex` (blind) | low | Two copies today and Story 2.3's StoryCard would add a third; one helper in `lib/paths.ts` is a direct correction | patch |
| 5 | `revert-layer` reset now copied in four component CSS files (blind) | low | Root cause is the pre-existing unlayered `h1`/`h2`/`p` rules in `App.css`; layering them touches legacy pages outside this story | defer |
| 6 | Slot props accept an entry from another path (edge-case) | false | The only caller, `Landing.tsx`, passes `getFeaturedEntry(<slot's path>)` per slot; finding 1's test now pins that wiring | reject |
| 7 | `EXPLORATION_PATHS.to` duplicates `path` and no test ties it to the routes (blind) | false | The App test clicks each Explore tile and asserts the matching index h1, so drift from the route table fails | reject |
| 8 | Tile focus-ring offset is `background-primary` on the recessed band (blind) | low | The ring is still a visible solid ring; same trade-off Story 1.8 accepted for the footer rather than forking `focusRing` | reject |
| 9 | Beyond hint makes the whole summary the link (blind) | low | The frozen intent and task specify the summary as the link; changing it means editing the spec | reject |
| 10 | Equal `featured` ties and featured-but-unlisted entries are unspecified (blind) | false | Ties fall to the total index order (`date`, then `title`), which is deterministic and tested in `buildIndex`; unlisted exclusion is tested | reject |
| 11 | Beyond row repeats `EvidenceRow` markup (blind) | low | Developer-only, about ten lines; Stories 2.6/3.1/4.5 restyle these rows anyway | reject |
| 12 | `NAV_ITEMS` lost `as const` (blind) | false | `RouterNavbarLink` takes plain strings; nothing depends on the literal types | reject |
| 13 | Index titles are links, not headings; section unnamed (blind) | low | Zero content today; Story 2.3 replaces the list item inside `PathIndex`, so page files still stay unchanged | reject |
| 14 | App empty-state test does not assert "no list" (blind) | low | Covered in `PathIndex.test.tsx` against the same component the pages render | reject |

## Design Notes

Evidence & Highlights is data-driven now rather than an empty stub. With zero content it renders nothing, because EXPERIENCE §14 forbids a heading over nothing. Stories 2.6, 3.1 and 4.5 then only author `featured` content and restyle the teaser. `PathIndex` renders a plain title + summary list. Story 2.3 swaps that item for `StoryCard` inside `PathIndex`, and the page files stay unchanged.

## Verification

**Commands:**
- `cd asprinkleofcode && npm run build` -- expected: exit 0 (typecheck, lint, tests, vite build).

**Manual checks:**
- `npm run preview` at 375px and at desktop width: section order, tile focus rings, and each index's empty state.
