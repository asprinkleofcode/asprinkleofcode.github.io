---
title: 'Story 2.7: Story Render Guard & Single-Source Outcome Metric'
type: 'refactor'
created: '2026-10-12'
status: 'done'
baseline_commit: 'bdeddbd2660d130367924fed2e09097c071b3f71'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Two Epic 2 retro findings (F-5, F-6; actions A-1, A-2). No test renders every committed story, so a new `.mdx` can ship a body that throws on the live site. Each story also types its Outcome metric twice, once in frontmatter `highlight` and once in `<OutcomeBlock metric= unit=>`, so the homepage card and the story can disagree.

**Approach:** First, as its own commit, add a parametrised live-registry test that renders every non-draft work body. Then `WorkStory` provides `highlight` through a small React context around `<Body />`, and `OutcomeBlock` reads the metric and unit from that context with no props for them. A build rule bans `metric=`/`unit=` on `<OutcomeBlock>` and more than one `<OutcomeBlock>` per body. Remove the duplicated props from both stories.

## Boundaries & Constraints

**Always:**
- Commit 1 contains only the render test, and it is green against today's content. Later commits keep it green.
- The test iterates the live `entries` (real globs) filtered to `type: "work"`. It asserts the Context, Decision and Outcome `h2`s and, when `highlight.metric` is set, that the metric and `unit` appear **inside the Outcome section**. It also asserts at least one work entry exists, so an empty glob can't pass vacuously. Adding a third story needs no test edit.
- The rendered metric and unit keep today's place (top of the Outcome panel, above the caveat) and use `metricClasses`/`metricUnitClasses`, so they match the path card exactly. No `highlight`, or `highlight` without `metric`, means no metric element.
- Rule failures go through `storyBodyProblems`, so the build fails with a `FrontmatterError` naming the file and the rule. Each rule has a valid and an invalid unit case plus an `invalid-body` integration fixture.
- **Amendment to Story 2.1 "components take props only" (decided 2026-10-12, retro F-6):** `OutcomeBlock` is the one component that reads non-prop data, the story's `highlight`, from a context the page provides. AD-7 holds because the page reads the registry and the component never does. This is already recorded in ARCHITECTURE-SPINE AD-7 and epic-2-context.
- A non-featured story with a metric uses `highlight` without `featured` (the schema already allows it). Note this in the `OutcomeBlock` doc comment.

**Never:**
- No change to frontmatter schema, story wording, routes or the path card.
- No `MDXProvider`, and no registry import in any component.
- No DecisionBlock or rationale/tradeoffs changes (Story 2.8).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Highlight with metric+unit | RCM in WorkStory | "4,500" and the unit at the top of the Outcome panel, same classes as PathCard | — |
| Metric, no unit | `highlight:{headline,metric}` | metric only | — |
| No highlight / no context | personal page or bare render | no metric element, outcome text only | — |
| Literal prop | `<OutcomeBlock metric="1" …>` (or `unit=`) in a work body | — | build fails: file + "metric=/unit= … use frontmatter highlight" |
| Two blocks | two `<OutcomeBlock` tags | — | build fails: file + "at most one <OutcomeBlock>" |
| Ignored text | `metric=` inside a code fence, inline code, an MDX comment, or another tag's attribute | accepted | — |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/lib/registry.test.ts` -- "live registry" (l.138–207). The RCM and IaC cases each render their body and check h2s and the metric. Move rendering into one `it.each` over `entries.filter(e => e.frontmatter.type === "work")`, and keep the per-story index/order assertions. Render with `renderToStaticMarkup`, then scope to the Outcome `<section>` (parse with `DOMParser`, or render through Testing Library and use `getByRole("region", { name: "Outcome" })`).
- `asprinkleofcode/src/lib/storyHighlight.ts` (new) -- `StoryHighlightContext = createContext<Highlight | undefined>(undefined)`, using the `Highlight` type from `frontmatter.ts:35`. Commit 2 also wraps the body in the render test with it, the same way `WorkStory` does.
- `asprinkleofcode/src/pages/WorkStory/WorkStory.tsx` -- l.66 `<Body />`. Wrap it in `<StoryHighlightContext value={frontmatter.highlight}>` (React 19 context-as-provider).
- `asprinkleofcode/src/components/OutcomeBlock/OutcomeBlock.tsx` + test -- props become `{ outcome }`; the metric comes from `use(StoryHighlightContext)`. Empty-string handling and "unit only with metric" still apply. Drop the unit-without-metric throw: the schema already rejects it. Tests render inside the provider (metric+unit, metric only, none, empty strings) and keep the class and order assertions.
- `asprinkleofcode/src/pages/WorkStory/WorkStory.test.tsx` -- the fixture `Body` (l.46) passes metric/unit props. Give a fixture entry a `highlight` and assert the page shows it in the Outcome section. Add a case with no highlight that shows no metric.
- `asprinkleofcode/plugins/contentFrontmatter.ts` -- `storyBodyProblems` (l.130) runs on code-stripped `source`. Add an `OutcomeBlock` tag scan that respects quotes and braces (`[^>]*` breaks on `outcome={<>…</>}`). Check the attribute names `metric`/`unit` and count the tags. Update the module doc (l.24).
- `asprinkleofcode/plugins/contentFrontmatter.test.ts` -- "work story body structure (AD-3)" (l.150); add cases. `plugins/__fixtures__/invalid-body/` -- add a work `.mdx` with `metric=`, and assert it in `contentFrontmatter.integration.test.ts` (l.142).
- `asprinkleofcode/src/content/work/rcm-app-access-watcher.mdx` l.111–115, `azure-terraform-platform.mdx` l.131–135 -- delete only the `metric`/`unit` lines. Their values already match frontmatter.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/registry.test.ts` -- parametrised render test, **commit 1 alone**.
- [x] `src/lib/storyHighlight.ts`, `WorkStory.tsx`, `OutcomeBlock.tsx` + tests, `WorkStory.test.tsx`, `registry.test.ts` wrapper -- context-sourced metric.
- [x] `plugins/contentFrontmatter.ts` + unit/integration tests + fixture -- the two body rules.
- [x] both `.mdx` -- remove the duplicated props.

**Acceptance Criteria:**
- Given commit 1 checked out alone, when `npm test` runs, then it passes.
- Given the finished branch, when `/#/engineering/rcm-app-access-watcher` and `/#/engineering/azure-terraform-platform` render, then each Outcome panel shows its highlight metric and unit as before, and they match the homepage path card's text.
- Given `grep -n "metric=\|unit=" src/content`, then there are no matches.

## Implementation Notes

- A subagent implemented this in four commits:
  - `7464d5e`: the render test only, green on its own.
  - `24a96d4`: the metric comes from context.
  - `7d02b8e`: the duplicated content props are removed.
  - `b5a7813`: the build rules.
  
  Content landed before the rule so that no commit in between fails the build. The Tasks list has them in the opposite order.
- `StoryHighlightContext` lives in `src/lib/storyHighlight.ts`. `OutcomeBlock` reads it with `use()`, and outside a story page it shows no metric. The unit-without-metric throw is gone: the schema already rejects that case, and the component shows a unit only alongside a metric.
- The render test is a new `describe("live work story bodies")` in `registry.test.ts`. The RCM and IaC index-order cases stay, without their rendering.
- The body rule walks each `<OutcomeBlock` tag, skipping quoted values, and skipping `{…}` by brace depth. Two known limits are noted in a code comment: quotes inside `{…}` aren't tracked, and a `{...spread}` isn't inspected.
- `invalid-body` now has two failing files, and Vite reports only the first error. So `loadFixture` takes an optional module, and each test loads its own file's `?frontmatter`.
- Checked on HEAD:
  - typecheck, lint, 385/385 tests and the build all pass;
  - a temporary `metric="1"` made `npx vite build` fail, naming the file;
  - on `vite preview`, both Outcome panels' metric and unit match the path cards, and 375px has no horizontal scroll.
  
  The build also adds a ~0.09 kB shared `storyHighlight` chunk.

## Spec Change Log

## Review Triage Log

Pass 1 (blind-hunter BH, edge-case-hunter EC, verification-gap VG). VG filed no gaps.

| # | Layer | Finding | Verdict | Evidence / route |
|---|---|---|---|---|
| 1 | BH, EC | The live render test checks the metric by text containment over the whole Outcome section, so prose holding the same text, or a story with a metric but no `OutcomeBlock`, gives a false pass or an unclear failure | low | `registry.test.ts` `outcome.textContent toContain(...)`. Neither story's prose repeats its metric today, but this is the A-1 guard. **patch**: assert exactly one `metricClasses` element in the Outcome section with text equal to `highlight.metric` (and the unit element equal to `unit`), and none when there is no metric. |
| 2 | BH | The "no metric" assertions select `.text-4xl`, so they pass vacuously if the metric class changes | low | `OutcomeBlock.test.tsx` and `WorkStory.test.tsx` use `querySelector(".text-4xl")`. **patch**: derive the selector from `metricClasses`. |
| 3 | BH | Fixtures don't cover the count rule: no integration case for two `OutcomeBlock`s, and the valid fixture has no `OutcomeBlock` | low | The epic AC asks for "valid and invalid fixtures cover both rules". Only unit strings cover the count rule, and `valid-work.mdx` has no block. **patch**: add `invalid-body/…/two-outcomes.mdx` with an integration test, and an outcome-only `OutcomeBlock` in `valid-work.mdx`. |
| 4 | BH, EC | A spread `{...{metric}}` on `<OutcomeBlock>` passes the rule | low | Real: top-level `{…}` is blanked. No author writes this, and the fix adds a new rejection branch. rejected. |
| 5 | BH, EC | An aliased import (`OutcomeBlock as X`) bypasses both rules | low | Real, but bodies import the named whitelist exports, and resolving aliases adds import parsing. rejected. |
| 6 | BH, EC | A brace inside a string within `{…}` desyncs the walker | low | Real and documented in the code comment. Committed bodies use quoted `outcome="…"`. rejected. |
| 7 | BH, EC | An unclosed `<OutcomeBlock` reads the rest of the body as attributes, giving a misleading error | low | Only reachable on MDX that fails to compile anyway; the build fails either way. rejected. |
| 8 | EC | `<OutcomeBlock` text inside another tag's quoted attribute is counted | low | Real. The existing `StorySection` scan has the same limit, and no plausible content does this. rejected. |
| 9 | EC | A whitespace-only `highlight.metric` renders an empty metric area | false | `nonEmptyString` (`frontmatter.ts:101`) rejects `v.trim() === ""`. |
| 10 | VG, BH | Personal bodies get no context and no body rule, so `<OutcomeBlock metric=…>` in a personal entry is silently ignored | low | Real, but there is no `src/content/personal/`, and Beyond never shows a metric (UX-007), so no metric is the intended output. Story 4.1 builds the personal page and should run the metric/unit rule on personal bodies. rejected. |
| 11 | BH | The unit-without-metric behaviour change isn't tied to the schema rule by a test | low | The schema rule is tested in `frontmatter.test.ts`, and `OutcomeBlock.test.tsx` covers a hidden unit-only value. rejected. |
| 12 | BH | Use an allowlist (only `outcome`) rather than banning metric/unit | low | Unknown props being ignored is pre-existing for every block; the AC names metric/unit. rejected. |
| 13 | BH | The 2.1 and 2.2 specs still show `metric=` usage and the unamended "props only" rule | low | Those are done historical records. The amendment lives in epics.md 2.1, ARCHITECTURE-SPINE AD-7, epic-2-context and this spec. rejected. |

Patches 1–3 were applied in `262272a` by the step-03 implementer. After patching, typecheck, lint, 386/386 tests and the build all pass.

## Verification

**Commands:**
- From `asprinkleofcode/`: `npm run typecheck && npm run lint && npm test && npm run build` -- all green (`VITEST_MAX_WORKERS=2` if workers time out).
- `git log --oneline` -- the render-test commit comes before every other commit on the branch.

**Manual checks:**
- Temporarily add `metric="1"` to a story's OutcomeBlock: `npx vite build` fails naming the file. Revert.
- Browser pane on `vite preview`: both stories' Outcome metric and unit, plus the homepage card, at desktop and 375px.
