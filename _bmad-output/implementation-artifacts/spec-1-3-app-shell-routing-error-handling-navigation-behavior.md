---
title: 'Story 1.3: App Shell — Routing, Error Handling & Navigation Behavior'
type: 'feature'
created: '2026-10-04'
status: 'done'
baseline_commit: '6e55cf0d20088ac7b32cfbd07f5d2f3571dab9ae'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `App.tsx` routes only `/` and `/about`, loaded eagerly, with no error boundary, no not-found route, and no scroll or focus handling. A failed chunk or render error blanks the page, and route changes leave visitors at a stale scroll position with focus lost.

**Approach:** Replace the route table with AD-5's fixed set, with every page loaded via `React.lazy`. Wrap the routed area in one error boundary and one `Suspense` boundary inside `<main>`. Add placeholder index and detail pages that read the registry, a not-found page, `usePrefersReducedMotion`, and a single shell-level scroll/focus handler (AD-5, 6, 13, 16, 19).

## Boundaries & Constraints

**Always:** Use `HashRouter` (in `main.tsx`, unchanged). Header and Footer render outside the error and `Suspense` boundaries, so they show during loading and after errors. Scroll and focus settle only after everything in the route's `Suspense` boundary has resolved, including a story body. Pages never handle their own scroll or focus. `usePrefersReducedMotion` is the only source of the reduced-motion signal. Use role tokens and `type-*` utilities only. Any page copy the visitor sees must be finished text that is safe to make public.

**Decision (owner, 2026-10-04):** keep `/about` → legacy `AboutMe` as a temporary, lazily loaded route outside AD-5's set, marked in code as legacy pending removal by Story 1.4 or Epic 4. The header "About Me" link and the Landing "Learn About Me" button keep working.

**Never:** Don't make the header sticky, rename or reorder nav labels, restyle the header or footer, or add social links. All of that is Story 1.4. Don't build path-index lists or teasers (Story 1.7), the Landing identity block (Story 1.6), the ambient layer (Story 1.5), `useDocumentMeta`, or MDX blocks. Don't touch photos, videos, or deploy config. Don't add a state library.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Index route | `/engineering`, `/leadership`, `/beyond` | `<h1>` path label ("Engineering", "Leadership & Enablement", "Beyond the Code") plus "No stories published yet." | N/A |
| Known detail | `/engineering/foo` with a registry entry on that path | `<h1>` title, summary, lazily loaded body | N/A |
| Unknown detail | slug missing, or present only on the other work path | not-found content, nav intact | no throw |
| Legacy route | `/about` | legacy AboutMe page renders as today | N/A |
| Unknown path | `/nope` | not-found page with `<h1>` and a link home | N/A |
| Render/chunk failure | page throws, or lazy `import()` rejects | error fallback in `<main>` with a "Try again" (reload) button and a link home; header and footer stay | boundary resets on the next location change |
| Forward nav | PUSH/REPLACE, route resolves | scroll to top of `<main>` (smooth, or instant under reduced motion); focus the `<h1>` | no `<h1>`: scroll only |
| Back/pop | POP to a visited entry | restore that entry's saved scroll position, instantly; focus unchanged | unknown entry → top |
| Initial load | first render | no scroll or focus change | N/A |
| Still loading | fallback showing | header visible; no scroll or focus change; scroll events don't overwrite saved positions | N/A |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/App.tsx` -- shell. Replace the eager imports and route table; `/about` stays as a lazy legacy route (see Decision). Keep `ThemeProvider` > `Header` > `main` > `Footer`.
- `asprinkleofcode/src/main.tsx` -- `HashRouter`. No change.
- `asprinkleofcode/src/components/Header/RouterNavlink.tsx` -- uses a raw `href="#/…"`. Anchor navigation reaches React Router as POP with key `"default"`, which breaks forward/back detection. Render `NavbarLink as={…}` bound to router `Link` (pattern: `HomeLink` in `Header.tsx`). Keep labels and `active` logic.
- `asprinkleofcode/src/lib/registry.ts` -- `getEntry(path, slug)`, `loadBody(entry)` (returns an `MDXModule` whose `default` is the component). Read only from pages. First runtime import, so `vite build` now enforces frontmatter validation.
- `asprinkleofcode/src/lib/frontmatter.ts` -- `WorkPath`, `PersonalPath`, `PERSONAL_PATH`.
- `asprinkleofcode/src/pages/Landing/LandingPage.jsx`, `pages/AboutMe/AboutMe.jsx` -- legacy. Lazy-import with an explicit `.jsx` extension. Don't edit.
- `asprinkleofcode/src/theme/aSprinkleOfCodeTheme.ts` -- `button.color.primary`, plus `focusRing` classes to copy for links.
- `asprinkleofcode/src/test/setup.ts` -- jsdom lacks `scrollIntoView`, and `scrollTo` reports "not implemented". Stub both.
- `asprinkleofcode/src/App.test.tsx` -- route smoke test. Lazy pages need `findBy*`.
- `asprinkleofcode/src/index.css` -- shell-level CSS home for `--header-height`.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/usePrefersReducedMotion.ts` (+ test) -- `useSyncExternalStore` over `matchMedia('(prefers-reduced-motion: reduce)')`; returns `false` when `matchMedia` is missing.
- [x] `src/lib/useNavigationScroll.ts` (+ test) -- one hook for the shell (outside `Suspense`). It sets `history.scrollRestoration = 'manual'` and records `scrollY` per settled `location.key` from a passive scroll listener, pausing between a location change and its settle. It returns `settle(key, navigationType)`, which applies the matrix rows. It is idempotent per key (StrictMode, and `Suspense` re-reveal re-running layout effects). Forward settle calls `main.scrollIntoView({ block: 'start' })`, gives the `<h1>` `tabindex="-1"` if it is missing, and focuses it with `preventScroll`.
- [x] `src/components/ErrorBoundary/ErrorBoundary.tsx` + `.css` (+ test) -- class boundary with a `resetKey` prop. Fallback: `<h1>` "Something went wrong", text "This part of the page didn't load. The navigation above still works, or you can try again.", a flowbite `Button` "Try again" that reloads the page, and a `Link` "Go to the homepage".
- [x] `src/pages/NotFound/NotFound.tsx` -- `<h1>` "Page not found", text "There's nothing at this address. It may have moved, or the link may have a typo.", and a `Link` "Go to the homepage".
- [x] `src/pages/Engineering/Engineering.tsx`, `Leadership/Leadership.tsx`, `Beyond/Beyond.tsx` -- index placeholders per the matrix.
- [x] `src/pages/WorkStory/WorkStory.tsx` (`path` prop), `src/pages/Personal/Personal.tsx` -- detail placeholders. `getEntry`; render `NotFound` when there is no entry. The body is a `React.lazy` cached per entry key in `src/lib/storyBody.ts`, with no inner `Suspense`, so the route boundary covers it.
- [x] `src/App.tsx` -- `ErrorBoundary resetKey={location.key}` > `Suspense` (fallback: `sr-only` `role="status"` "Loading…") > `Routes` plus a sibling `RouteSettled` that calls `settle` in a layout effect keyed on `location.key`. All pages are `React.lazy`, including legacy `/about` with a comment naming it temporary.
- [x] `src/index.css` -- `:root { --header-height: <current rendered navbar height> }`; `html { scroll-padding-top: var(--header-height) }`; `h1[tabindex="-1"]:focus { outline: none }`.
- [x] `src/components/Header/RouterNavlink.tsx` -- router `Link` as described in the Code Map.
- [x] `src/test/setup.ts`, `src/App.test.tsx` -- stubs; smoke-test every route and matrix row through `App` with no console errors (expected boundary errors spied and silenced). Assert the header renders while a route is suspended.

**Acceptance Criteria:**
- Given a fresh `npm ci`, when `npm run build` runs, then all gates pass and route pages are emitted as separate chunks from the entry chunk.
- Given `npm run preview`, when navigating via header links, scrolling, then going back, then forward nav lands at the top with the `<h1>` focused, and back restores the earlier scroll position.

## Implementation Notes

- `focusRing` is now exported from `aSprinkleOfCodeTheme.ts` and reused via `src/lib/linkClasses.ts` (`textLinkClasses`) instead of being copied.
- `RouterNavlink` uses a module-level `RouterAnchor` adapter (`href` -> `Link to`) as NavbarLink's `as`, since `as` isn't polymorphically typed.
- `useNavigationScroll(mainRef)` takes the `<main>` ref. Pausing happens in a layout effect on `location.key` in the shell; it runs after the child `RouteSettled` effect, so a route that didn't suspend is already settled and recording isn't paused.
- `--header-height` is calculated from the theme classes: 61px below md, 53px from md up. It wasn't measured in a browser.
- Index placeholders show "No stories published yet." only when `getPathEntries` is empty. Lists come in Story 1.7.
- After review, the Landing "Learn About Me" button was changed to flowbite `Button as={Link} to="/about"` so it navigates as PUSH; copy and styling are unchanged. Known gap: the footer copyright `href="#"` is still a raw hash anchor and gets no scroll/focus handling (Story 1.4).
- Review finding 2 (retry a failed story-body import) was tried and then reverted. Evicting the cache entry inside the rejection handler loops forever, because React re-renders while committing the error and a new lazy suspends again. The working alternative needed a new `ErrorBoundary onError` prop plus module state, which is too much for a rare failure that "Try again" (a reload) already recovers from.
- `useNavigationScroll` seeds `settledKey` with the initial `location.key` and clears `paused` before the same-key early return.

## Spec Change Log

## Review Triage Log

Pass 1 (blind, edge-case, verification-gap):

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 1 | Landing "Learn About Me" (`Hero.jsx:22`, `href="#/about"`) reaches the router as POP, so it gets no scroll-to-main or `<h1>` focus. No test clicks it (blind, verification-gap) | medium | On a fresh load the HashRouter key is `"default"`. The anchor nav also yields `"default"`, so `settle` returns early and does nothing. This is the homepage's main CTA and one of the two entry points `/about` was kept for. The Code Map's "don't edit" was about restyling; a one-line router `Link` swap is the direct fix | patch |
| 2 | `getStoryBody` caches a rejected `lazy` forever, so after one chunk failure the story errors on every revisit until reload (blind, edge-case) | low | Real (React `lazy` memoizes rejection), but rare. The direct `.catch` evict loops forever because React re-renders during the error commit. The working fix needs a new boundary prop and module state, and "Try again" already recovers by reloading. Patch attempted, then reverted | reject |
| 3 | `settle` returns early for an already-settled key without clearing `paused`, so recording stops after a POP back from an errored route (edge-case, incl. claim) | low | An errored route commits its location (App's layout effect sets `paused`) but never settles. A POP back to the previous key hits the early return with `paused` still `true`. Fix is direct: clear `paused` before the early return | patch |
| 4 | If the initial route throws, `settledKey` stays `null`, so the first real navigation counts as "initial" and gets no scroll or focus (edge-case) | low | `RouteSettled` never mounts under the fallback. Fix is direct: seed `settledKey` with the initial `location.key` | patch |
| 5 | Error fallback gets no focus or scroll; `RouteSettled` unmounts with the boundary (blind, edge-case) | low | Real, but only on a render or chunk failure. Focus stays on the clicked header link, which still exists. The fix needs a new boundary prop or callback | reject |
| 6 | `role="status"` fallback inserted with its text may not be announced (blind) | low | React Router 7.9.6 wraps navigations in `startTransition`, so the fallback shows only on initial load, where the page is announced anyway. The fix adds a persistent live region | reject |
| 7 | Index placeholders hide the empty-state line when stories exist and list nothing (blind) | low | Story content (2.4+) is sequenced after Story 1.7 replaces these pages. The fix would build 1.7's list | reject |
| 8 | Header lacks links to the new routes; active match is exact (blind) | false | The frozen Never assigns nav changes to Story 1.4 | reject |
| 9 | `WorkStory` and `Personal` duplicate render logic (blind) | low | 20-line placeholders, both replaced by Epics 2 and 4. Extracting them is not a direct fix | reject |
| 10 | POP restore can clamp short if content grows after resolve (blind, edge-case) | low | Possible on image-heavy AboutMe if images are not yet cached. The fix needs a ResizeObserver retry loop | reject |
| 11 | "Still loading" test uses a fixed 20 ms wait and passes because the transition keeps the old page, not because of the boundary (blind, verification-gap) | low | Confirmed: navigations are transitions (`chunk-4WY6JWTD.mjs:6405`). User-visible behavior is still correct, the comments' commit-unit claim holds either way, and the test still guards a premature settle | reject |
| 12 | `ErrorBoundary` has no `componentDidCatch` (blind) | false | No named harm; React already logs caught errors | reject |
| 13 | `--header-height` is hand-copied, and `scroll-padding-top` offsets `<main>` though the header isn't sticky (blind) | false | `<main>` starts right below the header, so `scrollIntoView` with padding = header height lands at `scrollY` 0. The comment notes Story 1.4 updates the value | reject |
| 14 | `ErrorBoundary` resets in the same commit that a new `resetKey` throws, rendering the child twice (edge-case) | low | `componentDidUpdate` sees the changed key and clears the error, the child re-throws, and the fallback holds. The only cost is a duplicate console error; the fix adds state | reject |
| 15 | `MediaQueryList.addEventListener` is missing in Safari < 14 and would crash the shell (edge-case) | low | Browsers from before 2020 only. The fix adds a branch | reject |
| 16 | Footer copyright `href="#"` navigates as POP to `/` (verification-gap) | low | Pre-existing, not changed here. Story 1.4 rebuilds the footer | defer |

## Design Notes

Settle timing: `RouteSettled` is a sibling of `<Routes>` inside the same `Suspense` boundary. A boundary never commits part of its tree, so the settler's layout effect for a new location runs only once the page and its body have resolved, whether React shows the fallback or keeps the old UI during a transition. Only one `--header-height` consumer is added (`scroll-padding-top`). Adding `scroll-margin-top` on top of it would double the offset, so that is left for future in-page anchor targets. Scroll positions are kept in memory only, so a reload doesn't restore them.

## Verification

**Commands:**
- `cd asprinkleofcode && npm ci && npm run build` -- expected: exit 0.

**Manual checks:**
- `npm run preview`: walk the matrix in a browser, including a forced chunk failure (block a route chunk in devtools) and reduced-motion emulation.
