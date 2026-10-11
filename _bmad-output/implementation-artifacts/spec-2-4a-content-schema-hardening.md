---
title: 'Story 2.4 (part A): Content Schema Hardening'
type: 'feature'
created: '2026-10-11'
status: 'done'
baseline_commit: 'e178c5fd59a0ed94920e9cdc5c2fe7241d9a55a8'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The first Engineering story (Story 2.4 part B) needs a `highlight` block that the schema doesn't have yet. `hero` is still a bare string, nothing stops two stories in one path from sharing a `featured` value, `capabilities` accepts duplicates, and the AD-10 colour gate doesn't read `.mdx` files.

**Approach:** Extend `frontmatter.ts` and the content plugin with the Story 2.4 schema rules and the Epic 1 retro A-10 checks, and extend the AD-10 gate to `src/content/**/*.mdx`. Story content and the real-glob registry test are part B (deferred-work.md, decided 2026-10-11: Alisha split Story 2.4 into A then B).

## Boundaries & Constraints

**Always:**
- Both schemas accept `highlight?: { headline, metric?, unit? }`: every field is a non-empty string, `unit` without `metric` is rejected, and unknown keys are rejected.
- Both schemas accept `hero?: { src, alt }`. `src` is a relative `.webp` or `.avif` path inside `src/assets/media/`, with no `..`, no leading `/` and no backslash. `alt` is a non-empty string. Unknown keys are rejected, and so is the old bare string.
- `capabilities` with a repeated value is rejected, naming the value.
- These rules apply only to non-draft entries:
  - `featured` without `highlight` fails.
  - A `hero.src` that isn't a file under `src/assets/media/` fails.
  - Two entries in the same path with the same `featured` value fail, and the message names both files.
- Each failure is a `FrontmatterError` that names the file, and it fails the build, the dev server and tests alike.

**Never:**
- No content files, component, page, route or `registry.ts` changes, and no hero renderer or media-resolving helper (Story 4.1).
- No changes to existing media, and no `ExplorationPaths`/`EvidenceHighlights` changes.
- Do not mark Story 2.4 `done` in sprint-status at close-out. It stays `in-progress` until part B merges.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Featured, highlighted | `featured: 1`, `highlight: { headline, metric, unit }` | Passes; highlight in frontmatter output | N/A |
| Featured, no highlight | non-draft `featured: 1` | Fails naming the file | FrontmatterError |
| Draft featured, no highlight | `draft: true, featured: 1` | Passes (body and frontmatter stripped) | N/A |
| Unit alone / extra key / empty | `{ headline, unit }`, `{ headline, x }`, `headline: ""` | Rejected | FrontmatterError |
| Featured clash | two non-draft engineering files, `featured: 1` | Fails naming both files | FrontmatterError |
| Same number, other path or draft | engineering + leadership both `1`, or one is a draft | Passes | N/A |
| Hero shapes | bare string, missing `alt`, `../x.webp`, `/x.webp`, `x.jpg` | Rejected | FrontmatterError |
| Hero not on disk | non-draft with a valid-looking `hero.src` and no file | Fails naming file and path | FrontmatterError |
| Duplicate capability | `[ownership, ownership]` | Rejected | FrontmatterError |
| Palette class in a story | `className="text-red-500"` in an `.mdx` | AD-10 gate test fails | test failure |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/src/lib/frontmatter.ts` -- add `highlight` and `hero` `KeyRule`s, following the `links` rule (one problem per key, unknown keys rejected), and add them to both `SCHEMAS`. Add `Highlight`/`HeroImage` types to both interfaces and a duplicate check to `capabilities`. Put "`featured` needs `highlight`" in `parseFrontmatter` when `draft !== true`. It stays pure, with no Node imports.
- `asprinkleofcode/plugins/contentFrontmatter.ts`:
  - Add `ProcessOptions.mediaDir`, set in `configResolved` to `src/assets/media`. Check that `hero.src` exists there, next to the `pdf` check, through `fileExists`.
  - Add an exported pure `featuredClash(seen: Map<file, {path, featured}>, file, entry)` that returns the conflicting file or null.
  - The plugin instance keeps the map. Update it in `load` (replace the file's own record, delete it for drafts or entries without `featured`) and throw `FrontmatterError` naming both files. The path for personal entries is `beyond`.
- `asprinkleofcode/plugins/contentFrontmatter.test.ts` -- inline-source unit tests for the hero existence check and `featuredClash`.
- `asprinkleofcode/plugins/contentFrontmatter.integration.test.ts` + `__fixtures__/`:
  - The test loads whole fixture roots, and `invalid/` expects exactly its `bad-key` error, so add new roots instead of new files in `invalid/`. Every root needs its own `src/lib/fixtureRegistry.ts` copy.
  - `valid/`: give `valid-work.mdx` `featured` + `highlight` + `hero`, add a tiny new `.webp` at `valid/src/assets/media/engineering/`, and update the expected frontmatter.
  - New `invalid-featured/` root: two engineering files with the same `featured`.
  - New `invalid-hero/` root: a missing hero file.
- `asprinkleofcode/src/lib/frontmatter.test.ts` -- unit cases for every matrix row about the schema.
- `asprinkleofcode/src/test/semanticTokens.test.ts` -- `?raw` on `.mdx` runs through the MDX and content plugins, so walk `src/content` with `node:fs`/`node:path`, resolved from `import.meta.url`. Run `findColorViolations` on each file and allow an empty directory. Add a detection test against an inline MDX string.
- `_bmad-output/implementation-artifacts/deferred-work.md` -- part A resolves the "AD-10 scan to `.mdx`" entry and the "duplicate `capabilities`" entry.

## Tasks & Acceptance

**Execution:**
- [x] `asprinkleofcode/src/lib/frontmatter.ts` + `frontmatter.test.ts` -- the `highlight`, `hero`, duplicate-capability and featured-needs-highlight rules, with tests.
- [x] `asprinkleofcode/plugins/contentFrontmatter.ts` + `contentFrontmatter.test.ts` -- the `mediaDir` hero check and the `featured` clash check, with tests.
- [x] `asprinkleofcode/plugins/__fixtures__/` + `contentFrontmatter.integration.test.ts` -- the valid root updated, and new invalid roots that assert the file names in each error.
- [x] `asprinkleofcode/src/test/semanticTokens.test.ts` -- the `.mdx` scan.

**Acceptance Criteria:**
- Given a schema rule, when a valid or invalid fixture runs through the real Vite plugin chain, then the valid one loads and the invalid one fails, naming the file or files.
- Given an empty `src/content/`, when tests run, then the AD-10 gate and the live registry test pass.

## Implementation Notes

- Implemented directly in the session (no subagent), as Story 2.2 was.
- `frontmatter.ts`: a shared `blockProblems` helper backs the `highlight` and `hero` rules. "featured needs highlight" runs only when `featured` itself is valid, so `featured: 0` still reports one problem.
- Plugin: `featuredSlots` is keyed by display path. It is cleared in `configResolved`, because the integration tests reuse one plugin instance across fixture roots. Without the clear, `invalid-featured/first-featured.mdx` collided with `valid/valid-work.mdx` (found by the integration test). A `delete` `watchChange` drops a removed file's slot in dev.
- **Deviation (outside the Code Map):** `?raw` on an `.mdx` went through both the content plugin (frontmatter errors) and `@mdx-js/rollup` (compiled to a component).
  - The content plugin's `transform` now skips `?raw`/`?url`.
  - `vite.config.ts` wraps `mdx()`'s transform to do the same. Its `exclude` option can't be used, because the plugin strips the query before filtering.
  - With these two changes, the AD-10 gate reads stories with `import.meta.glob(..., { query: "?raw" })`, instead of `node:fs`, which the `src/` tsconfig has no types for. Frontmatter validation is unaffected: the registry's `?frontmatter` glob still validates every file.
- **Superseded after walkthrough (Alisha, 2026-10-11):** the `?raw` approach was replaced. `vite.config.ts` and the content plugin's `?raw`/`?url` skip are back to their baseline form, and the fixture `raw` glob and its integration assertion are gone (triage #1's patch is no longer needed). The story scan now lives in `plugins/storyColors.test.ts`. It runs under `tsconfig.node.json`, so it has Node types, reads `src/content/**/*.mdx` with `node:fs`, and still scans markup attributes only (triage #2). The build pipeline is unchanged by this story apart from the schema checks. A temporary story containing `PR #123` and a `text-red-500` class failed the test on the class only, and was then deleted.
- Manual check (original approach): a temporary `src/content/work/tmp-check.mdx` with `className="text-red-500"` failed the gate with `../content/work/tmp-check.mdx: text-red-500`. The file was then deleted, and the gate passes with an empty `src/content/`.

## Spec Change Log

## Review Triage Log

Pass 1 (blind-hunter BH, edge-case-hunter EC, verification-gap VG):

| # | Layer | Finding | Verdict | Evidence / route |
|---|---|---|---|---|
| 1 | VG/BH/EC | Story scan and the `?raw` bypasses never run: `src/content/` is empty, so the glob is `{}` | medium | Confirmed: removing the MDX wrapper still passed every test. patch: `raw` glob in the `valid` fixture registry, plus an integration assertion that the source comes back raw. The test now fails without the wrapper (checked). |
| 2 | BH/EC | Story scan runs HEX and colour-function rules over prose and frontmatter, so "PR #123" or "#4500" fails the gate | medium | `HEX` matches `#123`; ES-1 prose is likely to cite numbers. patch: scan only `className`/`class`/`style`/`fill`/`stroke`/`color` attribute values (`storyMarkup`), with a prose test. |
| 3 | BH/EC | `MEDIA_SRC` accepts uppercase, `./`, `//`, `?`, `:`. A case-insensitive `existsSync` on Windows passes what Linux CI rejects | low | A direct regex correction; the README already requires lowercase hyphenated names. patch: lowercase kebab segments, with rejection cases. |
| 4 | EC | AC says each rule's invalid fixture fails through the real Vite chain, but only the clash and the missing hero do | medium | Direct AC deviation; the fix is test-only. patch: `invalid-schema/bad-schema.mdx` (featured without highlight, string hero, repeated capability), plus a unit-only highlight in `invalid/bad-key.mdx`. |
| 5 | VG | Draft fixture is in another path, so it doesn't prove drafts are left out of the clash check | low | patch: `draft-work.mdx` moved to `engineering` with `featured: 1`. |
| 6 | VG/BH | `watchChange` delete cleanup is untested | low | Dev only, and recovers on restart. defer (VG disposition). |
| 7 | EC/BH | A stale slot stays when a reload throws; in dev, B stays in error after A is fixed | low | Dev only; Vite reloads B on the next request. A fix adds try/catch branches. rejected |
| 8 | BH | Move the clash check into `buildIndex` | false | A design preference. The `load` check fails `vite build` itself and names both files; `buildIndex` would fail only the test run. rejected |
| 9 | EC/BH | An unlisted personal entry with `featured` blocks or needs a highlight | low | No content sets `featured` on an unlisted entry, and the fix adds guards. rejected |
| 10 | BH | `highlight` without `featured` is accepted silently | false | The spec allows it, and Story 2.6 reads `highlight` only from featured entries. Not a defect. rejected |
| 11 | EC | A directory named `*.webp` passes the existence check | low | Unrealistic. rejected |
| 12 | EC/BH | The MDX wrapper breaks if `@mdx-js/rollup` ships an object hook | low | 3.x uses a function hook; an upgrade would fail loudly on the first build. rejected |
| 13 | BH | The raw/url predicate exists twice (regex and URLSearchParams) | low | Both agree on every form Vite emits; no named divergence. rejected |
| 14 | BH | Unquoted YAML number `metric` gets a generic message | low | The message names the key and says a string is required. rejected |
| 15 | BH | `hero` is validated but nothing renders it | false | The intent excludes the renderer (Story 4.1). rejected |
| 16 | BH | `fixtureRegistry.ts` is copied for each fixture root | low | The pattern already exists (`invalid-body/`). rejected |

## Verification

**Commands:**
- `npm run typecheck && npm run lint && npm test && npm run build` (from `asprinkleofcode/`) -- expected: all green.
