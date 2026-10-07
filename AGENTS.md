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
- Color tokens in `asprinkleofcode/src/theme/colors.css` (primitive ramps + semantic role tokens; UI uses roles only, enforced by `src/test/semanticTokens.test.ts`, which fails on primitive vars, raw colour values or palette utilities); Tailwind mapping, radius, and `type-*` scale in `src/theme/theme.css`; flowbite theme object in `asprinkleofcode/src/theme/aSprinkleOfCodeTheme.ts`.
- Content: one `.mdx` story per file in `asprinkleofcode/src/content/work/` (Engineering, Leadership) or `src/content/personal/` (Beyond the Code); adding a story means adding one file. The frontmatter schema, capability vocabulary and key rules live only in `src/lib/frontmatter.ts`. `plugins/contentFrontmatter.ts` validates every file during test and build (bad frontmatter fails the build) and strips drafts. `src/lib/registry.ts` is the index pages read; components never read it. MDX blocks are whitelisted in `src/mdx-components.tsx` and imported explicitly per file (no `MDXProvider`).

## Running and verifying

- Run all npm commands from `asprinkleofcode/`, not the repo root (root has only a stub `package-lock.json`).
- Verify changes with `npm run typecheck`, `npm run lint`, `npm test`, then `npm run build`. `build` runs tsc (both `tsconfig.json` and `tsconfig.node.json`), `eslint .`, and `vitest run` before `vite build`, so any type, lint, or test failure blocks deploy.
- `npm run lint` covers `.js`/`.jsx`/`.ts`/`.tsx` with typescript-eslint and `jsx-a11y`. Legacy `.jsx` is linted but not type-checked (`allowJs` is off); typed files import it with an explicit `.jsx` extension.

## Conventions that differ from defaults

- New components and pages use `.tsx`. Existing `.jsx` files are from the repo's React-learning phase — don't add to them; migrate opportunistically.
- Routing uses `HashRouter` because GitHub Pages has no SPA history fallback — do not switch to `BrowserRouter`.
- Build UI from `flowbite-react` components and the shared `src/theme/` theme, following React and flowbite-react conventions, rather than hand-rolling equivalents.
- Each component lives in its own folder under `src/components/`. Add a co-located `ComponentName.css` only when the component has styles that utilities and the theme can't express; don't create comment-only or empty stylesheets (Vite still emits and preloads an empty CSS file for a lazy chunk).

<!-- /bmad:context -->
