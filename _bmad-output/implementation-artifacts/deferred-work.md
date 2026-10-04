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
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-ambient-layer.md`
  summary: Add a browser-level test that the ambient layer's dots have no animation under prefers-reduced-motion.
  evidence: Unit tests only check class names; jsdom applies no stylesheet, so deleting the `animation: none` rules would not fail any test.
