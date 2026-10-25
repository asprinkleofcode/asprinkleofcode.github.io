# Epic 4 Context: Beyond the Code — Personal Dimensions

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

A visitor can discover Alisha's personal side through two authentic, standalone stories, Powerlifting and Birdhouses. Each links out to its own Instagram, and the Birdhouses page links to a care-guide PDF hosted on the site. This is the first time the `personal` content type is built against real content: `PersonalPage`, the photo block, a click-to-load `VideoEmbed`, the `pdf` document link, and outbound links inside a story. Once it ships, the homepage Beyond the Code card goes live, `/beyond` lists both dimensions, and the legacy `/about` page is retired. Epic 4 is built before Epic 3, because Leadership stories haven't been chosen yet. The order visitors see does not change: the header, path cards and routes still read Engineering → Leadership & Enablement → Beyond the Code. Alisha supplies the source material (narratives in `addendum.md` BC-1/BC-2, photos, video links and the PDF) in a content drop that is merged to `main` before Story 4.4. Right now BC-1 and BC-2 are still empty templates.

## Stories

- Story 4.1: Personal Story Component & Detail Page
- Story 4.2: Beyond the Code Path Index
- Story 4.3: Birdhouses Care Guide — Static PDF Asset
- Story 4.4: Author Powerlifting & Birdhouses Dimension Stories
- Story 4.5: Homepage Beyond the Code Card
- Story 4.6: Retire the Legacy `/about` Page

## Requirements & Constraints

- **Authentic and standalone:** each dimension is a deliberate opportunity to explore, not a passing mention. No story may claim or require a "hobby makes me a better engineer" metaphor. Personal pages have no capability signals, evidence blocks or metrics. How deep a story goes depends on the material available; there is no quota.
- **Nothing invented:** stories are written only from BC-1/BC-2, `src/assets/media/<dimension>/` and `public/downloads/`. If a section a story needs is missing, ask Alisha instead of writing it. No placeholder, stock photo, stub link or placeholder PDF ever ships. A link, photo or download renders only once the real file or value is committed.
- **Two dimensions only:** Powerlifting and Birdhouses. The visitor-facing name is "Birdhouses", never "Birdhouse and Gourd Making". `/beyond` never shows a slot for a dimension that doesn't exist.
- **Instagram handles, exact:**
  - powerlifting: `https://www.instagram.com/asprinkleofcode/`
  - Birdhouses: `https://www.instagram.com/orangecatwoodcraft/`
  - No other Instagram link.
- **Public safety:** the repo is public.
  - Photos have EXIF/GPS data stripped.
  - Nothing from work appears (screens, badges, documents).
  - Other people appear only with consent; photographers are credited when they ask.
  - Nobody else's private information appears without consent.
  - Clear the PDF's document properties before committing it.
- **Media policy:** never modify or delete existing photos or videos. Removing `/about` removes page code only. Legacy media (`pl-1.jpg`, `pl-2.jpg`, the headshot) stays where it is; to reuse one, add a web-ready copy under `media/<folder>/`.
- **Quality floor:**
  - WCAG 2.2 AA.
  - Pointer targets at least 24×24 CSS px.
  - Visible, logically ordered focus.
  - Mobile is first-class: media, body and links stay readable and reachable.
  - Reduced-motion fallbacks.
  - Personal content gets Alisha's review before a story is marked done.

## Technical Decisions

- **`personal` schema:** `type`, `title`, `slug?`, `summary`, `date?`, `hero?: { src, alt }`, `links?: { label, href }[]`, `pdf?: { label, href }`, `highlight?: { headline, metric?, unit? }`, `featured?`, `draft?`, `listed?` (defaults to true). Unknown keys are rejected. `plugins/contentFrontmatter.ts` validates at build time, and every new rule gets valid and invalid fixtures.
- **No metric on personal entries (retro A-9, Story 4.1):** `highlight.metric` or `highlight.unit` on a `personal` entry fails the build and names the file. `highlight.headline` is allowed. Story 4.1 must land before 4.4 and 4.5 publish content.
- **`PersonalPage`** is separate from `WorkStoryPage`:
  - Freeform body; the AD-3 section menu does not apply.
  - Exactly one `<h1>` and an `<article>` landmark.
  - Lazy-loaded on `/beyond/:slug`.
  - Sets its title and description with `useDocumentMeta`, which restores the defaults on unmount.
  - Renders `hero` with its `alt`.
- **`listed: false`:** the entry is reachable at its route but left out of `/beyond` and every teaser. It stays in the schema for a future supporting page. No MVP entry uses it.
- **Photos:**
  - Content refers to a photo by its path inside `src/assets/media/`, e.g. `birdhouses/01-raw-gourd.webp`.
  - One helper resolves the path through `import.meta.glob`. An unresolved `src` fails the build (frontmatter) or the test run (body).
  - In the body, one sanctioned MDX photo block (AD-8) takes `src` and a required `alt`, renders explicit `width`/`height`, and lazy-loads unless it is the hero. No layout shift.
  - **Decided (Alisha, 2026-10-25, Story 4.1A):** `width`/`height` are read from the file at build time. `plugins/photoMeta.ts` serves `?photo` imports of `src/assets/media/` files as `{ src, width, height }` (via `image-size`); `src/lib/media.ts` `resolveMedia` is the one resolver. Authors write only `src` and `alt`.
  - Maximum per page: Powerlifting 1 hero + 4–6; Birdhouses 1 hero + 5–7 process + 3–6 finished; `/beyond` up to 2 (one per card, only if the card shows an image).
  - Photo treatment (aspect ratio, radius, edge) and whether the Birdhouses process photos show as a sequence or a gallery are **OPEN**. They are decided with Alisha once real photos exist and recorded in `DESIGN.md`/`EXPERIENCE.md`, never invented in code.
- **`VideoEmbed` (Story 4.1; powerlifting only):** one sanctioned block with `src`, a required `title` and an optional `poster` (a path inside `media/`).
  - Shows a click-to-load facade: a fixed 16:9 box with the poster, or a role-token panel when there is none, plus a play control whose accessible name is the `title`.
  - The `<iframe>` (YouTube from `youtube-nocookie.com`, or the Google Drive `/preview` embed) is created only when the play control is activated, and gets the same `title`.
  - No third-party request or thumbnail before activation. No autoplay or loop.
  - The build fails, naming the file, on a non-YouTube/Drive `src`, a missing or empty `title`, or more than 4 clips on a page.
  - Titles tell clips apart (lift, meet, year). Video files are never committed.
- **Care guide (AD-20 as revised 2026-10-25):** the PDF is the `pdf: { label, href }` field on the Birdhouses entry. It replaces the old bare-string field.
  - There is no separate entry, route, `.mdx` file or inline `<iframe>`/`<object>` preview.
  - `href` matches `/downloads/<kebab-name>.pdf`. A non-draft entry whose `href` has no committed file under `public/downloads/` fails the build.
  - It renders as a plain same-origin `<a href>` beside the entry's `links`: no `target`, `rel` or `download` attribute, and no "leaves the site" marker.
  - The link says it is a PDF before activation (for example a "(PDF)" suffix), and that marker is part of the accessible name.
  - Without `pdf`, no link renders and no space is reserved for one.
  - Real file: `public/downloads/birdhouse-care-guide.pdf`, wired in Story 4.4.
- **Outbound links:** `personal.links` holds only genuinely external destinations. They render through `ExternalLink`: `target="_blank"`, `rel="noopener noreferrer"`, and a visible "leaves the site" marker. **Retro A-11 (Story 4.4):** fix the whole-label `nowrap` so multi-word labels wrap like body text, with only the last word and the arrow kept together. A component test covers this.
- **Slugs (pinned):** `src/content/personal/powerlifting.mdx` and `birdhouses.mdx`, with no `slug` override, giving `/beyond/powerlifting` and `/beyond/birdhouses`.
- **Ordering:** `featured` ascending, then `date` descending, then `title`, on every surface.
- **Tokens:** use semantic role tokens only, enforced by `semanticTokens.test.ts`. Run `expectNoFlowbiteDefaults` on any new component that uses flowbite.
- **Decisions made mid-epic:** a spec that records "decided YYYY-MM-DD" also updates this file.

## UX & Interaction Patterns

- **Birdhouse flow:** discover the personal side → Birdhouses → see the transformation and process → continue to @orangecatwoodcraft (outbound) or open the care guide (PDF) in one step. Both links sit on the Birdhouses page.
- **Powerlifting flow:** the journey and context (training, setbacks, progress), not just numbers → continue to @asprinkleofcode. Up to 4 clips sit beside the photos; video appears nowhere else.
- **`/beyond` index:** a summary card for every non-draft entry where `listed` is true, built from the registry. Selecting a card uses the same ~180ms cross-fade as work stories, instant under reduced motion. With no entries, it keeps the "no stories published yet" state.
- **Homepage Beyond the Code card (Story 4.5):** it goes live when a non-draft personal entry is `featured` and has `highlight`.
  - Shows `highlight.headline` and `summary`, with no metric and no "evidence" styling or wording.
  - Both dimensions are featured, so they step under the Story 2.6 rules. `listed: false` entries never appear.
  - The card links straight to the dimension's detail page.
  - **Retro A-8:** with two or more live cards, each "Read the story →" link needs an accessible name that is unique on the page and includes the path or the story (e.g. "Read the story: Beyond the Code"). The visible label is unchanged, and a test checks the names are unique.
  - The Leadership card stays "Coming soon".

## Cross-Story Dependencies

- Epics 1 and 2 are done. Epic 4 reuses the registry, the `hero`/`highlight` schema, `useDocumentMeta`, the path-index mechanism, the path cards (2.6), `ExternalLink` and the cross-fade.
- Build order: **4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6.** Stories 4.1–4.3 need no real content and use fixtures. The content drop must be merged before 4.4 starts.
- 4.4 depends on 4.1 (A-9 rule, photo block, `VideoEmbed`) and 4.3 (the `pdf` link). 4.5 depends on 4.4's featured entries with `highlight`.
- **4.6** depends on 4.1 and 4.4, so powerlifting is live in its new home before `/about` goes. It also:
  - removes `AboutMe.tsx`, `Primary.jsx`, `BeyondTheCodePowerlifting.jsx` and their CSS; `/about` then falls through to not-found;
  - drops the `/about` exceptions in `semanticTokens.test.ts` and `globalCss.test.ts`, and the "Epic 4 replaces it" comments;
  - adds a stable `public/` copy of the headshot for the JSON-LD `image`, `og:image` and `twitter:image`;
  - resolves every `deferred-work.md` entry marked "Epic 4", including the legacy video titles that 4.4 fixes.
- Epic 3 follows. Story 3.1 re-checks A-8 once the Leadership card goes live.
