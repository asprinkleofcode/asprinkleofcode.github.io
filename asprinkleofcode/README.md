# asprinkleofcode

Source for Alisha Sprinkle Korba's portfolio site: Vite + React 19 + TypeScript, Tailwind v4, and `flowbite-react`, deployed to GitHub Pages from `main`.

All commands run from this directory (`asprinkleofcode/`).

## Install

```sh
npm ci
```

Requires Node `^22.13` or `>=24` (Vitest and jsdom engine ranges).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run typecheck` | `tsc --noEmit` for the app (`tsconfig.json`) and for `vite.config.ts` (`tsconfig.node.json`). |
| `npm run lint` | ESLint over `.js`/`.jsx`/`.ts`/`.tsx`, including typescript-eslint and `jsx-a11y`. |
| `npm test` | Run the Vitest suite once (jsdom + Testing Library). |
| `npm run build` | The deploy gate: typecheck, lint, and test, then `vite build` into `dist/`. Any failure stops the build. |
| `npm run preview` | Serve the built `dist/` locally. |

## Deploy

Pushing to `main` runs `.github/workflows/main.yml`, which runs `npm ci && npm run build` and publishes `dist/` to GitHub Pages. Because `build` includes the checks, a type, lint, or test failure blocks the deploy.

## Theme

- `src/theme/colors.css`: primitive ramps plus the semantic role tokens (`--background-*`, `--text-*`, `--border-*`, `--brand-*`, `--accent-*`, `--focus-ring`, `--status-*`). UI code uses the role tokens only.
- `src/theme/theme.css`: maps roles to Tailwind utilities (`bg-background-primary`, `text-text-secondary`, `ring-focus-ring`, …), plus radius (`rounded-default`/`-control`/`-pill`), the `drop-shadow-glow` brand glow, and the `type-*` type scale.
- `src/theme/aSprinkleOfCodeTheme.ts`: the `flowbite-react` theme, built on those utilities.
