---
title: 'Personal story detail page, photo block and personal-highlight rule (Story 4.1 part A)'
type: 'feature'
created: '2026-10-25'
status: 'done'
baseline_commit: 'acf8dd1434190ce1264b5d783ec082076ef4d910'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-4-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/beyond/:slug` still renders the Story 1.3 placeholder. It has no document meta, no hero, no type guard and no test, and nothing exists for showing photos in a story body. Personal entries can also still carry a `highlight.metric`, which the Beyond the Code card must never show (retro A-9).

**Approach:** Rebuild `Personal` as the `PersonalPage` of AD-5. It is freeform and media-first, with no section menu or evidence affordances. Add one `media/` resolver helper and a sanctioned `Photo` MDX block, and reject `highlight.metric`/`unit` on `personal` at build time. `VideoEmbed` is Story 4.1 part B (`deferred-work.md`).

## Boundaries & Constraints

**Always:**
- One `<h1>` (title) inside an `<article>`, with the same `max-w-3xl` column and type scale as `WorkStory`.
- Render guard: a missing entry, or one whose `type !== "personal"`, renders `NotFound`.
- Meta goes through `useDocumentMeta`: title `` `${title} | ${IDENTITY.name}` ``, `description` = summary, and Article JSON-LD shaped like `WorkStory`'s.
- The hero renders with its `alt`, eager (`loading="eager"`). Body photos are `loading="lazy"`. Every `<img>` has explicit `width`/`height`.
- An unknown `media/` path throws when it is resolved. It never renders a broken `<img>`.
- **Decided (Alisha, 2026-10-25):** photo `width`/`height` are read automatically at build time. A small Vite plugin serves `?photo` imports of `src/assets/media/` files as `{ src, width, height }` using the `image-size` devDependency. Authors write only `src` and `alt`.
- Semantic role tokens only. Run `expectNoFlowbiteDefaults` on the new page.
- `listed: false` keeps its existing registry behavior: `getEntry` resolves it, and `getPathEntries`/`getFeaturedEntries` drop it. A test proves the page renders such an entry.

**Never:**
- No capability list, `role` line, `StoryHighlightContext`, Outcome/Decision blocks or section menu on this page.
- No photo treatment (aspect ratio, radius, border or edge) and no gallery or sequence layout. Those are OPEN until real photos land (Story 4.4). Photos only get `block h-auto w-full`, plus a margin when they sit in the body.
- Don't touch `/about`, `AboutMe/` or any existing media. Don't add `src/content/personal/` content or real photos (that's Story 4.4).
- No `VideoEmbed`, and no `pdf`/`links` rendering (Stories 4.1B, 4.3 and 4.4).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Personal entry | `/beyond/garden`, has hero | h1, summary, hero `<img alt>` eager with width/height, then the body | N/A |
| Unlisted | `listed: false` entry | Renders at its route | N/A |
| Missing / wrong type | unknown slug, or a work entry under the `beyond` path | `NotFound` | N/A |
| Body photo | `<Photo src="birdhouses/x.webp" alt="…" />` | `<figure><img loading="lazy" width height alt>`, plus `<figcaption>` when `caption` is set | Unknown src → throws `Unknown media path "…"` |
| Personal metric | `personal` frontmatter `highlight: {headline, metric}` | Build fails, naming the file: `"highlight.metric" is not allowed on personal entries` (same for `unit`) | `FrontmatterError` |
| Personal headline | `highlight: {headline}` | Valid | N/A |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/plugins/` (new `photoMeta.ts` + `photoMeta.test.ts`) -- Vite plugin. For ids ending `?photo`, it emits `import src from "<file>"; export default { src, width, height }`, with dimensions from `image-size`. Register it in `vite.config.ts` (it also runs under Vitest). Declare the `*?photo` module type in the app's `vite-env.d.ts` (or an equivalent `.d.ts`).

- `asprinkleofcode/src/pages/Personal/Personal.tsx` -- placeholder ("Epic 4 replaces it"). Rebuild it in place as PersonalPage. `App.tsx:20` already lazy-loads it via `lazyWithRetry` on `/beyond/:slug`.
- `asprinkleofcode/src/pages/WorkStory/WorkStory.tsx:23-75` -- pattern to mirror: render guard, `key={entry.key}` remount, PUSH-only `animate-story-in` fade with `usePrefersReducedMotion`, `useDocumentMeta` with JSON-LD (`entryHref`, `SITE_URL`, `IDENTITY`), `storyProseClasses`, `getStoryBody(entry)`.
- `asprinkleofcode/src/pages/WorkStory/WorkStory.test.tsx` -- test pattern to copy: `entry()` factory, `vi.mock("../../lib/registry")` with `getEntry`/`loadBody`, `renderAt` with ThemeProvider + MemoryRouter + Suspense.
- `asprinkleofcode/src/lib/frontmatter.ts:168-179,240-255` -- the `highlight` rule and the personal `SCHEMAS` entry. Add a `personalHighlight` rule that rejects `metric`/`unit`.
- `asprinkleofcode/src/lib/frontmatter.test.ts` -- unit cases for the new rule.
- `asprinkleofcode/plugins/__fixtures__/invalid-schema/` and `plugins/contentFrontmatter.integration.test.ts` -- add a personal-metric invalid fixture. The `valid` root's `valid-personal.mdx` gains a headline-only `highlight`.
- `asprinkleofcode/src/lib/` (new `media.ts`) -- `resolveMedia(src)` over `import.meta.glob("../assets/media/**/*.{webp,avif}", { eager: true, … })`. Throws on unknown paths. Accepts an optional glob map, so tests can inject one (`src/assets/media/` holds only `README.md` today).
- `asprinkleofcode/src/components/Photo/Photo.tsx` (new) and `src/mdx-components.tsx` -- export `Photo`. `src/mdx-components.test.ts:5` asserts the block-name list, so add `Photo` there.
- `asprinkleofcode/src/lib/registry.test.ts:208-229` -- Story 2.7 live render test. Add a personal equivalent over real personal entries (none exist yet, so it must pass while the list is empty; Story 4.4 makes it non-empty).
- `asprinkleofcode/src/App.test.tsx:37,104,172,225` -- personal "Garden" mock and route tests. Keep them passing.
- Don't change: `src/pages/AboutMe/**`, `src/lib/registry.ts` (`listed` already handled at :66, :83, :91), `plugins/contentFrontmatter.ts` hero existence check (:291-295).

## Tasks & Acceptance

**Execution:**
- [x] `asprinkleofcode/src/lib/frontmatter.ts` -- add `personalHighlight` and use it in the personal schema -- retro A-9
- [x] `asprinkleofcode/src/lib/frontmatter.test.ts`, plugin fixtures and integration test -- valid headline-only case, and invalid metric and unit cases that name the file
- [x] `asprinkleofcode/package.json`, `plugins/photoMeta.ts` (+ test, with a tiny committed `.webp` fixture under `plugins/__fixtures__/`), `vite.config.ts`, module `.d.ts` -- `?photo` dimension plugin
- [x] `asprinkleofcode/src/lib/media.ts` (+ `media.test.ts`) -- resolver returning `{ src, width, height }`; throws on unknown paths
- [x] `asprinkleofcode/src/components/Photo/Photo.tsx` (+ test) -- `src`, `alt` (required), optional `caption` and `priority` (eager); `<figure>`/`<img>` with width/height
- [x] `asprinkleofcode/src/mdx-components.tsx` + `.test.ts` -- whitelist `Photo`
- [x] `asprinkleofcode/src/pages/Personal/Personal.tsx` (+ new `Personal.test.tsx`) -- PersonalPage per Boundaries. Hero via `Photo` with `priority`, placed after the header and before the body
- [x] `asprinkleofcode/src/lib/registry.test.ts` -- live personal render test

**Acceptance Criteria:**
- Given a fixture personal entry, when `/beyond/:slug` renders, then there is exactly one `h1`, one `article`, the document title and description are set and restored on unmount, and no capability, role or evidence markup is present.
- Given a fixture body using `Photo` with an injected media map, when it renders, then the `img` has the `alt`, `width`, `height` and `loading="lazy"`. An unknown `src` makes the render throw.
- Given a 375px viewport, when a personal story renders, then images are `w-full h-auto` inside the padded column, so nothing overflows horizontally.
- Given the full suite, when `npm run build` runs, then typecheck, lint, tests and the Vite build all pass.

## Implementation Notes

- `personalHighlight` reports `metric`/`unit` as named problems (not "unknown key"), and drops the work rule "unit needs a metric" so a unit-only personal highlight gets the one relevant message. The invalid fixtures live in their own root, `plugins/__fixtures__/invalid-personal/`, loaded per file, so the existing `invalid-schema` assertions are unaffected (the valid root's `valid-personal.mdx` already had a headline-only highlight).
- `PersonalFrontmatter.highlight` keeps the shared `Highlight` type: narrowing it ripples into `PathCard` (which already guards metric by type) and a PathCard test that feeds a personal metric on purpose.
- Body-photo margin is `[&>figure]:my-8 [&_section>figure]:my-8` in `storyProseClasses`, so `Photo` itself carries no margin and the hero (outside the body wrapper) gets none.
- `photoMeta` errors on a `?photo` import that resolves outside `src/assets/media/`, and on a file whose size can't be read (naming the file). Fixture: a 34-byte solid-colour 3×2 lossless WebP at `plugins/__fixtures__/photo-meta/`. A throwaway production build with a probe photo confirmed the glob emits `{ src, width, height }`.
- The live personal render test (`registry.test.ts`) uses a plain loop, so it registers no per-entry cases while `src/content/personal/` is empty.

## Spec Change Log

- 2026-10-25 (planning, A-6 trace of epic ACs): The AC "PersonalPage component exists" is met by rebuilding `pages/Personal/Personal.tsx`, which matches the `WorkStory` naming precedent. The AC "photo treatment decided with Alisha when the first real photos are placed" moves to Story 4.4, the first story with real photos (epic-4-context OPEN item). The VideoEmbed ACs were split to Story 4.1 part B by Alisha at the step-01 scope gate. Every other Story 4.1 AC is covered above.

## Review Triage Log

| # | Layer | Finding | Verdict | Evidence | Route |
|---|-------|---------|---------|----------|-------|
| 1 | edge + blind | `photoMeta` "outside media" check is a case-sensitive `startsWith` (drive-letter case, junctions) | medium | On Windows, `config.root` can carry a different drive-letter case than Vite's realpath'd id, so every legitimate photo would be rejected. `path.relative` is case-insensitive on win32. | patch |
| 2 | edge | AVIF `irot`/`imir` rotation swaps width/height | low | Content is Squoosh-exported WebP; rotated AVIF is unlikely, and the fix adds orientation branches | reject |
| 3 | verification-gap | `photoMeta.test` `src` matcher (`stringContaining`) can't tell a URL from an absolute file path | medium | Pre-verified: an inlined-path regression would still pass while every photo ships a broken `src` | patch |
| 4 | verification-gap | `media.ts`'s own glob is never run against a real photo | medium (unverified until 4.4) | Pre-verified; closing it now would need a placeholder photo in `src/assets/media/` (forbidden). The 4.4 live loop closes it. | defer |
| 5 | blind | `sprint-status.yaml` `last_updated` went backwards (12:00 → 11:41) | low | True; the system clock was behind the hand-entered value. A direct correction, applied at step 05's status update. | patch |
| 6 | blind | Part-B deferred entry has `source_spec: none` | false | step-01's split format mandates `source_spec: none` | reject |
| 7 | blind | `Photo` has no runtime `alt` check; MDX isn't type-checked | medium | `<Photo src="…" />` in MDX renders an `<img>` without alt, which breaks the required-alt AC. A one-line throw fixes it. | patch |
| 8 | blind | Body `Photo src` lacks a `MEDIA_SRC` format check and has a generic error | low | An unknown path already throws, naming the path; the change is cosmetic | reject |
| 9 | blind | Article JSON-LD omits `image` when there is a hero | low | Not required by any AC; the fix needs an absolute asset URL (adds surface) | reject |
| 10 | blind | The `priority` hero still has `decoding="async"` and no `fetchpriority="high"` | low | Real LCP cost, and the correction is direct inside `Photo` | patch |
| 11 | blind | Freeform body headings: prose styles only `h3`, and there's no `h2` rule | low | No personal body exists yet; Story 4.4 authors the bodies and settles heading use. The fix adds styling decisions. | reject (flag for 4.4) |
| 12 | blind | No pipeline check for EXIF/GPS in committed photos | medium (unverified) | Public-safety rule is a manual checklist today (`media/README.md`); `photoMeta` reads every photo and could enforce it | defer |
| 13 | blind | `?photo` plugin accepts non-webp/avif files | low | Only reachable by a hand-written `?photo` import outside the glob; the fix adds a branch | reject |
| 14 | blind | The `?photo` shape is declared three times (`vite-env.d.ts`, `MediaPhoto`, `PhotoDimensions`) | low | The `.d.ts` can drift from `MediaPhoto`; a direct correction reuses the type via `import()` | patch |
| 15 | blind | The live personal test passes vacuously with zero entries | low | Documented in-spec; Story 4.4 makes it non-empty (see #4) | reject |

## Design Notes

Hero placement after the header is provisional, as part of the OPEN photo treatment. Story 4.4 can move it once real photos exist. `Photo` takes `priority` instead of guessing whether a photo is above the fold.

## Verification

**Commands (from `asprinkleofcode/`):**
- `npm run typecheck` -- expected: no errors
- `npm run lint` -- expected: no errors
- `npm test` -- expected: all pass, including the new Personal, Photo, media and frontmatter cases
- `npm run build` -- expected: success
