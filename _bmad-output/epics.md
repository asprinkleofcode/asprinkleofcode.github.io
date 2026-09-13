---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/PRD.md
  - _bmad-output/addendum.md
  - _bmad-output/architecture/ARCHITECTURE-SPINE.md
  - _bmad-output/DESIGN.md
  - _bmad-output/EXPERIENCE.md
  - _bmad-output/specs/spec-portfolio/SPEC.md
  - _bmad-output/specs/spec-portfolio/glossary.md
  - _bmad-output/specs/spec-portfolio/exploration-paths.md
  - _bmad-output/specs/spec-portfolio/professional-storytelling.md
  - _bmad-output/specs/spec-portfolio/release-quality-floor.md
---

# Alisha Sprinkle Korba Portfolio - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the Alisha Sprinkle Korba Portfolio, decomposing the requirements from `PRD.md` v0.8 (+ `addendum.md`, the same date), the UX design contract (`DESIGN.md` v0.6 + `EXPERIENCE.md` v0.8), `ARCHITECTURE-SPINE.md` (updated 2026-09-13), and the `spec-portfolio` SPEC set into implementable stories, optimized for upload to a GitHub Project.

**Re-extraction note (2026-09-13):** this supersedes a step-1 pass from 2026-09-11 that predated the current `ARCHITECTURE-SPINE.md` (which added AD-20), the new `addendum.md`, and the current `SPEC.md`. The FR/NFR set itself is unchanged in substance between the two passes — only the Additional Requirements and UX Design Requirements sections picked up real deltas (AD-20, the now-resolved care-guide status, and the two confirmed Engineering story selections). See "Known cross-document staleness" at the end of Additional Requirements for one still-open inconsistency between documents.

## Requirements Inventory

### Functional Requirements

FR-1: The landing experience must establish Alisha's identity and professional role (**Senior Software Engineer**), either directly or through an immediately accessible adjacent experience. The title should be presented naturally, not repeated throughout.

FR-2: The landing experience must create an engaging, cohesive first impression conveying a confident, approachable professional identity — fun and outgoing without quirky/gimmicky presentation.

FR-3: The landing experience must make the portfolio's distinct exploration paths apparent enough that a visitor can choose how to understand Alisha without reading the entire site. At minimum: Engineering / Technical, Leadership / Enablement, Beyond the Code. Visitor-facing labels are fixed: **"Engineering"**, **"Leadership & Enablement"**, **"Beyond the Code"** (D-15).

FR-4: The Engineering / Technical path must provide evidence of technical capability and responsibility through selected professional stories. A story qualifies because it evidences a target capability, not because it uses an interesting technology. Stories are text-first, diagrams over photography (A-11).

FR-5: Professional evidence must demonstrate Alisha's ability to translate business or customer needs into engineering decisions, at an appropriate level of public detail.

FR-6: Professional evidence must demonstrate Alisha's ability to own complicated work through meaningful portions of the path from ambiguity/problem definition through delivery, distinguishing her contribution from the broader team where public-safe.

FR-7: Professional stories must provide evidence of how Alisha makes engineering decisions — constraints, rationale, tradeoffs, consequences — and that she selects an appropriate level of engineering investment rather than always maximizing sophistication.

FR-8: At least some professional evidence must demonstrate how Alisha handles ambiguous situations: getting to the root of a problem, understanding constraints, developing a viable path forward, offering sound suggestions, navigating disagreement without unnecessary conflict.

FR-9: The Leadership / Enablement path must provide evidence of how Alisha contributes to the effectiveness or growth of people around her (mentorship, onboarding, knowledge sharing, team enablement, peer/intern development, process improvements).

FR-10: Where an enablement story involves onboarding or knowledge transfer, the portfolio should make visible how Alisha converted individual knowledge into something reusable by others, when that evidence exists (e.g., the contractor/offshore onboarding guide).

FR-11: The portfolio may include contributions Alisha makes outside her formal role boundaries when they provide meaningful evidence of leadership, mentorship, or investment in others — demonstrating behavior, not implying a formal management role.

FR-12: The portfolio must provide intentional opportunities to discover personal dimensions of Alisha beyond software engineering. MVP dimensions: powerlifting and **Birdhouses** (D-18) — the visitor-facing dimension name is "Birdhouses" only, not "Birdhouse and Gourd Making"; gourds are a material/technique within the content, not part of the label.

FR-13: Personal stories must stand on their own as authentic representations of Alisha. The experience must not require an explicit claim that a hobby maps to a professional engineering capability.

FR-14: Where a personal dimension is presented as a meaningful experience rather than a simple profile detail, the visitor should have a path to explore the story, process, or context behind it — depth follows available material, not an arbitrary quota.

FR-15: Each professional evidence path must let visitors: (1) understand what the path represents, (2) scan concise story summaries, (3) select a story, (4) explore a deeper story experience. The homepage must support an informed choice without requiring full story content (C-6, A-10 — resolved by `EXPERIENCE.md` v0.8 §6.1–§6.5, UX-025).

FR-16: Deep stories must prioritize evidence, reasoning, and context over unsupported descriptive claims. Generic adjectives must not substitute for evidence.

FR-17: The portfolio must provide clear opportunities for professional visitors to continue engagement through appropriate external destinations when available. Intended destinations: **LinkedIn** and **GitHub** (D-16).

FR-18 (CONDITIONAL on A-13): The portfolio should support professional speaking visibility when Alisha has appropriate public speaking content. Speaking content must not be invented. Not an MVP deliverable — near-term follow-up once public-safe material exists.

FR-19: Where a Beyond the Code dimension has a real external presence, the portfolio should link out to it from that dimension's own context (D-17): powerlifting → powerlifting Instagram; birdhouse/gourd making → birdhouse-making Instagram. No hosted content or commerce — contextual outbound links only. Handles pending from Alisha (A-14).

FR-20: Professional stories must be expressible at a level that demonstrates Alisha's thinking and responsibility without exposing confidential information (generalized problem classes/business context, role, public-safe technologies, generalized architecture patterns, decisions, tradeoffs, collaboration patterns, generalized outcomes, lessons learned).

FR-21: Professional stories must not expose proprietary architecture, customer information, internal system names, sensitive metrics, credentials/secrets, sensitive operational details, or company-confidential implementation specifics. Governing principle: **Show the thinking, not the secrets.**

FR-22: The public experience must expose sufficient semantic content for visitors and search systems to understand Alisha's name, Senior Software Engineer role, relevant professional capabilities, and meaningful relationships among the portfolio's content.

FR-23: The experience should provide appropriate structured identity information and metadata to support search and AI discovery. *(Scope constraint: FR-22/FR-23 are satisfied at the site and person level only — `HashRouter` leaves one crawlable URL; per-story organic search discoverability is an explicit non-goal, AD-14.)*

FR-24: The entry surface must make sense to a visitor who arrives already holding one context for Alisha (most often from a talk, or a colleague's link) without requiring that context to be reproduced on the site. A visitor arriving from a talk must be able to connect what they heard to what the portfolio shows. Does not depend on a speaking surface existing (independent of FR-18/A-13).

### NonFunctional Requirements

NFR-1: The portfolio must target **WCAG 2.2 AA** conformance.

NFR-2: The portfolio must provide a usable experience across supported mobile and desktop viewport sizes.

NFR-3: The portfolio must provide a responsive, usable public experience. Specific performance budgets are established downstream (Architecture) once content/media strategy is final, consistent with the low-to-no-cost operating constraint.

NFR-4: Any publicly available version must meet the production-quality floor: core journeys work end-to-end; no known critical accessibility issues; responsive across supported viewports; no obviously broken or placeholder content; professional content is public-safe; basic performance and discoverability requirements are met. Incomplete/experimental work stays non-public until it meets this floor.

NFR-5: Motion and ambient visual effects must have an accessible reduced-motion experience (mandatory static fallback).

### Additional Requirements

**Brownfield initiative — no starter/greenfield template.** This evolves the existing Vite + React 19 SPA (Tailwind v4, `flowbite-react`, `HashRouter`) on GitHub Pages (2 routes today: `/`, `/about`). There is no starter-template bootstrap step; instead, **Architecture designates a mandatory first story of the initiative** (AD-17, see below) that all other story work is sequenced behind — this is the functional equivalent of "Epic 1 Story 1" for this brownfield project.

**AD-17 — Toolchain + compliance baseline (must be Story 1 of Epic 1, blocks all other work):** Add `typescript` (~5.9), `typescript-eslint` (^8.70), `eslint-plugin-jsx-a11y` (^6.10), `vitest` + `@testing-library/react`; add `tsconfig.json` (`strict: true`) + `tsconfig.node.json`; extend `eslint.config.js` to `**/*.{ts,tsx}`; migrate `App.jsx` / `main.jsx` to `.tsx`/`.ts` (AD-9); author the AD-10 semantic token layer (`colors.css` role tokens + new `theme.css` Tailwind `@theme` mapping + typed `aSprinkleOfCodeTheme.ts`) — without which AD-10 is unbuildable; perform AD-4 dead-scaffolding cleanup (remove the `useState` counter in `App.jsx`, the stale `NavbarBrand` `href`, the unused `react.svg`); update `AGENTS.md`'s "lint covers only `.js`/`.jsx`" note; add a light smoke test (each route renders without throwing, registry loads, no console errors). Only when `tsc --noEmit`, `eslint`, and `vitest run` all pass does `build` become `tsc --noEmit && eslint && vitest run && vite build`.

- **AD-1 (content model):** Every content piece is one `.mdx` file, one pipeline (`@mdx-js/rollup`), two frontmatter schemas discriminated by directory: `work` (`src/content/work/`, Engineering + Leadership) and `personal` (`src/content/personal/`, Beyond the Code). No CMS or backend.
- **AD-2 (frontmatter as source of truth):** Summary cards, path indexes, and homepage teasers are generated entirely from frontmatter — never separately authored prose. `capabilities` draws from a controlled vocabulary. `draft: true` removes a story at the registry/build level (body never enters `dist`). Missing/invalid required frontmatter fails the build. No empty-state shells for non-existent content. `listed: false` lets a `personal` entry (e.g. the care guide) exist without appearing in the `/beyond` index.
- **AD-3 (deep-story structure):** Canonical section order — Context · Problem/Ambiguity · Constraints · Ownership · Decision · Rationale · Tradeoffs · Collaboration · Outcome · Reflection. Context, Decision, and Outcome are always present; the other seven appear only where real evidence exists.
- **AD-4 (repo as display artifact):** Every commit to `main` — code, content, and planning artifacts — is held to the public-safe, no-scaffolding standard. `_bmad-output/` is committed except `.memlog.md` and `.working/`. Branch-and-PR only; never commit to `main`.
- **AD-5 (fixed routes, discovered content):** Route set is exactly `/`, `/engineering` + `/engineering/:slug`, `/leadership` + `/leadership/:slug`, `/beyond` + `/beyond/:slug`, and `*`. `HashRouter` only. Stories are discovered via `import.meta.glob`, never manually registered — adding a story means adding one `.mdx` file.
- **AD-6 (eager frontmatter / lazy bodies):** Registry eager-loads frontmatter only; each story body is a dynamic `import()` on its detail route; route pages are `React.lazy` + `Suspense`.
- **AD-7 (one-way dependencies):** content → registry; pages → registry/components; components → theme only (props in, no registry access); MDX bodies import only from the whitelist.
- **AD-8 (MDX whitelist):** `src/mdx-components.tsx` exports the sanctioned block set (`DecisionBlock`, `OutcomeBlock`, `CapabilitySignal`, `StorySection`, etc.); MDX files import explicitly per file, no `MDXProvider` auto-injection.
- **AD-9 (touch-to-migrate TypeScript):** New files are always `.ts`/`.tsx`. A substantively edited `.js`/`.jsx` file is migrated as a verified, typed rewrite (no implicit `any`), checked against `tsc --noEmit` + `eslint` + the smoke test.
- **AD-10 (semantic tokens only):** UI references semantic role tokens only (`--background-*`, `--text-*`, `--border-*`, `--brand-*`, `--accent-secondary*`, `--focus-ring`, `--status-*`) — never primitive ramp variables, raw hex, or raw Tailwind palette colors. JS reads colors via the typed `cssVar(name: TokenName)` helper.
- **AD-11 (remediated color values):** New/touched components use the §18a-remediated values: `--focus-ring` solid 2px `--brand-primary` with 2px offset; `--brand-primary-fill` `#A73E6C`; `--accent-secondary-fill` `#4F63D8`. `--brand-primary-fill-hover` is OPEN — does not exist as a token; use the interim glow effect instead.
- **AD-12 (single ambient layer):** One `<AmbientLayer>` component, mounted once in the app shell behind `<main>`. Contract: `aria-hidden`, `pointer-events: none`, fixed z-index below content, `prefers-reduced-motion` static render path, app must render correctly if the layer never mounts. Existing `StarBackground`, `GradientWaves`, and inline Hero sparkles fold into it or are removed when next touched.
- **AD-13 (reduced motion resolved once):** Single `usePrefersReducedMotion` hook in `src/lib/` is the only source of that signal. Summary→deep-story transition: ~180ms cross-fade, instant under reduced motion.
- **AD-14 (static discoverability):** FR-22/FR-23 met via static `index.html` — expanded `Person` JSON-LD (`knowsAbout`, `sameAs` for LinkedIn + GitHub), solid default `<title>`/description/canonical/OG/Twitter-card tags. Per-route head updates via `useDocumentMeta({ title, description, jsonLd? })` are progressive enhancement only (restores static defaults on unmount). No prerender/SSG.
- **AD-15 (semantic HTML baseline):** One `<h1>` per page, correct heading hierarchy, `<main>`/`<nav>`/`<article>`/`<section>` landmarks, meaningful link text, descriptive `alt` on every meaningful image. Enforced in part by `eslint-plugin-jsx-a11y`.
- **AD-16 (never a blank page):** App-shell React error boundary wraps the routed area (below `<Header>`, above `<Footer>`), rendering a recovery fallback with navigation intact on render/chunk-load failure. `*` route renders a not-found page that keeps header/nav.
- **AD-18 (self-sufficient entry surface):** The three exploration paths are fixed product structure and always render; story content inside them is registry-derived (AD-2's no-empty-shell rule applies to that). No route, nav entry, path card, or teaser slot may be conditional on content that doesn't exist yet (speaking/FR-18, a third Beyond-the-Code dimension, the care-guide destination) — such surfaces are purely additive later. The static `index.html` head + `Person` JSON-LD is the single canonical owner of entry-surface identity/capability wording; the Landing page must not state a different claim (smoke-tested).
- **AD-19 (scroll/focus on navigation):** One shell-level handler owns scroll and focus behavior for every route change — no page implements its own. Forward navigation: scroll to top of `<main>`, move focus to the new page's `<h1>`. Back/pop navigation: restore previous scroll position. Settles after the lazy body resolves; instant (no smooth scroll) under reduced motion.
- **AD-20 (in-portfolio documents are static assets, not outbound links) — NEW since the prior extraction:** The Birdhouses care guide (and any future in-portfolio document) is a `listed: false` `personal` entry (its own `.mdx`, own route, reachable but absent from `/beyond` and every teaser) — **not** a field merged onto the Birdhouses dimension's own entry. Its frontmatter carries an optional `pdf?: string` field naming a static asset under `public/downloads/<slug>.pdf`, served directly by GitHub Pages. Rendering is a plain same-origin `<a href>` — **no** `target="_blank"`, **no** `rel`, **no** `download` attribute (those belong to the outbound-link convention only); an optional inline `<iframe>`/`<object>` preview may accompany it with an accessible name (AD-15). No PDF-viewer library required for MVP. This directly implements PRD A-12 (resolved 2026-09-12: the care guide is a downloadable PDF hosted within the portfolio, not an external link).
- **Stack additions requiring installation:** `@mdx-js/rollup` (^3.1, `enforce: 'pre'`), `typescript` (~5.9), `typescript-eslint` (^8.70), `eslint-plugin-jsx-a11y` (^6.10), `vitest` + `@testing-library/react` (^5.0 / ^16.3), `rollup-plugin-visualizer` (^7.1, dev-only, on-demand bundle analysis).
- **Operations/deploy:** Single production environment, no staging/PR-preview. Existing `.github/workflows/main.yml` deploy runs unchanged. Pre-merge verification is local `npm run build && npm run preview` + branch review — no PR-triggered CI. Rollback = revert the commit on `main`. No CI performance/bundle-size gate for MVP; a manual Lighthouse pass (Accessibility in the 90s, homepage LCP < 2.5s on throttled mid-tier mobile) precedes each public release.
- **README update:** Document `install / dev / build / preview` (AD-4).

**Confirmed content for the Engineering path (NEW since the prior extraction — see `addendum.md`):** the minimum 2-of-2–3 story requirement (A-4) is now met. Both stories have full source material, decision/tradeoff detail, and hindsight already written in `addendum.md`, ready for story authoring in Step 2+:
- **ES-1 — `Auth.RcmAppAccessWatcher`:** an event-driven CDC/pub-sub synchronization system Alisha designed and delivered solo, closing an authorization-drift gap between a healthcare platform ("InmarOne") and its system of record ("RCM"). Fully public-safe per Alisha's verbal confirmation (2026-09-12) — system and product names may be used as-is.
- **ES-2 — Azure Infrastructure-as-Code platform conversion:** an ~11-microservice manual-provisioning-to-Terraform conversion Alisha led end-to-end, including a defense-in-depth data-protection response to a destructive Cosmos DB incident. **Confidentiality constraint (explicit, not just a default):** the underlying product/system name is proprietary and must **never** appear in any portfolio-facing or planning artifact — refer to it only as "the platform." Cloud/tool names (Terraform, Azure, Cosmos DB, Container Apps, Key Vault, Azure DevOps, Akamai) are public-safe third-party technology names.
- A third Engineering story remains an optional stretch, not required (PRD §14.3 item 1).
- Leadership & Enablement story selection (2–3) remains **open** — no candidates confirmed yet (PRD §14.3 item 2). Do not invent content for this path.

**Known cross-document staleness (flag, do not silently resolve):** `DESIGN.md` §11/§20 and `EXPERIENCE.md` §9.3/§13/§24 still describe the Birdhouses care-guide destination as **OPEN** / "a lightweight page… external link acceptable." This is superseded by PRD A-12 (resolved 2026-09-12) and `ARCHITECTURE-SPINE.md` AD-20 (2026-09-13), which the architecture spine itself flags as a pending reconciliation for `bmad-ux`, not something it corrects. Epic/story design in Step 2 should follow the more recent PRD + Architecture + `SPEC.md` CAP-7 resolution (in-portfolio downloadable PDF), not the stale UX wording.

### UX Design Requirements

**Design tokens (DESIGN.md §7, §18a):**

- UX-DR1: Implement the full semantic color token system as CSS variables — `background.{primary,secondary,recessed}`, `text.{primary,secondary,inverse}`, `border.{default,essential}`, `brand.primary`, `brand.primaryFill`, `accent.secondary`, `accent.secondaryFill`, `focus.ring`, `status.{success,error,warning}` — replacing any raw hex or Tailwind palette usage.
- UX-DR2: Apply the §18a AA-remediation values wherever a component is newly built or substantively touched: focus ring → solid 2px `brand.primary`, 2px offset (replaces 30%-alpha ring, SC 2.4.7/2.4.11 risk); `brand.primaryFill` → `#A73E6C` (replaces `#C45F87`, which fails AA at 3.9:1); `accent.secondaryFill` → `#4F63D8` (replaces `#6F82EE`, which fails AA at 3.4:1).
- UX-DR3: Treat `brand.primaryFillHover` as OPEN — do not invent a hover fill value; use the retained signature glow effect (`drop-shadow(0 0 6px)` on `brand.primary`) as the interim hover treatment, static under reduced motion.
- UX-DR4: Pair every `status.*` color usage with a non-color cue (icon, label, or shape) per WCAG SC 1.4.1 — never color alone.

**Components to build (DESIGN.md §11 — conceptual roles, names may differ in implementation):**

- UX-DR5: Header component — global orientation and navigation.
- UX-DR6: Hero component — identity and initial professional recognition.
- UX-DR7: Exploration Path component — helps visitors choose Engineering / Leadership & Enablement / Beyond the Code.
- UX-DR8: Evidence Summary component — makes professional proof scannable.
- UX-DR9: Story Card component — concise story representation for path indexes and homepage teasers.
- UX-DR10: Story Detail component — deep evidence and reasoning layout (Context → Problem/Ambiguity → Constraints → Ownership → Decision → Rationale → Tradeoffs → Collaboration → Outcome → Reflection).
- UX-DR11: Capability Signal component (HYPOTHESIS — validate with a real visitor before treating as final) — connects a story to the capability it demonstrates; capability values come from the controlled vocabulary (`business-to-engineering`, `ownership`, `engineering-judgment`, `ambiguity`, `enablement`).
- UX-DR12: Decision Block component — makes engineering reasoning visible within a deep story.
- UX-DR13: Outcome Block component — makes impact legible within a deep story.
- UX-DR14: Personal Story component — supports authentic personal exploration (powerlifting, making) without forced engineering metaphor.
- UX-DR15: Speaking Item component — represents public speaking activity; build only when public-safe content exists (conditional on FR-18/A-13; must not block or appear empty in the meantime).
- UX-DR16: External Link component/pattern — every outbound link (LinkedIn, GitHub, powerlifting Instagram, birdhouse-making Instagram) opens `target="_blank"` + `rel="noopener noreferrer"` with a visible "leaves the site" affordance.
- UX-DR17: Care Guide Link — **RESOLVED (updated from prior extraction, where this was still OPEN):** a `listed: false` `personal` entry with a `pdf?` frontmatter field pointing at a static asset under `public/downloads/`. Rendered as a plain same-origin `<a href>` — no `target`, `rel`, or `download` attribute — optionally paired with an inline `<iframe>`/`<object>` preview. Per PRD A-12 / `ARCHITECTURE-SPINE.md` AD-20 / `SPEC.md` CAP-7. (`DESIGN.md`/`EXPERIENCE.md` still show this as open — see "Known cross-document staleness" above; follow the resolution, not the stale wording.)
- UX-DR18: Footer component — closing orientation and external/social destination links.
- UX-DR19: AmbientLayer component — single mount point per AD-12; `aria-hidden`, `pointer-events: none`, static reduced-motion render path; app functions if it never mounts.

**Typography (DESIGN.md §8):**

- UX-DR20: Implement the 7-level typographic hierarchy using the system sans stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`, no web font): (1) Identity/name — ~1.5rem+, weight 700, tracking-wide; (2) Professional title — weight 500–600, sentence case; (3) Section heading — weight 600, sentence case; (4) Story title — weight 600, smaller than section heading; (5) Supporting heading — 0.75rem, weight 600, uppercase, tracking-widest; (6) Body — 1rem, weight 400; (7) Metadata — 0.875rem, weight 400, `text.secondary` token.

**Shape, elevation, motion (DESIGN.md §15–16):**

- UX-DR21: Apply `rounded` tokens — 0.5rem default (cards/buttons/panels), 0.375rem small controls, full pill (chips, capability signals).
- UX-DR22: Communicate hierarchy via borders and background steps (`background.primary` → `secondary` → `recessed`), not stacked shadows; single low `shadow` + `shadow-inner` for the footer only.
- UX-DR23: Style links as `brand.primary`, underlined on hover/focus; underline is not the sole affordance in body text (color + context carry it too).
- UX-DR24: Implement the summary→deep-story transition as a ~180ms cross-fade preserving the selected story's title/context, instant (no animation) under `prefers-reduced-motion`; the transition must never gate access to the underlying content.

**Responsive & accessibility (DESIGN.md §17–18, EXPERIENCE.md §15–16):**

- UX-DR25: Ensure mobile is a first-class experience — identity, exploration paths, evidence, deep stories, and external actions remain accessible and hierarchy-equivalent at every viewport; no critical info exists only on desktop.
- UX-DR26: Meet WCAG 2.2 AA across the whole experience: keyboard access, visible focus, sufficient contrast, semantic headings, meaningful link names, accessible controls, non-color-only communication, reduced-motion support, readable mobile text, no hover-only critical info, pointer targets ≥ 24×24 CSS px (SC 2.5.8).

**Information architecture & state behavior (EXPERIENCE.md §5–6, §14):**

- UX-DR27: Navigation structure — **RESOLVED (`EXPERIENCE.md` v0.8 §5.2, UX-015):** single, flat, top-level header row — identity (logo + name), then Home, Engineering, Leadership & Enablement, Beyond the Code — identical and sticky on every page including deep stories (no breadcrumb, no chrome change with depth); external/social links are footer-only; mobile collapses via the existing flowbite-react `NavbarToggle`/`NavbarCollapse` hamburger pattern.
- UX-DR28: Homepage composition — **RESOLVED (`EXPERIENCE.md` v0.8 §6.1–§6.5, UX-025):** three stacked sections in order — Recognition (identity, title, and the decided one-line positioning statement, D-25: *"Give me a business problem and I'll turn it into an engineering decision worth trusting."*) → Exploration (the three path entries, label-only, no teaser copy) → Evidence & Highlights (Engineering and Leadership & Enablement each get ≥1 dedicated evidence teaser; Beyond the Code gets exactly one personal-hint line, not evidence). All deeper content lives on path/story pages (C-6).
- UX-DR29: Implement the four state patterns: Cold Load (meaningful semantic content without waiting on decorative effects), Loading (never blocks identity recognition), Error (preserves navigation/recovery), Missing Content (no empty visual shells for content that doesn't exist — gracefully omit or simplify instead).
- UX-DR30: Keyboard focus must remain visible (solid ring per UX-DR2) and logically ordered across all interactive flows.

### FR Coverage Map

| Requirement | Epic |
|---|---|
| FR-1, FR-2, FR-3, FR-15 (mechanism), FR-17, FR-22, FR-23, FR-24 | Epic 1 — Foundation |
| NFR-1, NFR-2, NFR-3, NFR-4, NFR-5 | Epic 1 — Foundation (mechanism); enforced in every epic thereafter |
| AD-17 toolchain baseline | Epic 1 — Foundation, Story 1 (blocks everything else) |
| FR-4, FR-5, FR-6, FR-7, FR-8, FR-16, FR-20, FR-21 | Epic 2 — Engineering Path |
| FR-9, FR-10, FR-11 | Epic 3 — Leadership & Enablement Path (content-blocked — PRD §14.3 item 2) |
| FR-12, FR-13, FR-14, FR-19 | Epic 4 — Beyond the Code |
| AD-20 care-guide asset | Epic 4 — Beyond the Code |
| FR-18 | Excluded from MVP epic breakdown — conditional on A-13, purely additive later (AD-18) |

**Dependencies:** Epic 1 blocks Epics 2–4 (shared shell, routing, tokens, content pipeline). Epics 2, 3, and 4 are independent of each other; Epic 2 before Epic 3 lets Leadership reuse Engineering's story components with zero rework.

## Epic List

### Epic 1: Foundation — Toolchain, Content Pipeline & Entry Surface

A visitor arriving at the portfolio gets a fully upgraded entry experience — identity, title, positioning statement, the three exploration paths, working nav/footer, ambient personality layer, graceful error/not-found handling, and machine-readable identity for search — all built on a verified TypeScript/lint/test toolchain and a content pipeline (registry, frontmatter schema, MDX build wiring) ready to receive story content. Standalone and deployable on its own: the site is measurably better even before any new stories exist.

**FRs covered:** FR-1, FR-2, FR-3, FR-15 (mechanism), FR-17, FR-22, FR-23, FR-24
**NFRs covered:** NFR-1, NFR-2, NFR-3, NFR-4, NFR-5 (mechanism)
**Architecture covered:** AD-17 (mandatory Story 1), AD-1–AD-16, AD-18, AD-19

### Epic 2: Engineering Path — Professional Evidence

A visitor can browse the Engineering path, scan story summaries, and read two deep, evidence-rich stories — `Auth.RcmAppAccessWatcher` and the Azure IaC platform conversion — demonstrating business-to-engineering translation, ownership, judgment, and ambiguity handling. First epic to build the reusable work-story components (Story Card, Decision Block, Outcome Block, Capability Signal) against real content; Epic 3 reuses them unchanged.

**FRs covered:** FR-4, FR-5, FR-6, FR-7, FR-8, FR-16, FR-20, FR-21
**Content status:** Ready — both stories fully sourced in `addendum.md` (ES-1, ES-2).

### Epic 3: Leadership & Enablement Path — Developing Others

A visitor can browse the Leadership & Enablement path and see evidence of how Alisha grows the people around her. Reuses Epic 2's story components; only adds `.mdx` content and wires the path index + homepage teaser.

**FRs covered:** FR-9, FR-10, FR-11
**Content status:** Blocked — story selection is still open (PRD §14.3 item 2). The mechanism can be built now; content-authoring stories can't be completed until Alisha selects specific stories.

### Epic 4: Beyond the Code — Personal Dimensions

A visitor can discover Alisha's personal side — powerlifting and Birdhouses — as authentic, standalone stories, with a downloadable care guide and contextual outbound links to each dimension's Instagram.

**FRs covered:** FR-12, FR-13, FR-14, FR-19
**Architecture covered:** AD-20 (care guide as in-portfolio PDF asset)
**Content status:** Partial risk — Instagram handles pending from Alisha (A-14); the care-guide PDF file itself needs to be supplied. Links/downloads render only once real values exist — no placeholders (NFR-4).

**Excluded from this MVP breakdown:** FR-18 (Speaking) is conditional on public-safe material existing (A-13) and is framed by Architecture as "purely additive later" (AD-18) — not planned as a story here, since there is no content yet to build against.

---

## Epic 1: Foundation — Toolchain, Content Pipeline & Entry Surface

A visitor arriving at the portfolio gets a fully upgraded entry experience — identity, title, positioning statement, the three exploration paths, working nav/footer, ambient personality layer, graceful error/not-found handling, and machine-readable identity for search — all built on a verified TypeScript/lint/test toolchain and a content pipeline ready to receive story content. Standalone and deployable on its own.

**FRs covered:** FR-1, FR-2, FR-3, FR-15 (mechanism), FR-17, FR-22, FR-23, FR-24
**NFRs covered:** NFR-1, NFR-2, NFR-3, NFR-4, NFR-5 (mechanism)
**Architecture covered:** AD-1–AD-19

### Story 1.1: Toolchain & Compliance Baseline

As a developer maintaining the portfolio,
I want a verified TypeScript, lint, and test toolchain with an enforced build gate,
So that every subsequent change is type-checked, linted for accessibility issues, and smoke-tested before reaching production.

**Acceptance Criteria:**

**Given** the repo has no TypeScript config
**When** this story is complete
**Then** `tsconfig.json` (strict: true) and `tsconfig.node.json` exist and `tsc --noEmit` passes with zero errors

**Given** `eslint.config.js` covers only `.js`/`.jsx`
**When** this story is complete
**Then** it extends to `**/*.{ts,tsx}` with `typescript-eslint` + `eslint-plugin-jsx-a11y`, and `npm run lint` passes clean

**Given** `App.jsx`/`main.jsx` are the existing entry files
**When** this story is complete
**Then** they are migrated to `.tsx`/`.ts` as typed rewrites (no implicit `any`), behavior unchanged (AD-9)

**Given** AD-10's semantic token layer doesn't exist yet
**When** this story is complete
**Then** `colors.css` exposes the semantic role tokens, a new `theme.css` maps them via a Tailwind v4 `@theme` block, and `aSprinkleOfCodeTheme.ts` references only role tokens

**Given** DESIGN §8 (typography) and §15 (shape/elevation) define token values that don't exist in the codebase yet
**When** this story is complete
**Then** `theme.css` also encodes the 7-level typographic hierarchy (UX-DR20) and the `rounded` scale — `0.5rem` default, `0.375rem` control, full pill (UX-DR21) — as reusable Tailwind utilities/tokens, available for every component built in later epics

**Given** known dead scaffolding (the `useState` counter, the stale `NavbarBrand` href, the unused `react.svg`)
**When** this story is complete
**Then** all three are removed (AD-4)

**Given** `AGENTS.md` says lint covers only `.js`/`.jsx`
**When** this story is complete
**Then** that note is updated to reflect `.ts`/`.tsx` coverage

**Given** no automated test exists
**When** this story is complete
**Then** a `vitest` + `@testing-library/react` smoke test asserts every route renders without throwing and with no console errors

**And** `npm run build` runs `tsc --noEmit && eslint && vitest run && vite build`, all passing

### Story 1.2: Content Registry & Frontmatter Schema

As a developer adding portfolio content,
I want a build-time registry that discovers `.mdx` files and validates their frontmatter against a typed schema,
So that adding a story is just adding one file — no registry or route edit required.

**Acceptance Criteria:**

**Given** `@mdx-js/rollup` isn't installed
**When** this story is complete
**Then** it is added with `enforce: 'pre'` ahead of `@vitejs/plugin-react` (AD-1)

**Given** two content types exist, work and personal
**When** this story is complete
**Then** `src/lib/frontmatter.ts` validates both schemas and rejects unknown keys

**Given** no registry exists yet
**When** this story is complete
**Then** `src/lib/registry.ts` uses `import.meta.glob(..., { eager: true, import: 'frontmatter' })` keyed by type + path + slug (AD-5), with bodies resolved via a separate dynamic `import()` (AD-6)

**Given** invalid or missing required frontmatter on a content file
**When** the build runs
**Then** it fails with a clear error (AD-2)

**Given** `draft: true` on a content file
**When** the registry builds
**Then** that story's body is excluded from the production bundle entirely, not merely hidden at render (AD-2, NFR-4)

**Given** `src/mdx-components.tsx` doesn't exist
**When** this story is complete
**Then** it exists as the sanctioned MDX block whitelist, consumed via explicit per-file imports, no `MDXProvider` auto-injection (AD-8)

**And** with zero `.mdx` files present, the registry returns an empty index without error

### Story 1.3: App Shell — Routing, Error Handling & Navigation Behavior

As a visitor navigating the portfolio,
I want every route to load reliably, recover gracefully from errors, and land me in the right scroll/focus position,
So that I never see a blank page or lose my place when I navigate.

**Acceptance Criteria:**

**Given** AD-5's fixed route table
**When** this story is complete
**Then** `HashRouter` registers `/`, `/engineering` + `/engineering/:slug`, `/leadership` + `/leadership/:slug`, `/beyond` + `/beyond/:slug`, and `*`, loaded via `React.lazy` + `Suspense` (AD-6)

**Given** no detail-page component exists yet
**When** this story is complete
**Then** each detail route renders a minimal placeholder (to be replaced by Epic 2/4 content) rather than erroring

**Given** a render or chunk-load failure occurs
**When** it does
**Then** an app-shell error boundary (below Header, above Footer) renders a recovery fallback with navigation intact (AD-16)

**Given** a visitor navigates to an undefined path
**When** they do
**Then** the `*` route renders a not-found page that keeps the header/nav and offers a route home (AD-16)

**Given** the initial page load, before any decorative effects (ambient layer) have painted
**When** a visitor's connection is slow
**Then** the page already exposes meaningful semantic content — identity, nav — without waiting on those effects (EXPERIENCE §14 Cold Load)

**Given** a lazy route or story body is still loading
**When** the `Suspense` fallback is showing
**Then** it never blocks basic identity recognition (the header/shell stays visible throughout) and never steals scroll or focus against its own height (EXPERIENCE §14 Loading, AD-19)

**Given** a visitor navigates forward to a new route
**When** the new page's lazy body resolves
**Then** scroll moves to the top of `<main>` and focus moves to the new page's `<h1>` (AD-19)

**Given** a visitor uses the browser back/pop action
**When** they do
**Then** their previous scroll position is restored (AD-19)

**Given** `usePrefersReducedMotion` reports reduced motion
**When** a route changes
**Then** scrolling is instant, never smooth (AD-19, AD-13)

**And** a shared `--header-height` custom property drives `scroll-padding-top`/`scroll-margin-top` so content never lands hidden under the sticky header

### Story 1.4: Header, Footer & Navigation

As a visitor on any page of the portfolio,
I want a consistent header with the three exploration paths and a footer with professional/social links,
So that I can orient myself and reach any part of the site or Alisha's external profiles from anywhere.

**Acceptance Criteria:**

**Given** UX-DR27
**When** any page renders
**Then** the header shows a single flat sticky row — identity (logo + name), Home, Engineering, Leadership & Enablement, Beyond the Code — identical on every page including deep stories

**Given** the header must work on mobile
**When** the viewport narrows
**Then** the row collapses via the existing flowbite-react `NavbarToggle`/`NavbarCollapse` hamburger pattern

**Given** the brand mark is currently invisible on the dark background
**When** the header renders
**Then** the cupcake icon recolors to `brand.primary` in the header (favicon stays the original unrecolored asset) (DESIGN §6)

**Given** external/social destinations must be footer-only (UX-DR16, UX-DR27)
**When** the footer renders
**Then** it shows LinkedIn and GitHub as outbound links (`target="_blank"`, `rel="noopener noreferrer"`, a visible "leaves the site" affordance), using the real URLs already present in `index.html`'s `sameAs` (FR-17)

**Given** Instagram handles are not yet supplied (A-14)
**When** the footer renders
**Then** no powerlifting/birdhouse-making Instagram link appears — not stubbed or invented; added by Epic 4 once handles exist

**Given** UX-DR25/NFR-2 (mobile is a first-class experience)
**When** the header and footer are viewed at supported mobile and desktop widths
**Then** identity, the path links, and every footer destination stay reachable and legible at both — nothing here is desktop-only

**And** keyboard-only navigation through header and footer shows a logical focus order with the solid `focus.ring` on every interactive element (UX-DR2, UX-DR30)

### Story 1.5: Ambient Layer

As a visitor browsing the portfolio,
I want a subtle ambient visual layer that reflects personality without interfering with content,
So that the site feels distinctly Alisha's without compromising readability, performance, or accessibility.

**Acceptance Criteria:**

**Given** AD-12
**When** the app shell renders
**Then** exactly one `<AmbientLayer>` component is mounted once, behind `<main>`, never imported per-page

**And** it carries `aria-hidden`, `pointer-events: none`, and a fixed z-index below all content

**Given** `prefers-reduced-motion` is set
**When** the layer renders
**Then** it uses a static, non-animated render path (AD-13, NFR-5)

**Given** the layer fails to mount or is removed
**When** that happens
**Then** the rest of the app still renders and functions correctly (AD-12)

**And** the existing `StarBackground`, `GradientWaves`, and inline Hero sparkle implementations are folded into `<AmbientLayer>` or removed, leaving a single implementation

### Story 1.6: Homepage Recognition & Discoverability

As a visitor landing on the portfolio for the first time,
I want to immediately understand who Alisha is, her role, and what she does — both on the page and for anyone sharing the link,
So that I recognize her identity within a few seconds, whether I read the page or just see a shared preview or search result.

**Acceptance Criteria:**

**Given** FR-1/FR-2 and UX-DR6/UX-DR28
**When** a visitor lands on `/`
**Then** the Recognition section shows "Alisha Sprinkle Korba", "Senior Software Engineer", and the decided positioning statement ("Give me a business problem and I'll turn it into an engineering decision worth trusting.") directly beneath the name/title (D-25)

**Given** AD-14
**When** the page is requested by a crawler or shared to a preview-generating service
**Then** static `index.html` carries an expanded `Person` JSON-LD (`knowsAbout`, `sameAs` for the real LinkedIn + GitHub URLs), plus solid default `<title>`, description, canonical, and Open Graph/Twitter-card tags

**Given** AD-18
**When** the Landing page's identity block is compared to the static head's `Person` JSON-LD
**Then** they state the same identity/capability claim — verified by the AD-17 smoke test

**Given** AD-15
**When** the homepage renders
**Then** it has exactly one `<h1>`, a correct heading hierarchy beneath it, and appropriate `main`/`nav` landmarks

**And** a visitor arriving already holding context about Alisha (FR-24) recognizes the identity/positioning statement as the same person, with no dependency on a speaking surface existing

### Story 1.7: Homepage Exploration Paths & Path Indexes

As a visitor deciding how to explore the portfolio,
I want to see the three distinct ways to understand Alisha and be able to visit each one, even before every path has stories yet,
So that I can choose where to go without reading the whole site, and the site never shows me a broken or dead-end path.

**Acceptance Criteria:**

**Given** UX-DR28 (Exploration section is label-only)
**When** a visitor views the homepage
**Then** it shows the three path entries — Engineering, Leadership & Enablement, Beyond the Code — as a distinct section, without teaser copy attached (FR-3)

**Given** UX-DR28 (Evidence & Highlights section)
**When** a visitor scrolls past Exploration
**Then** a separate Evidence & Highlights section exists with a slot for each professional path's teaser and Beyond the Code's personal-hint line; with zero content authored yet, each slot gracefully omits rather than rendering an empty card (AD-2, EXPERIENCE §14 Missing Content)

**Given** AD-5
**When** a visitor clicks any of the three path entries
**Then** they navigate to `/engineering`, `/leadership`, or `/beyond` respectively, and each index page renders (FR-15 mechanism)

**Given** the registry has zero content for a path
**When** that path's index page renders
**Then** it shows a graceful "no stories published yet" state rather than an empty visual shell or a broken layout (AD-2, AD-18 — a content gap to fill, not a path to hide)

**And** once a path index later gains content (Epics 2–4), the same index page renders that content with no further code change to the index page itself (AD-2, AD-5)

**Given** UX-DR25/NFR-2 (mobile is a first-class experience)
**When** the homepage — Recognition, Exploration, and Evidence & Highlights — is viewed at supported mobile and desktop widths
**Then** the same information hierarchy holds at both: professional identity, the three paths, and any teaser content all stay immediately understandable and reachable, with no critical information exposed only on desktop (DESIGN §17)

---

## Epic 2: Engineering Path — Professional Evidence

A visitor can browse the Engineering path, scan story summaries, and read two deep, evidence-rich stories — `Auth.RcmAppAccessWatcher` and the Azure IaC platform conversion — demonstrating business-to-engineering translation, ownership, judgment, and ambiguity handling. First epic to build the reusable work-story components against real content; Epic 3 reuses them unchanged.

**FRs covered:** FR-4, FR-5, FR-6, FR-7, FR-8, FR-16, FR-20, FR-21
**Content status:** Ready — both stories fully sourced in `addendum.md` (ES-1, ES-2).

### Story 2.1: Work-Story Presentation Components

As a developer building the Engineering and Leadership paths,
I want reusable Decision Block, Outcome Block, Capability Signal, and Story Card components,
So that every deep story and every path index renders reasoning and evidence consistently, and Leadership can reuse them without rebuilding anything.

**Acceptance Criteria:**

**Given** AD-8's whitelist
**When** this story is complete
**Then** `DecisionBlock`, `OutcomeBlock`, `CapabilitySignal`, and `StorySection` are exported from `src/mdx-components.tsx` and consumable only via explicit per-file MDX imports

**Given** the Decision Block and Outcome Block roles (DESIGN §11)
**When** a story body uses them
**Then** Decision Block visually foregrounds the decision, rationale, and tradeoffs, and Outcome Block foregrounds what changed as a result (FR-16)

**Given** UX-DR11 (Capability Signal is HYPOTHESIS)
**When** it renders
**Then** it draws its capability label only from the controlled vocabulary (`business-to-engineering`, `ownership`, `engineering-judgment`, `ambiguity`, `enablement`) — never free text

**Given** UX-DR9 (Story Card)
**When** a path index or homepage teaser renders a story
**Then** the Story Card shows title, one-liner/problem class, role, and capability tags — generated entirely from frontmatter, never separately authored prose (AD-2). Story Card, together with the homepage Evidence & Highlights section (Story 1.7), is what satisfies DESIGN §11's "Evidence Summary" component role (UX-DR8) — no separate component is built for it.

**Given** UX-DR1/UX-DR2 tokens
**When** any of these components render
**Then** they use semantic role tokens only, with the remediated focus ring and fill values (AD-10, AD-11)

**Given** DESIGN §15 (UX-DR22, UX-DR23)
**When** any of these components render
**Then** hierarchy is communicated via borders and background steps, never stacked shadows, and any link is `brand.primary`, underlined on hover/focus

**And** each component is tested against fixture frontmatter/content to verify it doesn't throw with realistic data shapes

### Story 2.2: Work Story Detail Page

As a visitor who has selected a professional story,
I want to read its full reasoning — context, decision, outcome, and whatever else applies — in one consistent layout,
So that I understand how Alisha operated, not just what she worked on.

**Acceptance Criteria:**

**Given** AD-3
**When** a work story's body renders
**Then** the canonical section order is Context · Problem/Ambiguity · Constraints · Ownership · Decision · Rationale · Tradeoffs · Collaboration · Outcome · Reflection, with Context, Decision, and Outcome always present

**Given** AD-3
**When** a section has no real evidence for a story
**Then** it is simply absent — no section is invented or padded to complete the set

**Given** `/engineering/:slug` and `/leadership/:slug` both render work-type stories
**When** either route resolves a valid slug
**Then** the same `WorkStoryPage` component renders it (shared, not duplicated)

**Given** a visitor selects a story from an index
**When** the transition to the deep story is initiated
**Then** it is a ~180ms cross-fade preserving the story's title/context, instant under reduced motion, and never gates access to the content (UX-DR24, AD-13)

**Given** AD-15
**When** a deep story renders
**Then** it has exactly one `<h1>` (the story title), correct heading hierarchy for its sections, and an `<article>` landmark

**Given** `draft: true` on a story
**When** a visitor requests its slug directly
**Then** it is not reachable (AD-2, NFR-4)

**Given** UX-DR25/NFR-2 and EXPERIENCE §15 (deep-story readability must hold on mobile)
**When** a deep story is read at a supported mobile width
**Then** the full section content, Decision/Outcome/Capability blocks, and reading measure remain readable without loss of hierarchy

**And** FR-16 is satisfied structurally: the layout foregrounds Decision/Rationale/Tradeoffs/Outcome blocks over plain prose, so generic adjectives cannot substitute for the required evidence sections

### Story 2.3: Engineering Path Index — Summary Scan & Selection

As a visitor exploring the Engineering path,
I want to scan concise story summaries and pick one to read deeply,
So that I can form a view of Alisha's technical capability without reading full case studies first.

**Acceptance Criteria:**

**Given** FR-15
**When** a visitor lands on `/engineering`
**Then** it lists Story Cards for every non-draft `work` story with `path: engineering`, ordered by `featured` ascending then `date` descending then `title` (Architecture Conventions: Index ordering)

**Given** DESIGN §12
**When** a Story Card renders
**Then** a visitor can tell the problem class, why it mattered, Alisha's role, and the demonstrated capability without opening the story

**Given** a visitor selects a Story Card
**When** they click it
**Then** they land on that story's `/engineering/:slug` detail page via the cross-fade transition (Story 2.2)

**Given** FR-4
**When** the index is reviewed
**Then** every listed story's Capability Signal(s) trace to a target capability, not merely an interesting technology

**And** this story reuses Epic 1's generic path-index mechanism (Story 1.7) — no route or registry changes, only the Story Card rendering and ordering logic

### Story 2.4: Author the Auth.RcmAppAccessWatcher Story

As a professional visitor evaluating Alisha's engineering ability,
I want to read the Auth.RcmAppAccessWatcher story in full depth,
So that I see concrete evidence of business-to-engineering translation, ownership, engineering judgment, and ambiguity handling.

**Acceptance Criteria:**

**Given** `addendum.md` ES-1
**When** the `.mdx` file is authored
**Then** it covers Context (InmarOne/RCM authorization gap), Ambiguity (first integrator, no prior pattern), Ownership (solo, end-to-end), Decision (CDC via Debezium, event-driven pub/sub), Rationale/Tradeoffs (at minimum the CDC-vs-polling and event-driven-vs-synchronous decisions with their stated tradeoffs), Collaboration (cross-team with the InmarOne platform team), Outcome (2,000→4,500 users/day, eliminated manual provisioning), and Reflection (at least the deployment-strategy and upstream-data-model hindsight points) (AD-3, FR-5–8)

**Given** Alisha's verbal confirmation that ES-1 is fully public-safe (2026-09-12)
**When** the story is authored
**Then** real system/product names (`Auth.RcmAppAccessWatcher`, InmarOne, RCM) may be used as-is (FR-20)

**Given** FR-16
**When** the story is reviewed
**Then** every claim is backed by the specific decisions, numbers, or outcomes in `addendum.md` — no generic adjectives standing in for evidence

**Given** AD-2
**When** frontmatter is written
**Then** `capabilities` draws only from the controlled vocabulary, and `featured` is set so this story is eligible for the homepage teaser (Story 2.6)

**And** Decision Block / Outcome Block (Story 2.1) are used for at least the CDC decision and the scale/impact outcome

### Story 2.5: Author the Azure Infrastructure-as-Code Platform Story

As a professional visitor evaluating Alisha's engineering ability,
I want to read the Azure IaC platform conversion story in full depth,
So that I see evidence of architecture/infrastructure judgment, ownership of a multi-month initiative, and engineering judgment under real operational risk.

**Acceptance Criteria:**

**Given** `addendum.md` ES-2
**When** the `.mdx` file is authored
**Then** it covers Context (manually provisioned, no QA/UAT/Prod environments), Ambiguity (no team Terraform experience, GCP→Azure translation), Ownership (sole architect, later infrastructure technical lead), Decision (reusable-platform-first architecture, environment-isolated backends), Rationale/Tradeoffs (at minimum the opinionated-baseline-module decision and its explicitly-flagged hindsight), Collaboration (teaching teammates, ADRs, conversion wiki), Outcome (Dev→QA→UAT in ~3 months, later Production, standardized tagging), and Reflection (the module-boundary and Key Vault hindsight points) (AD-3, FR-5–8)

**Given** the explicit confidentiality constraint on ES-2
**When** the story is authored
**Then** the underlying product/system name never appears anywhere in the `.mdx` file or its frontmatter — it is referred to only as "the platform" (FR-21)

**Given** the same constraint
**When** third-party tool/platform names are used
**Then** Terraform, Azure, Cosmos DB, Container Apps, Key Vault, Azure DevOps, and Akamai may appear as-is, since they are public-safe third-party technology names, not the employer's system name (FR-20)

**Given** the Cosmos DB destructive-replace incident in `addendum.md`
**When** the story covers it
**Then** it is presented as a decision/outcome highlight (defense-in-depth data-protection strategy) rather than a footnote, per the addendum's own framing

**Given** AD-2
**When** frontmatter is written
**Then** `capabilities` draws only from the controlled vocabulary, and `featured` is set so this story is eligible for the homepage teaser (Story 2.6)

**And** before this story is marked done, a reviewer (Alisha) confirms the masking holds — no proprietary name leaked — since this is a hard confidentiality constraint, not a style preference

### Story 2.6: Homepage Engineering Evidence Teaser

As a time-boxed visitor scanning the homepage,
I want to see at least one concise, high-signal Engineering evidence teaser without leaving the homepage,
So that I can judge Alisha's technical credibility within my ~90-second budget.

**Acceptance Criteria:**

**Given** UX-DR28 (Evidence & Highlights)
**When** the homepage renders
**Then** the Engineering slot (built empty in Epic 1 Story 1.7) now shows at least one teaser drawn from a `featured` Engineering story (FR-15, SM-1)

**Given** Architecture's index-ordering convention
**When** more than one Engineering story is `featured`
**Then** the lowest `featured` value appears first

**Given** the teaser is frontmatter-derived (AD-2)
**When** it renders
**Then** it shows only fields already defined in frontmatter — no separately authored homepage-only copy

**And** clicking the teaser navigates to that story's detail page directly (not via the Engineering index first)

---

## Epic 3: Leadership & Enablement Path — Developing Others

A visitor can browse the Leadership & Enablement path and see evidence of how Alisha grows the people around her. Reuses Epic 2's story components; only adds `.mdx` content and wires the path index + homepage teaser.

**FRs covered:** FR-9, FR-10, FR-11
**Content status:** Blocked — story selection is still open (PRD §14.3 item 2). The mechanism can be built now; content-authoring stories can't be completed until Alisha selects specific stories.

### Story 3.1: Leadership & Enablement Path Index & Homepage Teaser

As a visitor exploring how Alisha develops the people around her,
I want to browse the Leadership & Enablement path and see its evidence highlighted on the homepage once content exists,
So that I can scan and select leadership stories the same way I can Engineering stories.

**Acceptance Criteria:**

**Given** AD-1 (Leadership stories share the exact same `work` schema and AD-3 section model as Engineering)
**When** a `.mdx` file with `path: leadership` is added
**Then** it renders via the same `WorkStoryPage`, `StoryCard`, `DecisionBlock`, `OutcomeBlock`, and `CapabilitySignal` components built in Epic 2 — no new components are required

**Given** FR-15
**When** a visitor lands on `/leadership`
**Then** it lists Story Cards for every non-draft `work` story with `path: leadership`, ordered by `featured` ascending then `date` descending then `title` — verified with fixture content since no real story exists yet

**Given** UX-DR28
**When** the homepage renders
**Then** the Leadership & Enablement slot in Evidence & Highlights (built empty in Epic 1 Story 1.7) is wired to show a `featured` Leadership story's teaser once one exists, using the same mechanism as Story 2.6

**Given** zero real Leadership content exists at the time this story ships
**When** `/leadership` and the homepage teaser slot render
**Then** both show the graceful "no stories yet" state from Story 1.7 — this story delivers the mechanism, not the content

**And** this story requires no changes to the registry, routing, or shared components — verification only, given AD-5/AD-1's design already generalizes to any `work` path value

### Story 3.2: Author Leadership & Enablement Stories

As a professional visitor evaluating how Alisha develops others,
I want to read 2–3 real Leadership & Enablement stories,
So that I see concrete evidence of mentorship, onboarding, knowledge sharing, or team enablement — not a placeholder.

**Status:** BLOCKED — cannot start until Alisha selects specific stories (PRD §14.3 item 2). Do not invent candidates or content.

**Acceptance Criteria (to satisfy once unblocked):**

**Given** FR-9
**When** story candidates are selected and supplied
**Then** at least one story demonstrates Alisha contributing to the effectiveness or growth of people around her (mentorship, onboarding, knowledge sharing, team enablement, peer/intern development, or process improvement)

**Given** FR-10
**When** a selected story involves onboarding or knowledge transfer (e.g., the contractor/offshore onboarding guide mentioned in PRD §5.2)
**Then** the story makes visible how individual knowledge became something reusable by others

**Given** FR-11
**When** a story involves contribution outside Alisha's formal role boundaries
**Then** it demonstrates behavior rather than implying a formal management role that doesn't exist

**Given** the A-4 quality bar
**When** 2 vs. 3 stories are considered
**Then** 2 strong stories are preferred over 3 that would dilute quality

**Given** FR-20/21
**When** stories are authored
**Then** they follow the same public-safe boundary rules established in Epic 2 (Stories 2.4/2.5) — generalized problem classes, no internal system names or confidential specifics

**And** frontmatter `capabilities` draws only from the controlled vocabulary and at least one story is `featured` so Story 3.1's homepage teaser has real content to show

---

## Epic 4: Beyond the Code — Personal Dimensions

A visitor can discover Alisha's personal side — powerlifting and Birdhouses — as authentic, standalone stories, with a downloadable care guide and contextual outbound links to each dimension's Instagram.

**FRs covered:** FR-12, FR-13, FR-14, FR-19
**Architecture covered:** AD-20 (care guide as in-portfolio PDF asset)
**Content status:** No narrative source material exists yet for either dimension (unlike Engineering's `addendum.md`) — do not invent content. Instagram handles pending from Alisha (A-14); the care-guide PDF file itself needs to be supplied. Links/downloads render only once real values exist — no placeholders (NFR-4).

### Story 4.1: Personal Story Component & Detail Page

As a visitor exploring a personal dimension of Alisha's life,
I want to read powerlifting or Birdhouses content in a layout suited to media-first, freeform storytelling,
So that the experience feels authentic rather than forced into the professional evidence template.

**Acceptance Criteria:**

**Given** AD-1 (personal type has its own media-first frontmatter, freeform body, no evidence model, no story-count quota)
**When** this story is complete
**Then** a `PersonalPage` component exists, distinct from `WorkStoryPage`, and does not apply the AD-3 section menu

**Given** UX-DR14
**When** a personal story renders
**Then** it supports authentic exploration without forcing a hobby-to-engineering metaphor (FR-13) — the layout has no capability-signal or evidence-block affordance

**Given** `/beyond/:slug` per AD-5
**When** a valid slug resolves
**Then** `PersonalPage` renders that content, lazy-loaded per AD-6

**Given** AD-15
**When** a personal story renders
**Then** it has exactly one `<h1>` and an `<article>` landmark

**Given** `listed: false` (AD-2)
**When** a personal entry has that flag
**Then** it is reachable at its route but omitted from `/beyond`'s index and every teaser — this is how the care guide (Story 4.3) will exist without becoming a third dimension (D-18)

**Given** UX-DR25/NFR-2
**When** a personal story is read at a supported mobile width
**Then** media, body content, and any embedded links remain readable and reachable without loss of hierarchy

**And** a component test renders `PersonalPage` against fixture frontmatter/content to verify it doesn't throw

### Story 4.2: Beyond the Code Path Index

As a visitor curious about who Alisha is beyond software engineering,
I want to see her personal dimensions listed and choose one to explore,
So that I can discover the person, not just the professional.

**Acceptance Criteria:**

**Given** FR-14
**When** a visitor lands on `/beyond`
**Then** it lists a summary card for every non-draft, `listed`-true `personal` entry, using the same registry-driven, no-hand-maintained-list pattern as the professional indexes (AD-2)

**Given** D-18
**When** the index renders
**Then** it shows at most the two MVP dimensions (powerlifting, Birdhouses) plus any future genuine dimension — never a placeholder for a dimension that doesn't exist

**Given** zero personal content exists when this story ships
**When** `/beyond` renders
**Then** it shows the same graceful "no stories yet" state established in Story 1.7

**And** selecting a summary card navigates to that dimension's `/beyond/:slug` detail page via the same cross-fade transition pattern as Story 2.2

### Story 4.3: Birdhouses Care Guide — Static PDF Asset

As a visitor interested in the Birdhouses dimension,
I want to open or download the care guide directly from the portfolio,
So that I get real, usable information without being redirected to an external site.

**Acceptance Criteria:**

**Given** AD-20
**When** this story is complete
**Then** the care guide is a `listed: false` personal entry (its own `.mdx`, own route, absent from `/beyond` and every teaser) — not a field merged onto the Birdhouses dimension's own entry

**Given** AD-20's `pdf?` field
**When** that entry's frontmatter sets `pdf`
**Then** it names a static asset under `public/downloads/<slug>.pdf`

**Given** the rendering rule
**When** the link renders
**Then** it is a plain same-origin `<a href>` with no `target="_blank"`, no `rel`, and no `download` attribute (these belong only to the outbound-link convention)

**Given** AD-20 permits an optional richer preview
**When** implemented
**Then** an `<iframe>`/`<object>` embed may accompany the link with an accessible name (AD-15) — not required for MVP

**Given** the actual PDF file has not yet been supplied by Alisha
**When** this story ships
**Then** the mechanism exists but is not wired to a real asset until the file is supplied — no placeholder PDF is committed (NFR-4)

**And** the Birdhouses dimension's own entry (Story 4.4) links to this care-guide entry from its own content context once both exist

### Story 4.4: Author Powerlifting & Birdhouses Dimension Stories

As a visitor who wants to understand Alisha beyond her professional work,
I want to read authentic powerlifting and Birdhouses stories,
So that I come away seeing a whole person, not a résumé.

**Status:** Content-blocked — no narrative source material exists yet for either dimension (unlike Engineering's `addendum.md`); do not invent content. Photography/video availability is also an open question (A-11, PRD §14.3 item 6).

**Acceptance Criteria (to satisfy once content is supplied):**

**Given** FR-12
**When** both dimensions are authored
**Then** each provides an intentional opportunity to discover that personal dimension — not a passing mention

**Given** FR-13
**When** either story is authored
**Then** it stands on its own without an explicit "this hobby makes me a better engineer" claim

**Given** FR-14
**When** a dimension has enough material to be a meaningful experience rather than a simple profile detail
**Then** a path exists to explore its story/process/context — depth follows the material, not a quota

**Given** FR-19 and D-17
**When** a dimension has a real Instagram presence and Alisha has supplied the handle (A-14)
**Then** the story's frontmatter `links` includes that outbound destination, rendered via the same External Link pattern as Story 1.4 (target, rel, leaving-the-site affordance)

**Given** A-14 handles are not yet supplied
**When** this story ships without them
**Then** no Instagram link is stubbed or invented — the dimension renders complete without it (NFR-4)

**And** personal stories avoid exposing anyone else's private information without consent

### Story 4.5: Homepage Personal-Hint Teaser

As a visitor scanning the homepage,
I want a one-line hint that Alisha has a personal side worth exploring,
So that I notice Beyond the Code without it competing with the professional evidence.

**Acceptance Criteria:**

**Given** UX-DR28 (§6.4/§6.5)
**When** the homepage renders
**Then** the Beyond the Code slot in Evidence & Highlights shows exactly one personal-hint line, sharing the same visual treatment as the Engineering/Leadership teasers but not styled or labeled as "evidence" (UX-007)

**Given** the hint is frontmatter-derived
**When** it renders
**Then** it draws from a `featured` personal entry's `summary`, not separately authored homepage copy (AD-2)

**Given** no personal content is `featured` yet
**When** the homepage renders
**Then** the slot gracefully omits rather than showing an empty card (AD-2, EXPERIENCE §14)

**And** clicking the hint navigates to that dimension's detail page directly
