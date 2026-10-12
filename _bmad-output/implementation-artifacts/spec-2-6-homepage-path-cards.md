---
title: 'Story 2.6: Homepage Path Cards'
type: 'feature'
created: '2026-10-12'
status: 'done'
baseline_commit: 'a79ef66fff414aa1726bffca0668292b86769b74'
route: 'dispatch'
review_loop_iteration: 1
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Below Recognition, the homepage still has label-only Exploration tiles that repeat the header nav, followed by a separate Highlights list. UX-031 replaces both with three path cards. Each card gives a concrete reason to open that path.

**Approach:** Add one `PathCards` section with a `PathCard` per path, rendered only from registry frontmatter (`highlight` + `summary`). A path's slides are its listed featured entries in index order. A path with no listed entry gets a non-link "Coming soon" card. Remove `ExplorationPaths` and `EvidenceHighlights` and their tests, and update `mockups/key-homepage.html` in the same change.

## Boundaries & Constraints

**Always:**
- Labels are exactly "Engineering", "Leadership & Enablement" and "Beyond the Code", in that order. The section is named by a visually hidden `h2` "Explore", and each card label is an `h3`.
- A live card shows the label, an optional metric and unit, `highlight.headline`, `summary`, and "Read the story →" (arrow `aria-hidden`).
  - That link is the card's only link. It uses `stretchedLinkClasses`, with an intentional-overlay comment, and goes to the current slide's `entryHref`.
  - Flowbite `Card` gives the border step on hover and one `focusWithinRing`. No shadow and no button styling.
- Beyond the Code never renders a metric or unit and never uses evidence or capability framing.
- Rotation applies only when there are 2 or more slides.
  - Use flowbite `Button` `color="secondary"`, `size="sm"`, with `shadow-none` and `relative z-10`. Place them after the link in the DOM. Names are "Previous {label} highlight" and "Next {label} highlight", with a visible "N of M" count. Targets are at least 24×24 px.
  - The buttons wrap around. Nothing auto-advances.
  - Decided 2026-10-12 (review pass 1): every slide is rendered stacked in one grid cell, so the card keeps the tallest slide's height and the controls never move. Inactive slides are `invisible` (visibility: hidden), which keeps them unreachable by keyboard and AT. Only the active slide's entry drives the link.
  - The new slide fades in with `animate-story-in` unless `usePrefersReducedMotion`.
  - After a visitor's change, a polite live region announces "{label} highlight N of M: {headline}". It is empty on first render.
- A path with no listed entry gets a Coming soon card. It is a non-interactive element with no `aria-disabled`, showing the visible text "Coming soon" and a one-line description from `src/lib/paths.ts`.
- The grid stacks on mobile and has three columns from `md`. Role tokens only. Nothing is hover-only.
- Decided 2026-10-12: Coming soon one-liners are Leadership & Enablement "Onboarding, teaching, and making knowledge repeatable." and Beyond the Code "Powerlifting and birdhouses, and what each taught me." Engineering (shown only if it ever has no story) is "Systems I designed and delivered, and the decisions behind them." (confirmed in review pass 1).
- Decided 2026-10-12: a path with a listed non-draft entry but no featured one **fails `vite build`**, naming the path, so a live path always has a slide. Listed means work entries plus `listed: true` personal entries.
- Extract the `OutcomeBlock` metric and unit classes into a shared constant used by both components. This closes the 2.1 deferred item.

**Never:**
- No homepage-only copy, no flag for the live or soon state, no flowbite `Carousel`, no `MDXProvider`.
- No route, frontmatter-schema or `.mdx` changes. `/leadership` and `/beyond` keep their Story 1.7 empty state.
- Never modify or delete media.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Two featured | RCM `featured:1`, IaC `featured:2` | RCM slide first, "1 of 2", Next shows IaC "2 of 2", Next again wraps to RCM | — |
| One featured | single entry | no buttons, no count | — |
| Highlight without metric | `highlight:{headline}` | no metric or unit element | — |
| Empty path | no listed entries | Coming soon card, no link, no button | — |
| Listed, none featured | e.g. one unfeatured leadership story | `vite build` fails naming the path | build failure |
| Beyond live | personal featured with metric | headline + summary + link, no metric | — |
| Reduced motion | media query matches | no `animate-story-in` on change | — |

</frozen-after-approval>

## Code Map

- `plugins/contentFrontmatter.ts` -- `featuredSlots` map (l.210), filled in `load`. Add a parallel map of listed non-draft entries (display path → path) and a pure exported `pathsWithoutFeatured(listed, featured)`. Call it from a `buildEnd` hook that `this.error`s, naming each path. The integration harness uses a dev server (no `buildEnd`), so unit-test the pure function in `contentFrontmatter.test.ts` and update the module doc comment.

- `src/pages/Landing/Landing.tsx` -- renders `Recognition` then `ExplorationPaths` then `EvidenceHighlights`. Replace the last two with `<PathCards />`.
- `src/components/ExplorationPaths/`, `src/components/EvidenceHighlights/` -- delete both folders (component + test).
- `src/lib/registry.ts` -- `getFeaturedEntry` (single entry, used only by Landing and `registry.test.ts`). Replace with `getFeaturedEntries(path, index = entries)`: listed entries with `featured` set, in index order. Update its `registry.test.ts` cases (~l.104–133, live l.165, l.193) to the list form. The live test asserts RCM is `[0]` and IaC is `[1]`.
- `src/lib/paths.ts` -- `EXPLORATION_PATHS` (also feeds Header). Add a `description` per path and update the doc comment ("homepage path cards").
- `src/lib/linkClasses.ts` -- `stretchedLinkClasses`. Its comment says 2.6 reuses it; the comment's "anything above the overlay needs `relative z-10`" applies to the buttons.
- `src/theme/aSprinkleOfCodeTheme.ts` -- the `card` slot already has `relative`, the border step and `focusWithinRing` (scoped to `a`, so buttons keep their own `focusRing`). `button` is not in `aSprinkleOfCodeApplyTheme`. If `expectNoFlowbiteDefaults` fails on the buttons, add `button: replaceDefinedSlots(...)`, checking `ErrorBoundary` still renders.
- `src/components/StoryCard/StoryCard.tsx` + test -- pattern to mirror (Card, stretched link, single-focusable assertions).
- `src/components/OutcomeBlock/OutcomeBlock.tsx` -- metric `text-4xl leading-tight font-semibold text-text-primary`, unit `type-meta text-text-secondary`. Move these into exported constants (e.g. `src/lib/metricClasses.ts`).
- `src/theme/theme.css` `--animate-story-in`, `src/lib/usePrefersReducedMotion.ts` -- reuse for the fade.
- `src/App.test.tsx` -- the registry mock (l.102–111) exposes `getFeaturedEntry`; switch it to `getFeaturedEntries`. Rewrite the "homepage exploration (Story 1.7)" homepage cases (l.292–310, 344–371) for path cards. Keep the index-route `it.each`. Header nav tests scope to `Main` already.
- `_bmad-output/mockups/key-homepage.html` (479 KB, base64 images). Edit only the CSS l.98–115, the desktop sections l.155–173, the mobile sections l.208–224, and the legend/header comments (l.13–14, 130). Model the cards on `mockups/2026-10-11-epic-2-path-cards-keepsake.html` using real frontmatter copy.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/registry.ts`, `registry.test.ts` -- `getFeaturedEntries` replaces `getFeaturedEntry` -- slides in index order.
- [x] `plugins/contentFrontmatter.ts`, `contentFrontmatter.test.ts` -- listed-but-unfeatured path fails the build -- decided rule.
- [x] `src/lib/paths.ts` -- path descriptions -- Coming soon copy.
- [x] `src/lib/metricClasses.ts`, `OutcomeBlock.tsx` -- shared metric/unit classes.
- [x] `src/components/PathCard/PathCard.tsx` + `.test.tsx` -- live, rotating and soon states. The tests cover every matrix row, tab order (link before buttons), the single link, button names, live-region text, the focus-ring/border classes and `expectNoFlowbiteDefaults`.
- [x] `src/components/PathCards/PathCards.tsx` + `.test.tsx` -- section, sr-only h2, grid classes, three cards in order from `getFeaturedEntries` / `getPathEntries`.
- [x] `src/pages/Landing/Landing.tsx`; delete `ExplorationPaths`/`EvidenceHighlights` -- swap sections.
- [x] `src/App.test.tsx` -- path-card homepage tests: one live Engineering card plus two Coming soon cards with the empty mock, and clicking the card link opens the story page.
- [x] `_bmad-output/mockups/key-homepage.html` -- path cards replace Explore and Highlights on desktop and mobile.
- [ ] `_bmad-output/implementation-artifacts/deferred-work.md` -- at close-out, mark the 2.1 metric-constant entry `resolved-by #<PR>`.

**Acceptance Criteria:**
- Given the built site, when `/#/` loads, then Recognition is followed by three cards. Engineering shows "4,500" and "1 of 2", and the other two say "Coming soon". There are no console errors.
- Given the Engineering card, when Next is pressed, then the IaC slide shows and its link goes to `/#/engineering/azure-terraform-platform`. Clicking blank card space opens that story.
- Given keyboard only, when tabbing through the card, then focus goes link → Previous → Next, with one ring around the card for the link and a ring on each button.
- Given a 375px viewport, then the cards stack with no horizontal scroll. At 768px or wider, they sit in three columns.

## Implementation Notes

- A subagent implemented this from the spec. It ran `npm ci`, then typecheck, lint, `VITEST_MAX_WORKERS=2 npm test` and `npm run build`, all green. A rerun gave typecheck and lint clean and 357/357 tests passing.
- `PathCards` takes slides as props, and `Landing` calls `getFeaturedEntries`, because components never read the registry. The metric shows only for `type: "work"` entries, so Beyond never shows one.
- The Coming soon card is a flowbite `Card` with a dashed border on a recessed background, and its hover step is suppressed. The "Coming soon" label is a bordered text chip.
- The `paths.ts` type requires a description for every path, so Engineering has one: "Systems I designed and delivered, and the decisions behind them." It only shows if Engineering ever has no story, and Alisha needs to confirm the wording.
- The `buildEnd` rule runs only when `config.command === "build"`. It was checked by hand: a temporary unfeatured leadership `.mdx` made `npx vite build` exit 1 with "…in the leadership path…", and the file was then removed.
- Browser check on `vite preview`:
  - Engineering shows "4,500" and "1 of 2". Next goes to IaC, and its link points to `#/engineering/azure-terraform-platform`.
  - Clicking blank card space opens the story.
  - Tab order is link, Previous, Next. Buttons are about 38×36 px.
  - At 375px the cards stack with no horizontal scroll; at 768px or wider they sit in three columns. No console errors.
  - The fade itself was only unit-tested.
- Known: the card height changes between slides, so the grid row resizes when you rotate. The build emits a tiny shared `metricClasses-*.js` chunk.

## Spec Change Log

- **Review pass 1 (intent_gap, resolved by Alisha 2026-10-12):**
  - **Trigger:** triage rows 1–2. Rotating the Engineering card changed its height, so the controls jumped under the pointer. Separately, the Engineering Coming soon copy was unconfirmed.
  - **Amended (frozen block, by the human):** all slides are now stacked, with inactive ones `invisible`, in place of rendering only the active slide. The Engineering description is confirmed.
  - **Applied by patch, not revert:** Alisha chose to keep the passing implementation and patch it in place.
  - **Known-bad state avoided:** a card whose height follows the active slide.
  - **KEEP:**
    - Fade and announcement gating on the `changed` flag.
    - Link before buttons in the DOM.
    - `getFeaturedEntries` props flow from `Landing`.
    - The build-only `pathsWithoutFeatured` rule.
    - The Coming soon card styling.

## Review Triage Log

Pass 1 (blind-hunter BH, edge-case-hunter EC, verification-gap VG):

| # | Layer | Finding | Verdict | Evidence / route |
|---|---|---|---|---|
| 1 | BH | Card height changes between slides, so the Previous/Next buttons jump under the pointer | medium | Engineering is the tallest card and sets the grid row; the IaC slide's unit and summary are longer than RCM's, and the controls are pinned below the `mt-auto` link. The stable-height fix (stack all slides, hide inactive ones) conflicts with the frozen "only the active slide is rendered". **intent_gap** |
| 2 | BH | Engineering's Coming soon description is unconfirmed copy | medium | `paths.ts` ships "Systems I designed and delivered, and the decisions behind them."; the frozen decisions cover only Leadership and Beyond. Visible only if Engineering empties. **intent_gap** |
| 3 | VG, BH | `buildEnd`/`listedPaths`/`command` wiring untested; only the pure `pathsWithoutFeatured` is | medium | `contentFrontmatter.test.ts` hook `setup()` never passes `command` or calls `buildEnd`; the integration harness is a dev server. patch: hook test `configResolved({command:"build"})` → `load` fixture → `buildEnd` with a `this.error` spy, plus serve/unlisted/draft negatives. |
| 4 | VG, BH | Landing's per-path slide wiring is never exercised with leadership/beyond content, and the app never rotates | low | App.test only sets `registry.featured.engineering`. patch: App case with distinct featured entries in all three paths (hrefs per card) and two Engineering slides pressing Next. |
| 5 | EC | Clicking the "N of M" count or the gap between buttons opens the story | low | The count `span` and wrapper `div` are unpositioned, so the stretched `::after` overlay is above them. patch: move `relative z-10` from each `Button` to the controls wrapper. |
| 6 | BH | Mockup legend and header comment still describe "OPEN content" | low | `key-homepage.html` l.17 and l.137; no open content remains. patch: drop the OPEN wording and the sample chip. |
| 7 | EC, BH | All live cards' links are named "Read the story" | low | The spec fixes that link text. The card's headline provides the purpose in context (WCAG 2.4.4), and today only one card is live. rejected. |
| 8 | EC, BH | `slides[index]` is unclamped if `slides` shrinks while mounted | low | Only reachable under dev HMR; production slides are static. The fix adds a guard. rejected. |
| 9 | BH | Rotation controls lack `role="group"` / position context | low | The button names include the path, the count is visible, and changes are announced. The fix adds attributes for a marginal gain. rejected. |
| 10 | BH | `headline` fallbacks are dead code | false | `Frontmatter.highlight` is optional in the type (`frontmatter.ts:58,72`), so TypeScript requires handling it; the build rule is not visible to the type. |
| 11 | BH | Sprint key name and status disagree with the spec | false | The key is the established sprint key; step 05 sets `review`, so `in-progress` mid-review is expected. |
| 12 | EC | The unfeatured-path check is build-only | false | Decided in the spec: "fails `vite build`". |
| 13 | EC | Homepage no longer links to path indexes | false | Retired by UX-031; the header nav keeps them reachable (App test covers it). |
| 14 | BH | The mockup's `.rot` uses `z-index:1` vs `z-10` | false | Visual reference only; there is no behavioural difference in a static mockup. |

## Design Notes

The rotation state is one `useState` index plus a `changed` flag. The flag gates both the fade class and the live-region text, so a first render never animates or announces. The slide is keyed by `entry.key` so the fade replays.

## Verification

**Commands:**
- From `asprinkleofcode/`: `npm run typecheck && npm run lint && npm test && npm run build` -- all green (use `--maxWorkers=2` / `VITEST_MAX_WORKERS=2` if workers time out, as in 2.5).
- `grep -rn "ExplorationPaths\|EvidenceHighlights\|getFeaturedEntry\b" src` -- no matches.

**Manual checks:**
- Temporarily add an unfeatured leadership `.mdx` and run `npx vite build`: it fails naming `leadership`. Then remove the file.
- Browser pane on `vite preview`: the AC above at desktop and 375px, hover border step and underline, Next/Previous fade, and keyboard order.
