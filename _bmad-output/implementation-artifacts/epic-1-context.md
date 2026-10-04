# Epic 1 Context: Foundation — Toolchain, Content Pipeline & Entry Surface

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Give a first-time visitor a fully upgraded entry experience: identity, title, positioning statement and headshot; the three exploration paths; working header/footer navigation; a single accessible ambient personality layer; graceful error and not-found handling; and machine-readable identity for search and link previews. All of it sits on a verified TypeScript/lint/test build gate and a content pipeline (registry, frontmatter schema, MDX wiring) ready for story content. The epic is standalone and deployable, and it blocks Epics 2–4, which reuse its shell, routing, tokens and pipeline.

## Stories

- Story 1.1: Toolchain & Compliance Baseline (done)
- Story 1.2: Content Registry & Frontmatter Schema (done)
- Story 1.3: App Shell — Routing, Error Handling & Navigation Behavior (done)
- Story 1.4: Header, Footer & Navigation (backlog)
- Story 1.5: Ambient Layer (backlog)
- Story 1.6: Homepage Recognition & Discoverability (backlog)
- Story 1.7: Homepage Exploration Paths & Path Indexes (backlog)

## Requirements & Constraints

- WCAG 2.2 AA throughout: keyboard access, visible solid focus ring, contrast, semantic headings, meaningful link names, no hover-only critical info, pointer targets at least 24×24 CSS px.
- Mobile is first-class. Identity, paths, evidence and external links stay reachable and keep the same hierarchy at every supported width.
- **Reduced motion is mandatory.** Every motion or ambient effect needs a static fallback, and core content and navigation must work fully without animation.
- **Ambient effect constraints (authoritative, whatever treatment is chosen):** it never blocks or competes with professional evidence, is never needed to understand the experience, and is neither navigation nor content. It is a persistent, site-wide atmospheric layer, not a homepage-only section. Homepage personality otherwise appears only as the Beyond the Code one-line hint.
- Cold load: meaningful semantic content (identity, nav) appears without waiting for decorative effects. Loading states never block identity recognition.
- Production-quality floor: no placeholder or broken content in public, no empty visual shells for content that doesn't exist yet.
- Performance: a manual Lighthouse pass before each public release (Accessibility in the 90s, homepage LCP under 2.5 s on throttled mid-tier mobile). There is no CI performance gate, so decorative layers must stay cheap.
- Homepage composition: Recognition (name, "Senior Software Engineer", the positioning statement "Give me a business problem and I'll turn it into an engineering decision worth trusting.", and the existing headshot) → Exploration (three label-only path entries) → Evidence & Highlights (teasers that are omitted when there is no content).

## Technical Decisions

- **Single ambient layer.** One `<AmbientLayer>` component in `src/components/AmbientLayer/` (with a co-located CSS file), mounted once in the app shell behind `<main>` and never imported by a page. Its contract: `aria-hidden`, `pointer-events: none`, a fixed z-index below all content, a static render path under `prefers-reduced-motion`, and the app must render and read correctly if the layer never mounts. A future `variant` prop for per-route differences is allowed, but every variant must follow the same contract. The existing `StarBackground`, `GradientWaves` and inline Hero sparkle spans are folded in or removed, leaving one implementation.
- **Ambient treatment is deferred to implementation.** Keeping the current star field, switching to waves, or doing something new are all open choices, as is uniform versus per-route. The design goal is "something visual and engaging". The treatment stays behind the `<AmbientLayer>` boundary so it is cheap to change.
- **Reduced motion is resolved once.** A single `usePrefersReducedMotion` hook in `src/lib/` is the only source of the signal (the ambient layer, the shell scroll handler and the ~180 ms summary-to-story cross-fade all use it). No transition may gate access to content.
- **Semantic tokens only.** UI uses role tokens (`--background-*`, `--text-*`, `--border-*`, `--brand-*`, `--accent-secondary*`, `--focus-ring`, `--status-*`). Never use primitive ramps, raw hex, or raw Tailwind palette colors. JS reads colors through the typed `cssVar(name: TokenName)`. `background.recessed` is the role for the deepest surfaces and the ambient layer. `--brand-primary-fill-hover` is OPEN and does not exist, so the interim hover is the `brand.primary` `drop-shadow(0 0 6px)` glow, which stays static under reduced motion.
- **Migration:** new files are `.tsx`/`.ts`. A substantively edited `.jsx` is rewritten as typed code. Removed scaffolding must leave no dead code, because the repo itself is a public display artifact.
- **Shell (from 1.3):** `HashRouter`, a fixed route table, `React.lazy` + `Suspense`, and an error boundary below the Header and above the Footer. A single shell handler owns scroll and focus on navigation. A `--header-height` property set at a shared scope drives `scroll-padding-top`.
- **Discoverability:** the static `index.html` `Person` JSON-LD and OG/Twitter tags are the canonical identity wording. The Landing identity block must match them, and a smoke test checks that.
- **Media:** never modify or delete existing images or videos. Derivatives such as webp/avif are added as new files. Images need explicit `width`/`height` and descriptive `alt`. Above-the-fold images are not lazy-loaded.
- **Build gate:** `npm run build` = `tsc` + `eslint` (jsx-a11y) + `vitest run` + `vite build`. Smoke tests assert that each route renders without throwing or console errors.

## UX & Interaction Patterns

- Header: a single flat sticky row on every page (identity, then Home, Engineering, Leadership & Enablement, Beyond the Code). On mobile it collapses through flowbite `NavbarToggle`/`NavbarCollapse`. The cupcake mark is recolored to `brand.primary` in the header, while the favicon keeps the original.
- Footer: an icon-only row of LinkedIn, Instagram @asprinkleofcode, Instagram @orangecatwoodcraft and GitHub, in that order. Each opens with `target="_blank"` + `rel="noopener noreferrer"`, and its accessible name gives the platform, the handle and "opens in a new tab". The @orangecatwoodcraft icon gets a `glow.woodcraft` (`#F5A962` at 60%) drop-shadow on hover/focus only, and the focus ring still shows. The footer is the only place with a shadow (one low shadow plus shadow-inner).
- Hierarchy comes from background steps and borders, not stacked shadows. The default radius is 0.5rem.
- Headshot: a rounded-rectangle portrait with a `border.default` edge. On desktop it sits to the right of the text; on mobile it sits below, so the name and title are read first.
- The ambient layer conveys personality, not meaning. Nothing important may depend on it.

## Cross-Story Dependencies

- Stories 1.1–1.3 are done and provide the build gate, tokens, registry and app shell that 1.4–1.7 build on.
- **Story 1.5 depends on the 1.3 shell** for its mount point behind `<main>`, and on `usePrefersReducedMotion`. If that hook does not exist yet, 1.5 creates it in `src/lib/` as the only source of the signal.
- **Story 1.5 and Story 1.4 (still backlog):** 1.4 rebuilds the Header/Footer, which sit in the same shell as the ambient layer. The ambient layer's z-index must sit below the sticky header, the footer and `<main>`, and must not depend on the 1.4 components existing. The two stories share the shell file (`App.tsx`), so expect merge conflicts if both are in flight at once. 1.5 can ship first against the current header/footer.
- **Story 1.5 and Story 1.6:** the inline Hero sparkles live in the homepage Hero that 1.6 replaces. 1.5 folds or removes them now, so 1.6 must not reintroduce per-page decoration.
- Epics 2–4 depend on all of Epic 1.
