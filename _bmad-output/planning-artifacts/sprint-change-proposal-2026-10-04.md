---
title: Sprint Change Proposal — UX-027 headshot and spine version sync
date: 2026-10-04
trigger: UX-027 (commit 66e7a9c) — EXPERIENCE.md v0.10 §6.2
scope: Minor
mode: Batch
status: approved
branch: claude/docs-spine-version-sync-bc0efe
reviewed_against: origin/main 854766f
---

> **Re-review (2026-10-04, against `main` @ `854766f`).** UX-027 was squash-merged to `main`
> as #19, and its `EXPERIENCE.md` v0.10 and `mockups/key-homepage.html` are byte-identical
> to this branch. Story 1.2 (#18) also landed. It touched only code, `AGENTS.md`,
> `deferred-work.md`, and `sprint-status.yaml` (1.2 → `review`). It did not touch `PRD.md`,
> `SPEC.md`, `ARCHITECTURE-SPINE.md`, `epics.md`, `DESIGN.md`, or `EXPERIENCE.md`, so every
> line reference and OLD text below still matches. Its frontmatter implementation is
> consistent with AD-2, AD-20, and Conventions, and it introduces no new drift. Story 1.6 is
> still `backlog`. `main` has been merged into this branch, and no proposal edit changed.

# Sprint Change Proposal — UX-027 headshot and spine version sync

## 1. Issue Summary

**Trigger.** UX-027 (commit `66e7a9c`) moved `EXPERIENCE.md` from v0.9 to v0.10. §6.2 now
places the existing headshot (`asprinkleofcode/src/assets/alisha-sprinkle-korba-headshot.jpg`)
in the Recognition block. It is a rounded-rectangle portrait with the default radius and a
`border.default` edge. On desktop it sits to the right of the name / title / positioning
statement; on mobile it stacks below that text, so name and title are still read first. It
carries meaningful alt text (the name), not an empty `alt`.

**Type.** A new UX decision, plus citation drift that had built up across earlier spine bumps.

**Problem.** Downstream documents cite three or four different spine versions, and none of
them knows about the headshot. Story 1.6, which builds the Recognition block, would ship
without it.

**Evidence (current citations):**

| Document | Cites DESIGN | Cites EXPERIENCE | Cites PRD |
|---|---|---|---|
| `PRD.md` (v0.8) | v0.6 ×3 | v0.8 (live pointers ×5, historical ×4) | — |
| `specs/spec-portfolio/SPEC.md` | v0.6 | v0.8 ×3 | — |
| `architecture/ARCHITECTURE-SPINE.md` | v0.7 ✓ | v0.9 ×5 | **v0.7** — PRD is v0.8 |
| `epics.md` | v0.7 ✓ | v0.9 (overview), v0.8 (FR-15, UX-DR27, UX-DR28) | v0.8 ✓ |

Current versions: `PRD.md` v0.8 · `DESIGN.md` v0.7 · `EXPERIENCE.md` v0.10.

## 2. Impact Analysis

### Epic impact

- **Epic 1 only**, through **Story 1.6 Homepage Recognition & Discoverability**. Story 1.6 is
  `backlog` in `sprint-status.yaml`, so no built work is affected. Stories 1.1 and 1.2 are in
  `review` and do not touch the Recognition surface.
- Epics 2–4: no impact.
- No epics or stories are added, removed, renumbered, or resequenced. `sprint-status.yaml`
  is unchanged.

### Artifact conflicts

- **PRD.** No requirement changes. The headshot is a UX-owned layout decision inside the
  Recognition surface. A-11 already records that a headshot exists, and A-10 / D-25 still
  hold. Live citations go stale; historical "resolved by" records do not.
- **SPEC.** Live citations are stale. The homepage constraint lists Recognition contents
  without the headshot.
- **Architecture.** Live citations are stale, and the `binds:` list names PRD v0.7. No new
  architecture decision is needed. The existing Conventions → Images row (explicit
  `width`/`height`, `webp`/`avif`, never modify existing media) and AD-15 (descriptive `alt`)
  already cover a headshot. Note: the image is above the fold, so it must **not** be
  `loading="lazy"`, and it is a likely LCP element under the < 2.5 s homepage LCP target.
  That is captured in the Story 1.6 AC, not as a new AD.
- **Epics.** The overview, FR-15, UX-DR27, and UX-DR28 citations are stale. UX-DR28 and
  Story 1.6 do not mention the headshot. The overview gives the ARCHITECTURE-SPINE date
  as 2026-09-13; it is 2026-10-04.
- **UX (flag only, not edited here).** `EXPERIENCE.md` header says
  "Upstream: `PRD.md` v0.4". `DESIGN.md` says "Consumed by: `PRD.md` v0.4 and
  `EXPERIENCE.md` v0.6 both cite this document at v0.4; `ARCHITECTURE-SPINE.md` binds it
  at v0.4". The `EXPERIENCE.md` §24 v0.9 note still says downstream staleness is "flagged
  for their owning skills"; this proposal clears it. These belong to `bmad-ux`.

### Technical impact

- No code changes in this proposal. When Story 1.6 is built, it reuses the existing headshot
  file. Any `webp`/`avif` derivative is a **new** asset; the original is never modified or
  replaced (AGENTS.md).
- The current `pages/AboutMe/Primary.jsx` already imports the headshot. That is legacy
  `.jsx`, and Story 1.6 builds the new Recognition surface in `.tsx`.

## 3. Recommended Approach

**Option 1 — Direct Adjustment.**

- Refresh the live citations in PRD, SPEC, ARCHITECTURE-SPINE, and epics.
- Record the headshot in SPEC, UX-DR28, and Story 1.6.

**Versioning rule.**

- **Live pointers** are text saying where the current contract lives ("see",
  "is decided in", "binds", "is authoritative"). They move to the current versions:
  `DESIGN.md` v0.7, `EXPERIENCE.md` v0.10, `PRD.md` v0.8.
- **Historical records** keep their original version. These are PRD §14.1 "In v0.5"
  rows and the A-9 / A-10 "Status: Resolved — v0.8" lines.
- **PRD** keeps v0.8, because no requirement changed. Its `updated` date becomes 2026-10-04.

**Rejected options.**

- Rollback (Option 2): nothing implemented needs undoing.
- MVP Review (Option 3): MVP scope is unchanged.

**Effort, risk, and timeline.** Effort is low (documentation only, about 25 line edits).
Risk is low. There is no timeline impact.

## 4. Detailed Change Proposals

### 4.1 PRD — `_bmad-output/PRD.md`

**Frontmatter**

```
OLD: updated: 2026-09-13
NEW: updated: 2026-10-04
```

**Header (line 18)**

```
OLD: **Companion UX contracts:** `DESIGN.md` v0.6 (visual), `EXPERIENCE.md` v0.8 (experience) — both final
NEW: **Companion UX contracts:** `DESIGN.md` v0.7 (visual), `EXPERIENCE.md` v0.10 (experience) — both final
```

**§1 Document Purpose (lines 26, 37, 38)**

```
OLD: The PRD builds on the finalized UX spines (`DESIGN.md` v0.6, `EXPERIENCE.md` v0.8) …
NEW: The PRD builds on the finalized UX spines (`DESIGN.md` v0.7, `EXPERIENCE.md` v0.10) …

OLD: - Final visual design or design tokens — see `DESIGN.md` v0.6.
     - Final navigation structure and layout — see `EXPERIENCE.md` v0.8.
NEW: - Final visual design or design tokens — see `DESIGN.md` v0.7.
     - Final navigation structure and layout — see `EXPERIENCE.md` v0.10.
```

**Exploration paths (line 443)**

```
OLD: `EXPERIENCE.md` v0.8 §5.2 (A-9, UX-015).
NEW: `EXPERIENCE.md` v0.10 §5.2 (A-9, UX-015).
```

**Homepage allocation (line 554)**

```
OLD: … is decided in `EXPERIENCE.md` v0.8 §6.1–§6.5 (A-10, UX-025).
NEW: … is decided in `EXPERIENCE.md` v0.10 §6.1–§6.5 (A-10, UX-025).
```

**D-19 UX contracts (lines 1201–1203)**

```
OLD: The visual design contract is `DESIGN.md` v0.6 (…). The experience contract is `EXPERIENCE.md` v0.8.
NEW: The visual design contract is `DESIGN.md` v0.7 (…). The experience contract is `EXPERIENCE.md` v0.10.
```

**D-25 positioning statement (line 1258)**

```
OLD: The one-line positioning statement in the Recognition surface (`EXPERIENCE.md` v0.8
     §6.2), …
NEW: The one-line positioning statement in the Recognition surface (`EXPERIENCE.md` v0.10
     §6.2), …
```

**Unchanged (historical records):** §14.1 "In v0.5" table rows (lines 957–958) and the
A-9 / A-10 "Status: Resolved — `EXPERIENCE.md` v0.8 …" lines (1052, 1063).

*Rationale:* the live pointers name the current contracts. No requirement or MVP scope
changes.

### 4.2 SPEC — `_bmad-output/specs/spec-portfolio/SPEC.md`

**Homepage constraint (line 86)**

```
OLD: … It stacks three sections in order — Recognition (identity, title, and the one-line
     positioning statement below, D-25), Exploration … (C-6, PRD A-10 resolved,
     `EXPERIENCE.md` v0.8 §6.1–§6.5, UX-025)
NEW: … It stacks three sections in order — Recognition (identity, title, the one-line
     positioning statement below, D-25, and Alisha's existing headshot beside the text on
     desktop and below it on mobile, UX-027), Exploration … (C-6, PRD A-10 resolved,
     `EXPERIENCE.md` v0.10 §6.1–§6.5, UX-025, UX-027)
```

**Navigation constraint (line 93)**

```
OLD: … (PRD A-9, resolved; `EXPERIENCE.md` v0.8 §5.2, UX-015).
NEW: … (PRD A-9, resolved; `EXPERIENCE.md` v0.10 §5.2, UX-015).
```

**Authority constraint (line 94)**

```
OLD: - **`DESIGN.md` v0.6 and `EXPERIENCE.md` v0.8 are authoritative** …
NEW: - **`DESIGN.md` v0.7 and `EXPERIENCE.md` v0.10 are authoritative** …
```

*Rationale:* SPEC is the canonical build contract and already lists Recognition's contents,
so it has to include the headshot.

### 4.3 Architecture — `_bmad-output/architecture/ARCHITECTURE-SPINE.md`

**Frontmatter `binds:` (lines 12, 14)**

```
OLD:   - PRD.md v0.7 (FR-1..FR-24, NFR-1..NFR-5, C-1..C-6)
       - EXPERIENCE.md v0.9
NEW:   - PRD.md v0.8 (FR-1..FR-24, NFR-1..NFR-5, C-1..C-6)
       - EXPERIENCE.md v0.10
```

**Intro (line 29)**

```
OLD: It augments **PRD.md v0.7** at feature altitude. `DESIGN.md v0.7` and `EXPERIENCE.md v0.9` remain authoritative …
NEW: It augments **PRD.md v0.8** at feature altitude. `DESIGN.md v0.7` and `EXPERIENCE.md v0.10` remain authoritative …
```

**AD-19 Binds and Rule (lines 180, 182)**

```
OLD: (EXPERIENCE v0.9 §5.2)  /  (EXPERIENCE v0.9 §5.2, UX-015)
NEW: (EXPERIENCE v0.10 §5.2) /  (EXPERIENCE v0.10 §5.2, UX-015)
```

**AD-20 Rule (line 188, two occurrences)**

```
OLD: (EXPERIENCE v0.9 §13 Document Links, UX-026; …)  …  (EXPERIENCE v0.9 §9.3, §14 Missing Content)
NEW: (EXPERIENCE v0.10 §13 Document Links, UX-026; …) …  (EXPERIENCE v0.10 §9.3, §14 Missing Content)
```

**No new AD.** `updated:` already reads 2026-10-04.

*Rationale:* the binds now match the current PRD and EXPERIENCE versions. The headshot fits
inside the existing Images convention and AD-15.

### 4.4 Epics — `_bmad-output/epics.md`

**Overview (line 20)**

```
OLD: … the UX design contract (`DESIGN.md` v0.7 + `EXPERIENCE.md` v0.9), `ARCHITECTURE-SPINE.md` (updated 2026-09-13), …
NEW: … the UX design contract (`DESIGN.md` v0.7 + `EXPERIENCE.md` v0.10), `ARCHITECTURE-SPINE.md` (updated 2026-10-04), …
```

**New update note (after line 24)**

```
NEW: **Update note (2026-10-04, UX-027):** `EXPERIENCE.md` v0.10 §6.2 adds the existing
     headshot to the Recognition block (beside the text on desktop, below it on mobile).
     UX-DR28 and Story 1.6 pick this up. All live spine citations in this file, `PRD.md`,
     `SPEC.md`, and `ARCHITECTURE-SPINE.md` now point at `DESIGN.md` v0.7 /
     `EXPERIENCE.md` v0.10 / `PRD.md` v0.8 (sprint-change-proposal-2026-10-04). No epics or
     stories were added, removed, or renumbered.
```

**FR-15 (line 58)**

```
OLD: … (C-6, A-10 — resolved by `EXPERIENCE.md` v0.8 §6.1–§6.5, UX-025).
NEW: … (C-6, A-10 — resolved by `EXPERIENCE.md` v0.10 §6.1–§6.5, UX-025).
```

**UX-DR27 (line 170)**

```
OLD: - UX-DR27: Navigation structure — **RESOLVED (`EXPERIENCE.md` v0.8 §5.2, UX-015):** …
NEW: - UX-DR27: Navigation structure — **RESOLVED (`EXPERIENCE.md` v0.10 §5.2, UX-015):** …
```

**UX-DR28 (line 171)**

```
OLD: - UX-DR28: Homepage composition — **RESOLVED (`EXPERIENCE.md` v0.8 §6.1–§6.5, UX-025):**
     three stacked sections in order — Recognition (identity, title, and the decided
     one-line positioning statement, D-25: *"…"*) → Exploration …
NEW: - UX-DR28: Homepage composition — **RESOLVED (`EXPERIENCE.md` v0.10 §6.1–§6.5, UX-025,
     UX-027):** three stacked sections in order — Recognition (identity, title, the decided
     one-line positioning statement, D-25: *"…"*, and the existing headshot as a
     rounded-rectangle portrait with a `border.default` edge — right of the text on desktop,
     stacked below it on mobile — with meaningful alt text) → Exploration …
```

**Story 1.6 — Acceptance Criteria (insert after the first Given/When/Then block)**

```
NEW:
**Given** UX-DR28 and `EXPERIENCE.md` §6.2 (UX-027)
**When** a visitor views the Recognition section
**Then** the existing headshot (`src/assets/alisha-sprinkle-korba-headshot.jpg`) appears as
a rounded-rectangle portrait (default radius, `border.default` edge) to the right of the
name / title / positioning statement on desktop, and stacked below that text on mobile, so
the name and title are read first at every width

**And** the headshot has meaningful alt text naming Alisha (not an empty `alt`), explicit
`width`/`height`, and no `loading="lazy"`, since it is above the fold (AD-15, Conventions →
Images); any `webp`/`avif` derivative is added as a new asset and the original file is
never modified or replaced (AGENTS.md)
```

*Rationale:* Story 1.6 owns the Recognition block, so the headshot has to be in its ACs or
it won't be built. The lazy-loading note stops a homepage LCP regression.

**Not changed:** UX-DR6 (the Hero role is still accurate), Story 1.7, `sprint-status.yaml`.
Adding `image` to the `Person` JSON-LD / `og:image` was considered but is **not** proposed.
UX-027 does not ask for it, and it would be new scope for AD-14.

### 4.5 UX — flagged for `bmad-ux`, not edited here

- `EXPERIENCE.md` header: "Upstream: `PRD.md` v0.4" → should read v0.8.
- `DESIGN.md` header: the "Consumed by" line still describes v0.4-era consumers.
- `EXPERIENCE.md` §24: the v0.7 and v0.9 notes describe downstream staleness that this
  change clears.

## 5. Implementation Handoff

**Scope: Minor.** The Developer agent implements this directly on branch
`claude/docs-spine-version-sync-bc0efe`, then opens a PR to `main`. The branch already
contains `main` @ `854766f`. Because UX-027 is already on `main` via #19, the PR diff will
contain only this proposal and edits 4.1–4.4.

**Responsibilities**

- **Developer agent:** apply edits 4.1–4.4 exactly; commit; open the PR.
- **`bmad-ux` (follow-up, optional):** clear the items in 4.5 at the next UX pass.

**Success criteria**

- `grep` across PRD, SPEC, ARCHITECTURE-SPINE, and epics finds no live pointer to
  `DESIGN.md` v0.6 or `EXPERIENCE.md` v0.8 / v0.9. The only hits are the four historical
  PRD records listed in 4.1.
- ARCHITECTURE-SPINE `binds:` reads PRD v0.8 / DESIGN v0.7 / EXPERIENCE v0.10.
- UX-DR28, SPEC line 86, and Story 1.6 all describe the headshot consistently with
  `EXPERIENCE.md` §6.2.
- No files under `asprinkleofcode/` change, and no media is touched.
