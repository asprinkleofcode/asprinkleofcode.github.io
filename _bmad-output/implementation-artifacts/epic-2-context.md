# Epic 2 Context: Engineering Path — Professional Evidence

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

A visitor can browse the Engineering path, scan story summaries, and read two deep, evidence-rich stories: `Auth.RcmAppAccessWatcher` and the Azure Infrastructure-as-Code platform conversion. Together they show business-to-engineering translation, ownership, engineering judgment and handling of ambiguity. This is the first epic that builds the reusable work-story components (Story Card, Decision Block, Outcome Block, Capability Signal, the work-story detail page) against real content. Epic 3 reuses them unchanged. It also replaces the homepage's Exploration and Evidence & Highlights sections with three path cards, adds the `highlight` frontmatter block and the per-route `useDocumentMeta` hook, and closes the content-pipeline gaps that Epic 1 deferred until real content existed. Both stories are fully sourced in the PRD addendum (ES-1 and ES-2).

## Stories

- Story 2.1: Work-Story Presentation Components
- Story 2.2: Work Story Detail Page
- Story 2.3: Engineering Path Index — Summary Scan & Selection
- Story 2.4: Author the Auth.RcmAppAccessWatcher Story
- Story 2.5: Author the Azure Infrastructure-as-Code Platform Story
- Story 2.6: Homepage Path Cards

## Requirements & Constraints

- **Evidence over adjectives:** a story qualifies because it shows a target capability, not because it uses an interesting technology. Each claim needs a specific decision, number or outcome behind it. Stories are text-first, and diagrams are preferred over photography.
- **What the evidence must show:**
  - Translating business needs into engineering decisions.
  - Owning work from ambiguity through delivery, with Alisha's part kept distinct from the team's.
  - Decisions with their constraints, rationale, tradeoffs and consequences, including choosing an appropriate level of investment.
  - Handling ambiguity.
- **Confidentiality ("show the thinking, not the secrets"):**
  - Leave out proprietary architecture, customer information, internal system names, sensitive metrics, secrets and sensitive operational details.
  - ES-1: Alisha cleared `Auth.RcmAppAccessWatcher`, InmarOne and RCM for public use.
  - ES-2: the product or system name must **never** appear in the `.mdx`, its frontmatter or any committed document. Call it "the platform". Terraform, Azure, Cosmos DB, Container Apps, Key Vault, Azure DevOps and Akamai are allowed. Alisha reviews the masking before the story is marked done.
- **Name confirmation:**
  - Every company, product, system or application name in a story is listed, in its external form, in the story spec or PR description, and Alisha confirms the list.
  - A name without confirmation is left out or described generically.
  - Never commit a list of names to avoid.
  - CI cannot enforce this.
- **Metrics are claims:** print a metric only when the story can say exactly what it counts. The RCM figure is **4,500 syncs a day, up from 2,000**. It is never "users", because the same user is synced several times a day.
- **Quality floor:**
  - WCAG 2.2 AA.
  - Pointer targets at least 24×24 CSS px.
  - Visible, logically ordered focus.
  - Nothing hover-only, and color is never the only cue.
  - Mobile is first-class, with deep-story readability holding at mobile widths.
  - Reduced-motion fallbacks.
  - No placeholder content, and everything committed to `main` is public-safe.
- **Drafts:** a `draft: true` story is unreachable by slug, and its body never enters `dist`.

## Technical Decisions

- **Frontmatter is the only source of summaries:** Story Cards, path indexes and homepage path cards render only from frontmatter, never from separately authored prose. `capabilities` comes only from the controlled vocabulary: `business-to-engineering`, `ownership`, `engineering-judgment`, `ambiguity` and `enablement`.
- **New `highlight` block (Story 2.4)**, on both the `work` and `personal` schemas: `highlight?: { headline, metric?, unit? }`.
  - Every field is a non-empty string.
  - `unit` without `metric` is rejected, and so are unknown keys.
  - A non-draft entry with `featured` and no `highlight` fails the build, naming the file.
  - The card's supporting line is the existing `summary`.
  - `plugins/contentFrontmatter.ts` enforces all of this at build time.
- **Content-pipeline checks (Epic 1 retro A-10), owned by the first content story** (2.4, or 2.5 if it lands first):
  - A registry test runs the real `registry.ts` globs, not the fixture registry and not a mock, against the committed entry. It asserts that the frontmatter fields load and the body loader resolves.
  - `hero` becomes `{ src, alt }` for both schemas. `src` is a path inside `src/assets/media/` and `alt` is required. A non-draft `hero` that doesn't resolve fails the build.
  - Two non-draft entries in one path with the same `featured` value fail the build, naming both files.
  - Valid and invalid fixtures cover every new rule.
- **Ordering is total, on every surface:** `featured` ascending, then `date` descending, then `title`. Path-card slides are that path's featured entries in this order. There is no separate carousel or featured list.
- **Deep-story structure:**
  - Canonical section order: Context · Problem/Ambiguity · Constraints · Ownership · Decision · Rationale · Tradeoffs · Collaboration · Outcome · Reflection.
  - Context, Decision and Outcome are always present. The others appear only when there is real evidence, and none is padded to fill the set.
- **MDX whitelist:**
  - `DecisionBlock`, `OutcomeBlock`, `CapabilitySignal` and `StorySection` are exported from `src/mdx-components.tsx`.
  - Each MDX file imports them explicitly. There is no `MDXProvider`.
  - Components take props only and never read the registry.
- **One shared detail page:** `/engineering/:slug` and `/leadership/:slug` both render the same `WorkStoryPage`. The page has exactly one `<h1>` (the story title), a correct heading hierarchy and an `<article>` landmark.
- **MDX prose styling:** `App.css` is gone, so story bodies need their own prose styles from the `type-*` scale and role tokens:
  - block spacing;
  - heading levels below the page `h1`;
  - `text.primary` and `text.secondary` colors.
  These styles are scoped to the story body and never come from bare global element rules (`globalCss.test.ts` guards this).
- **`useDocumentMeta` (Story 2.2, Epic 1 retro A-7):** one hook, `useDocumentMeta({ title, description, jsonLd? })` in `src/lib/useDocumentMeta.ts`, used as progressive enhancement.
  - A story sets the title to its `title` plus the site name, sets the description to `summary`, and adds `Article` JSON-LD.
  - On unmount it restores the static `index.html` title and description and removes the JSON-LD it added.
  - A test checks that nothing leaks after navigating away.
  - The static `index.html` head stays the single owner of identity wording. There is no SSG or prerender.
- **Tokens:**
  - Semantic role tokens only, gated by `semanticTokens.test.ts`.
  - The focus ring is a solid 2px `brand.primary` with a 2px offset.
  - `brand.primaryFill` is `#A73E6C` and `accent.secondaryFill` is `#4F63D8`.
  - `--brand-primary-fill-hover` does not exist. Use the `brand.primary` glow for hover.
  - `cssVar` is built only alongside the first JavaScript code that reads a color.
  - Rounded corners: 0.5rem default, 0.375rem for controls, full pill for chips and capability signals.
- **Motion:** `usePrefersReducedMotion` is the only source of the reduced-motion signal. The ~180ms cross-fade becomes instant under reduced motion, and no transition ever gates content.
- **Open carry-overs to watch:**
  - Extend the AD-10 source scan to `.mdx` story bodies once the first one exists (2.4).
  - Run `expectNoFlowbiteDefaults` on every new flowbite-using component, since flowbite `dark:` defaults still leak outside the header and footer.
  - Epic 1 retro A-11 (open, no story assigned): fix `ExternalLink`'s whole-label `white-space: nowrap` before the first multi-word outbound link ships; only the last word and the arrow should be no-wrap. Adding `og:image`/`twitter:image` from a stable `public/` headshot copy and repointing the JSON-LD `image` is deferred, tied to the Epic 4 AboutMe removal. Epic 2 doesn't need it.

## UX & Interaction Patterns

- **Story Card:** title, one-liner/problem class, role and capability tags. A visitor can tell the problem class, why it mattered, Alisha's role and the capability shown without opening the story. Story Card and the path cards together fill the "Evidence Summary" role, so no separate component is built for it.
- **Decision and Outcome Blocks:** the Decision Block foregrounds the decision, rationale and tradeoffs. The Outcome Block foregrounds what changed. The layout puts these blocks ahead of plain prose.
- **Capability Signal** is a hypothesis to validate with a real visitor. Its labels come from the controlled vocabulary only.
- **Index to story:** a ~180ms cross-fade that keeps the selected story's title and context visible.
- **Path cards (UX-031):**
  - Recognition is followed by one section of three cards labeled exactly "Engineering", "Leadership & Enablement" and "Beyond the Code".
  - A live card shows the label, an optional metric and unit, the `highlight.headline`, the `summary` and a "Read the story →" link.
  - That link is the only link on the card. Its hit area is stretched over the whole card, and a code comment says this is intentional. It opens the current slide's story directly.
  - Hover steps the border up one level and underlines the link. Focus shows one ring around the card. The card never looks like a button.
  - A path with more than one featured story gets previous and next buttons with an "N of M" count.
    - The buttons sit above the stretched link area, and tab order is the link, then the buttons.
    - Their accessible names include the path, e.g. "Next Engineering highlight".
    - Slides never auto-advance and change with the ~180ms cross-fade.
    - Inactive slides are hidden from keyboard and assistive technology, and a slide change is announced politely.
    - A path with one story shows no buttons and no count.
  - A path with no story gets a non-link card (no `aria-disabled`) with the text "Coming soon" and a one-line path description from `src/lib/paths.ts`. That state comes from the registry, not a flag.
  - At release, Engineering is live and the other two are Coming soon. `/leadership` and `/beyond` stay reachable from the header and keep their "no stories published yet" state.
  - Beyond the Code never uses evidence framing and never shows a metric.
  - Cards stack on mobile and sit in three columns from `md`.
- **Visual hierarchy:** borders and background steps, never stacked shadows. Links are `brand.primary` and underline on hover and focus.

## Cross-Story Dependencies

- Epic 1 is done and supplies the shell, routes, registry, schema, tokens and path-index mechanism. Its hardening work (A-1 through A-6) has landed, so `App.css` is gone and the AD-10 gate is active.
- 2.1 comes before 2.2, 2.3, 2.4 and 2.5, which all use its components.
- 2.2 provides the detail page, the cross-fade, prose styling and `useDocumentMeta`. 2.3 links to it.
- 2.3 reuses the Story 1.7 index mechanism, changing only how cards render and how they are ordered. No route or registry changes.
- 2.4 adds the `highlight` schema and the A-10 pipeline checks. If 2.5 lands first, the A-10 checks move to it.
- 2.4 and 2.5 each set `featured` and `highlight`, so both feed the Engineering path card. Their `featured` values must differ.
- 2.6 depends on the `highlight` schema and on at least one featured Engineering story. It removes the `ExplorationPaths` and `EvidenceHighlights` components and their tests, and updates `mockups/key-homepage.html` in the same change.
- Epic 3 reuses 2.1 and 2.2 unchanged (Leadership shares `WorkStoryPage`). Its path card turns live with no code change once Leadership content is published.
