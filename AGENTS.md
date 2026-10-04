<!-- bmad:context -->
<!-- Verified 2026-09-08 against c7e36fd. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## asprinkleofcode.github.io

Personal portfolio site for Alisha Sprinkle Korba, deployed to GitHub Pages. The app is a Vite + React 19 single-page app using Tailwind v4 and `flowbite-react`; it lives entirely in the `asprinkleofcode/` subdirectory — the repo root has no buildable project. TypeScript (strict), ESLint, and a Vitest + Testing Library smoke test gate the build.

## Policy

- Always work on a branch and open a PR; never commit to `main`. Pushes to `main` build and deploy the live site automatically (`.github/workflows/main.yml`).
- Never modify or delete existing photos or videos in `asprinkleofcode/src/assets/` or `asprinkleofcode/public/`. Adding new media is fine; propose removals rather than making them.
- The custom domain is set in GitHub Pages settings, not the repo. Do not add a `CNAME` file or change Pages/deploy configuration.

## Where things are

- All app code, configs, and `package.json` are under `asprinkleofcode/`.
- Routes in `asprinkleofcode/src/App.tsx`; entry point `asprinkleofcode/src/main.tsx`. Tests live next to code (`*.test.tsx`); shared setup in `src/test/setup.ts`.
- Color tokens in `asprinkleofcode/src/theme/colors.css` (primitive ramps + semantic role tokens; UI uses roles only); Tailwind mapping, radius, and `type-*` scale in `src/theme/theme.css`; flowbite theme object in `asprinkleofcode/src/theme/aSprinkleOfCodeTheme.ts`.

## Running and verifying

- Run all npm commands from `asprinkleofcode/`, not the repo root (root has only a stub `package-lock.json`).
- Verify changes with `npm run typecheck`, `npm run lint`, `npm test`, then `npm run build`. `build` runs tsc (both `tsconfig.json` and `tsconfig.node.json`), `eslint .`, and `vitest run` before `vite build`, so any type, lint, or test failure blocks deploy.
- `npm run lint` covers `.js`/`.jsx`/`.ts`/`.tsx` with typescript-eslint and `jsx-a11y`. Legacy `.jsx` is linted but not type-checked (`allowJs` is off); typed files import it with an explicit `.jsx` extension.

## Conventions that differ from defaults

- New components and pages use `.tsx`. Existing `.jsx` files are from the repo's React-learning phase — don't add to them; migrate opportunistically.
- Routing uses `HashRouter` because GitHub Pages has no SPA history fallback — do not switch to `BrowserRouter`.
- Build UI from `flowbite-react` components and the shared `src/theme/` theme, following React and flowbite-react conventions, rather than hand-rolling equivalents.
- Each component lives in its own folder under `src/components/` with a co-located `ComponentName.css`.

<!-- /bmad:context -->
