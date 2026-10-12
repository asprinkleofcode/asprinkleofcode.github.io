---
title: 'Story 2.5: Author the Azure Infrastructure-as-Code Platform Story'
type: 'feature'
created: '2026-10-11'
status: 'done'
baseline_commit: 'ff464ebef149c878416da007f9aa6dce936f8409'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/addendum.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Engineering path has one story. ES-2 (`addendum.md` lines 159–388), the Terraform/Azure platform conversion, is the second selected story. It shows something different from ES-1: platform and infrastructure architecture, a multi-month initiative, and judgment under operational risk.

**Approach:** Author one `.mdx` file in `src/content/work/` from ES-2 using the whitelisted blocks, then extend the live-registry test so the real globs prove both stories load in the order the path card will use.

## Boundaries & Constraints

**Always:**
- **Masking (hard rule):** the product or system name never appears in the `.mdx`, its frontmatter, the spec, the PR or any commit. It is only ever "the platform". Business-domain specifics stay out too, beyond "a multi-service application platform". Alisha reviews the masking before the story is `done`.
- Frontmatter: `path: engineering`, `featured: 2`, `date: 2026-10-11`, no `hero`.
  - `capabilities` comes from the controlled vocabulary: `[engineering-judgment, ownership, ambiguity, business-to-engineering]`.
  - `role` is sole architect and later infrastructure technical lead.
  - Title: "Turning a hand-built Azure environment into a Terraform platform".
  - Add a `highlight` block with `metric: "~3 months"` and the unit "from one hand-built Dev environment to Dev, QA and UAT on Terraform". The headline names the ~11 microservices moved onto the platform. The `OutcomeBlock` uses the same metric and unit, and its text mentions the ~11 microservices too.
  - `summary` reads without internal names.
- Sections, in canonical order: Context, Problem & ambiguity, Ownership, Decision, Rationale, Tradeoffs, Collaboration, Outcome, Reflection. Constraints is omitted because ES-2 gives it no evidence separate from Context and Ambiguity.
  - **Context:** manual provisioning, a temporary Dev-only environment, and no QA, UAT or Production.
  - **Problem & ambiguity:** nobody on the team had Terraform experience, the work meant translating GCP patterns to Azure, and there was no multi-environment model.
  - **Decision:** a `DecisionBlock` for reusable-platform-first with environment-isolated backends. It also covers the four-phase parallel migration.
  - **Cosmos DB:** the destructive-replace incident gets its own `DecisionBlock` as a defense-in-depth highlight (prevention, detection, authorization, recovery), not a footnote.
  - **Rationale and Tradeoffs:** these include at least the opinionated baseline module and its flagged hindsight.
  - **Collaboration:** teaching teammates, ADRs and the conversion wiki. Developers later migrated services and built modules independently.
  - **Outcome:** an `OutcomeBlock` covering Dev→QA→UAT in ~3 months, Production later on the same foundation, and standardized tagging.
  - **Reflection:** the module-boundary and third-Key-Vault points.
- Every claim traces to ES-2 or to the Story 2.5 acceptance criteria in `epics.md`. Add no new numbers and no new adjectives. Approximate figures stay approximate ("about").
- Use confirmed names only. Confirmed by Alisha on 2026-10-12: Terraform, Azure, Cosmos DB, Container Apps, Key Vault, Azure DevOps, Akamai, Managed Identities (UAMI), Azure RBAC, Azure API Management (APIM), GCP/Google Cloud. The employer stays unnamed.

**Never:**
- No schema, plugin, component, page, route, `registry.ts` or media changes, and no change to `ExplorationPaths`/`EvidenceHighlights` (Story 2.6).
- No `MDXProvider`, no raw HTML styling, no colour classes, and no `#`/`##` body headings (use `###`).
- No committed list of names to avoid, and no test that encodes the masked name.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Both stories indexed | real globs | `getPathEntries("engineering")` is [RCM (featured 1), IaC (featured 2)] | test fails |
| Featured pick | real globs | `getFeaturedEntry("engineering")` is still RCM | test fails |
| IaC body renders | `loadBody` + `renderToStaticMarkup` | Context/Decision/Outcome `h2`s and the highlight metric present | test fails |
| Featured clash | IaC set to `featured: 1` | build fails naming both files (existing plugin rule) | build failure |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/content/work/azure-terraform-platform.mdx` -- new; the slug comes from the filename. Mirror the structure of `rcm-app-access-watcher.mdx`: import `{ StorySection, DecisionBlock, OutcomeBlock }` from `"../../mdx-components"` and use `<StorySection section="context|problem|ownership|decision|rationale|tradeoffs|collaboration|outcome|reflection">`. `OutcomeBlock` throws on a unit without a metric. Voice is first person.
- `asprinkleofcode/src/lib/registry.test.ts` (`describe("live registry")`, ~line 148) -- add one test for `azure-terraform-platform` that mirrors the RCM test, with `featured: 2`, plus an order assertion on `getPathEntries("engineering")` slugs. Keep the RCM test unchanged; `getFeaturedEntry` still picks RCM.
- Untouched: `plugins/contentFrontmatter.ts` already rejects a featured clash and a featured entry without a `highlight`. `plugins/storyColors.test.ts` scans every `.mdx` automatically. `App.test.tsx` mocks the registry.

## Tasks & Acceptance

**Execution:**
- [x] `asprinkleofcode/src/content/work/azure-terraform-platform.mdx` -- author the story -- ES-2 evidence.
- [x] `asprinkleofcode/src/lib/registry.test.ts` -- live test for the second entry and the path order -- real-glob proof that both stories are indexed.

**Acceptance Criteria:**
- Given the dev server, when `/#/engineering` is opened, then two Story Cards appear (RCM first) and the new card links to `/#/engineering/azure-terraform-platform`. That page has one `<h1>` and the sections in canonical order, with no console errors.
- Given a 375px viewport, when the story is read, then there is no horizontal scroll.
- Given the PR description, when it is opened, then it lists every external name used, for Alisha to confirm. It asks her to confirm the masking, and it never states the masked name.

## Implementation Notes

- Implemented directly in the session (no subagent), as 2.2, 2.4A and 2.4B were.
- Voice is first person, as in the RCM story. Approximate figures are written "about 11", "about 2 months", "about 3 months", with "~3 months" as the metric. The Context section names the ~11 microservices, and so do the highlight headline and the Outcome text.
- The Decision section has the platform-first `DecisionBlock`, a short list of how the layers are separated, and two `###` subsections: the four-phase migration, and the Cosmos DB `DecisionBlock` (prevention, detection, authorization, recovery).
- The ES-2 key lesson closes Reflection as a plain sentence. Hindsight point 3 (moving judgment into platform guardrails) is included as well.
- Names used: Terraform, Azure, Container Apps, Cosmos DB, Key Vault, managed identities, Azure RBAC, Azure DevOps, Azure API Management, Google Cloud and Akamai. The employer and the product are not named.
- Verification: the default `npm test` timed out starting workers for 6 files on this machine, though all 230 tests that did start passed. A rerun with `--maxWorkers=2` passed 30/30 files and 340 tests. `npm run build` (with `VITEST_MAX_WORKERS=2`) is green. The body ships only in `azure-terraform-platform-*.js`.
- Browser (vite preview): `/#/engineering` lists two cards, RCM then this story. The story page has one `h1`, one `article` and nine `h2`s in canonical order, with no console errors. At 375px, `scrollWidth` is 375 and no article element overflows.

## Spec Change Log

## Review Triage Log

Pass 1 (blind-hunter BH, edge-case-hunter EC, verification-gap VG):

| # | Layer | Finding | Verdict | Evidence / route |
|---|---|---|---|---|
| 1 | VG | No verification gaps | — | Covered: the plugin checks featured clashes, and the live test covers entry, order, featured pick and render. |
| 2 | EC | Exact `toEqual` on the engineering slugs fails as soon as a third story is added | medium | Breaks the AGENTS.md "adding a story means adding one file" rule. patch: assert relative order with `indexOf` plus `toContain`. |
| 3 | BH | "A third Key Vault" when the story only ever introduces one | low | Context says one shared Key Vault. patch: reworded to "A separate Key Vault for externally managed secrets" (ES-2's own heading). |
| 4 | BH | Phase 4 expands "to Dev, QA and UAT" right after phase 2 built Dev | low | Reads as a contradiction. patch: "beyond Dev to QA and UAT". The highlight unit and Outcome describe the state at ~3 months, which is accurate. |
| 5 | BH | Resource locks aren't among the four adopted controls | low | ES-2 lists the same four controls and doesn't say whether locks were adopted. The text already frames them as insufficient. rejected: the fix needs an unsourced claim. |
| 6 | BH | Cosmos tradeoffs name no cost, and the rationale prop mostly tells the incident | low | ES-2 states no cost for the controls. rejected: adding one would invent a claim. |
| 7 | BH | Doesn't say whether the deleted data was recovered | low | ES-2 doesn't say. rejected: no source. |
| 8 | BH | No "Why" for keeping identity separate from workload | low | ES-2 decision 5 gives it. patch: added "Why identity is its own module". |
| 9 | BH | "Wrong provider" mixes up provider and subscription | low | The sentence's own subject is the subscription. patch: "an unintended subscription". |
| 10 | BH | `prevent_destroy` isn't formatted as code | low | Cosmetic. Fixing it means turning the block props into JSX fragments, which is not a direct correction. rejected. |
| 11 | BH | Test checks the highlight metric but not the unit | low | The frozen intent says the OutcomeBlock repeats both. patch: assert the unit too. |
| 12 | BH | Test checks only 3 of 9 headings and not their order | low | Same pattern as the RCM test. `StorySection.test.tsx` covers canonical order, and the browser check confirmed this page's order. rejected: it would pin editorial structure. |
| 13 | BH | `arrayContaining` capabilities assertion is weak | low | 2.4B review (row 11) deliberately avoided pinning editorial fields in the wiring test. rejected. |
| 14 | BH | Sprint status says `in-progress` while the spec says `in-review` | false | Per the workflow, step 05 sets sprint status to `review`. Mid-review it is expected to lag. |
| 15 | BH | "Production rollout was straightforward" is unqualified | false | ES-2 says it, and the same sentence gives the reason (the lower environments validated the patterns). |

## Verification

**Commands:**
- `npm run typecheck && npm run lint && npm test && npm run build` (from `asprinkleofcode/`) -- expected: all green.
- `grep -l` a body phrase in `dist/assets/` -- expected: only an `azure-terraform-platform-*.js` lazy chunk.

**Manual checks:**
- Browser pane at desktop width and 375px: `/#/engineering` and the story page.
