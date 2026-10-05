# Epic 1 Context: Foundation — Toolchain, Content Pipeline & Entry Surface

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

This epic turns the existing Vite + React 19 portfolio (brownfield, GitHub Pages, `HashRouter`) into a verified, typed foundation with a complete entry surface. A visitor should immediately see who Alisha is: her name, title, positioning line and headshot, followed by the three exploration paths. The page also needs working nav and footer, one ambient personality layer, graceful error and not-found handling, and machine-readable identity for search. All of it sits on a TypeScript/lint/test build gate and an MDX content pipeline that is ready for stories. The epic must be deployable on its own, meaning the site is measurably better before any story content exists. Epics 2–4 depend on its shell, routes, tokens and registry, so they cannot start until it lands.

## Stories

- Story 1.1: Toolchain & Compliance Baseline
- Story 1.2: Content Registry & Frontmatter Schema
- Story 1.3: App Shell — Routing, Error Handling & Navigation Behavior
- Story 1.4: Header, Footer & Navigation
- Story 1.5: Ambient Layer
- Story 1.6: Homepage Recognition & Discoverability
- Story 1.7: Homepage Exploration Paths & Path Indexes
- Story 1.8: Visual Alignment to the Homepage Mockup (UX-030). Built before 1.7, on the Story 1.6 branch.

## Requirements & Constraints

- **Identity:** the page reads "Alisha Sprinkle Korba" and "Senior Software Engineer". Never swap the title for something clever. The fixed positioning line sits directly beneath them, in the same block: *"Give me a business problem and I'll turn it into an engineering decision worth trusting."* Tone: confident, approachable, fun, not gimmicky.
- **Exploration paths:** the labels are exactly **Engineering**, **Leadership & Enablement** and **Beyond the Code**. These paths are fixed product structure. They always render, even when no stories exist. No route, nav entry, path card or teaser slot may depend on content that doesn't exist yet. That covers speaking, a third personal dimension and the care guide.
- **Professional continuation:** LinkedIn and GitHub use the real URLs already in the `sameAs` of `index.html`. The Instagram handles are supplied: powerlifting is @asprinkleofcode (`https://www.instagram.com/asprinkleofcode/`) and Birdhouses is @orangecatwoodcraft (`https://www.instagram.com/orangecatwoodcraft/`).
- **Post-talk arrival:** someone who already has context on Alisha must recognize her from the identity and positioning alone. Nothing may depend on a speaking surface, which is out of scope.
- **Discoverability:** handled at site and person level only, in static `index.html`. Per-story organic search is a non-goal.
- **Accessibility:** WCAG 2.2 AA.
  - Focus is a visible solid ring and moves in a logical order.
  - Pointer targets are at least 24×24 CSS px.
  - No information is hover-only, and no status is shown by color alone.
  - Lighthouse Accessibility scores in the 90s.
- **Responsive:** mobile is first-class. The information hierarchy is the same at every viewport, and nothing critical is desktop-only.
- **Performance:**
  - Homepage LCP stays under 2.5s on a throttled mid-tier mobile profile.
  - ~175 KB gzip of initial JS is a watch line, not a gate.
- **Reduced motion:** every motion or ambient effect needs a static fallback.
- **Production floor:** no placeholder or broken content and no empty visual shells. Everything on `main`, including planning docs, must be public-safe.
- **Repo policy:** work on a branch and open a PR. Never modify or delete existing photos or videos; add new derivatives instead. No `CNAME` file and no deploy-config changes.

## Technical Decisions

- **Build gate:** `build` runs `tsc --noEmit && eslint && vitest run && vite build`.
  - There is no PR CI, so the gate binds at deploy.
  - Stay on ESLint 9.x, because jsx-a11y does not support 10.
  - Stay on TypeScript ~5.9.
  - Do not `@latest` `@vitejs/plugin-react`, because 6.x forces Vite 8.
- **TypeScript migration:**
  - New files are `.ts` or `.tsx`.
  - A substantively edited `.js` or `.jsx` file becomes a typed rewrite: no implicit `any` and unchanged behavior.
  - Do not add to legacy `.jsx` files.
- **Tokens:**
  - UI uses semantic role tokens only. Primitive ramps, raw hex and raw Tailwind palette colors are not allowed in UI.
  - JS reads tokens through the typed `cssVar(name: TokenName)`.
  - The focus ring is a solid 2px `brand.primary` with a 2px offset.
  - `--brand-primary-fill-hover` is OPEN. Do not create it. The interim hover is the `brand.primary` glow (`drop-shadow(0 0 6px)`), which is static under reduced motion.
  - Every `status.*` color is paired with a non-color cue.
  - Radius tokens: 0.5rem default, 0.375rem control, full pill.
  - Type is a 7-level scale on the system sans stack. There is no web font.
- **Content pipeline:**
  - Every story is one `.mdx` file. Two schemas are selected by directory: `work` and `personal`.
  - The schema rejects unknown keys. Invalid frontmatter fails the build.
  - `draft: true` keeps the body out of `dist`.
  - With zero files, the index is empty.
  - Frontmatter eager-loads. Bodies load lazily through `import()`.
  - Index and teaser order is total: `featured` ascending, then `date` descending, then `title`.
  - Summaries, indexes and teasers come only from frontmatter, never from separately authored prose.
- **Dependency direction:**
  - Content feeds the registry.
  - Pages use the registry, components and lib.
  - Components use theme and lib, and receive data through props only. They never read the registry.
  - MDX bodies import only from the whitelist, explicitly, with no `MDXProvider`.
- **File layout:**
  - Components go in `src/components/<Name>/<Name>.tsx` with a co-located `<Name>.css`.
  - Pages go in `src/pages/<Target>/<Target>.tsx`.
  - Helpers go in `src/lib/<camelCase>.ts`.
  - External URL literals live only in `src/lib/links.ts` or in frontmatter. Do not use `.env` or runtime config.
- **Routes:** exactly `/`, `/engineering(/:slug)`, `/leadership(/:slug)`, `/beyond(/:slug)` and `*`, on `HashRouter` only.
  - Each route page is `React.lazy` inside `Suspense`.
  - The detail pages are placeholders until Epics 2 and 4.
  - There is no state library.
- **Error handling:** an app-shell error boundary sits between Header and Footer, so nav keeps working after a render or chunk-load failure. The `*` route keeps nav and links home.
- **Scroll and focus:** one shell-level handler owns this, and pages never implement their own.
  - Forward navigation goes to the top of `<main>` and focuses the `<h1>`.
  - Back or pop navigation restores the scroll position.
  - Scroll and focus settle after the lazy content resolves.
  - Scrolling is instant under reduced motion.
  - `--header-height` drives the scroll padding and margin.
  - `usePrefersReducedMotion` is the only source of the reduced-motion signal.
- **Ambient layer:** exactly one `<AmbientLayer>`, mounted once in the shell behind `<main>` and never imported per page.
  - It is `aria-hidden`, uses `pointer-events: none` and has a fixed z-index below content.
  - It has a static reduced-motion path.
  - The app must work if the layer never mounts.
  - `StarBackground`, `GradientWaves` and the Hero sparkles get folded into it or removed.
  - Treatment (UX-030, `DESIGN.md` v0.9 §16): sparse ~1px stars (a few 1.5px), mostly `text.primary` with a few `accent.secondary` and `brand.primary`, each twinkling slowly (opacity ~0.25 → 0.8 over ~5s), no drift, no glow, on the `background.primary` page. Static under reduced motion. This replaces the 1.5 bokeh.
  - The visual treatment is left to implementation. The goal is "something visual and engaging."
- **Static head (`index.html`):**
  - Expanded `Person` JSON-LD with `knowsAbout` and `sameAs`.
  - Default title, description, canonical, Open Graph and Twitter tags.
  - This head is the single owner of the identity wording. The Landing page must state the same claim, and the smoke test asserts they match.
  - Do not add `image` or `og:image`; that is not in scope.
  - `useDocumentMeta` is progressive enhancement only and restores the defaults on unmount.
  - No SSG or prerender.
- **Images:**
  - Set explicit `width` and `height`.
  - Use `webp` or `avif` derivatives as new files.
  - Use `loading="lazy"` only below the fold.
  - The headshot is above the fold and likely the LCP element, so it must **not** be lazy.
- **Semantic HTML:**
  - One `<h1>` per page and a correct heading hierarchy.
  - `main`, `nav`, `article` and `section` landmarks.
  - Meaningful link text and descriptive `alt`.

## UX & Interaction Patterns

- **Header:** a single flat sticky row, identical on every page including deep stories, with no breadcrumb.
  - Order: identity (logo + name), Home, Engineering, Leadership & Enablement, Beyond the Code.
  - On mobile it collapses to a hamburger using flowbite `NavbarToggle`/`NavbarCollapse`.
  - No social icons.
  - The cupcake mark is recolored to `brand.primary` in the header with an SVG or CSS mask. The favicon stays the original.
  - The brand text reads "Alisha Korba" in `text.primary`, ~1rem, weight 700, tracking ~0.02em, independent of `type-title`. Inactive nav links are `text.secondary`; the active link is `brand.primary` (UX-030).
- **Footer:**
  - External and social links appear here, not in the header. Epic 4 stories also carry their own contextual Instagram link.
  - An icon-only row, in order: LinkedIn, Instagram @asprinkleofcode, Instagram @orangecatwoodcraft, GitHub. The platform logo is the exit cue, so there is no extra visible marker. Each icon opens in a new tab with `rel="noopener noreferrer"` and has an accessible name naming platform, handle and new tab (e.g. "Instagram @orangecatwoodcraft (opens in a new tab)").
  - The @orangecatwoodcraft icon gets a `glow.woodcraft` glow (apricot `#F5A962` at 60% alpha, `drop-shadow(0 0 6px)`) on hover and keyboard focus only. It never shows at rest and no other element uses it. `focus.ring` stays the focus cue.
  - Every other outbound link uses `target="_blank"` and `rel="noopener noreferrer"`, with a visible "leaves the site" affordance.
  - The copyright line and the existing icon-attribution link stay.
  - The footer is the only place for a low shadow or `shadow-inner`. Everywhere else, hierarchy comes from borders and background steps.
  - It sits on `background.recessed` with a 1px `border.default` top edge and `inset 0 2px 6px rgb(0 0 0 / 0.5)` (UX-030).
- **Homepage:** three stacked sections, in this order.
  1. **Recognition:**
     - Name, title and positioning line form one block.
     - The existing headshot (`src/assets/alisha-sprinkle-korba-headshot.jpg`) is a rounded-rectangle portrait with the default radius and a `border.default` edge.
     - On desktop it sits to the right of the text. On mobile it stacks below the text, so the name and title are read first.
     - Its alt text names Alisha; an empty `alt` is not acceptable.
     - Look (UX-030): white name (`text.primary`, ~3rem desktop / ~2.1rem mobile), rose title (`brand.primary`, ~1.35rem / ~1.1rem, weight 600), body-size positioning line wrapping at ~34ch; ~88/72px vertical padding on desktop, ~56/48px on mobile; on mobile the text and the headshot are both left-aligned.
     - Dimensions and crop are up to the implementer.
  2. **Exploration:** the three path entries, label-only, with no teaser copy.
  3. **Evidence & Highlights:**
     - At least one teaser slot each for Engineering and for Leadership & Enablement.
     - Exactly one personal-hint line for Beyond the Code.
     - Each slot is omitted when it has no content.
- **Path indexes:** with zero stories, show a graceful "no stories published yet" state, never an empty card grid. When stories arrive, the same page renders them with no code change.
- **Links:** `brand.primary`, underlined on hover and focus. Color is not the only cue.
- **Accent:** `accent.secondary` is for functional emphasis only. It is not a personal-versus-professional hue.
- **State patterns:**
  - On cold load, identity and nav appear without waiting on ambient effects.
  - Suspense fallbacks never hide the header or shell.
  - The error state keeps navigation available.

## Cross-Story Dependencies

- 1.1 (done) provides the build gate, tokens, TS entry files and smoke-test harness. 1.2 (done) provides the registry and schema. 1.3 (done) provides the shell, routes, error boundary, scroll and focus handling, and `usePrefersReducedMotion`. Stories 1.4–1.7 build on these.
- 1.4's Header and Footer and 1.5's AmbientLayer mount in the 1.3 shell. 1.6 and 1.7 both build the Landing page: 1.6 owns Recognition and the static head, 1.7 owns Exploration, Evidence & Highlights and the three path indexes. 1.8 revises the look of 1.4 and 1.5 (page background, ambient layer, header colors, footer surface, global type levels 1–2) and lands before 1.7.
- 1.6's identity block must match the `index.html` JSON-LD, and the smoke test enforces it.
- Epic 1 blocks Epics 2–4:
  - Epic 2 replaces the work detail placeholder and fills the Engineering teaser.
  - Epic 3 fills Leadership.
  - Epic 4 replaces `PersonalPage`, adds each dimension's contextual Instagram link, and adds the care guide. The care guide is a `listed: false` entry with a `pdf` under `public/downloads/`.
