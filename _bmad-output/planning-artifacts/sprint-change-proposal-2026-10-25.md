# Sprint Change Proposal: Run Beyond the Code (Epic 4) Before Leadership & Enablement (Epic 3)

- **Date:** 2026-10-25
- **Trigger:** Sprinkle can't yet pick Leadership & Enablement stories (PRD §14.3 item 2). Beyond the Code material is ready now.
- **Prepared for:** Sprinkle
- **Mode:** Batch
- **Scope classification:** Moderate. The backlog is resequenced and one story is added. No PRD requirement, MVP scope or architecture changes.
- **Status:** Approved by Sprinkle (2026-10-25). Applied to the planning artifacts in the same change.

## 1. Issue Summary

Epic 2 is done. The gate before the next epic (Stories 2.7 and 2.8 done, Story 2.4 reconciled, retro verdict re-recorded in #45) is met. By the plan, Epic 3 (Leadership & Enablement) is next, but its content story (3.2) has always been blocked: Sprinkle hasn't chosen which 2–3 Leadership stories to tell, and the plan says not to invent candidates. Without content, Epic 3 can only deliver Story 3.1, which verifies that the existing mechanism works and changes nothing a visitor sees.

Sprinkle has confirmed (2026-10-25) that she can supply all of the Beyond the Code material now:

- the powerlifting narrative
- the Birdhouses narrative
- web-ready photos
- the Birdhouses care-guide PDF

This removes every content blocker that `epics.md` lists for Epic 4.

**Decision:** keep the product order exactly as it is. The header, homepage path cards and routes stay Engineering → Leadership & Enablement → Beyond the Code. Only the build order changes: Epic 4 runs next, and Epic 3 waits until Leadership stories are chosen.

**Swap style chosen: resequence, don't renumber.** Epic 3 is still Leadership and Epic 4 is still Beyond the Code. Renumbering would leave stale references in:

- seven code comments ("until Epic 4 replaces AboutMe", in `App.tsx`, `Personal.tsx`, `PathIndex.tsx`, `AboutMe.tsx`, `AboutMe.css`, `globalCss.test.ts` and `semanticTokens.test.ts`)
- `deferred-work.md`
- `EXPERIENCE.md` ("Story 4.1", "Epic 3 content")
- two retros and several specs

## 2. Impact Analysis

### Epic impact

| Epic | Impact |
|---|---|
| Epic 2 | No change. `sprint-status.yaml` still says `in-progress`. It is set to `done`: every story is done and the retro verdict was re-recorded. |
| Epic 4 | **Sequenced next.** Its content status changes from blocked to supplied. It picks up retro items A-8, A-9 and A-11, and gains Story 4.6 (retire the legacy `/about` page). |
| Epic 3 | **Deferred, not dropped.** It starts once Sprinkle picks Leadership stories. Story 3.1 (the mechanism) needs no change of its own. FR-9 to FR-11 stay MVP requirements. |

### Story impact

| Story | Change | Why |
|---|---|---|
| 4.1 | Add the A-9 schema rule (no metric on personal entries) and a video decision criterion | A-9 was written for "Epic 4 planning". The legacy powerlifting page embeds videos, and the UX contract has no video block |
| 4.3 | Replace "PDF not yet supplied" with "commit the supplied PDF" | The PDF exists now |
| 4.4 | Status changes from content-blocked to supplied. Add the A-11 `ExternalLink` wrap fix | The Instagram links are the first multi-word outbound links |
| 4.5 | Add the A-8 unique link names criterion | Beyond the Code becomes the **second** live card, which is the trigger A-8 was waiting for. A-8 was routed to Story 3.1 only because Epic 3 was expected to go first |
| 4.6 (new) | Retire the legacy `/about` page | Code comments and `deferred-work.md` say Epic 4 retires it, but no Epic 4 story does |
| 3.1 | Add one line: the A-8 rule from Story 4.5 also holds for the Leadership card | Keeps A-8 covered whichever card goes live last |
| 3.2 | No change | Still blocked on story selection |

### Artifact conflicts

| Artifact | Status |
|---|---|
| `PRD.md` | No requirement change. In §14.3 item 6 (photography), Beyond the Code is marked answered. Item 2 stays open. |
| `ARCHITECTURE-SPINE.md` | No conflict. AD-1, AD-2, AD-5, AD-18 and AD-20 already cover personal content, and the three paths are fixed structure whatever the build order. |
| `DESIGN.md`, `EXPERIENCE.md` | No conflict. `EXPERIENCE.md:361` ("deferred until Epic 3 content exists") and the Story 4.1 references stay correct because the IDs don't change. Any video decision from Story 4.1 is recorded in `EXPERIENCE.md` §22 then. |
| `epics.md` | Updated: an update note, the Dependencies paragraph, the Epic 3 and 4 status lines (in the Epic List and the epic headers), Stories 3.1, 4.1, 4.3, 4.4 and 4.5, and the new Story 4.6. |
| `sprint-status.yaml` | Updated: `epic-2: done`, the epic-4 block moved above epic-3 (the next backlog story is picked in file order), the `4-6` key added, and the A-8, A-9 and A-11 items re-routed. |
| `epic-2-context.md`, retros, earlier specs | Left as they are. They are historical records, and `epics.md` is the live plan. |
| Code | No change in this proposal. The code changes ship with Stories 4.1–4.6. |

### Technical impact

- **No rework.** Story 2.6 made the path cards registry-driven, so the Beyond the Code card turns live without a code change, and the Leadership card stays "Coming soon".
- **First personal content.** This is the first time `PersonalPage`, the photo block, `listed: false`, the `pdf` field and outbound links inside a story are built against real content.
- **Media policy (AGENTS.md).** New photos and the PDF are added as new files. Retiring `/about` removes page code only. The legacy media (`pl-1.jpg`, `pl-2.jpg`, the headshot) stay where they are. A story that reuses one copies it into `src/assets/media/<folder>/`.

## 3. Recommended Approach

**Direct adjustment:** resequence the epics and amend Epic 4's stories.

| Option | Verdict | Reason |
|---|---|---|
| Direct adjustment (resequence) | **Selected** | Epics 3 and 4 were planned as independent (`epics.md` Dependencies). Only the build order changes. |
| Renumber Epics 3 and 4 | Rejected by Sprinkle | It adds churn across code comments and history and changes nothing about the work. |
| Rollback | Not viable | Nothing completed is affected. |
| MVP review | Not viable | MVP scope is unchanged. Leadership content is still required before public release. |

- **Effort:** medium. Most of it is Epic 4's own content work, which was already planned. This proposal adds only Story 4.6 (small) and four extra criteria.
- **Risk:** low. The main risk is quality: personal stories that read as filler. FR-13 and FR-14, and Sprinkle authoring from her own narrative, guard against that.
- **Timeline:** the site gains visible content now instead of a verify-only Epic 3. Leadership still needs content before the MVP is complete (NFR-4 counts "Coming soon" as a deliberate state, not placeholder content).

## 4. Detailed Change Proposals

### 4.1 `epics.md`

#### E1. Update note (append after the 2026-10-12 note, line 38)

```markdown
**Update note (2026-10-25, resequence):** Epic 4 (Beyond the Code) now runs before Epic 3 (Leadership & Enablement). Leadership stories aren't chosen yet (PRD §14.3 item 2), and Sprinkle has supplied the Beyond the Code narratives, photos and care-guide PDF. Epic and story IDs are unchanged, and so is the order visitors see (header, homepage path cards, routes). Story 4.6 is added (retire the legacy `/about` page). Stories 4.1, 4.3, 4.4 and 4.5 pick up retro items A-9, A-11 and A-8 and the supplied content, and Story 3.1 keeps a pointer to A-8 (`planning-artifacts/sprint-change-proposal-2026-10-25.md`). One story was added. None were removed or renumbered.
```

#### E2. Dependencies (line 203)

OLD:
```markdown
**Dependencies:** Epic 1 blocks Epics 2–4 (shared shell, routing, tokens, content pipeline). Epics 2, 3, and 4 are independent of each other; Epic 2 before Epic 3 lets Leadership reuse Engineering's story components with zero rework. **Gate (2026-10-12):** Epic 3 starts only after Epic 2's remediation stories (2.7, 2.8) are done, Story 2.4's criteria are reconciled, and the Epic 2 retrospective is resumed and its verdict re-recorded (`implementation-artifacts/epic-2-retro-2026-10-12.md`). Epic 3 reuses the render guard and the block rules.
```

NEW:
```markdown
**Dependencies:** Epic 1 blocks Epics 2–4 (shared shell, routing, tokens, content pipeline). Epics 2, 3, and 4 are independent of each other; Epic 2 before Epic 3 lets Leadership reuse Engineering's story components with zero rework. **Gate (2026-10-12):** the next epic starts only after Epic 2's remediation stories (2.7, 2.8) are done, Story 2.4's criteria are reconciled, and the Epic 2 retrospective is resumed and its verdict re-recorded (`implementation-artifacts/epic-2-retro-2026-10-12.md`). The gate was met on 2026-10-12. Epic 3 reuses the render guard and the block rules.

**Build order (2026-10-25):** Epic 4 runs next, and Epic 3 follows once Leadership & Enablement stories are chosen (PRD §14.3 item 2). This changes the build order only. The visitor-facing order stays Engineering → Leadership & Enablement → Beyond the Code in the header, the homepage path cards and the routes (FR-3, D-15, UX-DR27).
```

#### E3. Epic 3 status (Epic List line 228 and epic header line 859–860)

OLD (both places):
```markdown
**Content status:** Blocked — story selection is still open (PRD §14.3 item 2). The mechanism can be built now; content-authoring stories can't be completed until Alisha selects specific stories.
```

NEW (both places, followed in the epic header by its existing "Starts after" line):
```markdown
**Content status:** Blocked — story selection is still open (PRD §14.3 item 2). The mechanism can be built now; content-authoring stories can't be completed until Alisha selects specific stories.
**Sequenced after Epic 4 (2026-10-25):** starts when Leadership stories are chosen.
```

#### E4. Epic 4 status (Epic List line 236 and epic header line 928)

OLD (Epic List):
```markdown
**Content status:** Partial risk — Instagram handles supplied (A-14: @asprinkleofcode, @orangecatwoodcraft); the care-guide PDF file itself needs to be supplied. Links/downloads render only once real values exist — no placeholders (NFR-4).
```
OLD (epic header):
```markdown
**Content status:** No narrative source material exists yet for either dimension (unlike Engineering's `addendum.md`) — do not invent content. Instagram handles supplied (A-14: @asprinkleofcode, @orangecatwoodcraft); the care-guide PDF file itself needs to be supplied. Links/downloads render only once real values exist — no placeholders (NFR-4).
```

NEW (both places):
```markdown
**Content status:** Supplied (2026-10-25). Alisha has the powerlifting and Birdhouses narratives, web-ready photos and the care-guide PDF; Instagram handles are supplied (A-14: @asprinkleofcode, @orangecatwoodcraft). Stories are authored from her material only; nothing is invented beyond it. Links and downloads render only once the real files and values are committed, with no placeholders (NFR-4).
**Sequenced next (2026-10-25):** runs before Epic 3. Story 4.1 lands before 4.4 and 4.5 publish content (Epic 2 retro A-9).
```

#### E5. Story 4.1: add two criteria (before the final "And a component test…" line)

```markdown
**Given** the Beyond the Code card carries no metric (UX-007, `EXPERIENCE.md` §6.4) (Epic 2 retro A-9, F-7)
**When** a `personal` entry's frontmatter has `highlight.metric` or `highlight.unit`
**Then** the build fails naming the file, and valid and invalid fixtures cover it. `highlight.headline` stays allowed

**Given** the legacy powerlifting page embeds videos, and the UX contract covers photos only (UX-DR31)
**When** Alisha decides whether a personal story uses video
**Then** either it doesn't, or the decision (embed source, one sanctioned block in `src/mdx-components.tsx`, a `title` that tells each clip apart, lazy loading, a cap per page) is recorded in `EXPERIENCE.md` §22 before the block is built. No video block is invented in code
```

#### E6. Story 4.3: replace the "not yet supplied" criterion

OLD:
```markdown
**Given** the actual PDF file has not yet been supplied by Alisha
**When** this story ships
**Then** the mechanism exists but is not wired to a real asset until the file is supplied: no placeholder PDF is committed and no care-guide link renders anywhere (NFR-4, UX-DR29 Missing Content, `EXPERIENCE.md` Birdhouse Flow)
```

NEW:
```markdown
**Given** Alisha has supplied the care-guide PDF (2026-10-25)
**When** this story ships
**Then** the file is committed as a new asset at `public/downloads/<slug>.pdf` (supplied by the content drop as `public/downloads/birdhouse-care-guide.pdf`, so the entry's slug is `birdhouse-care-guide`), the link label is the wording in `addendum.md` BC-2, the entry's `pdf` field names the file, and a test fails if a non-draft entry's `pdf` does not resolve to a file under `public/downloads/`. No placeholder PDF is ever committed, and if the file is not in the PR, no care-guide link renders anywhere (NFR-4, UX-DR29 Missing Content, `EXPERIENCE.md` Birdhouse Flow)
```

#### E7. Story 4.4: status line and two criteria

Added after approval (2026-10-25, Sprinkle): a criterion pinning the slugs to `powerlifting` and `birdhouses` (`/beyond/powerlifting`, `/beyond/birdhouses`), placed before the FR-19 criterion.

OLD:
```markdown
**Status:** Content-blocked — no narrative source material exists yet for either dimension (unlike Engineering's `addendum.md`); do not invent content. Photography/video availability is also an open question (A-11, PRD §14.3 item 6); where photos go, how many, and how they are chosen are now decided (UX-DR31, `EXPERIENCE.md` v0.12 §22 Photography), and Alisha adds them under `src/assets/media/powerlifting/` and `src/assets/media/birdhouses/`.

**Acceptance Criteria (to satisfy once content is supplied):**
```

NEW:
```markdown
**Status:** Content supplied (2026-10-25). Alisha provides the powerlifting and Birdhouses narratives and the photos through the content drop (`addendum.md` BC-1 and BC-2, photos in `src/assets/media/<dimension>/`); the stories are authored from that material only, and nothing is invented to fill a gap. If a section the story needs is missing from BC-1 or BC-2, the agent asks Alisha rather than writing it. Where photos go, how many, and how they are chosen are decided (UX-DR31, `EXPERIENCE.md` v0.12 §22 Photography), and Alisha adds them under `src/assets/media/powerlifting/` and `src/assets/media/birdhouses/`. Depends on Story 4.1 (A-9).

**Acceptance Criteria:**
```

ADD (after the A-14 handles criterion):
```markdown
**Given** these are the site's first multi-word outbound links (Epic 1 retro A-11, R-9)
**When** an Instagram link renders through `ExternalLink`
**Then** its label wraps between words like body text, and only the last word and the "leaves the site" arrow are kept together, so the arrow never wraps onto a line by itself. A component test covers a multi-word label
```

#### E8. Story 4.5: add the A-8 criterion (before the final "And clicking the live card…" line)

```markdown
**Given** Beyond the Code becomes the second live path card (Epic 2 retro A-8, F-8)
**When** more than one card is live
**Then** each card's "Read the story →" link has an accessible name unique on the page that includes the path or the story (for example "Read the story: Engineering"), the visible label is unchanged, and a test asserts the names are unique with two or more live cards
```

#### E9. Story 3.1: one added line (after the Coming soon criterion)

```markdown
**And** the unique path-card link names from Story 4.5 (Epic 2 retro A-8) hold once the Leadership card is live too. This is verified, not rebuilt
```

#### E10. New Story 4.6 (after Story 4.5)

```markdown
### Story 4.6: Retire the Legacy `/about` Page

**Origin:** resequence proposal (2026-10-25). Code comments and `deferred-work.md` say Epic 4 replaces `AboutMe`, but no Epic 4 story did. Depends on Stories 4.1 and 4.4, so the powerlifting content is live in its new home before the old page goes.

As a visitor, and as the developer maintaining the site,
I want the old `/about` page gone once its content lives in Beyond the Code,
So that there's one place for each story and no off-system page lingers by URL.

**Acceptance Criteria:**

**Given** AD-5's fixed route set
**When** this story is complete
**Then** the `/about` route and the `AboutMe` page code (`AboutMe.tsx`, `Primary.jsx`, `BeyondTheCodePowerlifting.jsx` and their `.css`) are removed, and `/about` falls through to the not-found page (AD-16)

**And** no photo or video file is modified or deleted (AGENTS.md). Media that only the legacy page used stays in place, and any removal is proposed separately

**Given** the legacy exceptions kept "until Epic 4"
**When** the page is removed
**Then** the `/about` allowances in `semanticTokens.test.ts` and `globalCss.test.ts` and the "Epic 4 replaces it" comments (`App.tsx`, `Personal.tsx`, `PathIndex.tsx`) are removed or updated, and both gates pass with no legacy exception

**Given** the Person JSON-LD `image` in `index.html` points at a Vite-hashed headshot (`deferred-work.md`, Epic 1 retro A-11)
**When** this story is complete
**Then** `index.html` uses a stable `public/` copy of the headshot (a new file, with the original untouched) for the JSON-LD `image`, `og:image` and `twitter:image`, and the built `dist` serves it

**And** every `deferred-work.md` entry marked "Epic 4" is set to `resolved-by` this story or to the Story 4.4 change that resolved it (for example the powerlifting video titles, if the videos moved)
```

### 4.2 `PRD.md`

#### P1. §14.3 item 6

OLD:
```markdown
6. What photography or video is available for the making dimension and for story imagery (A-11).
```

NEW:
```markdown
6. What photography or video is available for the making dimension and for story imagery (A-11) — **answered for Beyond the Code (2026-10-25):** Alisha has web-ready photos for both dimensions. Video use is decided in Story 4.1. Work-story imagery stays text-first.
```

### 4.3 `implementation-artifacts/sprint-status.yaml`

- `epic-2: in-progress` → `epic-2: done`.
- Move the whole `epic-4` block (`epic-4` to `epic-4-retrospective`) above the `epic-3` block. The keys are unchanged.
- Add `4-6-retire-legacy-about-page: backlog` after `4-5-homepage-personal-hint-teaser`.
- Action items:
  - `epic-2-retro-item-19` (A-8): action becomes `"A-8: Unique accessible names for path-card links once more than one path is live. → Story 4.5 (second live card); verified again in Story 3.1."` It stays `open`.
  - `epic-2-retro-item-20` (A-9): action gains `" → Story 4.1 (schema rule) and Epic 4 sequencing note."` It stays `open`.
  - `epic-1-retro-item-11` (A-11): action gains `" → Story 4.4 (ExternalLink wrap) and Story 4.6 (og:image, JSON-LD image)."` It stays `open`.
- `last_updated` is bumped.

### 4.4 `addendum.md`: new Beyond the Code source section (template)

This is appended after the Engineering source material and filled in by Sprinkle in the content drop (section 5). It follows the ES-1/ES-2 precedent: source material is committed in `addendum.md` and the agent authors from it.

```markdown
## Beyond the Code — Source Material

Supplied by Alisha for Epic 4. Public: everything here is committed (AD-4), so it is
written to the same public-safety rules as the stories (`EXPERIENCE.md` §22).

### BC-1: Powerlifting

#### Story (in Alisha's words)
<!-- How you started, the journey over time, setbacks, progress, what it means to you.
     Rough is fine; the agent shapes it, it doesn't add to it. -->

#### Facts the story may state
<!-- Meets, lifts, numbers, dates — only ones you're happy to publish. -->

#### Photos
| File (in `media/powerlifting/`) | Role | Alt text | Caption (optional) | Credit (if required) |
|---|---|---|---|---|
| `hero-....webp` | hero | | | |
| `01-....webp` | body | | | |

#### Videos (links only, not files)
| URL (YouTube or Google Drive) | Title that tells this clip apart | Keep? |
|---|---|---|

#### Featured highlight (homepage card)
- headline:
- summary:

### BC-2: Birdhouses

#### Story (in Alisha's words)
<!-- How you got into it, the gourd-to-birdhouse process, what you make, who for. -->

#### Facts the story may state

#### Photos
| File (in `media/birdhouses/`) | Role (hero / process NN / finished) | Alt text | Caption (optional) | Credit (if required) |
|---|---|---|---|---|

#### Care guide
- file: `public/downloads/birdhouse-care-guide.pdf`
- link label (shown to visitors; "(PDF)" is added if you leave it out):
- one line on what's in it:

#### Featured highlight (homepage card)
- headline:
- summary:
```

## 5. Content Drop: Where to Put Your Material

The development agent works in a **fresh git worktree**, which holds only committed files. Anything left uncommitted in your main checkout, or in a gitignored folder, is invisible to it (the same issue as `config.user.toml`). So the material goes in through **one small PR that you merge to `main` before Story 4.3 starts**. Stories 4.1 and 4.2 need nothing from you except the video decision, so they can run while you prepare it.

| Material | Put it here | Format and rules |
|---|---|---|
| Powerlifting narrative | `_bmad-output/addendum.md` → **BC-1** (template in 4.4) | Your own words, rough is fine. Public once merged, so leave out anything you wouldn't publish. |
| Birdhouses narrative | `_bmad-output/addendum.md` → **BC-2** | Same as above. |
| Powerlifting photos | `asprinkleofcode/src/assets/media/powerlifting/` | Follow `src/assets/media/README.md`: WebP, ~1600 px long edge (≤2000 px for the hero), under ~250 KB, location data removed, nothing from work, no one in frame without consent, lowercase hyphenated names. 1 hero + 4–6. List each one in BC-1's photo table with its alt text. |
| Birdhouses photos | `asprinkleofcode/src/assets/media/birdhouses/` | Same rules. 1 hero + 5–7 process (numbered `01-`, `02-`… in order, same angle and background) + 3–6 finished pieces. List each in BC-2's table. |
| Videos | **Links only**, in BC-1's video table. Don't commit video files. | YouTube or Google Drive share links, each with a title that tells it apart. The four Drive clips and one YouTube video on the old `/about` page can be listed here if you want to keep them. Whether video is used at all is decided in Story 4.1. |
| Care-guide PDF | `asprinkleofcode/public/downloads/birdhouse-care-guide.pdf` | The final file. Before committing, clear its document properties (author, and anything else you don't want public). Put the link label in BC-2. |
| Existing `pl-1.jpg` / `pl-2.jpg` | Leave them where they are | If you want one in the new story, add a web-ready copy to `media/powerlifting/`. The original is never moved or edited (AGENTS.md). |

**Steps:**

1. Create a branch, for example `content/beyond-the-code-source`.
2. Add the files and fill in BC-1 and BC-2.
3. Open a PR and merge it. It deploys nothing visible: unreferenced photos aren't bundled, and the PDF isn't linked until Story 4.3. It does become publicly downloadable by URL as soon as it merges, so commit only the final version.
4. Tell the agent the content drop is merged when you start Story 4.3.

If something isn't ready (for example only half the Birdhouses process photos), merge what you have. The stories ship with what exists and leave out the rest, with no placeholders (§14 Missing Content).

## 6. Implementation Handoff

**Scope: Moderate.** The backlog is reorganized and the Developer agent implements it.

| Who | Responsibility |
|---|---|
| Developer (Amelia, via `bmad-build`) | Apply sections 4.1–4.4 to the planning artifacts in this change, including the empty BC-1/BC-2 template in `addendum.md`. Read source material only from `addendum.md` BC-1/BC-2, `src/assets/media/<dimension>/` and `public/downloads/`. Then build Epic 4 in order: **4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6**. Create `implementation-artifacts/epic-4-context.md` when the epic starts. It carries the A-9 rule and the AD-3 and A-5 conventions that apply to personal content (decisions dated in a spec also update the epic context). |
| Sprinkle | Merge the content drop (section 5) before Story 4.3 starts. Decide on video in Story 4.1, and on photo treatment and the Birdhouses gallery with the first real photos. Review every personal story before it's marked done. Keep collecting Leadership & Enablement story candidates for Epic 3. |
| PM (John) | Close retro items A-8 and A-9 when Stories 4.5 and 4.1 merge. Revisit Epic 3 once Leadership candidates exist. |

**Success criteria:**

- `epics.md` and `sprint-status.yaml` show Epic 4 next, with Epic 3's IDs and stories intact, and the next backlog story in file order is 4.1.
- The visitor-facing order is unchanged: the header and path cards read Engineering → Leadership & Enablement → Beyond the Code.
- When Epic 4 is done, the Beyond the Code card is live, `/beyond` lists powerlifting and Birdhouses, the care-guide PDF opens in place, `/about` is gone, and the Leadership card still says Coming soon.
- `npm run build` stays green throughout.

## Checklist record

| Item | Status | Note |
|---|---|---|
| 1.1 Trigger | [x] | Content gap for Story 3.2, raised before Epic 3 started |
| 1.2 Problem | [x] | Strategic resequencing, driven by content readiness |
| 1.3 Evidence | [x] | `epics.md` marks Story 3.2 BLOCKED. Sprinkle confirmed all Epic 4 material is available (2026-10-25) |
| 2.1 Current epic | [N/A] | Epic 2 is complete |
| 2.2 Epic changes | [x] | Build order only, plus Story 4.6 |
| 2.3 Future epics | [x] | Stories 3.1, 4.1, 4.3, 4.4 and 4.5 amended |
| 2.4 Obsolete or new epics | [x] | None obsolete, none new |
| 2.5 Order | [x] | Epic 4 before Epic 3 |
| 3.1 PRD | [x] | §14.3 item 6 only |
| 3.2 Architecture | [N/A] | No conflict |
| 3.3 UX | [x] | No conflict. Video decision deferred to Story 4.1 |
| 3.4 Other | [x] | `sprint-status.yaml` and retro action items |
| 4.x Path | [x] | Direct adjustment |
| 5.x Proposal | [x] | This document |
| 6.1–6.2 Review | [x] | |
| 6.3 Approval | [x] | Approved 2026-10-25 |
| 6.4 sprint-status | [x] | Applied |
| 6.5 Handoff | [x] | Developer via bmad-build, starting Story 4.1 |
