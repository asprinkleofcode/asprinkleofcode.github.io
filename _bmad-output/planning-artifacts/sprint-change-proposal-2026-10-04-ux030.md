---
title: Sprint Change Proposal — UX-030 homepage look matched to the mockup
date: 2026-10-04
trigger: UX-030 (commit 4c36880) — DESIGN.md v0.9, EXPERIENCE.md v0.13
scope: Moderate
mode: Incremental
status: approved
branch: claude/bmad-build-user-story-1-6-9a603e
---

# Sprint Change Proposal — UX-030 homepage look matched to the mockup

## 1. Issue Summary

**Trigger.** UX-030 (commit `4c36880`, on the Story 1.6 branch) moved `DESIGN.md` to v0.9
and `EXPERIENCE.md` to v0.13. While reviewing Story 1.6, the owner compared the built
homepage with `mockups/key-homepage.html`, preferred the mockup's cleaner look, and chose
it. The decisions are as follows:

- **Page background:** navy `background.primary`. The legacy grey is retired.
- **Ambient layer:** sparse tiny stars that twinkle slowly. They replace the Story 1.5 pink bokeh.
- **Recognition colors:** the name is white and the title rose (`DESIGN.md` §7a amended).
- **Type sizes:** larger identity and title sizes on the global type scale.
- **Header:** the brand text "Alisha Korba" is white at ~1rem bold, and inactive nav links use `text.secondary`.
- **Footer:** sits on `background.recessed` with a stronger inset shadow.
- **Recognition layout:** the mockup's spacing, with text and headshot left-aligned on mobile.

**Type.** A new stakeholder requirement: the owner chose a different look after seeing the
build.

**Problem.** The live site (Stories 1.4 and 1.5) and the unmerged Story 1.6 code no longer
match the spines. The downstream documents still cite DESIGN v0.8 and EXPERIENCE
v0.11 / v0.12, and three of them still say the ambient treatment is undecided.

**Evidence.**

- `sally-mockup-vs-site-differences.md` (owner's desktop) measured each difference between
  the mockup and the production build at 1280px and 375px.
- `.working/homepage-color-compare.html` shows four options side by side: A (as built),
  B (mockup), C (mockup with quieter bokeh) and D (mockup with twinkling stars). The owner
  picked D.

## 2. Impact Analysis

### Epic impact

- **Epic 1 only.** It can still be completed with one story added. No epic is added,
  removed or resequenced.
  - **Stories 1.4 and 1.5** are done and live. Their behavior and contracts still hold, but
    their look has been revised. They stay `done`, and the visual deltas move to new
    Story 1.8.
  - **Story 1.6** is in review and unmerged. It gains its Recognition deltas and goes back
    to `in-progress`.
  - **Story 1.7** is in backlog. It is built after Story 1.8 so that the Exploration and
    Highlights sections land on the final surface.
- **Epics 2–4:** no change. Story pages pick up the larger global level 1 and 2 sizes
  automatically.

### Artifact conflicts

| Artifact | Conflict | Change |
|---|---|---|
| `PRD.md` | Live citations cite DESIGN v0.8 / EXPERIENCE v0.11. D-20 says the ambient effect is deferred | Bump citations; D-20 records the UX-030 decision. No requirement or MVP change |
| `ARCHITECTURE-SPINE.md` | Binds DESIGN v0.8 / EXPERIENCE v0.12. AD-12 and the Deferred table say the treatment is deferred | Bump bindings and pointers; AD-12 records the treatment; remove the Deferred row. No new AD |
| `SPEC.md` | Live citations are stale; the ambient open question is still open | Bump citations; mark the question resolved |
| `epics.md` | Overview, UX-DR19/20/22/27/28 and Story 1.6 predate UX-030 | Update note, UX-DR updates, Story 1.6 AC, new Story 1.8 |
| `sprint-status.yaml` | No entry for Story 1.8; Story 1.6 is in `review` | Add `1-8-…: backlog`; set 1.6 to `in-progress` |
| UX | Done in commit `4c36880`. `mockups/key-header.html` predates v0.13 | No edit here; EXPERIENCE §5.2 already points to `key-homepage.html` as current |

### Technical impact (for the build; not edited by this proposal)

- `src/App.css`: `body` uses `--color-dark-600`, a primitive ramp token, which already
  breaks AD-10. Switch it to `--background-primary`.
- `src/components/AmbientLayer/`: bokeh → stars. `AmbientLayer.test.tsx` asserts 28 dots
  and seeded positions, so it needs new expectations. Keep the AD-12 contract tests.
- `src/theme/theme.css`: new `type-identity` and `type-title` values.
- Header: brand text color and size (decouple it from `type-title`), and inactive nav color
  (theme object or `Header.css`).
- Footer: the `footer.root.base` theme classes switch to recessed, with a border-top and the inset shadow.
- `src/components/Recognition/`: color, spacing and mobile alignment, plus tests.
- No dependency, routing, deployment or CI impact.

## 3. Recommended Approach

**Direct Adjustment (Option 1).** Add the deltas to Story 1.6's acceptance criteria and
put the site-wide deltas in a new Story 1.8. Build both on the Story 1.6 branch and ship
them in one PR.

- **Why:**
  - Story 1.6 is unmerged, so fixing it now costs less than shipping it and correcting it
    later.
  - The site-wide work cuts across two stories that are already done. One new story keeps
    them closed and gives the work its own record.
  - A single PR shows the homepage as it is meant to look.
- **Rejected:**
  - Reopening Stories 1.4 and 1.5 would mean three PRs and reopening merged work.
  - Folding everything into Story 1.6 would stretch it well beyond "Recognition &
    Discoverability".
  - Rollback gains nothing, because the AD-12 contract survives.
  - An MVP review doesn't apply.
- **Effort:** low to medium (CSS, theme, one component rewrite, test updates).
- **Risk:** low. Watch contrast on the recessed footer and the larger type at narrow widths.
- **Timeline:** about one story's worth of work, added before Story 1.7.

## 4. Detailed Change Proposals (all approved incrementally)

### Stories (`epics.md`)

**P1 — Story 1.6, Acceptance Criteria.** Add after the headshot criteria:

```
**Given** `DESIGN.md` v0.9 §7a, §8, §9 and `EXPERIENCE.md` v0.13 §6.2 (UX-030)
**When** a visitor views the Recognition section
**Then** the name is `text.primary` at type level 1 (~3rem desktop / ~2.1rem mobile, weight 700,
line-height ~1.05), the title is `brand.primary` at level 2 (~1.35rem / ~1.1rem, weight 600,
~10px below the name), and the positioning line is body size (`1rem`, `text.secondary`,
wrapping at ~34ch)
**And** the section has ~88px above / ~72px below on desktop and ~56px / ~48px on mobile
**And** on mobile the text block and the headshot (4:5, centre crop, ~192×240) are both
left-aligned, not centred
```

Status: `review` → `in-progress`. The story spec file (`spec-1-6-…`) picks up these deltas
when `bmad-build` resumes the story.

**P2 — New Story 1.8**, placed after Story 1.7 with a sequencing note:

```
### Story 1.8: Visual Alignment to the Homepage Mockup (UX-030)

**Sequencing:** built before Story 1.7, together with Story 1.6 on its branch, so the
Exploration and Highlights sections are built on the final surface. Revises the look
delivered by Stories 1.4 and 1.5; their behavior and contracts are unchanged.

As a visitor on any page of the portfolio,
I want the clean navy look of the approved homepage mockup,
So that the site feels calm and polished, with personality that stays in the background.

**Acceptance Criteria:**

**Given** `DESIGN.md` v0.9 §7 (UX-030)
**When** any route renders
**Then** the page background is `background.primary` via its role token; the legacy grey
(`--color-dark-600` on `body`) is gone and no primitive ramp token is used for it (AD-10)

**Given** `DESIGN.md` v0.9 §16 (UX-030)
**When** the ambient layer renders
**Then** it shows sparse ~1px stars (a few at 1.5px), mostly `text.primary` with a few
`accent.secondary` and `brand.primary`, each twinkling slowly on its own phase (opacity
~0.25 → 0.8 over ~5s) with no drift and no glow; the pink bokeh is removed
**And** under reduced motion the same field renders static at a fixed faint opacity (AD-13, NFR-5)
**And** the AD-12 contract still holds: one mount in the shell, `aria-hidden`,
`pointer-events: none`, below all content, and the app works if the layer never mounts

**Given** `DESIGN.md` v0.9 §6 and §7a (UX-030)
**When** the header renders
**Then** the brand text reads "Alisha Korba" in `text.primary` at ~1rem, weight 700,
tracking ~0.02em, independent of `type-title`; the cupcake mark stays `brand.primary`;
inactive nav links are `text.secondary` and the active link is `brand.primary`

**Given** `DESIGN.md` v0.9 §15 (UX-030)
**When** the footer renders
**Then** it sits on `background.recessed` with a 1px `border.default` top edge and an inset
shadow of `inset 0 2px 6px rgb(0 0 0 / 0.5)`; the UX-028 icon row, its order, accessible
names and woodcraft hover are unchanged

**Given** `DESIGN.md` v0.9 §8 (UX-030)
**When** any page uses type level 1 or 2
**Then** `type-identity` reaches ~3rem desktop / ~2.1rem mobile (weight 700, line-height
~1.05) and `type-title` ~1.35rem / ~1.1rem (weight 600); `type-body` stays 1rem

**And** text on every changed surface keeps WCAG 2.2 AA contrast, and the solid
`focus.ring` still shows on every interactive element (UX-DR2, UX-DR26)
```

`sprint-status.yaml`: add `1-8-visual-alignment-to-homepage-mockup: backlog` after Story 1.7.

**P3 — Requirements inventory and overview.**

- **Overview:** DESIGN v0.8 + EXPERIENCE v0.11 → v0.9 + v0.13, plus a UX-030 update note.
- **UX-DR19:** add the treatment: sparse tiny stars tinted with role tokens, twinkling
  slowly, static under reduced motion.
- **UX-DR20, level 1:** ~3rem desktop / ~2.1rem mobile, weight 700, line-height ~1.05,
  tracking-wide, `text.primary`.
- **UX-DR20, level 2:** ~1.35rem / ~1.1rem, weight 600, `brand.primary`.
- **UX-DR20, header brand:** add a note that the header brand text is not a scale level.
- **UX-DR22:** the footer sits on `background.recessed` with a `border.default` top edge
  and `inset 0 2px 6px rgb(0 0 0 / 0.5)`.
- **UX-DR27 / UX-DR28:** cite EXPERIENCE v0.13. UX-DR28 adds that text and headshot are
  left-aligned on mobile.

### PRD (`PRD.md`) — P4

- **Live citations:**
  - DESIGN v0.8 → v0.9 on lines 18, 26 and 37.
  - EXPERIENCE v0.11 → v0.13 on lines 18, 26, 38, 443 and 554.
  - Historical "Resolved by" records stay as they are.
- **D-19:** v0.8 / v0.11 → v0.9 / v0.13.
- **D-20:** retitled "Ambient effect", recording the UX-030 decision. Its constraints are
  unchanged.
- **MVP impact:** none.

### Architecture (`ARCHITECTURE-SPINE.md`) — P5

- **Bindings and live pointers:** DESIGN v0.8 → v0.9 and EXPERIENCE v0.11 / v0.12 → v0.13,
  on lines 13, 14, 29, 180, 182, 188, 202, 203 and 336.
- **AD-12:** the "treatment itself is deferred" sentence becomes a statement of the UX-030
  treatment. The contract is unchanged.
- **Deferred table:** remove the "Ambient-layer treatment" row.

### SPEC (`specs/spec-portfolio/SPEC.md`) — P6

- **Citations:** EXPERIENCE v0.11 → v0.13 and DESIGN v0.8 → v0.9 on lines 86, 93 and 94.
  Line 128 is historical and stays.
- **Ambient open question:** struck through and marked resolved (UX-030, DESIGN v0.9 §16,
  PRD D-20).

### UI/UX

No edits needed here; commit `4c36880` already made them.

### Applied addendum

While applying the proposals, two more live pointers turned up that the line lists missed.
Both get the same citation bump, so no new decision is involved:

- `PRD.md` D-25 (line 1264): `EXPERIENCE.md` v0.11 §6.2 → v0.13.
- `epics.md` FR-15 (line 66): "resolved by `EXPERIENCE.md` v0.11" → v0.13.
- `implementation-artifacts/epic-1-context.md`, the compiled context `bmad-build` reads:
  added Story 1.8 to the story list, and added the UX-030 look to its ambient layer,
  header, footer, Recognition and dependency notes, so the build follows P1 and P2.

The remaining v0.8 / v0.11 / v0.12 mentions are records of when something was decided or
resolved (update notes, "Resolved by …" rows, UX-029 provenance), and they stay as they are.

## 5. Implementation Handoff

**Approved** by Alisha on 2026-10-04 (incremental mode; P1–P6 each approved). The edits
were applied on the Story 1.6 branch.


**Scope: Moderate.** Backlog change (a new story and a status change), document updates,
then development.

| Role | Responsibility |
|---|---|
| Correct Course (this run) | Apply P1–P6 and the `sprint-status.yaml` changes on the Story 1.6 branch |
| Developer (`bmad-build`) | Resume Story 1.6 with the P1 deltas, then build Story 1.8 on the same branch; update `spec-1-6-…` and create `spec-1-8-…` |
| Owner (Alisha) | Visual sign-off against `mockups/key-homepage.html`, then open and merge one PR for Stories 1.6 and 1.8 |
| UX (`bmad-ux`, later) | Optional: refresh `mockups/key-header.html` to v0.13 |

**Success criteria.**

- At 1280px and 375px, the homepage matches `key-homepage.html`: navy background,
  twinkling stars, white name and rose title at the new sizes, white header brand, muted
  nav, recessed footer, and a left-aligned mobile Recognition.
- Under reduced motion, the stars render static.
- No primitive ramp token or raw hex appears in UI code (AD-10).
- `npm run typecheck`, `lint`, `test` and `build` all pass.
- WCAG 2.2 AA contrast holds on every changed surface.
- No downstream document cites DESIGN v0.8 or EXPERIENCE v0.11 / v0.12 in a live pointer.
