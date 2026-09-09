<!-- bmad:context -->
<!-- Verified 2026-09-08 against c7e36fd. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## asprinkleofcode.github.io

Personal portfolio site for Alisha Sprinkle Korba, deployed to GitHub Pages. The app is a Vite + React 19 single-page app using Tailwind v4 and `flowbite-react`; it lives entirely in the `asprinkleofcode/` subdirectory — the repo root has no buildable project. No test suite.

## Policy

- Always work on a branch and open a PR; never commit to `main`. Pushes to `main` build and deploy the live site automatically (`.github/workflows/main.yml`).
- Never modify or delete existing photos or videos in `asprinkleofcode/src/assets/` or `asprinkleofcode/public/`. Adding new media is fine; propose removals rather than making them.
- The custom domain is set in GitHub Pages settings, not the repo. Do not add a `CNAME` file or change Pages/deploy configuration.

## Where things are

- All app code, configs, and `package.json` are under `asprinkleofcode/`.
- Routes in `asprinkleofcode/src/App.jsx`; entry point `asprinkleofcode/src/main.jsx`.
- Color tokens in `asprinkleofcode/src/theme/colors.css`; flowbite theme object in `asprinkleofcode/src/theme/aSprinkleOfCodeTheme.js`.

## Running and verifying

- Run all npm commands from `asprinkleofcode/`, not the repo root (root has only a stub `package-lock.json`).
- No tests exist — verify changes with `npm run lint` and `npm run build`.
- `npm run lint` covers only `.js`/`.jsx`; it does not lint `.tsx`, so it will not catch problems in newer components.

## Conventions that differ from defaults

- New components and pages use `.tsx`. Existing `.jsx` files are from the repo's React-learning phase — don't add to them; migrate opportunistically.
- Routing uses `HashRouter` because GitHub Pages has no SPA history fallback — do not switch to `BrowserRouter`.
- Build UI from `flowbite-react` components and the shared `src/theme/` theme, following React and flowbite-react conventions, rather than hand-rolling equivalents.
- Each component lives in its own folder under `src/components/` with a co-located `ComponentName.css`.

<!-- /bmad:context -->
