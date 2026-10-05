---
title: 'Story 1.8: Visual Alignment to the Homepage Mockup (UX-030)'
type: 'feature'
created: '2026-10-05'
status: 'done'
baseline_commit: '122bf61c144de13180d32654939e798ac13279b1'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** UX-030 (DESIGN v0.9 §6–§8, §15, §16) gives the whole site the homepage mockup's navy look. Today the site still has:
- the legacy grey page (`--color-dark-600`, a primitive, against AD-10) with pink glowing bokeh;
- a rose header brand sized by `type-title`, and white inactive nav links;
- a navy footer with a faint `shadow-inner`;
- level 1/2 type at the old sizes.

Also, for visitors whose OS is in dark mode, flowbite's default `dark:` classes override the header and footer theme: grey-blue `#1F2937` bars and white or grey nav links instead of role tokens.

**Approach:** Implement Story 1.8's ACs (`epics.md`). Behavior and contracts from Stories 1.4 and 1.5 stay as they are.
- Switch the page to `background.primary`.
- Replace the bokeh with twinkling stars.
- Recolour the header brand and nav; move the footer onto `background.recessed`.
- Enlarge `type-identity` and `type-title`.
- Make the header and footer theme slots `replace` the flowbite defaults, so every visitor sees the role tokens.

## Boundaries & Constraints

**Always:**
- Role tokens only (no primitives, raw hex or Tailwind palette).
- The AD-12 contract holds:
  - one `<AmbientLayer>` in the shell, `aria-hidden`, `pointer-events: none`, `z-index` below content;
  - a static path from `usePrefersReducedMotion`, plus the CSS `prefers-reduced-motion` fallback;
  - `AmbientBoundary`, and the app must work without the layer;
  - a seeded PRNG, positions drawn once per mount, and a fresh field per navigation (the shell key).
- Contrast stays WCAG 2.2 AA, and the solid `focus.ring` still shows on every header and footer control.
- The UX-028 footer icon row, order, accessible names and woodcraft hover are unchanged.

**Never:**
- New dependencies or canvas/WebGL.
- Touching the Recognition component (Story 1.6) beyond what the type-scale change does automatically.
- Building Story 1.7.
- Changing routes or `index.html`.
- Editing media in `src/assets/` or `public/`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Motion allowed | Any route | Sparse stars twinkle on their own phases; no drift, no glow | N/A |
| Reduced motion | `prefers-reduced-motion: reduce` | Same field, static, fixed faint opacity | N/A |
| OS dark mode | `prefers-color-scheme: dark` | Header and footer render the same role-token colours as light mode | Theme slots use `replace`; no `dark:`/`gray-` classes rendered |
| Layer absent/throws | Mocked null or throwing layer | Routes render and navigate | Existing shell tests stay green |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/App.css:5-8` -- `body` uses `--color-dark-600` / `--color-dark-50`. Switch to `var(--background-primary)` / `var(--text-primary)`; leave the other legacy rules alone.
- `asprinkleofcode/src/components/AmbientLayer/AmbientLayer.tsx`, `.css`, `.test.tsx` -- the bokeh rewrite.
  - Keep: `mulberry32`, the `seed` prop, the `useState` initializer, the `--static` modifier, the fade-in and the reduced-motion media query.
  - The test asserts 28 dots and seeded `top`/`left`/`width` values; update both.
- `asprinkleofcode/src/App.test.tsx:330` -- the ambient reshuffle test selects `.ambient-layer__dot`.
- `asprinkleofcode/src/theme/theme.css:57-72` -- `type-identity` (`clamp(1.5rem…2.25rem)`, lh 1.2) and `type-title` (1.25rem, 500). The only users are Recognition and the header brand (`Header.tsx:42`).
- `asprinkleofcode/src/components/Header/Header.tsx:42` and `Header.css` -- the brand text carries `type-title`. `.navbar-brand-text` sets weight 700. Keep the hover glow and sparkle.
- `asprinkleofcode/src/theme/aSprinkleOfCodeTheme.ts` -- the theme slots to change:
  - `navbar.brand.base` has `text-brand-primary`;
  - `navbar.link.active.off` has `text-text-primary`;
  - `footer.root.base` has `bg-background-primary shadow-inner`.
  - `createTheme` merges each slot with the flowbite defaults, so `dark:bg-gray-800`, `dark:text-gray-400`, `dark:border-gray-700` and similar end up rendered (confirmed in a browser).
  - `ThemeProvider` (`App.tsx`) and components accept `applyTheme` (`"replace"` per slot, typed `DeepPartialApplyTheme`).
- `asprinkleofcode/src/components/Header/Header.test.tsx`, `Footer/Footer.test.tsx` -- add the class assertions here.
- `_bmad-output/implementation-artifacts/deferred-work.md` -- the Story 1.4 entry on flowbite `dark:` leakage is resolved by this story.

## Tasks & Acceptance

**Execution:**
- [x] `asprinkleofcode/src/App.css` -- `body` background and colour switch to role tokens -- AC 1 and AD-10.
- [x] `asprinkleofcode/src/components/AmbientLayer/AmbientLayer.tsx` + `.css` -- stars replace the bokeh -- AC 2 and the I/O matrix.
  - Rename `__dot` to `__star`.
  - Count from viewport area at mount, about 10 per 420×520px, clamped to roughly 12–80, with a fallback when there's no `window`.
  - Size: 1px, about 1 in 6 at 1.5px.
  - Tint: about 70% `--text-primary` and about 15% each `--accent-secondary` and `--brand-primary`, via modifier classes.
  - Twinkle: opacity 0.25 → 0.8 over about 5s, alternate, with a random negative delay per star.
  - No drift, no glow.
  - Static path: fixed opacity of about 0.5.
- [x] `asprinkleofcode/src/components/AmbientLayer/AmbientLayer.test.tsx` + `src/App.test.tsx` -- update the selectors and seeded expectations; assert that only star sizes 1px/1.5px appear and that tint classes come from the allowed set.
- [x] `asprinkleofcode/src/theme/theme.css` -- `type-identity` and `type-title` reach the AC 5 sizes.
  - `type-identity`: 2.1rem, stepping to 3rem at `48rem` (`md`); line-height 1.05; weight 700; tracking 0.02em.
  - `type-title`: 1.1rem, stepping to 1.35rem; weight 600.
  - Confirm the nested `@media` compiles inside `@utility`.
- [x] `asprinkleofcode/src/components/Header/Header.tsx` + `aSprinkleOfCodeTheme.ts` -- AC 3 in both colour schemes.
  - Brand text: drop `type-title`; use `text-base tracking-[0.02em] text-text-primary`.
  - Theme: `navbar.brand` uses `text-text-primary`; `link.active.off` uses `text-text-secondary`.
- [x] `asprinkleofcode/src/theme/aSprinkleOfCodeTheme.ts` + `src/components/Footer/Footer.css` comment -- `footer.root.base` becomes `bg-background-recessed border-t border-border-default shadow-[inset_0_2px_6px_rgb(0_0_0/0.5)]` -- AC 4.
- [x] `asprinkleofcode/src/theme/aSprinkleOfCodeTheme.ts` + `src/App.tsx` -- export an `applyTheme` map that sets `"replace"` on every navbar and footer slot the theme defines, and pass it to `ThemeProvider` -- I/O matrix dark-mode row.
- [x] `Header.test.tsx`, `Footer.test.tsx` -- assert the following:
  - the brand text has `text-text-primary` and no `type-title`;
  - inactive links have `text-text-secondary`;
  - the footer root has recessed, border and inset-shadow classes;
  - no rendered header or footer element carries a `dark:` or `gray-` class.
- [x] `_bmad-output/implementation-artifacts/deferred-work.md` -- add a new entry noting the Story 1.4 `dark:` leakage item is resolved by Story 1.8 (do not edit the old entry).

**Acceptance Criteria:**
- Given `vite preview` at 375px and 1280px in both light and dark colour schemes, when `/`, `/engineering` and `/nope` render, then:
  - the page is navy `#1E1E2F` with faint twinkling stars;
  - the header brand is white "Alisha Korba" at 16px/700, inactive links `#9C9CBA` and the active link rose;
  - the footer is `#0F0F15` with a visible top border and inset shadow;
  - the Recognition name is about 33.6px/48px and the title about 17.6px/21.6px at weight 600.
- Given reduced-motion emulation, when any route loads, then the stars are visible and fully static.

## Review Triage Log

Pass 1 (blind, edge-case, verification-gap):

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 1 | App.tsx `applyTheme` wiring untested; Header/Footer tests supply their own provider (vg gap, blind) | medium | Pre-verified gap: removing it from App.tsx keeps every test green, and dark-mode visitors get the grey bars back | patch |
| 2 | Viewport-sizing test uses 1024×768, whose count equals `FALLBACK_STARS` (blind) | low | Confirmed: round(786432 × 10 / 218400) = 36 = fallback | patch |
| 3 | Footer shadow is a raw `rgb()` literal in a theme that bans raw colours (blind) | low | Confirmed against the theme file's header rule; a named `@theme` shadow token matches the existing glow tokens | patch |
| 4 | Type steps hard-code `48rem` instead of the `md` breakpoint (blind) | low | Confirmed; would desync from Recognition's `md:` layout switch if the breakpoint changed | patch |
| 5 | Duplicated declarations: star base vs `--light` colour; brand span vs slot colour (blind) | low | Confirmed; fix is deletion | patch |
| 6 | `"replace"` silently drops structural classes in future slots; footer focus-offset choice not in code (blind) | low | Confirmed (e.g. copyright lost `sm:text-center`, no visible effect today). Comment-only fix | patch |
| 7 | `colors.css` says `--background-recessed` is for the ambient layer (blind) | low | Confirmed stale after this story | patch |
| 8 | Dark-mode sweep copy-pasted in two test files (blind) | low | Confirmed; shared helper also serves #1 | patch |
| 9 | Dark-mode leak remains on Avatar/Button/Carousel outside header/footer (edge, blind) | low | Pre-existing; limited to legacy `/about` and the error-fallback button. A site-wide `@custom-variant dark` would be the clean fix | defer |
| 10 | No `color-scheme: dark`, so light-mode visitors get light native controls on the dark page (blind) | low | Pre-existing: the page was already dark grey before this story | defer |
| 11 | `replaceDefinedSlots` could throw for a theme slot missing from flowbite defaults (edge) | false | Every slot the theme defines exists in flowbite defaults today; header and footer render in all tests and the browser | reject |
| 12 | Disabled nav link and unused footer slots would render default grey classes (edge) | low | Not rendered anywhere (no disabled links; groupLink/title/divider unused) | reject |
| 13 | `starCount()` fallback branches untested (blind) | low | No-window/non-finite viewport doesn't occur in the browser build; no user harm | reject |
| 14 | `as DeepPartialApplyTheme` cast hides slot mismatches (blind) | low | Stronger typing needs a mapped type; the dark-mode sweep tests catch a broken map at runtime | reject |

## Design Notes

- **Focus ring in the footer:** the offset colour stays `ring-offset-background-primary`. On the recessed footer that shows as a 2px navy gap before the rose ring, which is still a visible solid ring. Retargeting the offset per surface would mean forking `focusRing`.
- **Type steps:** a single step at `md` rather than a fluid clamp, because the decided values are a desktop/mobile pair and Recognition already switches layout at `md`.

## Verification

**Commands:**
- `cd asprinkleofcode && npm run build` -- expected: exit 0 (typecheck, lint, tests, vite build).

**Manual checks:**
- In the browser pane, run the AC matrix: 375px and 1280px, light and dark scheme, reduced motion, with keyboard Tab through the header and footer to confirm the focus ring.

## Implementation Notes

- Final browser check on `vite preview`. At 1280px with OS dark mode:
  - page `#1E1E2F` with 47 stars;
  - header navy, with a white 16px/700 "Alisha Korba", inactive links `#9C9CBA` and the active link rose;
  - footer `#0F0F15` with a 1px `#3A3A4D` top border and inset shadow `rgba(0,0,0,.5) 0 2px 6px`;
  - Recognition name 48px/700 white, title 21.6px/600 rose.
- At 375px (light): 14 stars; name 33.6px, title 17.6px/600 with a 10px gap; padding 56/48; text and headshot left-aligned at x=16; no horizontal scroll. This also closes the Story 1.6 size check deferred in `spec-1-6-recognition-color-and-positioning.md`.
- Review patches: a shared `src/test/expectNoFlowbiteDefaults.ts` sweep, now also run at App level so it guards the `applyTheme` wiring; the 1280×800 star-count test; a `--shadow-recessed-inset` theme token; `@variant md` for the type steps; de-duplicated colour declarations; comments on `"replace"` and the footer focus offset; and a `colors.css` comment fix.
- Not truly emulated: `prefers-reduced-motion` (the browser pane can't set it). The `--static` path was exercised directly and the CSS media fallback is in the build.
- Owner follow-up (2026-10-05): stars read as dust at 1px, so sizes went up to 1.5px with about 1 in 6 at 2px. DESIGN §16, the Story 1.8 AC in `epics.md`, `epic-1-context.md` and `mockups/key-homepage.html` were updated to match.
