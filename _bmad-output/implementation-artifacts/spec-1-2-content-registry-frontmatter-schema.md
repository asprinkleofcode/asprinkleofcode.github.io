---
title: 'Story 1.2: Content Registry & Frontmatter Schema'
type: 'feature'
created: '2026-10-04'
status: 'done'
baseline_commit: '12c33668a577dece0747bbd76dff5eb4b0e441c9'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** There is no content pipeline. The site cannot compile `.mdx`, nothing validates story metadata, and no index exists for pages to list or route stories from. Every later story-content and path-index story depends on this.

**Approach:** Add `@mdx-js/rollup` and a small build plugin that validates each content file's YAML frontmatter against a typed schema. The plugin serves the frontmatter as its own module and strips draft bodies. Add a registry that indexes non-draft entries eagerly and loads bodies lazily, plus an empty MDX block whitelist (AD-1, 2, 5, 6, 8, 20).

## Boundaries & Constraints

**Always:** Work under `asprinkleofcode/`. Write YAML frontmatter between `---` fences. Keep the schema, capability union and key rules in exactly one place, `src/lib/frontmatter.ts`, which is pure TS with no DOM or Node imports. Validation is hand-rolled (no zod). Validation errors name the file and every bad key. The registry key is `type/path/slug`, with personal entries using path `beyond`. Use `featured` ascending (unfeatured last), then `date` descending, then `title`. `listed` defaults to `true`. A non-draft `pdf` must exist under `public/downloads/`. Pin `@mdx-js/rollup` ^3.1. Decision (owner, 2026-10-04): drafts are excluded in every mode, `vite serve` and Vitest included; there is no dev-only draft preview.

**Never:** Don't add `.mdx` content, routes, pages, `MDXProvider`, MDX blocks (Story 2.1) or `remark-*` plugins. Don't touch photos, videos, deploy config or the legacy `.jsx` pages. Don't wire the registry into `App`, which is Story 1.3.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Valid work file | `work/foo.mdx`, all required keys | entry `work/engineering/foo`, body lazy chunk | N/A |
| Slug override | `slug: bar` | key uses `bar` | non-kebab slug → build error |
| Missing/invalid key | no `role`, `path: other`, capability not in union, `type` ≠ directory | — | build fails listing each problem + file |
| Unknown key | `tags: [...]` | — | build fails: unknown key |
| No frontmatter | body only | — | build fails: missing required keys |
| Draft | `draft: true` | absent from index; body and frontmatter values absent from `dist` | N/A |
| Unlisted personal | `listed: false` | reachable by `getEntry`, absent from `getPathEntries('beyond')` | N/A |
| Missing PDF | non-draft `pdf: /downloads/x.pdf`, no file | — | build fails |
| Duplicate key | two files resolve to the same key | — | registry throws; smoke test fails build |
| Stray dir | `content/other/x.mdx` | — | build fails: unknown content type |
| Zero files | no `src/content` | `entries` is `[]` | N/A |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/vite.config.ts` -- plugins `react()`, `tailwindcss()`, `flowbiteReact()` (skipped under Vitest). Add the content plugin and `mdx()` with `enforce: 'pre'` before `react()`. `react({ include: /\.(mdx|js|jsx|ts|tsx)$/ })` gives MDX fast refresh.
- `asprinkleofcode/tsconfig.json` -- `types` is an explicit list (`vite/client`, `vitest/jsdom`), so `@types/mdx` must be added as `"mdx"`.
- `asprinkleofcode/tsconfig.node.json` -- includes only `vite.config.ts`. Add `plugins` (and transitively `src/lib/frontmatter.ts`).
- `asprinkleofcode/eslint.config.js` -- TS block already covers new `.ts/.tsx`; `.mdx` is not linted; no change expected.
- `asprinkleofcode/package.json` -- `build` = typecheck → lint → `vitest run` → `vite build`; Vitest uses the Vite plugins, so validation errors fail the gate before `vite build` too. `node_modules` absent: run `npm ci` first.
- `asprinkleofcode/src/App.test.tsx`, `src/test/setup.ts` -- existing smoke test; leave as is.
- `AGENTS.md` "Where things are", `asprinkleofcode/README.md` -- add content location and how to add a story.

## Tasks & Acceptance

**Execution:**
- [x] `asprinkleofcode/package.json` -- add devDeps `@mdx-js/rollup` ^3.1, `@types/mdx`, `yaml` ^2.
- [x] `asprinkleofcode/src/lib/frontmatter.ts` -- `CAPABILITIES`, `Capability`, `ContentType`, `WorkFrontmatter`, `PersonalFrontmatter`, and `parseFrontmatter(type, data, file)`, which returns normalized data (with `listed` defaulted) or throws `FrontmatterError` listing all problems. `date` is `YYYY-MM-DD`, `featured` is a positive integer, `capabilities` is non-empty, `links[].href` is `https://`, and `pdf` matches `/downloads/<kebab>.pdf`.
- [x] `asprinkleofcode/plugins/contentFrontmatter.ts` -- Vite plugin (`enforce: 'pre'`) for `.mdx` under `src/content/`. Derive the type from the directory, parse YAML, validate, and check that the `pdf` file exists. The `?frontmatter` id loads as `export const frontmatter = <json>` (`null` for drafts). The plain id has its frontmatter replaced by blank lines to keep line numbers, and draft bodies are emptied.
- [x] `asprinkleofcode/vite.config.ts`, `tsconfig.json`, `tsconfig.node.json` -- wire the plugins and types as in the Code Map.
- [x] `asprinkleofcode/src/lib/registry.ts` -- frontmatter glob (`eager`, `query: '?frontmatter'`, `import: 'frontmatter'`) plus a lazy body glob over `../content/**/*.mdx`. A pure, exported `buildIndex(frontmatters, bodies)` derives the slug and key, throws on duplicates and sorts. Exports `entries`, `getPathEntries(path)`, `getEntry(path, slug)` and `loadBody(entry)`.
- [x] `asprinkleofcode/src/mdx-components.tsx` -- whitelist module, exporting nothing yet. A header comment states the AD-8 rule.
- [x] `src/lib/frontmatter.test.ts`, `plugins/contentFrontmatter.test.ts`, `src/lib/registry.test.ts` -- cover every matrix row, and check that the live registry loads empty.
- [x] `AGENTS.md`, `asprinkleofcode/README.md` -- document the content directories, the schema location, and that adding a story means adding one file.

**Acceptance Criteria:**
- Given a fresh `npm ci`, when `npm run build` runs, then all gates pass and the registry test asserts an empty index.
- Given a temporary valid work `.mdx` and a draft `.mdx` with a unique marker string, when `npm run build` runs, then the valid body is a separate chunk outside the entry chunk, and the draft's marker appears nowhere in `dist/`.
- Given a temporary `.mdx` with an unknown key, when `npm run build` runs, then the build fails naming the file and key.

## Implementation Notes

- `?frontmatter` resolves to a `\0content-frontmatter:<file>` virtual id. `@mdx-js/rollup` strips queries and would otherwise compile the generated JS as MDX; the `\0` prefix keeps the MDX and React plugins off it. The design intent (a separate module id) is unchanged.
- Added a check beyond the spec: a non-kebab file name without a `slug` override fails, since the file name becomes the slug.
- The live-registry test was first written as `entries` equals `[]`. That would break the build as soon as content exists, so it now asserts the registry loads, and the zero-files case runs through `buildIndex({}, {})`.
- Known leftover: a draft's *file name* still appears in `dist/` as a glob key and an empty chunk name. Its title, summary and body do not.
- Build-time validation currently fires via `registry.test.ts` in the gate's test step. `vite build` itself enforces it once Story 1.3 imports the registry.
- Verified: `npm run build` exits 0 (53 tests). Temporary fixtures plus a temporary registry import confirmed that the valid body is in its own chunk and that no draft marker appears in `dist/` (AC2). An unknown `tags` key fails the test step and names the file and key (AC3). Fixtures removed.

## Spec Change Log

## Review Triage Log

Pass 1 (blind, edge-case, verification-gap):

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 1 | No automated test runs the wired pipeline (`?frontmatter` virtual module, plugin order, MDX compile, `loadBody`) on a real `.mdx`; the live test sees an empty glob | medium | Verification-gap layer, pre-verified. AC2/AC3 were proven only by manual temporary fixtures | patch (Vite integration test on a fixture root) |
| 2 | Unknown keys named like `Object.prototype` members (`constructor`, `toString`, `__proto__`) pass the `in` check | low | `frontmatter.ts` uses `key in schema.required`, which is true for inherited names, so they are never reported. Fix is a direct swap to `Object.hasOwn` | patch |
| 3 | Nested folders (`work/a/foo.mdx`) are accepted, and the folder is silently dropped from the key | low | `processContentFile` checks only the first segment. Conventions say `src/content/<type>/*.mdx`. Fix is a direct depth check | patch |
| 4 | Title tie-break uses the host's default locale | low | `localeCompare` with no locale. Fix is a direct argument | patch |
| 5 | README ordering line omits "undated last" | low | Code and its doc comment put undated entries last; README doesn't say so | patch |
| 6 | It's undocumented that a draft with invalid frontmatter still fails the build | low | Problems are collected before the draft short-circuit. This is intended (AD-4: drafts on `main` must be coherent), but the README doesn't say so | patch (one README line) |
| 7 | A draft's file name ships as an empty chunk name and glob key | low | Confirmed in the AC2 build (`zz-draft-*.js`, 0.21 kB, no content). The `.mdx` file name is already public in the repo (AD-4), so nothing new leaks. The fix needs non-static glob filtering | reject |
| 8 | `transform` validates `?raw`/`?url` content imports as MDX and fails | low | Real, but nothing imports content that way. Skipping queried ids would also skip dev's `?import` and `?t=` ids, which the plugin must process, so the fix is not a direct correction | reject |
| 9 | Duplicate keys are caught only when the registry is evaluated (vitest, runtime), not by the plugin | low | Duplicates still fail `npm run build` through the test step. A dev-time duplicate shows a module-init error. Catching it in the plugin needs cross-file state | reject |
| 10 | `hero` has no format or existence check | low | The spec gives `hero?` no format; Epic 2 decides how heroes render. Adding a rule now would guess | reject |
| 11 | AD-8 whitelist not enforced on `.mdx` imports | low | AD-8 is a convention; enforcement would need a new import scanner | reject |
| 12 | `mdx()` compiles `.mdx` outside `src/content` without frontmatter stripping | low | No such files exist. Scoping needs a filter whose path semantics differ on Windows, so the fix is not direct | reject |
| 13 | Duplicate `featured` ranks are not rejected | false | The spec defines `featured` as an ordering key with a title tie-break, not a unique slot | reject |
| 14 | `path.join(publicDir, "/downloads/x.pdf")` may misresolve on Windows; PDF not watched in dev | false | `path.join` concatenates (unlike `resolve`); AC builds ran on Windows. The missing watch only affects a PDF deleted mid-dev, which is negligible | reject |
| 15 | `AGENTS.md` test-file notes don't mention `*.test.ts` or `plugins/` | low | True, but the fix edits an agent-context file | defer |
| 16 | `resolveId` silently falls back when `isContentFile` rejects a path (e.g. case mismatch), so the registry hits `undefined` frontmatter with an unnamed TypeError | maybe-false | Settled only by a Windows drive-letter-case mismatch between `config.root` and resolved ids; the AC builds on Windows resolved correctly. If true it would be low | reject |
| 17 | `loadBody` throws a TypeError for an entry built from a custom bodies map | low | Only test-built entries can reach it; pages use the live index | reject |
| 18 | `readFileSync` ENOENT if a file is deleted between resolve and load | low | Dev-only race, and the error still names the path | reject |
| 19 | Live registry test no longer asserts `entries` is `[]`, unlike AC1's wording | low | Deliberate, and logged in Implementation Notes: asserting `[]` breaks the build once content lands. The zero-files row is covered by `buildIndex({}, {})`. The fix would edit this spec | reject |

## Design Notes

Why `?frontmatter`: if the same `.mdx` id is both statically imported (the eager glob) and dynamically imported (the body glob), Rollup folds the whole module, body included, into the entry chunk. That breaks AD-6 and leaks draft bodies. Giving frontmatter its own module id keeps every body in its own lazy chunk. For drafts, the frontmatter module exports `null`, so no draft values ship either.

## Verification

**Commands:**
- `cd asprinkleofcode && npm ci && npm run build` -- expected: exit 0.
- Temporary-fixture checks from the AC; remove the fixtures afterwards and confirm `git status` is clean under `src/content`.
