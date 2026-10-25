---
title: 'Beyond the Code path index: personal summary cards (Story 4.2)'
type: 'feature'
created: '2026-10-25'
status: 'done'
baseline_commit: 'c8b85553b47baac511dedc0979d32746a2fa2053'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-4-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/beyond` already lists listed, non-draft `personal` entries from the registry and shows the Story 1.7 empty state. But each entry renders as a bare title link and summary row, a stopgap that `PathIndex.tsx` marks "until Epic 4 builds the personal card". The epic asks for a summary card per dimension.

**Approach:** Render personal entries as a summary card that uses the same Story Card frame, link and focus behaviour as work entries, without role or capabilities. Selecting a card navigates to `/beyond/:slug`, where `PersonalPage`'s existing ~180ms fade-in (instant under reduced motion and on cold load) supplies the cross-fade. No route, registry or schema change is needed.

## Boundaries & Constraints

**Always:**
- Entries come only from `getPathEntries("beyond")`: non-draft, `listed`, in index order (`featured` ascending, then `date` descending, then `title`). PathIndex never re-sorts and never hand-lists entries.
- A personal card shows the title as an `h2` (the card's only link and only tab stop, named by the title and stretched over the card) and the `summary`. It has the same flowbite `Card` frame, border, hover step and single focus ring as a work Story Card.
- A personal card never shows a role, capability signals, a metric, `highlight`, or "evidence" wording (A-9, DESIGN §14).
- Zero entries keep the h1 and "No stories published yet." with no list. The page has one `h1`, the path label.
- Semantic role tokens only. `expectNoFlowbiteDefaults` passes on a page of personal cards.
- **Decided (Alisha, 2026-10-25):** personal cards are text-only. A card never renders `hero` or any image. Whether a card shows its hero is decided in Story 4.4, alongside the photo treatment, once real photos exist.

**Never:**
- No placeholder or slot for a dimension that has no entry (D-18). No real content, photos or `.mdx` files (Story 4.4). No image on the card, not even when `hero` is set.
- No change to `registry.ts`, `frontmatter.ts`, the content plugin, routes, `Personal.tsx`, or the homepage `PathCard`.
- No new transition mechanism: the fade belongs to the destination page.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Empty | no listed personal entries | h1 + "No stories published yet.", no list | N/A |
| Two dimensions | 2 listed entries | 2 cards in the given order, each with h2 title link → `/beyond/<slug>`, summary, no role or signals | N/A |
| Unlisted | 1 listed + 1 `listed: false` | only the listed card appears; the unlisted entry still renders at its route | N/A |
| Select | click a card's link | navigates to `/beyond/<slug>`; the article fades in, or doesn't under reduced motion | N/A |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/components/StoryCard/StoryCard.tsx` -- one card for both types. Make `role` and `capabilities` optional: the role line and the "Capabilities shown" list render only when given. Retype props as `title`, `summary`, `href` and optional `role`/`capabilities` (not `Pick<WorkFrontmatter,…>` with required fields). Keep the stretched link, `Card` theme slot and focus ring unchanged.
- `asprinkleofcode/src/components/StoryCard/StoryCard.test.tsx` -- add a no-role/no-capabilities case: no role text, no list, still one link and one tab stop.
- `asprinkleofcode/src/components/PathIndex/PathIndex.tsx` -- drop the personal `<li>` branch and the `hasCards` toggle. Every entry is a `StoryCard` in a `gap-4` list; pass role/capabilities only for `work`. Update the doc comment. `textLinkClasses` and `Link` imports become unused here.
- `asprinkleofcode/src/components/PathIndex/PathIndex.test.tsx:139-162` -- replace the "keeps the title link and summary item for personal entries" test. Personal entries now render cards with h2 titles, summaries and hrefs `/beyond/<slug>`, no role, no capability list, no `border-t` rows, one tab stop each, and `expectNoFlowbiteDefaults`. Add a test for navigation on click.
- `asprinkleofcode/src/App.test.tsx:33-45,151,159,227` -- the fixture registry already holds `personal/beyond/garden` (and `flaky`). Check which of these are `listed`, then add one test: on `/beyond`, the Garden card's link reaches `/beyond/garden` and its h1. Leave the empty-state cases alone.
- `asprinkleofcode/src/lib/registry.test.ts:103,139` -- the unlisted exclusion is already covered. No change.
- `asprinkleofcode/src/pages/Personal/Personal.tsx:31,50` -- the PUSH-only `animate-story-in` already exists, and `Personal.test.tsx:235-264` covers it. Don't change it.
- `asprinkleofcode/src/pages/Beyond/Beyond.tsx` -- already correct. No change.

## Tasks & Acceptance

**Execution:**
- [x] `asprinkleofcode/src/components/StoryCard/StoryCard.tsx` (+ test) -- optional role/capabilities -- one Story Card serves both content types (UX-DR9)
- [x] `asprinkleofcode/src/components/PathIndex/PathIndex.tsx` (+ test) -- personal entries render as Story Cards -- replaces the Epic 1 stopgap row
- [x] `asprinkleofcode/src/App.test.tsx` -- `/beyond` card → detail navigation -- AC 4 end to end

**Acceptance Criteria:**
- Given listed personal entries, when `/beyond` renders, then each appears as one card in registry order, and no other card or slot appears.
- Given zero listed personal entries, when `/beyond` renders, then the Story 1.7 empty state shows.
- Given a personal card, when its link is activated, then the visitor lands on `/beyond/<slug>` with that entry's h1.
- Given a 375px viewport, when cards render, then title and summary wrap with no horizontal scroll and the hit area spans the card.
- Given the full suite, when `npm run build` runs, then typecheck, lint, tests and the Vite build all pass.

## Implementation Notes

- `StoryCard` props are now their own interface. `role?` and `capabilities?` render only when defined. PathIndex passes them only for `work`.
- `expectNoFlowbiteDefaults` needs at least six elements, so the lone personal StoryCard test runs it on the render container.
- 375px check: `vite preview` at 375×812 on `/engineering`, which uses the same card markup; no personal content exists yet. Cards are 343px wide with no horizontal scroll (`scrollWidth` 375), and the link's `::after` sits at `inset 0`.
- `npm run build`: 36 files and 518 tests pass, and the Vite build succeeds.

## Spec Change Log

## Review Triage Log

| # | Layer | Finding | Verdict | Evidence | Route |
|---|-------|---------|---------|----------|-------|
| 1 | edge | `capabilities={[]}` renders an empty labelled list | false | `frontmatter.ts:137` rejects an empty `capabilities` at build time. PathIndex passes capabilities only from validated `work` frontmatter, and before this diff `[]` rendered the same empty list. | reject |
| 2 | edge | An empty or whitespace `role` renders a dangling "Role: " | false | `frontmatter.ts:252` makes `role` a `nonEmptyString`. The diff doesn't change how a given role renders. | reject |
| 3 | edge + blind | No personal fixture sets `hero`, so the "no image" assertions pass vacuously | low | Real. A later change that wired `hero` into the card would still pass. The fix is a fixture field. | patch |
| 4 | blind | Optional `role`/`capabilities` allow half-states; a work caller could drop signals | low | Only one caller exists (PathIndex), and it passes both for `work`. The fix adds a type union to guard a state no caller reaches. | reject |
| 5 | blind | The personal frame test doesn't assert the hover step | low | Real gap against "same … hover step". The fix is one class in an existing assertion. | patch |
| 6 | blind | The 375px AC was checked on `/engineering`, not a personal card | false | A personal card is the same `Card` and stretched link with a subset of children. Width comes from the frame (343px, `scrollWidth` 375 measured), and the summary `<p>` is the same element on both. Removing children can't cause overflow. | reject |
| 7 | blind | `epic-4-context.md` doesn't point Story 4.4 at the deferred hero decision | low | The note sits only in the `/beyond` bullet. The photo-budget line still reads as open-ended. The fix is a one-line pointer. | patch |
| 8 | blind | sprint-status says `in-progress` while the spec says `in-review` | false | By design: step 05 moves sprint-status to `review` when the change is presented. | reject |
| 9 | blind | The Select row's fade isn't asserted from the card click | false | A `Link` click is a PUSH navigation, and `Personal.test.tsx:230-236` asserts that PUSH arrival applies `animate-story-in`. The new App test proves the card reaches the page. | reject |
| 10 | blind | The Unlisted row has no end-to-end test | false | `registry.test.ts:103` covers exclusion from `getPathEntries` and reachability by `getEntry`. `Personal.test.tsx:178` covers an unlisted entry rendering at its route. | reject |
| 11 | blind | PathIndex's ternary repeats `title`/`summary`/`href` | false | No harm named. The two branches make the work-only props explicit, which the doc comment describes. | reject |
| 12 | blind | The App test repeats the unit-level role and list checks | false | No harm named. Two cheap assertions in a smoke test. | reject |
| 13 | blind | The `<p>` count assertion is brittle | low | It pins the tag count rather than the intent, which is already asserted (no role text, no list). The fix deletes one line. | patch |
| 14 | verification-gap | None | — | — | — |

## Design Notes

Generalising `StoryCard` instead of adding a `PersonalCard` keeps one component behind UX-DR9 ("Story Card: concise story representation for path indexes"). Personal and work cards then can't drift apart in frame, focus or hit-area behaviour. PathIndex still enforces the work contract: a `work` entry always passes role and capabilities.

## Verification

**Commands (from `asprinkleofcode/`):**
- `npm run typecheck` -- expected: no errors
- `npm run lint` -- expected: no errors
- `npm test` -- expected: all pass
- `npm run build` -- expected: success
