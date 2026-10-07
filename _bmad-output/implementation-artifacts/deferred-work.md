# Deferred Work

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-toolchain-compliance-baseline.md`
  summary: Give the four powerlifting video iframes in `BeyondTheCodePowerlifting.jsx` descriptive titles that tell the clips apart (e.g. lift and meet) instead of "Powerlifting video 1–4".
  evidence: Story 1.1 added the titles to satisfy jsx-a11y, but screen-reader users can't tell the clips apart; only the site owner knows what each clip shows. Best done when Epic 4 reworks the Beyond the Code pages.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-toolchain-compliance-baseline.md`
  summary: In Story 1.4 (Header, Footer & Navigation), remove the legacy CSS that overrides the role-token theme and prune theme slots that never render or only duplicate flowbite defaults.
  evidence: Found during the Story 1.1 walkthrough. (1) `asprinkleofcode/src/components/Header/Header.css:18` sets `.navbar-brand-text` to `var(--color-primary-100)`; unlayered CSS beats Tailwind utilities, so the theme's `text-brand-primary` never shows on the header name. (2) Raw primitive vars (`--color-primary-*`/`--color-dark-*`) remain in `App.css` (9), `Header.css` (5), `GradientWaves.css` (3), `BeyondTheCodePowerlifting.css` (7), and `StarBackground.tsx` (4); the last two belong to Story 1.5 / Epic 4. (3) `aSprinkleOfCodeTheme.ts` slots never rendered: `footer.brand`, `footer.groupLink`, `footer.title`, `footer.divider`, `footer.root.bgDark`, `navbar.link.disabled`, `navbar.root.rounded`/`bordered`. (4) Slots identical to flowbite defaults: `navbar.root.inner`, `navbar.collapse`, `navbar.link.base`, `navbar.toggle.icon`/`title`, `footer.brand.base`, `footer.icon.size`, `avatar.root.size.xl`. Story 1.4 rebuilds Header/Footer, so it should drop or start using these slots rather than pruning them separately.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-content-registry-frontmatter-schema.md`
  summary: Update the AGENTS.md "Where things are" test note to mention `*.test.ts` files and the top-level `plugins/` directory (build plugins and their tests, type-checked by `tsconfig.node.json`).
  evidence: Story 1.2 added `src/lib/*.test.ts` and `plugins/contentFrontmatter{,.test}.ts`, but AGENTS.md still says tests are `*.test.tsx` next to code with setup in `src/test/`. Review routed this to defer because the fix edits an agent-context file; best handled at the next bmad-project-context refresh.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-app-shell-routing-error-handling-navigation-behavior.md`
  summary: In Story 1.4, replace the footer copyright's `href="#"` (`asprinkleofcode/src/components/Footer/Footer.tsx:14`) so clicking it no longer acts as a raw hash navigation.
  evidence: Under `HashRouter`, clicking it sets the hash to `#`, which the router treats as a POP navigation to `/` with key `"default"`. That bypasses Story 1.3's forward-navigation scroll/focus handling. This predates Story 1.3, and Story 1.4 rebuilds the footer.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-header-footer-navigation.md`
  summary: Stop flowbite's default theme classes from merging into the role-token theme slots, so dark-mode and gray defaults no longer leak into the header and footer. Examples are `dark:text-white` on the active nav link, `dark:hover:text-white` on footer icons, `focus:ring-gray-200` on the navbar toggle, and `sm:text-center dark:text-gray-400` on the copyright.
  evidence: `createTheme` overrides are twMerged with flowbite defaults per slot. This build's `dark` variant compiles to `@media (prefers-color-scheme: dark)`, so visitors whose OS is in dark mode get raw palette colours instead of role tokens, against AD-10. This predates Story 1.4: the same slots merged the same defaults before. The fix is likely `clearTheme` or `applyTheme: "replace"` on the affected slots, plus a test that rendered header and footer carry no `gray-` or `dark:` classes.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-header-footer-navigation.md`
  summary: Move the hard-coded GitHub project URL in `asprinkleofcode/src/pages/Landing/Hero.jsx:28` ("Follow the Build") into `src/lib/links.ts` and give it the outbound-link treatment, or drop it, when Story 1.6 rebuilds Landing.
  evidence: `links.ts` is meant to hold every external URL (AD conventions), but this legacy button keeps its own literal and opens in the same tab without the new-tab notice.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-ambient-layer.md`
  summary: Add a browser-level test that the ambient layer's dots have no animation under prefers-reduced-motion.
  evidence: Unit tests only check class names; jsdom applies no stylesheet, so deleting the `animation: none` rules would not fail any test.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-homepage-recognition-discoverability.md`
  summary: Add a browser-level check that the homepage Recognition h1 and paragraphs render at the `type-*` sizes and role colours, not the legacy unlayered `App.css` h1/p rules.
  evidence: `Recognition.css` uses `revert-layer` to beat `App.css`; jsdom ignores cascade layers, so deleting the CSS import or a reset property would pass every test. Only the manual 375px/1280px check guards it.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-homepage-recognition-discoverability.md`
  summary: When Epic 4 removes the AboutMe page, replace the Person JSON-LD `image` in `index.html` (a Vite-hashed `alisha-sprinkle-korba-headshot-BqFgpPGr.jpg` URL on asprinkleofcode.github.io) with a stable image URL, or drop it.
  evidence: The hashed jpg is emitted only because `pages/AboutMe/Primary.jsx` imports the original headshot; once that import goes, the structured-data image 404s. It resolves today (pre-existing value kept by Story 1.6).

- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-homepage-recognition-discoverability.md`
  summary: Measure homepage LCP on a throttled mid-tier mobile profile; if it exceeds 2.5s, start the headshot fetch earlier (e.g. a preload of a fixed-name copy).
  evidence: Unverified (maybe-false, would be medium). The headshot sits in the lazy Landing chunk, so the browser discovers it only after the main bundle and route chunk load; `fetchPriority="high"` cannot help before then.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-recognition-color-and-positioning.md`
  summary: When Story 1.8 lands on this branch, check `/` in a browser at 375px and 1280px: Recognition name ~2.1rem/~3rem (700, line-height ~1.05), title ~1.1rem/~1.35rem (600, rose), and the 56/48 → 88/72px padding, 40px gap and left-aligned mobile layout.
  evidence: Story 1.6's UX-030 AC includes level 1/2 sizes, which arrive only with Story 1.8's `theme.css` change. jsdom applies no CSS, so neither the sizes nor the Tailwind v4 dynamic spacing utilities (`pt-22`, `pb-18`, `mt-5.5`) can be caught by unit tests; only a manual or browser check verifies them.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-8-visual-alignment-to-homepage-mockup.md`
  summary: Resolved by Story 1.8: the Story 1.4 item on flowbite `dark:` and `gray-` defaults leaking into the header and footer theme slots.
  evidence: `aSprinkleOfCodeApplyTheme` (`asprinkleofcode/src/theme/aSprinkleOfCodeTheme.ts`) sets `"replace"` on every navbar and footer slot the theme defines and is passed to `ThemeProvider` in `App.tsx`. `Header.test.tsx` and `Footer.test.tsx` assert no rendered element carries a `dark:` or `gray-` class.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-8-visual-alignment-to-homepage-mockup.md`
  summary: Stop flowbite `dark:` defaults leaking outside the header and footer (Avatar and Carousel on legacy `/about`, the error-fallback Button), ideally site-wide with `@custom-variant dark (&:where(.dark, .dark *));` in `index.css` instead of per-component `applyTheme`.
  evidence: Story 1.8's `aSprinkleOfCodeApplyTheme` replaces only the navbar and footer slots; other flowbite components still merge defaults with `dark:` palette classes, which this build applies under OS dark mode.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-8-visual-alignment-to-homepage-mockup.md`
  summary: Declare `:root { color-scheme: dark; }` so native scrollbars, form controls and autofill match the always-dark page for visitors in OS light mode.
  evidence: Nothing in `index.html` or `src/` sets `color-scheme`; the page is dark navy (and was dark grey before Story 1.8), so light native controls can appear on it.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-8-visual-alignment-to-homepage-mockup.md`
  summary: Resolved by Story 1.8: the Story 1.6 browser check of Recognition level 1/2 sizes and spacing (name 33.6px/48px, title 17.6px/21.6px at 600, padding 56/48 and 88/72, left-aligned mobile) passed on `vite preview`.
  evidence: Measured computed styles at 375px and 1280px after Story 1.8's `theme.css` change; see the Implementation Notes in the Story 1.8 spec.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-7-homepage-exploration-paths-path-indexes.md`
  summary: Move App.css's unlayered legacy `h1`/`h2`/`p` rules into a cascade layer (or retire them) so components stop copying the `revert-layer` reset.
  evidence: Recognition, ExplorationPaths, EvidenceHighlights and PathIndex each carry the same six-property `revert-layer` block because App.css's bare element rules beat Tailwind's layered `type-*` utilities; every new component needs another copy until the legacy pages that rely on them (AboutMe) are migrated.

- source_spec: `_bmad-output/implementation-artifacts/spec-epic-1-hardening.md`
  summary: Resolved by the Epic 1 hardening: the Story 1.7 item on moving App.css's unlayered legacy `h1`/`h2`/`p` rules so components stop copying the `revert-layer` reset, and the Story 1.6 item on a browser check that Recognition renders at the `type-*` sizes rather than App.css's.
  evidence: `src/App.css` is deleted. Its element rules live only in `src/pages/AboutMe/AboutMe.css` under `:where(.about-me)`, and the four `revert-layer` blocks are gone. `src/test/globalCss.test.ts` fails on a second Tailwind root or any rule not scoped to a class outside the index.css shell globals and legacy `/about`. A `vite preview` check measured Recognition, the path indexes, NotFound and `/about` (unchanged from the pre-change build).

- source_spec: `_bmad-output/implementation-artifacts/spec-epic-1-hardening.md`
  summary: Give MDX story bodies their own prose typography (paragraph and heading spacing, `type-*` levels, role colours) when Epic 2 builds the work-story detail page (Story 2.2), and Story 4.1 for personal pages.
  evidence: With App.css gone, nothing styles bare `p`/`h2` inside `<Body />` in `WorkStory.tsx`/`Personal.tsx`, so Tailwind preflight leaves paragraphs with no margin and headings at inherited size. Before, App.css gave them spacing, but at 0.75rem in primitive `--color-primary-100`, which was the defect A-1 removed. No story body exists yet, so nothing renders this today.

- source_spec: `_bmad-output/implementation-artifacts/spec-epic-1-hardening.md`
  summary: Add an App-level test that a route page whose own chunk fails to import is imported again after navigating away, beside the existing story-body and `lazyWithRetry` helper tests.
  evidence: `App.tsx` wraps every route page in `lazyWithRetry`, but `App.test.tsx` makes only story-body imports fail. Reverting a page to plain `React.lazy` would pass every test. The helper is tested with the same boundary and `onReset` wiring App uses. Making a real page module's dynamic import reject inside the smoke test needs a loader seam the app does not have yet.

- source_spec: `_bmad-output/implementation-artifacts/spec-epic-1-a6-ad10-gate.md`
  status: open
  summary: Extend the AD-10 source scan (`src/test/semanticTokens.test.ts`) to `.mdx` story bodies once the first one exists (Story 2.4), so a `className` palette class or inline colour in a story fails the build.
  evidence: The gate globs only `css/ts/tsx/js/jsx`; `?raw` on `.mdx` would go through the MDX plugin, and no story file existed when A-6 landed, so there was nothing to test against.

- source_spec: `_bmad-output/implementation-artifacts/spec-epic-1-a6-ad10-gate.md`
  status: open
  summary: Detect named CSS colour keywords (`color: white`, `border-color: red`) in `.css` property values in the AD-10 gate.
  evidence: `findColorViolations` catches hex, colour functions, palette variables and palette utilities, but not keywords; the TSX false-positive reason for skipping them does not apply to stylesheets. No current stylesheet outside legacy `/about` uses one (review of A-6).

- source_spec: `_bmad-output/implementation-artifacts/spec-epic-1-a6-ad10-gate.md`
  status: open
  summary: Once flowbite `dark:` and palette defaults stop leaking outside the header and footer, run `expectNoFlowbiteDefaults` on the ErrorBoundary fallback (its `Button` is not in the `replace` map) and on every new flowbite-using component from Epic 2.
  evidence: The rendered-DOM check only runs on the header, nav and footer, which already use `applyTheme: "replace"`. The fallback Button still merges flowbite defaults (tracked by the Story 1.8 entry above), so calling the check there today is expected to fail (not run).
