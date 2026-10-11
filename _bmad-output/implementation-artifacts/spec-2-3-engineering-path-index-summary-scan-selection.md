---
title: 'Story 2.3: Engineering Path Index — Summary Scan & Selection'
type: 'feature'
created: '2026-10-11'
status: 'done'
baseline_commit: '1734ea88840757c7fe7e80235cb4046e8b3b0727'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/engineering` lists each story as a bare title link and summary, so a visitor can't tell Alisha's role or the capability a story shows without opening it (DESIGN §12, FR-15). Story 2.1 built `StoryCard` for this, but nothing renders it yet.

**Approach:** Make the shared `PathIndex` (Story 1.7) render a `StoryCard` for every `work` entry, in the order the registry already gives (`featured` asc, `date` desc, `title`). No route, registry or schema changes. Personal entries on `/beyond` keep today's title-and-summary item until Epic 4 builds the personal card.

## Boundaries & Constraints

**Always:**
- `PathIndex` stays props-only: pages pass `getPathEntries(path)` and it never re-sorts. Card `href` comes from `entryHref(entry)`.
- Cards render from frontmatter only (AD-2): `title`, `summary`, `role`, `capabilities`. `StoryCard` is used unchanged.
- The page keeps exactly one `h1` (the path label); card titles are `h2`. Cards are items of one `<ul>`, stacked with a gap, inside the existing `max-w-3xl` column, at every width.
- Leadership uses the same `PathIndex`, so `work` entries there get cards too (no Leadership content exists yet).
- Selection reaches the detail page through the card's router `Link` (a PUSH navigation), which is what triggers Story 2.2's ~180ms fade-in on `WorkStory` (decided 2026-10-11: 2.2 merged in #35, so AC3's cross-fade needs no code here).
- Role tokens only (AD-10). Each card carries its own border, so the list item drops its divider rules for `work` entries.

**Never:**
- No change to `App.tsx` routes, `registry.ts`, `frontmatter.ts`, `paths.ts`, `StoryCard` or the `WorkStory` page.
- No content `.mdx` committed. Any fixture used for a browser check stays local and is deleted before commit.
- No card-specific CSS file.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| No stories | `entries = []` | `h1` + "No stories published yet.", no list | N/A |
| Work stories | several `work` entries in registry order | One `StoryCard` per entry, same order; each title links to `/engineering/{slug}` | N/A |
| Personal stories | `personal` entries (`/beyond`) | Unchanged title link + summary item, no role or capability pills | N/A |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/components/PathIndex/PathIndex.tsx` -- the only code change. Branch the list item on `entry.frontmatter.type`: `work` → `<StoryCard href={entryHref(entry)} {...fields} />`; `personal` → today's markup. Update the doc comment (it says "Story 2.3 swaps the list item").
- `asprinkleofcode/src/components/PathIndex/PathIndex.test.tsx` -- existing tests assert the bare `type-story` + `textLinkClasses` link on a `work` entry; rewrite those for cards and add a `personal` fixture for the unchanged branch. Follow `StoryCard.test.tsx` for `ThemeProvider` + `expectNoFlowbiteDefaults`.
- `asprinkleofcode/src/components/StoryCard/StoryCard.tsx` -- reuse as-is: `{ title, summary, role, capabilities, href }`, flowbite `Card`, `h2` title link with `stretchedLinkClasses`, "Role: …", `<ul aria-label="Capabilities shown">`.
- `asprinkleofcode/src/lib/registry.ts` -- `compareEntries` / `getPathEntries` already implement the AC ordering, tested in `registry.test.ts:70`. Don't change.
- `asprinkleofcode/src/pages/{Engineering,Leadership,Beyond}/*.tsx` -- callers; unchanged.
- `asprinkleofcode/src/pages/WorkStory/WorkStory.tsx` -- Story 2.2's page; `animate-story-in` runs when `useNavigationType() === "PUSH"` and motion isn't reduced. Don't change.
- `asprinkleofcode/plugins/contentFrontmatter.ts` -- since 2.2 the build rejects a work body without literal `StorySection`s for Context, Decision and Outcome in canonical order, or with its own `h1`/`h2`; a browser-check fixture must satisfy that.
- `_bmad-output/implementation-artifacts/deferred-work.md:125-129` -- the browser check of `StoryCard`'s whole-card click and single focus ring is owed "once Story 2.3 renders cards"; the 2.6 half of that entry stays open.

## Tasks & Acceptance

**Execution:**
- [x] `asprinkleofcode/src/components/PathIndex/PathIndex.tsx` -- render `StoryCard` for `work` entries in a gapped `<ul>`; keep the personal item and the empty state.
- [x] `asprinkleofcode/src/components/PathIndex/PathIndex.test.tsx` -- cover the matrix: order and hrefs preserved, each `work` item shows title link, summary, "Role: …" and one signal per capability; personal item unchanged; single `h1` with card `h2`s; `expectNoFlowbiteDefaults` under the app theme.

**Acceptance Criteria:**
- Given `/engineering` with work stories, when it renders, then the page lists one Story Card per listed non-draft engineering story, in registry order, and each card shows title, summary, role and capability signals.
- Given a keyboard user, when they tab through the index, then each card takes one tab stop (its title link) and the ring draws around the whole card; given a pointer user, a click anywhere on a card navigates to that story's `/engineering/:slug`.
- Given `npm run build`, then typecheck, lint, all tests and the bundle pass.

## Implementation Notes

- `PathIndex` adds `gap-4` to the list only when it holds `work` entries; personal items keep their ruled rows. A path never mixes types today.
- Browser check (2026-10-11, `npm run dev`, temporary `src/content/work/tmp-check.mdx`, since deleted): in dark mode no flowbite gray appears; Tab lands once per card with one ring around the whole card; clicking a pill (desktop) and the summary (375px mobile) opened the story with `animate-story-in`; no horizontal scroll at 375px. Light mode was not browser-checked (unit tests cover flowbite defaults).
- One full-build run hit a flaky `WorkStory.test.tsx` case ("replays the fade and replaces the meta…", stale `document.title`); it passed alone and on every rerun. `WorkStory` is untouched by this story.
- `sprint-status.yaml` `last_updated` stays at 15:30: the value from main is later than the local clock at close (14:23), so it is not moved backwards.

## Spec Change Log

## Review Triage Log

Pass 1 (blind-hunter BH, edge-case-hunter EC, verification-gap VG):

| # | Layer | Finding | Verdict | Evidence / route |
|---|---|---|---|---|
| 1 | BH/EC/VG | `sprint-status.yaml` `last_updated` moved back from 15:30 to 14:03 | low | Real: written from the local clock, earlier than 2.2's value. patch (step-05 status sync writes a value no earlier than the previous one) |
| 2 | BH/EC/VG | Sprint status `in-progress` vs spec `in-review` | false | By design: step 05 moves sprint status to `review`; the spec status leads it during review. rejected |
| 3 | BH/EC | Mixed work/personal list keeps personal rules inside a gapped list | low | Unreachable: each path holds one content type (`registry.ts` `path` derivation). Guard adds a branch. rejected |
| 4 | EC/BH | `topList()` picks the first unlabelled list; `[0]` may be undefined | low | A missing list still fails the test (TypeError). Test-only helper. rejected |
| 5 | BH/EC | Module-level `pathname` never reset between tests | low | Only one test clicks, but a later click test could pass on a stale value; one-line `beforeEach`. patch |
| 6 | BH/EC | "Click anywhere on a card" only tested on the title link | false | jsdom can't hit-test `::after`; overlay classes asserted in `StoryCard.test.tsx` (62, 71, 88); browser-checked on summary and pill. rejected |
| 7 | BH | Whole-card ring / `stretchedLinkClasses` not asserted in PathIndex tests | low | Covered by `StoryCard.test.tsx`; PathIndex passes only data props. rejected |
| 8 | BH | Spec Verification/Implementation Notes don't record the browser check | low | Fix edits this build's spec. rejected (result recorded in Implementation Notes at close) |
| 9 | BH | `deferred-work.md` entry for the 2.3 browser check untouched | false | Story close-out updates deferred-work status after the PR opens (workflow persistent fact). rejected |
| 10 | BH | No Leadership work-entry test | false | `App.test.tsx` 319–342 checks `/leadership` index hrefs. rejected |
| 11 | BH | Navigation test doesn't assert PUSH | low | Router `Link` always pushes; fade-in on PUSH covered in `WorkStory.test.tsx:213`. rejected |
| 12 | BH | No empty-state test for the Beyond title | low | Same code path as the Engineering empty-state test. rejected |
| 13 | BH | Outer list has no accessible name | low | Page `h1` already names the region; not required by AD-15. rejected |

## Verification

**Commands:**
- `npm run typecheck && npm run lint && npm test && npm run build` (from `asprinkleofcode/`) -- expected: all green.

**Manual checks:**
- With a temporary uncommitted fixture `work` `.mdx` (two capabilities; body with Context, Decision and Outcome `StorySection`s, copied from `plugins/__fixtures__/valid/src/content/work/valid-work.mdx`) under `src/content/work/`, run `npm run dev`, open `#/engineering` at mobile and desktop widths: a click on the summary or a pill opens the story with the fade-in; Tab gives one ring around the whole card; OS dark mode shows no flowbite gray. Delete the fixture afterwards.
