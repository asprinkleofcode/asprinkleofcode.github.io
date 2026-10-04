---
title: 'Story 1.1: Toolchain & Compliance Baseline'
type: 'chore'
created: '2026-10-04'
status: 'done'
baseline_commit: '55f73a7497849843ca2ba087bc020b9e859bd527'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The app has no type-checking, lint skips `.ts`/`.tsx`, there are no tests, and `npm run build` is a bare `vite build`, so nothing stops a broken or inaccessible change from deploying. AD-10's semantic token layer doesn't exist, so later stories can't follow it.

**Approach:** Add TypeScript (strict), typescript-eslint + jsx-a11y, and Vitest + Testing Library; migrate the entry files to TS; author the role-token layer, type scale, and radius tokens; remove dead scaffolding; then make `build` gate on tsc + eslint + vitest before `vite build` (AD-17).

## Boundaries & Constraints

**Always:** Work under `asprinkleofcode/`. Pin `typescript` ~5.9, `typescript-eslint` ^8.70, `eslint-plugin-jsx-a11y` ^6.10, `vitest` ^5, `@testing-library/react` ^16.3 (+ `@testing-library/dom`, `jsdom`). Keep ESLint on 9.x and `@vitejs/plugin-react` on 4.x. `tsconfig.json`: `strict: true`, `noUncheckedIndexedAccess` off, `allowJs`/`checkJs` off. Keep `HashRouter` and the current routes (`/`, `/about`). Visible behavior stays the same, except that theme values move to the remediated role tokens (brand fill `#A73E6C`, solid 2px focus ring, `text.secondary` replacing raw grays), which DESIGN §18a requires once a file is touched.

**Never:** Don't modify or delete photos/videos; `src/assets/react.svg` (an unused Vite template logo) is the only asset removed. No `CNAME`, no workflow/deploy changes, no PR CI. Don't create `--brand-primary-fill-hover`. Don't migrate other `.jsx` pages, add routes, build the registry, `cssVar`, `AmbientLayer`, or `rollup-plugin-visualizer`; those belong to later stories.

</frozen-after-approval>

## Code Map

- `asprinkleofcode/package.json` -- scripts `build` (`vite build`) and `lint` (`eslint .`); no TS or test deps. `node_modules` is absent, so run `npm install`.
- `asprinkleofcode/eslint.config.js` -- flat config covering `**/*.{js,jsx}` only. Keep it as `.js`, since a TS config would need `jiti`.
- `asprinkleofcode/vite.config.js` -- plugins: react, tailwindcss, flowbite-react. Becomes `vite.config.ts` and gains the vitest `test` block.
- `asprinkleofcode/src/App.jsx` -- holds the unused `useState` counter. `ThemeProvider` → Header, Routes (`/` LandingPage, `/about` AboutMe, both with `viewTransition`), Footer.
- `asprinkleofcode/src/main.jsx` -- `createRoot(getElementById("root"))` with a non-null assumption, StrictMode, HashRouter.
- `asprinkleofcode/src/components/Header/Header.tsx` -- `NavbarBrand as={Link} href="https://flowbite-react.com"` is the stale href and should become `to="/"`. Also has `interface HeaderProps {}` and an unused `React` import, which typescript-eslint will flag.
- `asprinkleofcode/src/components/Footer/Footer.tsx`, `GradientWaves/GradientWaves.tsx` -- same empty-interface pattern. Fix only what lint/tsc require. Leave the links and icons alone.
- `asprinkleofcode/src/components/Header/RouterNavlink.tsx`, `StarBackground/StarBackground.tsx` -- existing TSX that will now be type-checked.
- `asprinkleofcode/src/theme/colors.css` -- primitive ramps only (`--color-primary-*`, `--color-dark-*`). Keep them and add the role layer below.
- `asprinkleofcode/src/theme/aSprinkleOfCodeTheme.js` -- uses primitives, `text-gray-*`/`border-gray-*`, a 30%-alpha focus ring and the `#C45F87` fill. The avatar block mostly copies flowbite defaults. Only `inner` (the `avatar-pulse` class used by `pages/AboutMe/Primary.jsx`), `bordered`, and `size.xl` are custom.
- `asprinkleofcode/src/index.css` -- the Tailwind entry (`@import "tailwindcss"` + flowbite plugin). Import `theme/colors.css` and `theme/theme.css` here so `@theme` shares the Tailwind graph.
- `asprinkleofcode/src/App.css`, the page `.jsx` files and their `.css` -- legacy. Out of scope; do not touch.
- `AGENTS.md` (repo root) -- the "`npm run lint` covers only `.js`/`.jsx`" bullet and the "No tests exist" lines.
- `asprinkleofcode/README.md` -- stock Vite template text. Replace it with install/dev/lint/test/build/preview instructions (AD-4).
- `.github/workflows/main.yml` -- already runs `npm ci && npm run build`, so the gate binds at deploy. Do not edit.

## Tasks & Acceptance

**Execution:**
- [x] `asprinkleofcode/package.json` -- add the pinned dev deps; add the scripts `typecheck` (`tsc --noEmit && tsc --noEmit -p tsconfig.node.json`) and `test` (`vitest run`); set `build` to `tsc --noEmit && tsc --noEmit -p tsconfig.node.json && eslint . && vitest run && vite build` only after all three pass -- AD-17 gate. `tsconfig.node.json` must be checked too, because bare `tsc --noEmit` reads only `tsconfig.json`.
- [x] `asprinkleofcode/tsconfig.json`, `tsconfig.node.json` -- app config (bundler resolution, `jsx: react-jsx`, DOM libs, `vite/client` + vitest types, include `src`); node config for `vite.config.ts`.
- [x] `asprinkleofcode/src/vite-env.d.ts`, `src/legacy-jsx.d.ts` -- Vite client types; `declare module '*.jsx'` typed as a React component default export, so typed files can import legacy pages using an explicit `.jsx` extension while `allowJs` stays off.
- [x] `asprinkleofcode/vite.config.js` → `vite.config.ts` -- typed rewrite plus `test: { environment: 'jsdom', setupFiles, css: true }`.
- [x] `asprinkleofcode/eslint.config.js` -- add a `**/*.{ts,tsx}` block using `typescript-eslint` recommended, react-hooks, react-refresh, and `jsx-a11y` recommended. Also apply `jsx-a11y` to `.jsx`. If legacy `.jsx` fails a11y rules, fix the markup minimally and do not disable rules.
- [x] `asprinkleofcode/src/App.jsx` → `App.tsx`, `main.jsx` → `main.tsx` -- typed rewrites: drop the counter, guard the missing `#root` element with a thrown error rather than `!`, and keep the same tree and routes. Update the `index.html` script src.
- [x] `asprinkleofcode/src/components/{Header,Footer,GradientWaves}/*.tsx` -- point the brand at `/` via `to`; remove the empty prop interfaces and unused imports.
- [x] `asprinkleofcode/src/assets/react.svg` -- delete (unreferenced).
- [x] `asprinkleofcode/src/theme/colors.css` -- add AD-10 role tokens: `--background-{primary,secondary,recessed}`, `--text-{primary,secondary,inverse}`, `--border-{default,essential}`, `--brand-primary`, `--brand-primary-fill`, `--accent-secondary`, `--accent-secondary-fill`, `--focus-ring`, `--status-{success,error,warning}`. Values follow DESIGN §7.
- [x] `asprinkleofcode/src/theme/theme.css` (new) -- Tailwind v4 `@theme inline` mapping roles to colour utilities (e.g. `bg-background-primary`, `text-text-secondary`, `ring-focus-ring`); radius tokens `default` 0.5rem, `control` 0.375rem, `pill` 9999px; 7 `@utility type-*` levels per DESIGN §8 on the system sans stack.
- [x] `asprinkleofcode/src/theme/aSprinkleOfCodeTheme.js` → `.ts` -- typed via flowbite-react's theme type, using role-token utilities only. Focus becomes a solid 2px `focus-ring` with 2px offset. Hover on the brand fill is a glow, not a darker fill. Drop avatar keys that only duplicate flowbite defaults.
- [x] `asprinkleofcode/src/test/setup.ts`, `src/App.test.tsx` -- smoke test: for each route (`/`, `/about`), render `<App/>` in `MemoryRouter`, assert no throw, that an `h1` is present, and that `console.error` was never called. Polyfill only what jsdom lacks (e.g. `matchMedia`) in setup.
- [x] `AGENTS.md`, `asprinkleofcode/README.md` -- update the lint and test notes and the verify commands; document the scripts.

**Acceptance Criteria:**
- Given a fresh `npm ci`, when `npm run build` runs, then tsc (both configs), `eslint .`, `vitest run` and `vite build` all pass with zero errors and `dist/` is produced.
- Given a deliberate type error, lint error, or render-throwing route, when `npm run build` runs, then it fails before `vite build`.
- Given `src/`, then no `App.jsx`, `main.jsx`, `aSprinkleOfCodeTheme.js` or `react.svg` remain, and `aSprinkleOfCodeTheme.ts` contains no `--color-*` primitive, raw hex, or raw Tailwind palette colour.
- Given `colors.css`, then every DESIGN §7 role except the OPEN `brand.primaryFillHover` has a token whose value matches the table, and no `--brand-primary-fill-hover` exists.
- Given `npm run dev`, when `/` and `/about` load, then both render as before, the header brand links to `#/`, and keyboard focus on the nav toggle shows a solid ring.

## Implementation Notes

- Resumed after an interrupted run (laptop died mid-implementation). `node_modules` was half-installed, so `npm run build` resolved an old global `tsc`; `npm ci` from the intact lockfile fixed it. Deleting `react.svg` was the only unfinished task.
- `viewTransition` removed from `<Route>`: in react-router 7 it is a `Link`/`NavLink` prop, was a no-op on `Route`, and fails type-checking there. No behavior change.
- `jsdom` pinned ^29 (Node 22 engine range); `@types/node` added for `tsconfig.node.json`.
- `vite.config.ts` skips the flowbite-react plugin under Vitest: its watcher kept `vitest run` from exiting.
- `NavbarBrand` isn't polymorphically typed, so the brand uses a small `HomeLink` wrapper that binds `to="/"`.
- `BeyondTheCodePowerlifting.jsx` got `title` on its iframes and `alt` on two images to satisfy jsx-a11y. No rules disabled; media files untouched.
- `src/test/setup.ts` adds explicit Testing Library `cleanup` (Vitest globals are off) and a `matchMedia` stub.
- jsdom prints `Could not parse CSS stylesheet` during tests because of Tailwind v4 syntax. This is harmless noise, not a `console.error`.
- Verified: `npm run build` exits 0 (both tsc configs, eslint, 2 vitest tests, vite build). An injected type error fails the build before `vite build`. The theme `.ts` has no primitive or raw colours, and there is no `--brand-primary-fill-hover`.


## Spec Change Log

## Review Triage Log

Pass 1 (blind, edge-case, verification-gap):

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 1 | Smoke test only checks that some h1 exists, so a swapped or miswired route passes | medium | Every page has an h1. Confirmed by mutation: after the fix, mapping `/` → `AboutMe` fails the test | patch (route-specific heading names) |
| 2 | No test for the brand link's new `/` destination | low | Test only queried headings; the fix is a single assertion | patch (link href test) |
| 3 | `build` duplicates the `typecheck`/`lint`/`test` commands, so the gate can drift from local scripts | low | Real drift risk; direct correction | patch (`build` calls the npm scripts) |
| 4 | `react.svg` deletion violates the AGENTS.md media policy | false | Policy covers photos/videos; this is an unused Vite template logo; story AC and approved spec require removal | reject |
| 5 | Wildcard `*.jsx` declaration types every page as zero-prop and hides typo'd paths from tsc | low | No legacy page takes props or has named exports; a typo'd path still fails `vite build` inside the gate; a fix needs per-module declarations | reject (unlikely, not a direct fix) |
| 6 | Node engine range is documented but not enforced | low | Local Node 22.17 and CI `lts/*` are both in range; an `engines` guard adds config | reject (unlikely) |
| 7 | No `*` catch-all route or test | false | The intent excludes new routes; story 1.3 owns `*` | reject |
| 8 | Role tokens repeat hex instead of `var(--color-*)` | false | Deliberate: DESIGN §7 role values carry their own contrast figures and primitives are private; the spec says values follow §7 | reject |
| 9 | Vitest `css: true` with the flowbite plugin off breaks on a clean checkout (missing class list) | false | Removed `.flowbite-react/` and ran `vitest run`: 2/2 passed | reject |
| 10 | Vitest types are visible to app code via `tsconfig.json` | low | No harm shown; the fix needs a separate test tsconfig | reject |
| 11 | JS and TS ESLint blocks differ (unused-vars pattern, ecmaVersion, no type-aware rules) | low | No named breakage; type-aware lint is not in scope | reject |
| 12 | iframe titles "Powerlifting video 1–4" don't describe the videos | low | Titles are accurate but generic; better wording needs the owner's knowledge of each clip. Photo alt text checked against images and accurate | defer |
| 13 | `viewTransition` dropped without a note | false | Recorded in Implementation Notes | reject |
| 14 | New `type-*` / status tokens are unused, and the roles-only rule isn't enforced | false | Story intent is to make them available to later epics | reject |

## Design Notes

Type levels go in `@utility` rather than `--text-*` theme keys, because levels 5 and 7 carry case, tracking and colour, which `--text-*` can't express. Use names like `type-identity`, `type-title`, `type-section`, `type-story`, `type-supporting`, `type-body` and `type-meta`.

Map primitives in the theme to roles by nearest meaning: `dark-800`→`background-primary`, `dark-700`→`background-secondary`, `dark-600`→`border-default`, `dark-50`→`text-primary`, `dark-300`/`gray-300/400`→`text-secondary`, `primary-400`→`brand-primary`, `primary-500/600`→`brand-primary-fill`.

## Verification

**Commands:**
- `cd asprinkleofcode && npm ci && npm run lint && npm test && npm run build` -- expected: all exit 0.
- `grep -nE "color-(primary|dark)-|#[0-9A-Fa-f]{3,6}|(gray|red|green|yellow|blue|cyan|purple|pink)-[0-9]" asprinkleofcode/src/theme/aSprinkleOfCodeTheme.ts` -- expected: no matches.

**Manual checks:**
- Run `npm run preview` and load `#/` and `#/about`. Pages look as before, apart from the remediated fill and focus ring.
