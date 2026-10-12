# Sprint Change Proposal: Epic 2 Remediation

- **Date:** 2026-10-12
- **Trigger:** Epic 2 retrospective, verdict **rejected** (`implementation-artifacts/epic-2-retro-2026-10-12.md`)
- **Prepared for:** Sprinkle
- **Mode:** Incremental (each edit approved individually)
- **Scope classification:** Moderate (stories added and Epic 3 gated, with no PRD or MVP change)
- **Status:** Approved by Sprinkle (2026-10-12). Applied to the planning artifacts in the same change.

## 1. Issue Summary

Sprinkle rejected Epic 2 at its retrospective on 2026-10-12, overriding the machine verdict of "accepted-with-open-items". All six stories are done and the build is green. The live work stories still have problems:

- **F-1.** Both stories show Rationale and Tradeoffs twice. The text appears once as Decision Block labels and again as section `h2`s, against a block-composition decision Story 2.2 recorded on 2026-10-11. The decision lived only in the 2.2 spec, so Stories 2.4B and 2.5 never inherited it.
- **F-2, F-3, F-4.** Three Story 2.4 criteria were narrowed or waived on the way into the story spec, with no Spec Change Log entry: the highlight headline, the summary's internal-names clause, and the InmarOne tile example.
- **F-5.** Only the two named stories are ever rendered by a test. A third story that throws at render time would pass typecheck, lint, tests and build, then fail into the ErrorBoundary on the live site.
- **F-6.** The homepage metric and the story's Outcome metric are typed twice, with no single source.

The retro's own exit condition is A-1 to A-3 merged and A-4 applied.

**Found during this analysis (not in the retro):**

- `epics.md:670` requires the **Decision Block** to name the three sync triggers. A-3 moves those triggers out of the block, so this criterion has to be reconciled too.
- Story 2.1's criterion (`epics.md:564`) says the block foregrounds rationale and tradeoffs.
- Most of the reasoning that moves out of the blocks appears nowhere in the sections today:
  - RCM: signals not state, the three triggers, rebuild rather than delta.
  - Azure: the whole Cosmos DB incident and its four controls.
- So "move, never thin" means adding new section entries, not deleting duplicates.

## 2. Impact Analysis

### Epic impact

| Epic | Impact |
|---|---|
| Epic 2 | Can't close as planned. Two remediation stories are added (2.7, 2.8) and the epic stays `in-progress`. It closes when the retrospective is resumed and its verdict re-recorded. |
| Epic 3 | **Gated.** Starts after the Epic 2 remediation. It inherits the block-composition and single-source-metric rules through `epics.md` and the spine. No story changes. |
| Epic 4 | No change in this proposal. A-9 (reject `highlight.metric` on personal entries, and land 4.1 before 4.4/4.5) stays a tracked action item for Epic 4 planning. |

### Story impact

| Story | Change |
|---|---|
| 2.1 | Criteria amended: Decision Block carries the decision only, and `OutcomeBlock` reads `highlight` through context. |
| 2.4 | Criteria reconciled to what was built: the sync-design trigger location, the waived tile example, the headline and the summary. |
| 2.7 (new) | Story render guard and single-source Outcome metric (A-1, A-2). |
| 2.8 (new) | Decision Blocks carry only the decision (A-3, F-10). |

### Artifact conflicts

| Artifact | Status |
|---|---|
| `PRD.md` | No conflict. FR-7 and FR-16 are still met, and only where reasoning is presented changes. |
| `DESIGN.md`, `EXPERIENCE.md` | No conflict. §11 and §13 (DESIGN) and §11 (EXPERIENCE) define block roles and section order conceptually. |
| `ARCHITECTURE-SPINE.md` | Updated. AD-3 gains the block-composition rule, AD-7 gains a named `OutcomeBlock` context exception, and the frontmatter row notes `highlight` as the metric source. |
| `epics.md` | Updated: Stories 2.1, 2.4, 2.7 and 2.8, the Epic 3 gate, and an update note. |
| `implementation-artifacts/epic-2-context.md` | Updated: decisions, exception, dependencies, and the "decided YYYY-MM-DD" convention. |
| `implementation-artifacts/sprint-status.yaml` | Updated: new story keys and action-item statuses. |

### Technical impact

- **Code:**
  - `OutcomeBlock` (drops its `metric` and `unit` props and reads context).
  - `WorkStory` (adds a context provider around `<Body />`).
  - `DecisionBlock` (`rationale` becomes optional).
  - `plugins/contentFrontmatter.ts` `storyBodyProblems` (four new rules).
  - `src/lib/registry.test.ts` (a parametrised render test).
  - Both `.mdx` stories.
- **Infrastructure and deploy:** none. The live site changes only when Stories 2.7 and 2.8 merge.

## 3. Recommended Approach

**Direct adjustment.** Add two remediation stories to Epic 2 and reconcile the planning documents.

| Option | Verdict | Reason |
|---|---|---|
| Direct adjustment | **Selected** | The defects are presentation, guard and traceability gaps, not a wrong design. Medium effort, low risk. |
| Rollback | Not viable | Reverting 2.4B and 2.5 discards sound, reviewed content to fix how it's presented. |
| MVP review | Not viable | MVP scope and goals are unaffected. |

- **Effort:**
  - Story 2.7: small to medium (test, context, two rules, two prop removals).
  - Story 2.8: medium. Most of the effort is careful content work and Alisha's review.
- **Risk:** low. Story 2.7's render test lands first and guards every later edit. The main risk is content quality during the move, which the "never thin" criterion and Alisha's review address.
- **Timeline:** Epic 3 is delayed until 2.7 and 2.8 merge and the retro verdict is re-recorded.

## 4. Detailed Change Proposals

All six proposals were approved individually by Sprinkle on 2026-10-12.

### 4.1 Stories (`epics.md`)

#### P1. New Stories 2.7 and 2.8 (inserted after Story 2.6)

```markdown
### Story 2.7: Story Render Guard & Single-Source Outcome Metric

**Origin:** Epic 2 retrospective (rejected, 2026-10-12), A-1 and A-2 (F-5, F-6).

As a developer adding a work story,
I want every committed story rendered by a test and its outcome metric typed in one place,
So that "adding a story means adding one file" can't ship a story that throws on the live site, and the homepage card and the story can never disagree about a number.

**Acceptance Criteria:**

**Given** the live registry (the real globs, not the fixture registry)
**When** the test suite runs
**Then** one parametrised test loads and renders the body of every non-draft `work` entry and asserts its Context, Decision and Outcome `h2`s, and, when the entry has `highlight.metric`, that the metric and its `unit` appear in the rendered Outcome. A third story added later is covered with no test edit

**And** this test lands first, as its own commit, green against the current content, before any metric or content change in Stories 2.7 and 2.8

**Given** a work story whose frontmatter has `highlight.metric`
**When** its detail page renders
**Then** `WorkStory` provides `highlight` to the body through a small React context around `<Body />`, and `OutcomeBlock` renders the metric and unit from that context in the same place and styling as today, next to its caveat. `OutcomeBlock` no longer accepts `metric` or `unit` props. A story with no `highlight` shows no metric

**Given** `storyBodyProblems` in `plugins/contentFrontmatter.ts`
**When** a work story's body has `metric=` or `unit=` on `<OutcomeBlock>`, or more than one `<OutcomeBlock>`
**Then** the build fails naming the file and the rule, and valid and invalid fixtures cover both rules

**Given** both committed stories
**When** this story is complete
**Then** their `<OutcomeBlock>` metric and unit props are removed, and the rendered metric and unit are identical to the homepage path card's

**And** a story that isn't featured but has a metric gets a `highlight` without `featured` (the schema already allows it)

**And** the amendment to Story 2.1's "components take props only" rule, for `OutcomeBlock` reading `highlight` through context, is recorded in this story's spec. AD-7 still holds, because the context comes from the page, not the registry

### Story 2.8: Decision Blocks Carry Only the Decision

**Origin:** Epic 2 retrospective (rejected, 2026-10-12), A-3 (F-1, F-10). Depends on Story 2.7's render test.

As a visitor reading a deep story,
I want each decision's reasoning to appear once, in the Rationale and Tradeoffs sections,
So that I'm not reading the same labels and reasoning twice.

**Acceptance Criteria:**

**Given** the block composition decided on 2026-10-12 (option a)
**When** a work story uses `<DecisionBlock>`
**Then** the block carries only `decision`, and the page shows "Decision" as the block's only label. Rationale and Tradeoffs appear only as section `h2`s

**Given** the three Decision Blocks in the two committed stories
**When** their `rationale` and `tradeoffs` text moves
**Then** each piece becomes an entry in that story's Rationale or Tradeoffs section, in the same heading-then-details format as the existing entries (a `###` entry or a bullet). No reasoning is dropped or shortened. Where a moved point overlaps an existing entry, the two are merged only if every clause of both survives

**And** the RCM story still names the three triggers that force a sync and says the same user is processed several times a day (Story 2.4 AC, as reconciled), and the Azure story still presents the Cosmos DB incident and its four controls as a decision/outcome highlight (Story 2.5 AC)

**And** Alisha reviews the reworked sections against the current text before the story is marked done

**Given** `storyBodyProblems`
**When** a `<DecisionBlock>` has `rationale=` or `tradeoffs=` and the story has a matching Rationale or Tradeoffs section, or the body has a setext `h2` (a paragraph line underlined with `---`)
**Then** the build fails naming the file and the rule, with valid and invalid fixtures for each

**And** the Story 2.7 render test stays green throughout
```

**Rationale:** these carry A-1 to A-3 exactly as decided at the retro. The 2.7 → 2.8 order follows "the render test lands first", and the split mirrors the 2.4 A/B split that kept PRs reviewable.

#### P2. Story 2.4: reconcile criteria to what was built (A-4)

Sync-design criterion (`epics.md:668-670`):

- **OLD:** "**Given** the Decision Block for the sync design … **Then** it names the three triggers … Where the story explains InmarOne, it uses the example that InmarOne shows a tile …"
- **NEW:**

```markdown
**Given** the sync design
**When** the story is authored
**Then** its Decision or Rationale section names the three triggers that force a sync (an RCM admin changes an active user's permissions, a user logs in to RCM, an RCM user is marked inactive), says that the same user is expected to be processed several times a day, and never describes the 4,500 figure as users. The Decision Block itself carries only the decision (Story 2.8). *(Reconciled 2026-10-12, Epic 2 retro F-1/A-3: this criterion first required the triggers inside the block.)*

**And** the InmarOne tile example (a tile for an application RCM says the user has, such as Audit Management, and Contract Management listed under Other Inmar Applications) is optional; Alisha waived it as not needed for this story. *(Reconciled 2026-10-12, Epic 2 retro F-4: the waiver was previously recorded only in `deferred-work.md` and the 2.4B spec.)*
```

Path-card highlight criterion (`epics.md:700-702`), the **Then** clause:

- **OLD:** "… a headline that names RCM as the single authority on which RCM applications a user can open in InmarOne … `summary` is the one supporting line and reads without internal names"
- **NEW:**

```markdown
**Then** `highlight` carries a one-line problem/outcome headline (as authored: the event-driven sync from RCM to InmarOne replaced manual app-access provisioning), a `metric` of `4,500`, and a `unit` that says syncs, never users (as authored: `syncs a day, up from 2,000 at launch`). `summary` is the one supporting line. It may name InmarOne, Inmar and RCM, which Alisha has confirmed as public-safe (2026-09-12). *(Reconciled 2026-10-12, Epic 2 retro F-2/F-3, decided by Sprinkle: the copy stays as authored. The original criterion asked the headline to name RCM as the single authority on app access and the summary to avoid internal names.)*
```

**Rationale:** these record F-2 and F-3 as Sprinkle decided them and make the F-4 waiver visible. They also unblock Story 2.8 by naming a section rather than the block.

#### P3. Story 2.1: record the amendments

Block-roles criterion (`epics.md:562-564`), the **Then** clause:

- **OLD:** "Decision Block visually foregrounds the decision, rationale, and tradeoffs, and Outcome Block foregrounds what changed as a result (FR-16)"
- **NEW:**

```markdown
**Then** Decision Block visually foregrounds the decision, and Outcome Block foregrounds what changed as a result, with the story's metric when it has one (FR-16). A decision's rationale and tradeoffs live in the story's Rationale and Tradeoffs sections, not in the block. *(Amended 2026-10-12, Epic 2 retro F-1: block composition decided in Story 2.2 on 2026-10-11 and confirmed by Sprinkle; see Story 2.8.)*
```

New criterion, inserted after the block-roles criterion:

```markdown
**And** components take props only and never read the registry (AD-7), with one exception: `OutcomeBlock` reads the story's `highlight` metric and unit from a React context that `WorkStory` provides around the story body, so the number is typed once, in frontmatter. *(Amended 2026-10-12, Epic 2 retro F-6; see Story 2.7.)*
```

**Rationale:** Epic 3 reuses these components "unchanged" and reads Story 2.1 for how they work, so the decision has to live here (retro P-2).

#### P5b. Epic 3 gate

Appended to the **Dependencies:** paragraph (`epics.md:201`):

```markdown
**Gate (2026-10-12):** Epic 3 starts only after Epic 2's remediation stories (2.7, 2.8) are done, Story 2.4's criteria are reconciled, and the Epic 2 retrospective is resumed and its verdict re-recorded (`implementation-artifacts/epic-2-retro-2026-10-12.md`). Epic 3 reuses the render guard and the block rules.
```

Appended to the Epic 3 header, after **Content status:**:

```markdown
**Starts after:** the Epic 2 remediation gate (see Dependencies). Its epic context inherits the AD-3 block-composition and single-source-metric rules.
```

#### P6b. Update note (after the 2026-10-07 note)

```markdown
**Update note (2026-10-12, Epic 2 retrospective, verdict rejected):** the retro (`implementation-artifacts/epic-2-retro-2026-10-12.md`) found decision-block reasoning shown twice (F-1), Story 2.4 criteria not met as written (F-2, F-3, F-4), no render test over all stories (F-5) and the outcome metric typed twice (F-6). New Stories 2.7 and 2.8 carry the fixes. Story 2.4's criteria are reconciled to the copy as authored, Story 2.1 records the block-composition and `OutcomeBlock` context amendments, and Epic 3 is gated on the remediation (`planning-artifacts/sprint-change-proposal-2026-10-12.md`). Two stories were added. None were removed or renumbered.
```

### 4.2 Architecture (`architecture/ARCHITECTURE-SPINE.md`)

#### P4. Record the decisions as invariants (A-5)

AD-3 Rule, appended:

```markdown
**Block composition (decided 2026-10-12, Epic 2 retro F-1):** a `DecisionBlock` carries only the decision. A decision's rationale and tradeoffs are written once, as entries in the Rationale and Tradeoffs sections, never also as block props. A work story has at most one `OutcomeBlock`. The build (`storyBodyProblems`) enforces both rules.
```

AD-7 Rule, after "components never do (props only).":

```markdown
One sanctioned exception to "props only": `OutcomeBlock` reads the story's `highlight` from a React context that `WorkStory` (a page) provides around the story body, because an MDX body can't pass frontmatter to its blocks. This is not registry access; the page still owns the read.
```

The Conventions → Frontmatter keys row (`work` schema) annotates `highlight`:

> (required when `featured` is set; also the single source of the story's Outcome metric, so a non-featured story with a metric still sets `highlight`, and a body never types `metric=`/`unit=` on `<OutcomeBlock>`)

The frontmatter `updated` changes from `2026-10-11` to `2026-10-12`.

**Rationale:** these turn per-story decisions into inherited invariants. The AD-7 exception is narrow and named, so it can't grow into a general loophole.

### 4.3 Implementation artifacts

#### P5a. `implementation-artifacts/epic-2-context.md`

- **Stories:** add Story 2.7 and Story 2.8, each marked as retro remediation.
- **Technical Decisions → MDX whitelist:** add the `OutcomeBlock` context exception, plus a new **Block composition** bullet:
  - Decision Block carries only `decision`.
  - The metric lives only in `highlight`.
  - At most one `OutcomeBlock`.
  - The build enforces these, and a render test covers every work story.
- **Technical Decisions:** add a new **Decisions made mid-epic** bullet: a spec that records "decided YYYY-MM-DD" also updates this file.
- **UX & Interaction Patterns → Decision and Outcome Blocks:** Decision Block foregrounds the decision; its rationale and tradeoffs are read in their own sections. The Outcome Block shows the story's highlight metric.
- **Cross-Story Dependencies:**
  - 2.7 comes before 2.8, and 2.8 needs Alisha's review.
  - Epic 2 closes only after 2.7 and 2.8 are done and the verdict is re-recorded, and Epic 3 starts after that.

#### P6a. `implementation-artifacts/sprint-status.yaml`

- Under `epic-2` (which stays `in-progress`), add:
  - `2-7-story-render-guard-single-source-outcome-metric: backlog`
  - `2-8-decision-blocks-carry-only-the-decision: backlog`
- `epic-2-retrospective` stays `done`. The retro document's frontmatter `verdict` is what gets re-recorded.
- Action items:
  - A-1 and A-2 stay `open` and point to Story 2.7.
  - A-3 stays `open` and points to Story 2.8.
  - A-4 becomes `done` (applied by P2).
  - A-5 becomes `done` (applied by P4 and P5).
  - A-6 to A-9 and epic-1 A-11 are unchanged.
- Bump `last_updated`.

### 4.4 UI/UX

No changes. The DESIGN and EXPERIENCE block roles and section order still hold.

## 5. Implementation Handoff

**Scope: Moderate.** The backlog is reorganized (two stories added, Epic 3 gated) with no replan of the PRD or the architecture.

| Recipient | Responsibility |
|---|---|
| Developer (this change) | Apply P2 to P6 to the planning artifacts on a branch, then open a PR (documents only, no code). |
| Developer (Amelia), via `bmad-build` | Story 2.7, then Story 2.8. Each gets its own spec, branch and PR. |
| Alisha | Review Story 2.8's reworked Rationale and Tradeoffs sections against the current text. Decide where the Cosmos DB incident narrative sits. |
| Sprinkle | After 2.7 and 2.8 merge, resume `bmad-retrospective` for Epic 2 and re-record the verdict. |
| PM / SM (separately) | A-6 (`bmad-build` AC-trace customization), A-7 (Vitest worker limit), A-8 (Story 3.1 criterion) and A-9 (Epic 4 planning) remain open action items, outside this proposal. |

### Success criteria

1. A live-registry test renders every non-draft work story. It landed before any content change.
2. Each story's Outcome metric comes only from frontmatter `highlight`. No body contains `metric=` or `unit=`, and the build rejects them.
3. On `vite preview`, neither story repeats a Rationale or Tradeoffs label inside a Decision Block. No reasoning was dropped (confirmed by Alisha's review).
4. The build rejects block `rationale=`/`tradeoffs=` alongside a matching section, and rejects setext `h2`s.
5. `epics.md` Story 2.4 matches the copy as built, and the spine and `epic-2-context.md` carry the decisions.
6. The Epic 2 retrospective is resumed and its verdict is no longer `rejected`. Only then does Epic 3 start.
