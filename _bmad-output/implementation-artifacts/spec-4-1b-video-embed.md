---
title: 'Click-to-load VideoEmbed block and its build rules (Story 4.1 part B)'
type: 'feature'
created: '2026-10-25'
status: 'done'
baseline_commit: '8f5bb579a570c1f3c09c200ca5ed814cc7cbe5e8'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-4-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Story 4.4 needs to embed up to 4 powerlifting clips, but no sanctioned video block exists. A raw `<iframe>` (like the legacy `/about` page's Drive embeds) loads third-party content on page load and has no build-time guard.

**Approach:** Add one sanctioned MDX block, `VideoEmbed` (AD-8, EXPERIENCE §22 Video, UX-032). It renders a click-to-load facade and creates the YouTube-nocookie or Drive `<iframe>` only when the visitor activates it. The content plugin fails the build, naming the file, on a bad `src`, a missing title, or more than 4 clips. This resolves the Story 4.1 part B `deferred-work.md` entry.

## Boundaries & Constraints

**Always:**
- Props: `src`, `title` (required), and `poster?` (a `media/` path resolved with `resolveMedia`).
- Accepted `src`: `https://www.youtube-nocookie.com/embed/<11-char id>` with an optional query, or `https://drive.google.com/file/d/<id>/preview`. A YouTube query with `autoplay` or `loop` set is rejected.
- One `src` validator in `src/lib/` is shared by the plugin and the component. The component throws on an invalid `src` or a blank `title`, like `Photo`, because MDX isn't type-checked.
- The facade is a `<figure>` holding a fixed `aspect-video w-full` box, sized before load, so nothing shifts.
  - With a poster: the poster `<img>` (`alt=""`, lazy, explicit `width`/`height`, covering the box).
  - Without one: a `bg-background-secondary` panel showing the title as visible text.
  - Both show a centred, icon-only play `Button` (flowbite) with `aria-label={title}`. It is at least 44×44 CSS px, with the theme focus ring.
- On activation, the `<iframe>` replaces the facade in the same box, with the same `title`, the `src` unchanged, `allowFullScreen`, and `allow="encrypted-media; picture-in-picture; fullscreen"`. Focus moves to the iframe.
- Build rules apply to every non-draft body, work or personal:
  - `src` and `title` must be literal strings.
  - `src` must pass the validator.
  - `title` must be non-empty.
  - At most 4 `<VideoEmbed>` per file.
- Semantic role tokens only; run `expectNoFlowbiteDefaults` on the block.

**Never:**
- No `<iframe>`, third-party URL, or thumbnail fetch before activation. No autoplay or loop, including after the click.
- No real clips, content files or poster photos (Story 4.4). Don't touch `/about` or any existing media.
- Don't pick a photo treatment for posters beyond covering the 16:9 box. That stays OPEN (Story 4.4).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| No poster | valid src, title | Panel with the title and a play button named by the title; no iframe | N/A |
| Poster | `poster="powerlifting/x.webp"` | Lazy `<img alt="">` with width/height, plus the play button | Unknown poster → throws `Unknown media path` |
| Activated | click or Enter on play | One iframe, its title equal to `title`, src unchanged, focused | N/A |
| Bad src | `https://www.youtube.com/watch?v=…`, `?autoplay=1`, or another host | Build fails naming the file; the component throws | `FrontmatterError` |
| No title | `title` missing, `""` or `{expr}` | Build fails naming the file | `FrontmatterError` |
| Too many | 5 `<VideoEmbed>` in one body | Build fails: at most 4 clips (found 5) | `FrontmatterError` |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/plugins/contentFrontmatter.ts:131-163` -- `blockAttributes` walks a tag but returns only attribute names. Generalise it, or add a sibling, so it also returns literal string values (`null` for `{…}` expressions or boolean attributes). Add `videoEmbedProblems(body)` and call it at `:283` for every non-draft entry, not only `work`. Strip code fences, comments and inline code first, as `storyBodyProblems` does.
- `asprinkleofcode/src/lib/` (new `video.ts` + test) -- `videoSrcProblem(src): string | null`, plus `MAX_VIDEOS_PER_PAGE = 4`. The plugin imports from `src/lib` already (`frontmatter.ts`).
- `asprinkleofcode/src/components/VideoEmbed/VideoEmbed.tsx` (new, + test) -- copy `Photo.tsx`'s runtime-guard pattern and `Photo.test.tsx`'s `vi.mock("../../lib/media")` injected map.
- `asprinkleofcode/src/components/PathCard/PathCard.tsx:112-130` -- flowbite `Button` usage pattern. The theme lives in `src/theme/aSprinkleOfCodeTheme.ts:67`.
- `asprinkleofcode/src/lib/proseClasses.ts` -- `[&>figure]:my-8` already spaces a body `<figure>`.
- `asprinkleofcode/src/mdx-components.tsx` + `.test.ts:5` -- export `VideoEmbed` and add it to the sorted list.
- `asprinkleofcode/plugins/contentFrontmatter.test.ts` -- unit cases for `videoEmbedProblems`.
- `asprinkleofcode/plugins/__fixtures__/` -- add a new `invalid-video/` root (loaded per file, like `invalid-body`) with `bad-src.mdx`, `no-title.mdx` and `five-clips.mdx` (personal type), plus `src/lib/fixtureRegistry.ts`. Give `valid/…/valid-personal.mdx` one valid `<VideoEmbed>`, and assert in `contentFrontmatter.integration.test.ts` that it compiles and renders no `<iframe>`.
- Don't change: `src/pages/AboutMe/**`, `Photo`, `media.ts`, `registry.ts`.

## Tasks & Acceptance

**Execution:**
- [x] `asprinkleofcode/src/lib/video.ts` (+ test) -- src validator and clip cap
- [x] `asprinkleofcode/plugins/contentFrontmatter.ts` (+ unit tests) -- attribute values and `videoEmbedProblems` for all non-draft bodies
- [x] `asprinkleofcode/plugins/__fixtures__/invalid-video/**`, `valid/…/valid-personal.mdx`, integration test -- valid and invalid fixtures name the file
- [x] `asprinkleofcode/src/components/VideoEmbed/VideoEmbed.tsx` (+ test) -- facade, activation, focus, guards
- [x] `asprinkleofcode/src/mdx-components.tsx` + `.test.ts` -- whitelist `VideoEmbed`
- [ ] `_bmad-output/implementation-artifacts/deferred-work.md` -- set the part B entry to `resolved-by #<PR>` at close-out

**Acceptance Criteria:**
- Given a rendered `VideoEmbed`, when nothing is activated, then the DOM has no `<iframe>` and no URL on a third-party host.
- Given the play control, when it is activated by click or keyboard, then exactly one `<iframe>` exists with the given `title`, and it has focus.
- Given a 375px viewport, when the block renders, then the box is `w-full aspect-video`, so nothing overflows or shifts.
- Given the full suite, when `npm run build` runs, then typecheck, lint, tests and the Vite build all pass.

## Implementation Notes

## Spec Change Log

## Review Triage Log

| # | Layer | Finding | Verdict | Evidence | Route |
|---|-------|---------|---------|----------|-------|
| 1 | edge | A duplicate `title`/`src` attribute: `find()` checks the first, but JSX uses the last | low | Real, but it needs a hand-typed duplicate prop. The component still throws at render, and `registry.test.ts:256` renders every live personal body, so `npm run build` (which runs vitest) still fails. The fix adds a branch. | reject |
| 2 | edge | An entity-encoded src (`&amp;autoplay=1`) passes the build check | low | It needs an author to entity-encode a URL. The render-time `videoSrcProblem` throws, and the live render test blocks the build. | reject |
| 3 | edge + blind | `poster` is not checked at build; a typo fails only at render | low | This matches the epic design: an unresolved media `src` fails "the build (frontmatter) or the test run (body)". Body `Photo` works the same way, and `registry.test.ts:256` renders every personal body. | reject |
| 4 | edge | An aliased import (`import Clip from …VideoEmbed`) skips the scan, so a fifth clip could ship | low | AD-8 has content import named blocks from `mdx-components`. Aliasing is off-convention, and src/title are still checked at render. | reject |
| 5 | blind | With a poster, the title isn't visible on screen | low | The frozen intent puts the visible title only on the no-poster panel (EXPERIENCE §22). Changing it means editing the spec, and poster treatment is OPEN for Story 4.4. | reject (flag for 4.4) |
| 6 | blind | The play button's name is just the title, with no "Play video" | low | The epic AC and the frozen intent require the accessible name to be the title. Changing it means editing the spec. | reject (flag for 4.4) |
| 7 | blind | The title guidance "(lift, meet, year)" is powerlifting-specific, but the rule runs on work bodies too | low | The message is shown for any body. Rewording it is a direct correction. | patch |
| 8 | blind | Video problems are hidden while other problems exist | low | This is the existing gating pattern (`storyBodyProblems` is gated the same way). It's by design. | reject |
| 9 | blind | The iframe has no `referrerPolicy`, so YouTube error 153 under `no-referrer` | false | There's no `Referrer-Policy` in `index.html` or `public/`, and GitHub Pages sets none, so the browser's default `strict-origin-when-cross-origin` sends the origin. | reject |
| 10 | blind | The keyboard test fires a click, not a key press | low | A native `<button type="button">` is asserted. A real key press needs the `user-event` dependency. | reject |
| 11 | blind | The box goes transparent between the click and the player painting | low | `image === null && !active` drops the panel background. Keeping it is a direct correction. | patch |
| 12 | blind | Console spies aren't restored if an assertion fails | low | Only matters when a test is already failing. It's the same pattern as `Photo.test.tsx`. | reject |
| 13 | blind | The attribute walker now matches names in more places, with no regression test | false | The old `(?:^\|\s)` form missed names glued to a closing quote, so the new walker is stricter for the rationale/metric checks. The existing `storyBodyProblems` cases pass. | reject |
| 14 | blind | Thin integration coverage (no work clip, no autoplay or poster fixture) | low | The unit tests run `processContentFile` on work and autoplay cases, and the integration test covers the pipeline wiring. | reject |
| 15 | verification-gap | None | — | — | — |

## Design Notes

There's no autoplay after the click, so a visitor clicks once to load the player and once more in it to play. Drive `/preview` can't autoplay anyway, and UX-032 says nothing moves on its own. The play button is icon-only: a visible "Play" label that differs from the `aria-label` would break WCAG 2.5.3 (label in name), and the panel already shows the title as text.

## Verification

**Commands (from `asprinkleofcode/`):**
- `npm run typecheck` -- expected: no errors
- `npm run lint` -- expected: no errors
- `npm test` -- expected: all pass, including the new VideoEmbed, video and plugin cases
- `npm run build` -- expected: success
