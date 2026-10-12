---
title: 'Story 2.4 (part B): Author the Auth.RcmAppAccessWatcher Story'
type: 'feature'
created: '2026-10-11'
status: 'done'
baseline_commit: '0069e1b39243eb71c675dd88d60cb2b410f10032'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/addendum.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Engineering path has no stories. ES-1 (`addendum.md` lines 19–155) is the first one, and the content pipeline has never run against a committed entry. The real registry globs are untested, and the AD-10 `.mdx` scan has never seen a file.

**Approach:** Author `src/content/work/rcm-app-access-watcher.mdx` from ES-1 using the whitelisted blocks. Then add a registry test that runs the real globs against it, and make the story-colour scan prove it found a file. Decisions made on 2026-10-11 (deferred-work.md, Story 2.4 part B) are binding.

## Boundaries & Constraints

**Always:**
- Use a plain title: "Keeping InmarOne app access in step with RCM". `Auth.RcmAppAccessWatcher` is named in the body.
- Frontmatter: `path: engineering` and `featured: 1` (Story 2.5 takes 2). Add a `highlight` whose `metric` is `"4,500"`, whose unit says syncs a day, and whose headline is a one-line problem/outcome.
  - `capabilities` is `[business-to-engineering, ownership, engineering-judgment, ambiguity]`.
  - `role` describes a sole engineer and technical lead.
  - `date: 2026-10-11` (publication date, used only for ordering and JSON-LD).
  - There is no `hero`.
- Sections, in canonical order: Context, Problem & ambiguity, Ownership, Decision, Rationale, Tradeoffs, Collaboration, Outcome, Reflection. Constraints is omitted because there is no separate evidence for it.
- The Decision section covers CDC through Debezium and event-driven pub/sub, and says that CDC events are signals, not state.
  - The sync Decision Block names the three triggers: an RCM admin changes an active user's permissions, a user logs in to RCM, and an RCM user is marked inactive.
  - It says the same user is expected to be processed several times a day.
- Tradeoffs covers at least CDC vs polling and event-driven vs synchronous, each with the tradeoff stated in the addendum.
- Outcome: an `OutcomeBlock` with metric `4,500` and a unit saying syncs a day, up from 2,000. 4,500 is never called users.
  - Manual app-access provisioning is gone.
  - Users are still created by hand in RCM.
  - RCM is the only system that can grant or remove access to RCM applications.
- The leadership thread is one line: the shared library, the org-wide presentation, and the pattern other teams adopted.
- Reflection covers at least the deployment-strategy and upstream-data-model hindsight points.
- Every claim traces to `addendum.md` ES-1 or to the Story 2.4 acceptance criteria in `epics.md`. Add no new numbers and no new adjectives.
- Use confirmed names only: Inmar, InmarOne, RCM, `Auth.RcmAppAccessWatcher`, Audit Management, Contract Management, SQL Server, Debezium, Google Cloud (Pub/Sub, BigQuery, Cloud Run), Python, Terraform, Grafana. Describe the per-table service names and the two systems' application identifiers generically.

**Never:**
- No schema, plugin, component, page, route or `registry.ts` changes. No media, and no change to `ExplorationPaths`/`EvidenceHighlights` (Story 2.6).
- No `MDXProvider`, no raw HTML styling, no colour classes. Blocks are imported from `src/mdx-components.tsx`.
- No `#` or `##` headings in the body (the plugin rejects them). Use `###` for subheadings.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Live index | real `registry.ts` globs | `work/engineering/rcm-app-access-watcher` present, `highlight`/`featured`/`capabilities` loaded | test fails |
| Body loads | `loadBody(entry)` | module with a function `default` | test fails |
| Glob broken | `import: "frontmatter"` dropped | live test fails | test failure |
| Story scan | `src/content/` with this file | colour scan reads ≥1 file, no offenders | test failure |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/content/work/rcm-app-access-watcher.mdx` -- new. Import `{ StorySection, DecisionBlock, OutcomeBlock }` from `"../../mdx-components"`. Wrap each section in `<StorySection section="…">`. `DecisionBlock` takes `decision`/`rationale`/`tradeoffs?` and `OutcomeBlock` takes `outcome`/`metric`/`unit`. Props may be JSX fragments. Use `plugins/__fixtures__/valid/src/content/work/valid-work.mdx` for frontmatter shape.
- `asprinkleofcode/src/lib/registry.test.ts` (`describe("live registry")`, ~line 135) -- keep the empty-index test. Add assertions against `entries`/`getEntry("engineering", "rcm-app-access-watcher")`/`getFeaturedEntry("engineering")`/`loadBody`. Use no mocks.
- `asprinkleofcode/plugins/storyColors.test.ts` -- assert that `storyFiles(contentDir)` is non-empty, so the gate can't pass vacuously.
- Untouched: `src/App.test.tsx` mocks the registry. Once merged, the homepage `EvidenceHighlights` shows this story through `getFeaturedEntry` until Story 2.6 replaces it, as designed.
- `_bmad-output/implementation-artifacts/deferred-work.md` -- resolves the "Story 2.4 part B" entry.

## Tasks & Acceptance

**Execution:**
- [x] `asprinkleofcode/src/content/work/rcm-app-access-watcher.mdx` -- author the story -- ES-1 evidence.
- [x] `asprinkleofcode/src/lib/registry.test.ts` -- live-glob assertions -- A-10 R-7.
- [x] `asprinkleofcode/plugins/storyColors.test.ts` -- non-empty scan assertion -- AD-10 carry-over.

**Acceptance Criteria:**
- Given the dev server, when `/#/engineering` is opened, then one Story Card links to `/#/engineering/rcm-app-access-watcher`. The page renders the sections with one `<h1>`, and there are no console errors.
- Given a 375px viewport, when the story is read, then there is no horizontal scroll and the blocks stay readable.
- Given the PR description, when it is opened, then it lists every external name used, for Alisha to confirm.

## Implementation Notes

- Implemented directly in the session (no subagent), as 2.2 and 2.4A were.
- Voice is first person, matching the homepage positioning line (PRD D-25, C-4).
- Names: GKE and Datastream appear in ES-1 but aren't on the confirmed list, so the story says "a containerized deployment such as Cloud Run" and "a managed Google Cloud replication service" instead. The InmarOne tile example (Audit Management / Contract Management) is left out, as Alisha allowed.
- Highlight unit is "syncs a day, up from 2,000 at launch", and the OutcomeBlock uses the same metric and unit. The Outcome text says the count is syncs, not users.
- Mutation check: dropping `import: "frontmatter"` from `registry.ts` failed the new live test, and `registry.ts` was then restored.
- Build: the body ships only in `rcm-app-access-watcher-*.js` (a lazy chunk).
- Browser, desktop: `/#/engineering` shows one card linking to the story. The story page has one `h1`, one `article` and nine `h2`s in canonical order, and no console errors.
- Browser, 375px: no element wider than the viewport.
- `.claude/launch.json` was created locally for the preview server. It is not part of the change.

## Spec Change Log

## Review Triage Log

Pass 1 (blind-hunter BH, edge-case-hunter EC, verification-gap VG):

| # | Layer | Finding | Verdict | Evidence / route |
|---|---|---|---|---|
| 1 | VG | Live test loads the body but never renders it, so a render-time throw (for example an `OutcomeBlock` unit without a metric) would ship | medium | Pre-verified gap. patch: render with `renderToStaticMarkup` and assert the Context/Decision/Outcome headings and the highlight metric. An emptied `metric` now fails the test (checked, then restored). |
| 2 | BH/EC | "4,500 syncs, not users" contradicts ES-1's "users/day" | false | `epics.md:670` (Story 2.4 AC: "never describes the 4,500 figure as users") and epic-2 context ("4,500 syncs a day… never users"), both sources the frozen intent allows. |
| 3 | BH/EC | Metric has no as-of date, so it reads as current | low | ES-1 says "as of 2026-03-22". patch: the Outcome text now says "syncs as of March 2026". |
| 4 | BH | deferred-work "part B" entry is still `open` | false | Per the workflow, it's resolved after the PR opens, with `resolved-by #<PR>`. |
| 5 | BH | Login as a trigger isn't explained by the CDC pipeline | maybe-false | Would need Alisha to say how a login reaches CDC (likely a user-row write). ES-1 doesn't say, and the most it could be is low. rejected, noted for presentation. Resolved after review: Alisha confirmed (2026-10-11) that a login writes `LastUpdatedBy` on the user's RCM Users row, Debezium publishes that change to Pub/Sub, and the message starts the sync on Cloud Run. One sentence was added to the Decision section, with the column described generically. |
| 6 | BH | "protects revenue" overstates | false | ES-1 Impact: "protected revenue by ensuring correct product visibility". |
| 7 | BH | Persistent-disk choice lists only its benefit | low | ES-1 decision 4 states the infra-complexity cost. patch: cost added. |
| 8 | BH | Collaboration sentence reads as if the library presented | low | patch: split into two sentences with "I" as the subject. |
| 9 | BH | "within near real time", "drifted" implies prior sync | low | patch: "in near real time", "were out of step". |
| 10 | BH | Points repeat across Rationale, Tradeoffs and Reflection | low | The canonical sections give different facets (why / cost / hindsight), and the Tradeoffs AC requires the stated tradeoffs. rejected |
| 11 | BH | Live test pins title and metric copy | low | Editorial edits would break a wiring test. patch: `expect.any(String)` for title, headline and metric. Structural fields are kept. |
| 12 | BH | Sort order against real content not asserted, and the `entry!` message | false | Single entry. Sorting is unit-tested in `buildIndex`, and `toMatchObject` on `undefined` fails first with a clear diff. |
| 13 | BH | Empty-scan assertion has no message | low | patch: the message names `contentDir`. |

## Verification

**Commands:**
- `npm run typecheck && npm run lint && npm test && npm run build` (from `asprinkleofcode/`) -- expected: all green.
- `grep` the built `dist/` for a body phrase -- expected: it is present in a lazy chunk, not the entry chunk.

**Manual checks:**
- Check the story at desktop and 375px widths in the browser pane.
