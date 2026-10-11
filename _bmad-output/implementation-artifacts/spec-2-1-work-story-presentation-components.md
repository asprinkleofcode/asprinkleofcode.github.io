---
title: 'Story 2.1: Work-Story Presentation Components'
type: 'feature'
created: '2026-10-11'
status: 'done'
baseline_commit: '8d23b882bbd0372be5575b1127ce77fa49d9e74b'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Epic 2's detail page, path indexes and stories (2.2–2.5) and Epic 3 need shared blocks that make reasoning and evidence visible. Right now `src/mdx-components.tsx` is empty and path indexes list only a title and summary.

**Approach:** Build five prop-only components: `StorySection`, `DecisionBlock`, `OutcomeBlock`, `CapabilitySignal` and `StoryCard`. Use flowbite `Card` and `Badge` where they fit, themed with role tokens. Export the four MDX blocks from the AD-8 whitelist. Test each component against realistic fixture data. Nothing consumes them yet: 2.2 and 2.3 wire them in.

## Boundaries & Constraints

**Always:**
- Components take props only and never read the registry (AD-7). Each lives in its own folder under `src/components/`.
- Use semantic role tokens only (AD-10). The focus ring is `focusRing`. Links use `textLinkClasses` (`brand.primary`, underlined on hover and focus). Show hierarchy with borders and background steps, never stacked shadows. Use `rounded-default` for panels and `rounded-pill` for capability signals.
- Capability labels key off `Capability` from `frontmatter.ts`, so a missing label is a type error. No free-text capability. Decided wording (Q1, 2026-10-11): "Business-to-engineering", "Ownership", "Engineering judgment", "Ambiguity", "Enablement".
- `StorySection` headings come from the fixed AD-3 list: Context · Problem & ambiguity · Constraints · Ownership · Decision · Rationale · Tradeoffs · Collaboration · Outcome · Reflection. Each renders as a `<section>` labelled by its `<h2>`, since the page `<h1>` is the story title.
- **Story Card follows the UX-031 Path Card interaction (decided 2026-10-11, party session + `EXPERIENCE.md` §6.3):** the title is the card's only link, and its hit area is stretched over the whole card (a `::after` overlay on the link, with a code comment saying this is intentional so the card is clickable without nesting interactive elements). It sits on `background.primary` with a `border.default` edge that steps up to `border.essential` on hover, and the title underlines. Focus shows one `focusRing` around the card. The card never takes button styling. The link name stays the story title, not "Read the story →", so the index never has several identical link names.
- **Metric presentation matches the Path Card:** `OutcomeBlock`'s `metric` and `unit` mirror `highlight { metric, unit }`. The metric is large semibold `text.primary`, and the unit sits under it in `type-meta` `text.secondary`. Never periwinkle, and a metric counts exactly what the unit says (e.g. "syncs a day", never users).
- New flowbite slots go in `aSprinkleOfCodeTheme` with `replaceDefinedSlots` entries in `aSprinkleOfCodeApplyTheme`. Every flowbite-using component is tested with `expectNoFlowbiteDefaults`.

**Never:**
- No changes to `WorkStory`, `PathIndex`, pages, routes, the registry or the frontmatter schema. Those belong to 2.2–2.4.
- No `MDXProvider`, no component-level CSS files unless utilities truly can't do the job, no hover-only information, no colour as the only cue.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Full decision | `decision`, `rationale`, `tradeoffs` | All three as labelled parts; the decision is visually dominant | N/A |
| Minimal decision | `decision` + `rationale` only | No empty Tradeoffs label | N/A |
| Outcome with metric | `outcome`, `metric="4,500"`, `unit="syncs a day, up from 2,000"` | Metric large, the unit under it, the outcome text after them | N/A |
| Outcome, no metric | `outcome` only | No empty metric area | N/A |
| Story card | work frontmatter, several capabilities | Title link to `href` stretched over the card, then the summary, the role, and one signal per capability in the given order | N/A |
| Rich-text props | MDX passes JSX (e.g. `<code>`) as `rationale` | Rendered as given | N/A |

</frozen-after-approval>

## Code Map

- `src/mdx-components.tsx` -- empty whitelist; export the four MDX blocks.
- `src/lib/frontmatter.ts` -- `Capability`, `CAPABILITIES`, `WorkFrontmatter` (`title`, `summary`, `role`, `capabilities`). Read-only here.
- `src/lib/linkClasses.ts`, `src/theme/aSprinkleOfCodeTheme.ts` (`focusRing`, `replaceDefinedSlots`, `aSprinkleOfCodeApplyTheme`) -- reuse. flowbite 0.12.5 defaults for `card.root.{base,children,href}` and `badge.root.{base,color,size}` / `badge.icon.off` carry gray/`dark:`/`shadow-md`, so override them.
- `src/theme/theme.css` -- `type-story`, `type-supporting`, `type-body`, `type-meta`; role colour utilities.
- `src/components/PathIndex/PathIndex.tsx` + test -- the pattern to follow (list markup, class assertions, `MemoryRouter`). Don't change them.
- `src/components/Header/Header.test.tsx` -- the `ThemeProvider` + `expectNoFlowbiteDefaults` test pattern.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/capabilities.ts` -- `CAPABILITY_LABELS satisfies Record<Capability, string>` plus `capabilityLabel()`, using the wording chosen in Q1. Test that every `CAPABILITIES` value has a label.
- [x] `src/theme/aSprinkleOfCodeTheme.ts` -- `card` and `badge` slots with role tokens (card: `relative`, `bg-background-primary`, `border-border-default hover:border-border-essential`, `rounded-default`, no shadow, focus ring via `has-[:focus-visible]`; badge `rounded-pill`, `border-accent-secondary`, `text-accent-secondary`, one `capability` colour key). Add both to the apply map.
- [x] `src/components/CapabilitySignal/` -- `{ capability }` renders a flowbite `Badge` with the label.
- [x] `src/components/StorySection/` -- `{ section, children }` with the fixed section union.
- [x] `src/components/DecisionBlock/` -- `{ decision, rationale, tradeoffs? }` (ReactNode). A panel with a `<dl>` labelled Decision / Rationale / Tradeoffs. The decision is set in `type-story`.
- [x] `src/components/OutcomeBlock/` -- `{ outcome, metric?, unit? }`. `unit` without `metric` is a type error (discriminated props). The metric and unit are styled as in the Path Card rule above.
- [x] `src/components/StoryCard/` -- `{ title, summary, role, capabilities, href }`. A flowbite `Card` holding a heading-level title `Link`, the summary, "Role: …" in `type-meta`, and a `<ul>` of signals. The stretched-link pattern sits in a small shared class string in `src/lib/linkClasses.ts`, so Story 2.6's Path Card reuses it instead of re-deriving it.
- [x] Co-located `*.test.tsx` for each component -- cover the matrix rows, semantics (section/heading labelling, `dl`, list), token classes, and `expectNoFlowbiteDefaults`.

**Acceptance Criteria:**
- Given `src/mdx-components.tsx`, when imported, then it exports exactly `StorySection`, `DecisionBlock`, `OutcomeBlock`, `CapabilitySignal`, and nothing else.
- Given any of these components inside the app `ThemeProvider` under OS dark mode, when rendered, then no `dark:`, palette or raw colour class appears.
- Given a keyboard user on a Story Card, when they tab, then focus lands once (on the story link) and the 2px ring draws around the whole card. Given a pointer user, when they click anywhere on the card, including the summary or pills, then it navigates to `href`.
- Given `npm run build`, then typecheck, lint, all tests (including `semanticTokens.test.ts` and `globalCss.test.ts`) and the bundle pass.

## Implementation Notes

- Section names and headings live in `src/lib/storySections.ts` (`STORY_SECTION_HEADINGS`, `StorySectionName`), not in the component file, so 2.2 can import the canonical order and react-refresh stays happy. `Problem & ambiguity` is keyed `problem`.
- `focusWithinRing` (in `aSprinkleOfCodeTheme.ts`) is `focusRing` with `has-[a:focus-visible]:` variants (scoped to the link, so other focusable children never ring the card); the card slot uses it. `stretchedLinkClasses` (in `linkClasses.ts`) suppresses the link's own ring, so focus shows one ring around the card. Story 2.6 reuses both; anything above the overlay needs `relative z-10`.
- `StoryCard`'s title is an `h2` (path index `h1` is the page title). The signal list is labelled "Capabilities shown".
- Type-level rules (unit without metric, free-text capability, unknown section) are guarded with `@ts-expect-error` in the component tests, which `npm run typecheck` checks.
- jsdom can't hit-test the `::after` overlay, so the whole-card click and single-ring focus are covered by class and tab-stop assertions; confirm in a browser once 2.3 renders cards.
- Test fixtures use neutral "Fixture …" text, not invented facts about real stories (AD-4: the repo is public; ES-1 details belong only in the 2.4 story). The only real figure kept is the decided path-card metric (`4,500` / `syncs a day, up from 2,000`).

## Spec Change Log

## Review Triage Log

Pass 1 (blind-hunter BH, edge-case-hunter EC, verification-gap VG):

| # | Layer | Finding | Verdict | Evidence / route |
|---|---|---|---|---|
| 1 | VG | Pill `text-sm`/`px-2.5`/`py-0.5`/`bg-background-primary` unasserted | low | Gap filed with grep evidence; dropping `size.xs` falls back to flowbite `p-1 text-xs` unnoticed. patch (test extended) |
| 2 | VG | Card `ring-offset-background-primary` unasserted | low | Class in `focusWithinRing`, absent from test. patch |
| 3 | VG | jsdom can't confirm generated CSS | low | Built `dist` CSS was checked for the utilities; browser check deferred to 2.3. defer |
| 4 | EC | Unknown capability in MDX renders empty pill | medium | MDX JSX props aren't type-checked; `CAPABILITY_LABELS[x]` is `undefined`. patch (throws) |
| 5 | EC | Unknown section in MDX renders empty `h2` | medium | Same root as 4. patch (throws) |
| 6 | EC | `unit` without `metric` in MDX silently dropped | medium | Same root as 4. patch (throws) |
| 7 | EC/BH | `metric=""` / `unit=""` render empty areas | low | `!== undefined` check let `""` through, against the "no empty metric area" matrix row. patch |
| 8 | EC | Whitespace/empty-fragment `tradeoffs` shows bare label | low | Real but unlikely in reviewed content; fix adds branches. rejected |
| 9 | EC/BH | Empty `decision`/`rationale` render bare labels | low | Same as 8. rejected |
| 10 | EC/BH | Duplicate capabilities → duplicate keys and pills | low | Validator doesn't reject duplicates; right fix is in `frontmatter.ts`. defer (2.4) |
| 11 | EC | Empty `capabilities` → empty list announced | false | Only source is frontmatter, which requires a non-empty list. rejected |
| 12 | EC/BH | Badge only defines `capability`/`xs`; other uses unstyled | low | No other Badge use; documented in a theme comment. patch |
| 13 | EC/BH | OutcomeBlock/StorySection tests lack `expectNoFlowbiteDefaults` | low | Spec execution list asks for it per component. patch |
| 14 | BH | `has-[:focus-visible]` rings card when any child is focused | low | No second focusable child in StoryCard yet, but 2.6's buttons would double-ring. patch (`has-[a:focus-visible]`) |
| 15 | BH | No ring fallback without `:has()` | low | `:has()` is supported in all current evergreen browsers; fix adds `@supports` CSS. rejected |
| 16 | BH | Global `card` hover step makes any future Card look clickable | low | Only Card is StoryCard; spec placed the hover on the slot. rejected, revisit when a non-link Card appears |
| 17 | BH | Metric classes hand-rolled, not shared with Path Card | low | No second consumer yet. defer (2.6 extracts) |
| 18 | BH | StorySection/DecisionBlock composition and repeated "Decision" | low | Layout belongs to 2.2. defer (2.2) |
| 19 | BH | Required Context/Decision/Outcome subset not exported | low | Enforcement belongs to 2.2. defer (2.2) |
| 20 | BH | Comments describe a Path Card that doesn't exist yet | low | Story 2.6 builds it. patch (future tense) |
| 21 | BH | StoryCard has no heading-level prop | low | Only planned consumer is the path index under its `h1`. rejected |
| 22 | BH | Overlay test misses `absolute`/`sticky` descendants | low | Card has no positioned children; speculative. rejected |

## Design Notes

`StorySection` takes `section="decision"` and so on, not free text, so two stories can't name the same section differently. The block props are `ReactNode`, so MDX authors can pass plain strings or inline JSX:

```mdx
<DecisionBlock
  decision="Example decision text."
  rationale={<>Example rationale with <code>inline code</code>.</>}
/>
```

## Verification

**Commands:**
- `npm run typecheck && npm run lint && npm test && npm run build` (from `asprinkleofcode/`) -- expected: all green.

**Manual checks:**
- No visual check is possible until 2.2 and 2.3 consume these components; a temporary local render for checking is fine but must not be committed.
