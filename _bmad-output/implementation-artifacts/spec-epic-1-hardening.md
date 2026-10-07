---
title: 'Epic 1 Hardening: Retro Action Items A-1 to A-5'
type: 'bugfix'
created: '2026-10-05'
status: 'done'
baseline_commit: '07f408ec608f69bca84e10f458968f257b86bdb8'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-retro-2026-10-05.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Epic 1 retrospective found shipped defects. The legacy `App.css` re-imports Tailwind, which silently resets the DESIGN §8 font stack, and its unlayered `h1`/`h2`/`p` rules put primitive-ramp typography on NotFound, the error fallback and story pages (F-1, F-2). A PUSH into a failing route never settles scroll or focus (R-1). A failed lazy chunk stays broken for the session (R-2). Focus disappears in forced-colors mode (R-3). The mobile toggle hides its state, and the copyright reads "© 2026Alisha Korba" (R-4, R-5).

**Approach:** Retire `App.css` by scoping its legacy rules to the `/about` page, which is the only page that relies on them. Settle AD-19 from the error fallback. Evict and retry failed lazies. Switch the focus utility. Give the toggle its ARIA state and fix the copyright spacing. Ship as an Epic 1 follow-up inside the retrospective PR (owner decision, 2026-10-05: all five items in one PR, before Epic 2).

## Boundaries & Constraints

**Always:**
- `/about` looks the same as before, because its legacy rules move with it.
- Role tokens and the `type-*` scale only, in non-legacy code.
- One Tailwind root (`index.css`).
- Every behavior change gets a test.

**Never:**
- Modify or delete photos or videos.
- Change routes, deploy config, the token values or the visual design of non-legacy surfaces beyond removing the bleed.
- Touch A-6 to A-11.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Not-found page | `/#/nope` | h1 22px `type-section`, no text-shadow; p 16px `text.secondary`, no 2rem margin | N/A |
| Site font | any route | `body` font-family starts `system-ui, -apple-system, "Segoe UI"` | N/A |
| PUSH into throwing route | `/` → navigate `/engineering/throws` | Fallback h1 focused, `main.scrollIntoView` called once | Boundary fallback |
| Chunk fails, then succeeds | first `import()` rejects, retry resolves | Fallback first; after navigating away and back, the page renders | Next attempt re-imports |
| Mobile toggle | closed → click | `aria-expanded` false → true; `aria-controls` names the collapse id | N/A |
| Copyright | footer | text is `© {year} Alisha Korba` | N/A |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/App.css` -- lines 1–3 re-import Tailwind, the flowbite plugin and `@source` (already in `index.css`). `body` uses role tokens. Bare `h1`/`h2`/`p` (+ md media) and `@keyframes pinkPulse`/`.avatar-pulse` use primitive tokens. Delete the file and its import in `App.tsx:1`.
- `asprinkleofcode/src/index.css` -- receives the `body` rule.
- `asprinkleofcode/src/pages/AboutMe/AboutMe.jsx` -- a 12-line legacy root with a bare `<section>`. Migrate to `AboutMe.tsx` (AD-9: a typed rewrite, children imported with explicit `.jsx`), add root class `about-me`, and update the lazy import at `App.tsx:24`.
- `asprinkleofcode/src/pages/AboutMe/AboutMe.css` -- receives the `App.css` legacy rules, scoped with `:where(.about-me)` so specificity stays (0,0,1). `Primary.css` `.primary-content h1/p` must keep winning, as before. Also receives `pinkPulse` (`Primary.css` already defines `.avatar-pulse`).
- `asprinkleofcode/src/components/{Recognition,ExplorationPaths,EvidenceHighlights,PathIndex}/*.css` -- delete the `revert-layer` block. Keep each file with a one-line comment, following `Footer.css`.
- `asprinkleofcode/src/components/ErrorBoundary/ErrorBoundary.tsx` -- add an optional `ReactNode` prop rendered with the fallback.
- `asprinkleofcode/src/App.tsx:27–38,54–75` -- `RouteSettled` sits inside the boundary's children. Also pass it through the new prop.
- `asprinkleofcode/src/lib/useNavigationScroll.ts` -- unchanged. Its `settle` already handles PUSH/POP/same-key.
- `asprinkleofcode/src/lib/storyBody.ts:14–21` -- the module `Map` caches a rejected `lazy`. Delete the entry on rejection.
- `asprinkleofcode/src/App.tsx:14–24` -- route `lazy()`s. Wrap them with a new `src/lib/lazyWithRetry.ts`.
- `asprinkleofcode/src/theme/aSprinkleOfCodeTheme.ts:8–9` -- `focusRing`: `focus:outline-none` → `focus:outline-hidden`. `footer.copyright.span: "ml-1"`.
- `asprinkleofcode/src/components/Header/Header.tsx:41` -- `<NavbarToggle />`. flowbite spreads extra props onto the `<button>` and the `NavbarCollapse` `<div>`. `useNavbarContext()` gives `isOpen`.
- `asprinkleofcode/src/components/Footer/Footer.tsx:36`, `Footer.test.tsx:98` -- FooterCopyright renders `"© ", year, <span>{by}</span>`.
- Tests: `src/App.test.tsx`, which already mocks `/engineering/throws` and `chunk-fails`, and spies `scrollIntoView` at `:478–533`; `Header.test.tsx`; `Footer.test.tsx`; `ErrorBoundary.test.tsx`.

## Tasks & Acceptance

**Execution:**
- [x] `src/pages/AboutMe/AboutMe.{tsx,css}`, delete `AboutMe.jsx` -- typed root with `about-me`. Move the legacy rules from `App.css`, scoped `:where(.about-me)`.
- [x] `src/App.css` (delete), `src/index.css`, `src/App.tsx` -- one Tailwind root; `body` moves to `index.css`.
- [x] The four component CSS files -- drop the `revert-layer` resets.
- [x] `src/test/globalCss.test.ts` -- with `?raw` imports, assert that only `index.css` imports `tailwindcss` and that no non-legacy CSS has a top-level bare `h1`/`h2`/`p`/`body` selector (excluding `index.css`'s `body` and `#root`).
- [x] `ErrorBoundary.tsx` + `App.tsx` -- render `<RouteSettled>` alongside the fallback. Add App tests: PUSH into `/engineering/throws` and into `chunk-fails` focuses "Something went wrong" and scrolls `main`.
- [x] `src/lib/storyBody.ts`, new `src/lib/lazyWithRetry.ts` (+ tests), `App.tsx` -- evict on rejection. Add an App test that the cached body retries after navigating away and back.
- [x] `aSprinkleOfCodeTheme.ts` -- `focus:outline-hidden`. Update any test that asserts the old class.
- [x] `Header.tsx` + `Header.test.tsx` -- toggle `aria-expanded`/`aria-controls` tied to the collapse `id`.
- [x] `Footer.tsx`, theme `copyright.span`, `Footer.test.tsx` -- copyright reads `© {year} Alisha Korba`.

**Acceptance Criteria:**
- Given `npm run build`, when it runs, then it exits 0.
- Given `npm run preview` at 375px and 1280px, when `/`, `/#/nope`, `/#/engineering` and `/#/about` are inspected, then computed styles match the matrix. `/about` h1/p sizes match the pre-change build, and the built CSS has exactly one `@layer base{`.

## Implementation Notes

- The implementation subagent was dispatched twice and both runs died before changing a file (a usage limit, then a session end). The spec was implemented directly in the main session, which the workflow allows when no subagent is available.
- **A-3 retry is keyed, not evicted on rejection.** React re-renders as soon as a lazy import rejects. Evicting in the `.catch` would make that re-render import again, looping on an import that keeps failing. `retryingLazy` (`src/lib/lazyWithRetry.ts`) keeps a failed `lazy()` while the caller's attempt key is unchanged and makes a fresh one for a new key. The shell passes `location.key`: route pages through `lazyWithRetry` (which reads `useLocation`), and story bodies through `getStoryBody(entry, key)` (`WorkStory`/`Personal` now pass it). Tests assert one import per failing navigation and a successful second import after navigating away and back.
- **ErrorBoundary now resets in `getDerivedStateFromProps`.** Before, `componentDidUpdate` cleared any error when `resetKey` changed. A PUSH into a throwing route changes the key in the same update that throws, so the new error was cleared, the route threw again, and a second fallback mounted. The settle probe in the first fallback had focused an `h1` that was then removed. Resetting before render, keyed on `resetKey`, means the fallback mounts once. This is retro finding R-13a, which proved to be the root cause of the failing A-2 test, not a cosmetic double-log. A test covers navigating from one failing route straight into another.
- `AboutMe.jsx` → `AboutMe.tsx` (`git mv`; children imported with explicit `.jsx`). The legacy rules sit in `AboutMe.css` under `:where(.about-me)`, unlayered.
- **Browser check (`vite preview`):**
  - `/about` at 1024px matches the pre-change baseline on every measured h1/h2/h3/p value (size, weight, color, margins, text-shadow, line-height). At 375px it keeps the legacy mobile sizes (h1 48px, p 12px).
  - `/#/nope` and `/#/engineering/missing`: h1 22px/600, no shadow. p 16px `#9C9CBA`, margin-bottom 0.
  - `body` font is `system-ui, -apple-system, "Segoe UI", Roboto, …`. Copyright reads `© 2026 Alisha Korba`. The toggle carries `aria-controls="main-menu"` and `aria-expanded` false → true on click.
  - No horizontal scroll at 375px.
- **Built CSS:** `index-*.css` went from 75 KB to 43 KB, with one each of `@layer theme{` / `@layer base{` / `@layer utilities{`.
- **Accepted:** the Landing chunk's CSS is now empty, but Vite still emits a 0-byte `Landing-*.css` that the main bundle preloads beside the chunk. That is one parallel empty request, kept over orphaning or deleting the co-located component CSS files the convention requires.
- **Matrix audit:**
  - Not-found and Site-font rows: jsdom cannot compute styles. They are guarded at the source by `src/test/globalCss.test.ts` (one Tailwind root, no bare global element rules outside legacy `/about`) and were verified in the browser.
  - PUSH into a throwing route: `App.test.tsx` "scrolls to main and focuses the fallback h1 after navigating into a route that throws / fails to load".
  - Chunk fails then succeeds: `App.test.tsx` "imports a failed story body again…" and `lazyWithRetry.test.tsx`.
  - Toggle: `Header.test.tsx` "exposes the mobile menu toggle as a disclosure…".
  - Copyright: `Footer.test.tsx:98`.
  - All of these ran and passed in `npm run build` (19 files, 196 tests).
- **Review patch (supersedes the A-3 note above).** Keying the retry on `location.key` never retried on Back or Forward, because a POP restores the failed entry's old key (review #1). The location *object* was tried next and failed too: React Router navigations are transitions, so a suspended render is discarded and `useLocation()` returns a new object on the retry. That re-imported inside the failing navigation, which the tests caught.
  - **Final mechanism:** `retryFailedImports()` advances a counter, and `retryingLazy` recreates a failed `lazy()` only when the counter has moved since the failure. The shell's `ErrorBoundary` calls it through a new `onReset` prop, only when a `resetKey` change clears an error it was showing.
  - **What that gives:** no re-import inside a failing navigation, and one fresh import after leaving it by any means (link, Back, Forward). `getStoryBody(entry)` and the detail pages are back to their original signatures.
  - **Tests:** a Back case in `lazyWithRetry.test.tsx`, a Back case on `/beyond/flaky` in `App.test.tsx`, and `onReset` cases in `ErrorBoundary.test.tsx`.

- **Walkthrough follow-up (owner decision, 2026-10-07; supersedes the "Accepted" 0-byte `Landing-*.css` note above).** Deleted the comment-only `Recognition.css`, `ExplorationPaths.css`, `EvidenceHighlights.css`, `PathIndex.css` and `Footer.css`, and their imports. `Footer.css`'s one-shadow note already lives on the theme's `footer.root` slot. The convention now reads "co-locate `ComponentName.css` only when the component has styles of its own" in `AGENTS.md`, `ARCHITECTURE-SPINE.md` (layer table and naming conventions) and `epic-1-context.md`.

## Spec Change Log

## Review Triage Log

Pass 1 (blind, edge-case, verification-gap):

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 1 | A failed import is never retried on Back/Forward: a POP restores the failed entry's `location.key` (blind, edge-case ×2) | medium | Confirmed in `retryingLazy.get`: `key === attemptKey` keeps the failed lazy on POP. The App test only returned by PUSH | patch (retry counter advanced by the boundary's `onReset`; Back tests added) |
| 2 | Beyond the Code body retry untested at `Personal.tsx` (vg) | medium | Pre-verified: the only failing-body fixture was `work/engineering/flaky` | patch (`personal/beyond/flaky` + Back test) |
| 3 | "Try again" Button merges with flowbite's `focus:outline-none`; no test pins the result (vg, blind) | low | Pre-verified gap; tailwind-merge keeps `outline-hidden` today | patch (assertion in App fallback test) |
| 4 | `globalCss.test` splits commas inside `:is()`, matches only exact bare selectors, and misses `tailwindcss/…` sub-imports (blind, edge-case ×3) | medium | `:is(h1, p)`, `main p` and `h1:first-child` all passed the old guard | patch (top-level comma split, class-scope rule with an index.css allowlist, sub-import regex) |
| 5 | Legacy exemption covers all of `pages/AboutMe/`, not just `AboutMe.css`; lazy-chunk CSS stays global once loaded (blind) | medium | `startsWith("../pages/AboutMe/")` exempted `Primary.css`/`BeyondTheCodePowerlifting.css` | patch (exempt `AboutMe.css` only; the other two pass the class rule) |
| 6 | Test allows `html` in index.css, which the task text did not list (blind) | false | `index.css` has carried `html { scroll-padding-top }` since Story 1.3 (AD-19). The task list was incomplete; the rule is the page-shell allowlist | reject |
| 7 | `ErrorBoundary.test.tsx` doesn't cover the new reset-before-render or `alongsideFallback` (blind) | medium | No unit test of either | patch (alongside, same-update error kept, `onReset` cases) |
| 8 | MDX story bodies lose all paragraph/heading spacing now that App.css is gone (blind, edge-case) | medium | True; preflight zeroes margins. Before, App.css gave spacing at 0.75rem in a primitive colour, the very defect A-1 removed. No body exists until Epic 2 | defer (Story 2.2 / 4.1 prose typography) |
| 9 | Route-page retry tested only through the helper, not via `App`'s table (vg) | low | Pre-verified; filed disposition `defer` | defer (needs a loader seam) |
| 10 | No-loop assertions rely on a fixed 50ms wait (blind) | low | A loop with immediately rejecting test loaders shows up within one tick; a slower regression is speculative | reject |
| 11 | Flaky fixtures use module-level counters and the storyBody cache (blind, vg) | low | Each fixture is used by exactly one test; developer-only | reject |
| 12 | `lazyWithRetry` mutates module state during render; every wrapper is named `LazyWithRetry` (blind) | low | The mutation is idempotent (recreate once per counter step), so abandoned renders are harmless; the name only affects DevTools | reject |
| 13 | `deferred-work.md` still lists the App.css items as open (blind) | low | True | patch (appended "Resolved by" entry) |
| 14 | Copyright spacing relies on flowbite's `"© ", year, <span>` markup (blind) | low | `Footer.test.tsx:98` pins the exact text, so a flowbite change fails loudly | reject |
| 15 | Import started under location A rejects after location B rendered the same component (edge-case) | false | B was waiting on that same import, so showing the fallback at B is correct; the next navigation retries | reject |

## Design Notes
## Design Notes

`:where(.about-me) :is(h1, h2, p)` keeps the old (0,0,1) specificity, unlayered, so the `/about` cascade is unchanged. `@layer base` alone would still leak margins and text-shadow wherever no utility overrides them, as in MDX bodies. `retryingLazy` keeps a rejected `lazy()` through the failing navigation and swaps in a fresh one once the error boundary has reset on a later navigation (`retryFailedImports`), so the import runs again without looping. A browser that caches failed module fetches may still refuse that retry, but the fallback's "Try again" reload still covers it.

## Verification

**Commands:**
- `cd asprinkleofcode && npm run build` -- expected: exit 0.

**Manual checks:**
- `vite preview` computed styles per the AC, plus a before/after of `/about` h1/h2/p font-size, color and margin.
