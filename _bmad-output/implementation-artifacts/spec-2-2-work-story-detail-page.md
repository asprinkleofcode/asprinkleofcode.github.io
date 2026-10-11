---
title: 'Story 2.2: Work Story Detail Page'
type: 'feature'
created: '2026-10-11'
status: 'done'
baseline_commit: 'f77e39b090a62e89d7ce9612fd69a18a9320db9c'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/engineering/:slug` and `/leadership/:slug` render a placeholder (`pages/WorkStory`): an `h1`, the summary and an unstyled MDX body. Story bodies have no prose typography since `App.css` went, nothing enforces AD-3's section order, and every route keeps the static head.

**Approach:** Turn `pages/WorkStory` into the shared work-story page (the AC's `WorkStoryPage`; the spine names the folder `WorkStory/`). It gets a frontmatter header (title, summary, role, capability signals), scoped prose styling for the MDX body, a ~180ms fade-in on arrival from a link, and `useDocumentMeta` for the title, description and `Article` JSON-LD. The content plugin enforces section order and the required sections at build time.

## Boundaries & Constraints

**Always:**
- One `<h1>` (the story title) inside an `<article>`. Sections are `h2` (StorySection), and body subheadings are `###` (`h3`). Use role tokens and `type-*` only (AD-10). Prose styles are scoped to the body wrapper with Tailwind arbitrary variants, never bare element rules (`globalCss.test.ts`).
- Build-time body rules for non-draft `work` files in `plugins/contentFrontmatter.ts`: every `<StorySection>` uses a literal `section="…"`; sections appear in canonical order with no duplicates; `context`, `decision` and `outcome` are present; and there is no markdown `# ` h1. Each violation fails the build, naming the file. `REQUIRED_STORY_SECTIONS` lives next to `STORY_SECTION_HEADINGS`.
- `usePrefersReducedMotion` is the only reduced-motion source. The fade never hides content: the final state is the unstyled default, and the content is in the DOM from the first frame.
- `useDocumentMeta` captures the current title and description when it applies, restores them on unmount, and removes only the JSON-LD `<script>` it added.
- **Block composition (decided 2026-10-11):** `DecisionBlock` sits inside the `decision` section and `OutcomeBlock` inside the `outcome` section. Rationale and tradeoffs are parts of the block, not separate sections, when a block is used. The block's repeated "Decision" label stays, and the 2.1 components don't change.
- **Transition (decided 2026-10-11):** the incoming story fades in over ~180ms on PUSH. The title carries across because the card title becomes the `h1`. There is no View Transitions API.

**Never:**
- No route, registry or frontmatter-schema changes, and no `Personal` page changes (Story 4.1). No `MDXProvider`, no new CSS file, no SSG.
- No OG/Twitter tag rewriting. AC scope is the title, description and JSON-LD only.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Arrive via link | PUSH to `/engineering/foo` | Article fades in over ~180ms | N/A |
| Reduced motion / cold load / back | reduce, or POP | No fade class | N/A |
| Unknown or draft slug | `getEntry` undefined | `NotFound`; no meta applied | N/A |
| Leave story | navigate to `/` | Static title/description restored; Article JSON-LD gone; Person JSON-LD intact | N/A |
| Missing required section | work body without `outcome` | Build fails naming file + missing sections | FrontmatterError |
| Out of order / duplicate | `decision` before `context`, or `context` twice | Build fails naming file | FrontmatterError |
| Dynamic section prop | `<StorySection section={x}>` | Build fails: literal required | FrontmatterError |
| Draft work file | `draft: true`, no sections | Passes (body stripped) | N/A |

</frozen-after-approval>

## Code Map

- `src/pages/WorkStory/WorkStory.tsx` -- placeholder to rebuild; `getEntry` → `NotFound`; renders `getStoryBody(entry)` with no inner `Suspense` (keep that: AD-19 settles after the body).
- `src/App.tsx` -- routes already share `WorkStory` for both paths; no change.
- `src/components/{StorySection,DecisionBlock,OutcomeBlock,CapabilitySignal}` -- reuse in header and as body blocks; `StorySection` is `mt-10 first:mt-0`, h2 `type-section`.
- `src/lib/storySections.ts` -- add `REQUIRED_STORY_SECTIONS` and the canonical-order list (key order of `STORY_SECTION_HEADINGS`).
- `src/lib/identity.ts` -- `IDENTITY.name` is the site name for the tab title (`"<title> | Alisha Sprinkle Korba"`). Add `SITE_URL = "https://alishasprinklekorba.com/"` here (it mirrors the canonical in `index.html`) for the JSON-LD `url` (`${SITE_URL}#/engineering/slug`) and the author `@id` (`#person`).
- `src/lib/usePrefersReducedMotion.ts` -- reduced-motion signal; `useNavigationType` from `react-router` for PUSH.
- `src/theme/theme.css` -- add `--animate-story-in` and `@keyframes` (opacity 0→1, 180ms) inside `@theme`.
- `plugins/contentFrontmatter.ts` `processContentFile` -- add the body checks after frontmatter validation (on blanked `body`, non-draft `work` only); fixtures in `plugins/__fixtures__/`. `valid-work.mdx` currently has `# Valid work heading` and no sections, so update it.
- `src/App.test.tsx` -- mocks registry with fixture entries (`work/engineering/foo`); extend for meta-leak navigation test.
- `src/test/globalCss.test.ts`, `semanticTokens.test.ts` -- must keep passing.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/storySections.ts` -- export `STORY_SECTION_ORDER` and `REQUIRED_STORY_SECTIONS` (`context`, `decision`, `outcome`).
- [x] `src/lib/useDocumentMeta.ts` + test -- the hook as bounded above, with JSON-LD in one `<script type="application/ld+json" data-document-meta>`. Tests cover apply, restore, removal of only its own script, and a rerender with new values.
- [x] `src/lib/identity.ts` -- `SITE_URL`, plus an App test asserting that it matches the `index.html` canonical.
- [x] `src/theme/theme.css` -- `story-in` animation token.
- [x] `src/pages/WorkStory/WorkStory.tsx` + new `WorkStory.test.tsx` -- `<article>` with a header (h1 `type-section`, summary `type-body text-text-secondary`, "Role: …" `type-meta`, a "Capabilities shown" signal list) and the body wrapper with the scoped prose classes (p/ul/ol spacing, `h3` `type-story`, `strong` text-primary, links brand). The fade class is applied only when PUSH && !reduced (no `motion-safe:` variant). `useDocumentMeta` with `Article` JSON-LD (`headline`, `description`, `url`, `author` `@id`, `datePublished` when there is a `date`). Tests cover the matrix rows, a single h1, the landmark, and the meta.
- [x] `plugins/contentFrontmatter.ts` + tests + fixtures -- body section rules; invalid fixtures for missing/out of order/duplicate/dynamic/h1; update `valid-work.mdx` to a valid three-section body.
- [x] `src/App.test.tsx` -- navigate story → `/` and assert that no story title, description or Article JSON-LD remains.

**Acceptance Criteria:**
- Given either work route with a valid slug, when it renders, then the same page component renders one `h1`, an `article`, section `h2`s, and no heading level is skipped.
- Given a 375px viewport, when a story renders, then the header, blocks and prose reflow without horizontal scroll (manual browser check with a temporary local fixture, not committed).
- Given `npm run build`, then typecheck, lint, all tests and the bundle pass.

## Implementation Notes

- Implemented directly in the session (no subagent). Files touched: `src/lib/{storySections,identity,useDocumentMeta(+test),proseClasses}.ts`, `src/theme/theme.css`, `src/pages/WorkStory/WorkStory.tsx` (+ new test), `src/App.test.tsx`, `plugins/contentFrontmatter.ts` (+ unit/integration tests, `valid-work.mdx` fixture).
- Prose classes live in `src/lib/proseClasses.ts` (`storyProseClasses`) so Story 4.1 can reuse them on `Personal`. Block spacing targets `>p` / `section>p` (and `ul`/`ol`/`h3`) only, so it never adds margins inside the Decision/Outcome block panels. `li`, `strong`, `code` and `a` apply at any depth. Inline links are always underlined (WCAG 1.4.1) with the `focusRing` values.
- `useDocumentMeta` serializes `jsonLd` for its effect dependency, and creates (then removes) a description meta if the head has none. JSON-LD carries `data-document-meta`.
- The fade is `animate-story-in` (opacity from 0, 180ms) applied when `useNavigationType() === "PUSH"` and reduced motion is off.
- Body rules are `storyBodyProblems` in the plugin. Deviation: the body rules are covered by inline-source unit tests in `contentFrontmatter.test.ts`, not extra invalid fixture files, because the integration test loads the whole `invalid/` fixture dir and expects its one `bad-key` error. A self-closing `<StorySection section="x" />` is accepted. Code fences are ignored.
- Browser check (temporary `src/content/work/tmp-check.mdx`, deleted afterwards) at 1280px and 375px: one h1, prose spacing 16px, `h3` 18px, list discs, underlined brand links, fade on link arrival (`story-in 0.18s`), none on reload, no horizontal scroll at 375px, and the title, description and JSON-LD restored after navigating to `/`.
- Observation: the page `h1` uses `type-section`, the same size as the section `h2`s. The hierarchy is right semantically, and visually it is carried by placement and the header's bottom border. DESIGN §8 doesn't define a detail-page title level.

## Spec Change Log

## Review Triage Log

Pass 1 (blind-hunter BH, edge-case-hunter EC, verification-gap VG):

| # | Layer | Finding | Verdict | Evidence / route |
|---|---|---|---|---|
| 1 | VG | Article `author` `@id` not tied to `index.html`'s Person `@id` | low | Renaming the Person `@id` passed every test. patch (App test asserts `person["@id"] === SITE_URL#person`) |
| 2 | VG/EC/BH | h1 check misses setext (`===`), `> #`, `- #`, bare `#` | medium | Each compiles to a second `<h1>` and passed the rule. patch (`ATX_H1` with block prefix, `SETEXT_H1`) |
| 3 | EC | `## x` / `<h2>` in the body passes, competing with section h2s | low | The spec says body subheadings are `###`; it is a direct check. patch (h2 rule) |
| 4 | VG/EC/BH | Inline code / MDX comments mentioning `<h1>` or `<StorySection>` falsely fail the build | low | `/<h1\b/` matched inside backticks. patch (strip inline code and `{/* */}`) |
| 5 | EC | A fence closes early on a line with an info string (```` ```js ````) | low | A CommonMark closing fence can't carry an info string; a direct regex fix. patch |
| 6 | EC/BH | Unclosed fence not stripped | low | MDX then treats the rest as code; unlikely in reviewed content, and the fix adds a branch. rejected |
| 7 | VG | Self-closing `<StorySection … />` accepted but untested | low | patch (test) |
| 8 | EC/BH | Fade doesn't replay story → story on the same route (article reused) | medium | Same route element, unkeyed article. patch (`key={entry.key}`, plus a test) |
| 9 | EC | Duplicate `capabilities` give duplicate keys/pills in the header | low | Pre-existing; already tracked by the open Story 2.1 deferred-work entry (fix in `frontmatter.ts`, Story 2.4). defer (no duplicate entry added) |
| 10 | EC | Cleanup writes `content=""` on a description meta that had no content | low | Static head always has content; negligible. rejected |
| 11 | EC | App leak test: interpolated meta HTML, title not restored in `finally` | low | patch (createElement, restore title) |
| 12 | EC/BH | Invalid fixtures for body rules missing; no build-level proof | medium | Direct spec deviation. patch: one `invalid-body/` fixture plus an integration test that the Vite pipeline fails naming the file; the rule variants stay as unit tests |
| 13 | EC/BH | `strong` not explicitly `text-primary` as the spec says | low | patch |
| 14 | BH | Not every problem reported in one pass (frontmatter → body; dupes skip the order check) | low | Same gating as the existing `pdf` check; more branches to fix. rejected |
| 15 | BH | App leak test doesn't assert the static Person JSON-LD survives | low | patch (static script injected and asserted) |
| 16 | BH | Canonical stays the homepage; hash Article `url` | false | AD-14 accepts deep links previewing as root, and the spec excludes head rewriting beyond title, description and JSON-LD. rejected |
| 17 | BH | `pre` unstyled, so long code lines widen the page on phones | medium | Engineering stories are likely to include code. patch (`[&_pre]` overflow-x-auto, panel) |
| 18 | BH | Blockquote/table/h4/hr unstyled | low | No content uses them yet; adds styling scope. rejected |
| 19 | BH | Comment says styling never reaches inside blocks | false | The comment limits that claim to block spacing, which is true. rejected |
| 20 | BH | Draft case not exercised; description not asserted on not-found | low | Drafts never reach the registry (covered by plugin/registry tests). patch (renamed, description asserted) |
| 21 | BH | Article JSON-LD lacks `publisher`/`dateModified`/author `name` | low | Author resolves via `@id`; rich results don't apply under the hash router. rejected |
| 22 | BH | Sprint status still `in-progress` | false | Step 05 sets `review`. rejected |

## Design Notes

The MDX shape that the body rules accept:

```mdx
<StorySection section="context">Prose…</StorySection>
<StorySection section="decision"><DecisionBlock decision="…" rationale="…" /></StorySection>
<StorySection section="outcome"><OutcomeBlock metric="4,500" unit="syncs a day, up from 2,000" outcome="…" /></StorySection>
```

The fade runs only on PUSH, so a cold load, refresh or back navigation shows the story instantly (EXPERIENCE §14 Cold Load).

## Verification

**Commands:**
- `npm run typecheck && npm run lint && npm test && npm run build` (from `asprinkleofcode/`) -- expected: all green.

**Manual checks:**
- With a temporary uncommitted `.mdx`, run `npm run dev` at 375px and 1280px: one h1, readable prose, blocks reflow, the fade on link arrival, none under emulated reduced motion, and the tab title resets after leaving.
