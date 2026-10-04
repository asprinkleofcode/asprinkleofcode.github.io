# Epic 1 Context: Foundation — Toolchain, Content Pipeline & Entry Surface

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Upgrade the existing Vite + React 19 portfolio (brownfield, GitHub Pages, `HashRouter`) into a verified, typed foundation and a complete entry surface. When a visitor arrives, they should immediately see Alisha's identity, her title, the positioning statement, and the three exploration paths. Around that sit working nav and footer, a single ambient personality layer, graceful error and not-found handling, and machine-readable identity for search. All of it runs on a TypeScript/lint/test build gate and an MDX content pipeline that is ready to receive stories. The epic is standalone and deployable: the site must be measurably better before any story content exists. It also blocks Epics 2–4, which reuse its shell, routing, tokens and registry.

## Stories

- Story 1.1: Toolchain & Compliance Baseline
- Story 1.2: Content Registry & Frontmatter Schema
- Story 1.3: App Shell — Routing, Error Handling & Navigation Behavior
- Story 1.4: Header, Footer & Navigation
- Story 1.5: Ambient Layer
- Story 1.6: Homepage Recognition & Discoverability
- Story 1.7: Homepage Exploration Paths & Path Indexes

## Requirements & Constraints

- **Identity:** the landing page states "Alisha Sprinkle Korba" and "Senior Software Engineer". Do not substitute a clever alternative for the title, and do not repeat it everywhere. The fixed positioning line sits directly under the name and title: *"Give me a business problem and I'll turn it into an engineering decision worth trusting."* The tone should be confident, approachable and fun, not gimmicky.
- **Exploration paths:** the visitor-facing labels are exactly **Engineering**, **Leadership & Enablement** and **Beyond the Code**. These paths are fixed product structure and always render, even with zero stories.
- **Professional continuation:** link out to LinkedIn and GitHub using the real URLs already in `index.html`'s `sameAs` (`https://www.linkedin.com/in/alishasprinklekorba`, `https://github.com/asprinkleofcode`). The Instagram handles are still pending. Do not invent or stub them.
- **Post-talk arrival:** a visitor who already has context on Alisha must recognize her from the identity and positioning alone. Nothing may depend on a speaking surface, which is out of scope and purely additive later.
- **Discoverability:** handled at the site and person level only, in static `index.html`. Per-story organic search is a non-goal.
- **Accessibility:** WCAG 2.2 AA. This includes visible solid focus, logical focus order, pointer targets of at least 24×24 CSS px, no hover-only critical info, and no color-only status. Lighthouse Accessibility should score in the 90s.
- **Responsive:** mobile is first-class. The information hierarchy is the same at every viewport, and nothing critical appears only on desktop.
- **Performance:** keep the homepage LCP under 2.5s on throttled mid-tier mobile. ~175 KB gzip of initial JS is a watch line, not a gate.
- **Reduced motion:** a static fallback for every motion or ambient effect is mandatory.
- **Production floor:** no placeholder or broken content and no empty visual shells. Everything committed to `main`, including planning docs, is public-safe and free of scaffolding.
- **Repo policy:** work on a branch and open a PR. Never modify or delete existing photos or videos. Never add a `CNAME` file or change deploy config.

## Technical Decisions

- **Build gate (Story 1.1 blocks everything):**
  - Dependencies to add: `typescript` ~5.9 (not 6 or 7), `typescript-eslint` ^8.70, `eslint-plugin-jsx-a11y` ^6.10, `vitest` ^5.0 + `@testing-library/react` ^16.3, and the dev-only `rollup-plugin-visualizer` ^7.1 (`build:analyze`).
  - Version ceilings: keep ESLint on 9.x because jsx-a11y does not support 10. Do not `@latest` `@vitejs/plugin-react`, since 6.x forces Vite 8.
  - TypeScript config: `tsconfig.json` with `strict: true` and `noUncheckedIndexedAccess` off, plus `tsconfig.node.json`, with `allowJs` and `checkJs` off.
  - Lint scope: ESLint covers `**/*.{ts,tsx}`.
  - Final build script: `tsc --noEmit && eslint && vitest run && vite build`. Switch to it only once all three checks pass clean.
  - Where the gate binds: the deploy workflow runs unchanged, so the gate takes effect at deploy time. There is no PR CI.
  - Also in this story: update the `AGENTS.md` lint note, and document install/dev/build/preview in the README.
- **TypeScript migration:**
  - New files are always `.ts` or `.tsx`.
  - A substantively edited `.js` or `.jsx` file becomes a typed rewrite, with no implicit `any` and unchanged behavior.
  - `App.jsx` and `main.jsx` are migrated first.
- **Dead scaffolding:** remove the `useState` counter in `App`, the `NavbarBrand` href pointing at flowbite-react.com, and the unused `react.svg`.
- **Tokens:**
  - `colors.css` adds semantic role tokens over the private primitive ramps. `theme.css` (new) maps them via Tailwind v4 `@theme`. `aSprinkleOfCodeTheme.ts` uses role tokens only.
  - UI never uses primitive ramps, raw hex, or raw Tailwind palette colors.
  - JS reads token values through a typed `cssVar(name: TokenName)` that returns a documented fallback in jsdom and on first paint.
  - Values: bg `#1E1E2F`/`#2B2B3B`/`#0F0F15`; text `#F8F8FA`/`#9C9CBA`/inverse `#1E1E2F`; border default `#3A3A4D` (decorative only) / essential `#85879D`; brand `#E48FB1`, fill `#A73E6C`; accent `#93A4F6`, fill `#4F63D8`; focus ring solid 2px `#E48FB1` with 2px offset; status `#4FCF7F`/`#F87171`/`#F5B343`.
  - `--brand-primary-fill-hover` is OPEN. Do not create it, and keep it out of `TokenName`. Use the `brand.primary` glow (`drop-shadow(0 0 6px)`) as the interim hover.
  - `theme.css` also encodes the 7-level type scale on the system sans stack with no web font. It runs from identity (~1.5rem+, 700, tracking-wide) down to metadata (0.875rem, `text.secondary`). Radius tokens: 0.5rem default, 0.375rem control, full pill.
- **Content pipeline:**
  - `@mdx-js/rollup` runs with `enforce: 'pre'`, ahead of plugin-react.
  - There are two frontmatter schemas, chosen by directory: `src/content/work/` and `src/content/personal/`. They live in `src/lib/frontmatter.ts`, and unknown keys are rejected.
  - Work keys: `type, title, path (engineering|leadership), slug?, summary, role, capabilities[], date?, hero?, featured?, draft?`.
  - Personal keys: `type, title, slug?, summary, date?, hero?, links?[{label,href}], pdf?, featured?, draft?, listed? (default true)`.
  - Capability vocabulary: `business-to-engineering | ownership | engineering-judgment | ambiguity | enablement`.
  - The validation mechanism (hand-rolled or zod) is the implementer's choice.
  - Invalid or missing required frontmatter fails the build.
  - `draft: true` excludes the body from `dist`.
  - With zero `.mdx` files the registry returns an empty index.
- **Registry (`src/lib/registry.ts`):**
  - Uses `import.meta.glob(..., { eager: true, import: 'frontmatter' })`.
  - Bodies load lazily via dynamic `import()`.
  - The key is `type` + `path` + `slug`, where slug is the filename unless frontmatter overrides it.
  - Index ordering: `featured` ascending first, then `date` descending, then `title`. The same order applies to teasers.
- **MDX whitelist:** `src/mdx-components.tsx`. MDX files import from it explicitly, one file at a time. There is no `MDXProvider`.
- **Dependency direction:** content → registry; pages → registry, components and lib; components → theme and lib, through props only. Components never read the registry.
- **Layout and file conventions:**
  - Components live in `src/components/<Name>/<Name>.tsx` with a co-located `<Name>.css`.
  - Pages live in `src/pages/<Target>/<Target>.tsx`.
  - Helpers live in `src/lib/<camelCase>.ts`, including `usePrefersReducedMotion`, `useDocumentMeta`, `cssVar` and `links`.
  - External URL literals go only in `src/lib/links.ts` or frontmatter. Never use `.env` or runtime config.
- **Routes:**
  - The route set is exactly `/`, `/engineering(/:slug)`, `/leadership(/:slug)`, `/beyond(/:slug)` and `*`, using `HashRouter` only.
  - Route pages are `React.lazy` + `Suspense`.
  - Both work detail routes share one `WorkStoryPage`, and `/beyond/:slug` uses `PersonalPage`. These are placeholders in this epic.
  - There is no state library.
- **Error handling:** an app-shell error boundary sits between Header and Footer and keeps nav working on render or chunk-load failure. The `*` not-found page keeps the nav and links home.
- **Scroll and focus:**
  - One shell-level handler owns this; pages never implement their own.
  - Forward navigation goes to the top of `<main>` and focuses the `<h1>` (`tabIndex={-1}`, ring suppressed for programmatic focus).
  - Back or pop navigation restores the previous scroll position.
  - Scroll and focus settle after the lazy content resolves, never against the fallback.
  - Scrolling is instant under reduced motion.
  - A shared `--header-height`, set at `:root` or shell scope, drives `scroll-padding-top` and `scroll-margin-top`.
- **Reduced motion:** a single `usePrefersReducedMotion` hook is the only source of this signal.
- **Ambient layer:**
  - There is exactly one `<AmbientLayer>`, mounted once in the shell behind `<main>`.
  - It is `aria-hidden`, has `pointer-events: none`, and sits at a fixed z-index below content.
  - It has a static reduced-motion path, and the app must still work if the layer never mounts.
  - `StarBackground`, `GradientWaves` and the Hero sparkles are folded into it or removed.
  - The visual treatment is deferred to implementation.
- **Static head (`index.html`):**
  - Expanded `Person` JSON-LD with `knowsAbout` and `sameAs`, plus `WebSite`/`ProfilePage`.
  - Default title, description, canonical, OG and Twitter tags.
  - This head is the single owner of the identity wording. The Landing page must state the same claim, and a smoke test asserts that they match.
  - `useDocumentMeta` is progressive enhancement only and restores the defaults on unmount.
  - There is no SSG or prerender.
- **Semantic HTML:** one `<h1>` per page, a correct heading hierarchy, `main`/`nav`/`article`/`section` landmarks, and meaningful link text.
- **Smoke test:** asserts that every route renders without throwing or console errors, that the registry loads, and that the identity matches the head.

## UX & Interaction Patterns

- **Header:**
  - A single flat, sticky row that is identical on every page, including deep stories, with no breadcrumb.
  - Order: identity (logo + name), Home, Engineering, Leadership & Enablement, Beyond the Code.
  - "Home" is an explicit link.
  - On mobile it uses the flowbite `NavbarToggle`/`NavbarCollapse` hamburger.
  - It has no social icons.
- **Brand mark:** the cupcake icon (`/cupcake.png`) is recolored to `brand.primary` in the header, via an SVG or a CSS `mask-image`. The favicon stays the original, unrecolored icon.
- **Footer:**
  - External and social links appear only here.
  - Outbound links use `target="_blank"` and `rel="noopener noreferrer"`, with a visible "leaves the site" affordance.
  - The footer uses a single low shadow or `shadow-inner`. Elsewhere, hierarchy comes from borders and background steps, not stacked shadows.
- **Homepage:** three stacked sections in order.
  1. Recognition: name, title and the positioning line in one block.
  2. Exploration: three label-only path entries with no teaser copy.
  3. Evidence & Highlights: a teaser slot for each of Engineering and Leadership & Enablement, plus one personal-hint line for Beyond the Code. Each slot is omitted when there is no content.
- **Path indexes:** with zero stories, show a graceful "no stories published yet" state, never an empty card grid. The same page renders real content later with no code change.
- **Links:** `brand.primary`, underlined on hover and focus. Color is not the only cue in body text.
- **Accent color:** `accent.secondary` is for functional emphasis only. It is not a personal-versus-professional hue.
- **Loading states:**
  - Cold load: semantic content (identity, nav) appears without waiting on ambient effects.
  - Suspense fallbacks never hide the header or shell.
  - The error state keeps navigation available.

## Cross-Story Dependencies

- Story 1.1 must land first. It provides the build gate, token layer, TS entry files and smoke-test harness that every other story is verified against.
- Story 1.2 (registry and schema) feeds 1.3's detail placeholders and 1.7's teasers and path indexes. 1.3 (shell, routes, error boundary, scroll/focus, `usePrefersReducedMotion`) hosts 1.4's Header/Footer, 1.5's AmbientLayer and the 1.6/1.7 Landing page.
- Story 1.6's identity block and the `index.html` JSON-LD must agree, enforced by the 1.1 smoke test.
- The whole epic blocks Epics 2–4. Epic 2 replaces the work-story detail placeholder and fills the Engineering teaser. Epic 3 fills Leadership. Epic 4 replaces `PersonalPage`, adds the Instagram links (once A-14 handles exist) and the care-guide `listed: false` entry with `pdf` under `public/downloads/`.
- Known doc staleness: older UX wording calls the care guide OPEN or an external link. The PDF-asset resolution supersedes it. This is not Epic 1 work, but the schema must already accept `pdf?` and `listed?`.
