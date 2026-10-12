---
title: 'Story 2.8: Decision Blocks Carry Only the Decision'
type: 'refactor'
created: '2026-10-12'
status: 'done'
baseline_commit: 'd1e99fe9fc92e235f0bd7dfcf4e609f1d41ebe63'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Epic 2 retro F-1 and F-10 (action A-3). Each `<DecisionBlock>` repeats its reasoning: it shows "Rationale" and "Tradeoffs" labels and text right above the story's own Rationale and Tradeoffs `h2` sections. A setext `h2` (a paragraph line underlined with `---`) also gets past the "no own h2" body rule.

**Approach:** Move the `rationale`/`tradeoffs` text of the three Decision Blocks (one in RCM, two in Azure IaC) into their stories' Rationale and Tradeoffs sections, keeping all of it. Reduce `DecisionBlock` to `decision` only. Then add two build rules: no `rationale=`/`tradeoffs=` on `<DecisionBlock>`, and no setext `h2`.

## Boundaries & Constraints

**Always:**
- The epic AC is traced clause by clause (retro P-1). The block carries only `decision`, and "Decision" is its only label. Each moved piece becomes an entry in the matching section, in the existing format: a `###` heading then details, or a `- **Lead:** …` bullet. No reasoning is dropped or shortened. A moved point merges with an existing entry only if every clause of both survives.
- RCM still names the three sync triggers and says the same user is processed several times a day, in its Rationale section (Story 2.4 AC, as reconciled). Azure still presents the Cosmos DB incident and its four controls as a decision/outcome highlight (Story 2.5 AC).
- **Rule scope (deviation, recorded):** the epic AC fails the build when `rationale=`/`tradeoffs=` appears *and* the story has a matching section. This spec bans both props unconditionally, which ARCHITECTURE-SPINE AD-3 already requires ("never also as block props"). The component no longer renders them, so a conditional ban would let MDX drop that reasoning silently. The AC's own case still fails.
- Failures go through `storyBodyProblems`, so the build throws a `FrontmatterError` naming the file and the rule. Each rule has valid and invalid unit cases, plus an `invalid-body` integration fixture. `valid-work.mdx` gains a decision-only block.
- The Story 2.7 render test (`registry.test.ts` "live work story bodies") stays green on every commit. Commit order: content move, then component, then rules.
- Alisha reviews the reworked sections against the current text before the story is `done`.
- **Cosmos DB controls (decided 2026-10-12, Alisha: option B):** the incident block's `decision` names the four controls under the four dimensions: prevent_destroy on critical resources (prevention), detection of destructive changes in Terraform plans (detection), extra approval before a destructive operation runs (authorization), and backup and restore automation (recovery). The incident narrative becomes a Rationale `###` entry. "Four controls instead of one … stopped relying on safe definitions alone" becomes a Tradeoffs bullet. The full spec was kept at ~2,100 tokens, by choice.

**Never:**
- No change to frontmatter, routes, `OutcomeBlock` or the path card. No `decision` wording changes except the Cosmos DB block above.
- No `MDXProvider`, no registry import in a component.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Decision only | `<DecisionBlock decision="…" />` | one panel, one "Decision" label | — |
| Block prop | `rationale=` or `tradeoffs=` (quoted or `{…}`, multi-line) on `<DecisionBlock>` | — | build fails: file + "must not set rationale=/tradeoffs= … write them in the Rationale/Tradeoffs sections" |
| Ignored text | the prop inside a code fence, inline code, an MDX comment, a quoted/`{…}` value, or another tag (`<DecisionBlockList>`) | accepted | — |
| Setext h2 | `Text\n---` | — | build fails with the existing "must not contain its own h2" message |
| Thematic break | blank line, then `---` | accepted | — |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/content/work/rcm-app-access-watcher.mdx` -- block l.52–56. The `rationale` becomes the first Rationale entry, `### Why every event rebuilds the user's access` (signals, not state; the three triggers; several times a day; full rebuild; safe to rerun). The `tradeoffs` becomes a new Tradeoffs bullet with the text kept, e.g. `- **A full rebuild on every event:** each event says little, so … In return, …`. Keep it separate from the "CDC over polling" bullet (it overlaps that bullet only in part).
- `asprinkleofcode/src/content/work/azure-terraform-platform.mdx` -- block 1 (l.55–59). Its rationale splits into Rationale entries `### Why build the platform before converting services` and `### Why one backend per environment`. Its tradeoffs merge into the existing bullets l.110–111, which then read "more architectural work up front, in exchange for fewer repeated decisions and less drift later" and "…more Azure resources than one shared backend…; I judged the operational clarity worth more". Block 2 (l.80–84) follows the Cosmos DB decision in Boundaries: the incident narrative becomes `### Why defense in depth for stateful resources`, and the cost becomes a `- **Four controls over one safeguard:** …` bullet. New Rationale entries go first, in Decision-section order.
- `asprinkleofcode/src/components/DecisionBlock/DecisionBlock.tsx` + `.test.tsx` -- props become `{ decision }`. Keep the `dl`, the panel classes and `type-story`, and drop `isEmpty`. Update the doc comment: reasoning lives in the sections (AD-3). Tests: one term, "Decision"; panel and token checks; rich `decision`.
- `asprinkleofcode/src/pages/WorkStory/WorkStory.test.tsx` l.51 -- drop `rationale=`.
- `asprinkleofcode/plugins/contentFrontmatter.ts` -- generalize `outcomeBlockAttributes` (l.137) to `blockAttributes(source, name)`, with the open regex built as `<${name}(?=[\s/>]|$)`. Add the `DecisionBlock` rule next to the OutcomeBlock one (l.209). Add `SETEXT_H2 = /^ {0,3}\S[^\n]*\n {0,3}-+[ \t]*$/m` beside `SETEXT_H1` and OR it into the h2 check (l.205). Update the module doc (l.24) and the function doc (l.169).
- `asprinkleofcode/plugins/contentFrontmatter.test.ts` -- "work story body structure (AD-3)": add a `describe` for the DecisionBlock rule modelled on the OutcomeBlock one (l.227), plus setext cases.
- `asprinkleofcode/plugins/__fixtures__/invalid-body/src/content/work/` -- add `decision-rationale.mdx` and `setext-h2.mdx`, and assert each in `contentFrontmatter.integration.test.ts` (pattern l.156). Add a decision-only block to `plugins/__fixtures__/valid/src/content/work/valid-work.mdx`.

## Tasks & Acceptance

**Execution:**
- [x] both `.mdx` -- move the reasoning into sections, with no block props left -- commit 1.
- [x] `DecisionBlock.tsx` + test, `WorkStory.test.tsx` -- decision-only block -- commit 2.
- [x] `contentFrontmatter.ts` + unit/integration tests + fixtures -- the two rules -- commit 3.

**Acceptance Criteria:**
- Given the finished branch, when `grep -n "rationale=\|tradeoffs=" src/content` runs, then there are no matches.
- Given both stories on `vite preview`, then each Decision panel shows only "Decision", and every sentence removed from a block appears in that story's Rationale or Tradeoffs section (diff check).
- Given a temporary `rationale="x"` on a story's block, or a setext `h2`, when `npx vite build` runs, then it fails naming the file.

## Implementation Notes

- A subagent implemented this in three commits, in spec order:
  - `34fe1ff`: content.
  - `5d13ab9`: the component.
  - `4034b2c`: the build rules.
  `npm test` was green after each one.
- The content move is verbatim, apart from the two Azure bullet merges ("Platform first", "Isolated backends"). Every clause of each merged bullet survives.
  - The "Four controls over one safeguard" bullet keeps the original tradeoffs text whole, so it reads "…: four controls instead of one: …". Flag this wording for Alisha's review.
- `expectNoFlowbiteDefaults` needs more than 5 elements, and the slimmer block renders 4. The panel test therefore renders a rich `decision`; no markup was added to the component.
- `SETEXT_H2` (the regex from the spec) also flags a non-paragraph line, such as a JSX closing tag, directly followed by `---`. This is conservative: the fix is a blank line. Neither story does this.
- Verified:
  - typecheck, lint, 407 tests and the build are green;
  - a temporary `rationale="x"`, and separately a setext h2, each made `npx vite build` fail, naming the file;
  - on `vite preview`, each Decision panel shows only "Decision", the new entries render, and 375px has no horizontal scroll.

## Spec Change Log

## Review Triage Log

Pass 1 (blind-hunter BH, edge-case-hunter EC, verification-gap VG). VG filed no gaps.

| # | Layer | Finding | Verdict | Evidence / route |
|---|---|---|---|---|
| 1 | BH, VG | The Cosmos DB `decision` and the new Tradeoffs bullet both list the four controls | low | Real, but this is decision B, chosen by Alisha in the frozen intent knowing the controls would be named twice. rejected. |
| 2 | BH, VG | That bullet stutters: "Four controls over one safeguard:** four controls instead of one: …" | low | Real (`azure-terraform-platform.mdx` Tradeoffs). **patch**: lead "Four controls instead of one safeguard", with the body starting at the list, keeping every clause. |
| 3 | BH | The `decision` string now carries what used to be tradeoffs content | false | This is exactly frozen decision B, not a departure from the approach. |
| 4 | BH | `epics.md` Story 2.8 AC still describes the conditional ban | low | Real (`epics.md` ~l.847). A retro auditor would see the AC and the build disagree. **patch**: add an amendment note, the same way l.566 and l.674 are amended. The proposal doc is a historical record and stays as it is. |
| 5 | BH, EC | A spread `{...{rationale}}` on `<DecisionBlock>` gets past the ban | low | Real; `{…}` is blanked. The same limit was rejected in Story 2.7 (#4). No author writes this, and the fix adds a rejection branch. rejected. |
| 6 | EC | An aliased import (`DecisionBlock as DB`) gets past the ban | low | Real; rejected in Story 2.7 (#5). Bodies import the named whitelist exports. rejected. |
| 7 | BH, EC | `SETEXT_H2` flags a thematic break directly after an ATX heading, a list item or a JSX line | low | Real. A plausible "divider" habit, with a plainly wrong "own h2" message. **patch**: a negative lookahead (from EC) plus accept tests. |
| 8 | EC | A setext h2 inside a blockquote or list item (`> H\n> ---`) gets past the rule | low | Real, but unlikely in story prose, and the fix needs container-marker parsing on both lines. rejected. |
| 9 | EC | `<DecisionBlock>` children are dropped silently | low | Pre-existing: the old component also ignored children. Not caused by this story, and unlikely. rejected. |
| 10 | EC | An empty or missing `decision` renders an empty panel | low | Pre-existing, with the same behaviour before this story. rejected. |
| 11 | EC | Claim: removed sentences were reworded (Isolated backends; "each addressed separately") | false | The AC allows merges in which every clause survives, and the Isolated backends bullet keeps all of them. The Cosmos `decision` wording is sanctioned by decision B. |
| 12 | BH | The integration fixture covers only `rationale=` | low | Real, though unit tests cover `tradeoffs=`. The fix is one line. **patch**: add `tradeoffs=` and assert the joined message. |
| 13 | BH | Azure "Why build the platform…" is thin, and the incident entry doesn't close the loop | low | Real as a reading note, but fixing it means authoring new claims (evidence rule), and the AC forbids changing the reasoning. Surfaced for Alisha's review. rejected. |
| 14 | BH | The RCM rebuild rationale is placed before the CDC rationale it depends on | low | A subjective ordering that the spec chose. Surfaced for Alisha's review. rejected. |
| 15 | BH | No `@ts-expect-error` test that `rationale` is no longer a prop | false | `tsc` already rejects an unknown prop on a TSX caller, and the build rule guards MDX. |

The step-03 implementer applied patches 2, 7 and 12 in `c6b230d` and `b51939e`. Patch 4 is in `epics.md`, committed with the planning docs. After patching, typecheck, lint, 410/410 tests and the build all pass.

## Verification

**Commands:**
- From `asprinkleofcode/`: `npm run typecheck && npm run lint && npm test && npm run build` -- all green (`VITEST_MAX_WORKERS=2` if workers time out). Run `npm test` after each commit.

**Manual checks:**
- Browser pane on `vite preview`: both stories' Decision, Rationale and Tradeoffs sections at desktop and 375px, with no horizontal scroll.
