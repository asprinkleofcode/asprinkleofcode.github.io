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
| `npm run typecheck` | `tsc --noEmit` for the app (`tsconfig.json`) and for `vite.config.ts` plus `plugins/` (`tsconfig.node.json`). |
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

## Content

Stories are MDX files with YAML frontmatter between `---` fences. Adding a story means adding one file:

- `src/content/work/<slug>.mdx`: Engineering or Leadership & Enablement stories (`path: engineering` or `path: leadership`).
- `src/content/personal/<slug>.mdx`: Beyond the Code entries.

The kebab-case file name is the slug unless frontmatter sets `slug`. The schema, the capability vocabulary and every key rule live in `src/lib/frontmatter.ts`, which is the reference for required and optional keys. Any of these fails `npm test` and `npm run build` with a message naming the file and each problem: invalid or missing keys, unknown keys, a file outside those two directories, or a `pdf` missing from `public/downloads/`.

- `draft: true` keeps an entry out of the index and keeps its body and frontmatter out of `dist/`. This applies in every mode, `npm run dev` included. A draft's frontmatter must still be valid; invalid frontmatter fails the build even for drafts.
- `listed: false` (personal only) keeps an entry reachable by URL but out of the Beyond the Code list.
- Lists are ordered by `featured` ascending (unfeatured last), then `date` descending (undated last), then `title`.

`src/lib/registry.ts` indexes frontmatter eagerly and loads each body as its own lazy chunk. MDX files import any blocks they use explicitly from `src/mdx-components.tsx`, the block whitelist.
