---
title: 'Story 1.5: Ambient Layer'
type: 'feature'
created: '2026-10-04'
status: 'done'
baseline_commit: '82f9c15cc609b47519472179a146e51e76323702'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Ambient decoration is scattered across three per-page implementations (`StarBackground` on AboutMe Primary, `GradientWaves` on AboutMe Powerlifting, emoji sparkle spans in the Landing Hero). None honors `prefers-reduced-motion`, and `StarBackground` re-randomizes on every render. This violates AD-12 and NFR-5.

**Approach:** Build one `<AmbientLayer>` (`src/components/AmbientLayer/`), mounted once in the `App.tsx` shell behind `<main>`, with the AD-12 contract and a static reduced-motion path from `usePrefersReducedMotion`. Remove the three per-page implementations and their components.

## Boundaries & Constraints

**Always:** `aria-hidden="true"`, `pointer-events: none`, `position: fixed; inset: 0`, and a fixed negative or base z-index below the header, `<main>` and footer. Use semantic role tokens only (`--background-recessed`, `--brand-primary`); no primitive ramps or raw hex. Generate dot positions deterministically once at module scope, never `Math.random()` during render. The layer must read as background only; content legibility is unchanged. Get the reduced-motion signal only from `src/lib/usePrefersReducedMotion.ts`.

**Never:** Import `AmbientLayer` from any page. Leave per-page ambient decoration in place. Add a `variant` prop (YAGNI until a per-route treatment is decided). Use canvas/WebGL or new dependencies. Touch the Header/Footer markup (Story 1.4). Modify or delete media in `src/assets/` or `public/`.

**Decision — treatment (2026-10-04, option D "quiet stardust"):** uniform on every route, ~40 tiny (1–3px) round dots on the `--background-recessed` surface, each slowly twinkling (opacity ~0.15 → 0.9 over ~5s, staggered delays), dot colour from `--brand-primary`. No star icons, no gradient, no movement beyond opacity. Reduced motion shows the same dots at a fixed mid opacity.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Default | Any route, motion allowed | One layer, animated, behind all content | N/A |
| Reduced motion | `prefers-reduced-motion: reduce` | Same layer, no CSS animation (static) | N/A |
| No `matchMedia` | jsdom/old browser | Animated path; no crash | Hook returns `false` |
| Layer absent | Component removed / throws | App renders and navigates normally | Layer is a sibling outside the route boundary with no children depending on it |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/App.tsx` -- shell; render `<AmbientLayer />` as the first child inside `ThemeProvider`, before `<Header />`, outside `ErrorBoundary`/`Suspense`.
- `asprinkleofcode/src/lib/usePrefersReducedMotion.ts` -- existing hook (Story 1.3); reuse, don't change.
- `asprinkleofcode/src/components/StarBackground/`, `GradientWaves/` -- superseded by the Decision; delete both folders (nothing carried over).
- `asprinkleofcode/src/pages/AboutMe/Primary.jsx:4,12`, `BeyondTheCodePowerlifting.jsx:3,10` -- legacy; remove only the import and element lines.
- `asprinkleofcode/src/pages/Landing/Hero.jsx` + `Hero.css` -- remove the four `.sparkle` spans and the `pulseSoft`/`.sparkle*` CSS only.
- `asprinkleofcode/src/theme/colors.css` -- `--background-recessed` is the ambient surface token.
- `asprinkleofcode/src/App.test.tsx`, `src/test/setup.ts` -- existing shell smoke tests; `matchMedia` may be stubbed there.

## Tasks & Acceptance

**Execution:**
- [x] `src/components/AmbientLayer/AmbientLayer.tsx` + `AmbientLayer.css` -- quiet stardust per the Decision (seeded PRNG at module scope; dots are absolutely positioned spans); root `div.ambient-layer` with the contract; adds a `ambient-layer--static` modifier when reduced motion is on, which sets `animation: none` on all descendants.
- [x] `src/components/AmbientLayer/AmbientLayer.test.tsx` -- asserts `aria-hidden`, the static modifier under a reduced-motion `matchMedia` stub, and the animated class otherwise.
- [x] `src/App.tsx` -- mount once as described in the Code Map.
- [x] `src/App.test.tsx` -- assert exactly one `.ambient-layer` across route renders; assert routes still render when `AmbientLayer` is mocked to `null`.
- [x] `src/pages/AboutMe/Primary.jsx`, `BeyondTheCodePowerlifting.jsx`, `src/pages/Landing/Hero.jsx`, `Hero.css` -- remove per-page decoration.
- [x] Delete `src/components/StarBackground/` and `src/components/GradientWaves/`.

**Acceptance Criteria:**
- Given the built app, when `grep -r "StarBackground\|GradientWaves\|sparkle" src` runs, then no matches remain outside `AmbientLayer`.
- Given `npm run preview` with reduced-motion emulated, when any route loads, then the ambient layer is visible and fully static, and all links and buttons remain clickable.

## Implementation Notes

## Spec Change Log

## Review Triage Log

Pass 1 (blind, edge-case, verification-gap):

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 1 | Layer outside every error boundary; a throw unmounts the app (edge-case, claim) | medium | Contradicts the matrix row "throws → app renders". Fixed with `AmbientBoundary` (null fallback) plus a throwing-mock test | patch |
| 2 | Same-dot-field test cannot fail; `DOTS` is computed once per module (blind, verification-gap) | low | Confirmed. Now pins the first dot's seeded `top`/`left`/`width` | patch |
| 3 | `ambient-layer--animated` has no CSS rule (blind) | low | Dead class; removed | patch |
| 4 | Static state relies on JS only (blind) | low | Added `@media (prefers-reduced-motion: reduce)` fallback | patch |
| 5 | `z-index: -1` buries the layer under opaque backgrounds (blind, edge-case, verification-gap) | false | Only `body` (propagates to the canvas, painted below the layer) and `.pr-tile` cards (meant to sit above) are opaque; no shell wrapper sets a background | reject |
| 6 | Reduced-motion CSS not verified by tests (verification-gap) | low | jsdom applies no stylesheet; needs a browser/e2e layer | defer |
| 7 | First AmbientLayer test relies on the setup.ts `matchMedia` stub (blind, edge-case) | low | Setup stub is the shared convention for all tests | reject |
| 8 | No test for a live `change` of the reduced-motion preference (blind) | low | Covered by the hook's own Story 1.3 tests | reject |
| 9 | Mobile density halving dropped (blind) | false | The Decision fixes ~40 dots uniformly | reject |
| 10 | Dots may be too faint or too distracting (blind) | maybe-false | Needs a visual browser check; would be at most low | reject |
| 11 | Leftover `relative` on powerlifting section; trailing newline in Hero.css (blind) | low | Harmless and legacy `.jsx` scheduled for replacement | reject |
| 12 | Powerlifting loses its gradient tint (blind) | false | Intended by the epic AC and the Decision | reject |
| 13 | Possible dead `FaStar` / deleted-component imports (blind) | false | Build and lint pass; `react-icons` still used elsewhere | reject |
| 14 | Spec not in the diff, so ACs can't be checked (blind) | false | Diff was scoped to code by design; spec is the claims file | reject |

## Verification

**Commands:**
- `cd asprinkleofcode && npm run build` -- expected: exit 0 (typecheck, lint, tests, vite build).

**Manual checks:**
- `npm run preview`: walk `/`, `/about`, `/engineering`; layer sits behind header, content and footer; toggle reduced-motion emulation and confirm animation stops.
