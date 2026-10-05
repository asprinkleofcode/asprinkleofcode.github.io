---
title: 'Story 1.6: Recognition color and positioning (UX-030)'
type: 'feature'
created: '2026-10-04'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** UX-030 (DESIGN v0.9 §7a, §9; EXPERIENCE v0.13 §6.2; Story 1.6 AC in `epics.md`) changed the Recognition look after Story 1.6 was built. The built block has a rose name and a white title, 64px vertical padding, and centred text and headshot on mobile. The new criteria call for:
- a white name and a rose title, ~10px below the name;
- the positioning line wrapping at ~34ch;
- ~88/72px vertical space on desktop and ~56/48px on mobile;
- text and headshot left-aligned on mobile.

**Approach:** Update `asprinkleofcode/src/components/Recognition/Recognition.tsx` and its tests:
- **Colours and spacing:** name `text-text-primary`, title `text-brand-primary` ~10px below the name, positioning line `max-w-[34ch]`.
- **Padding:** `pt-14 pb-12` on mobile, ~88/72px from `md` up.
- **Mobile alignment:** `items-start text-left`; desktop keeps the headshot to the right.

Keep using `type-identity`, `type-title` and `type-body`. The larger level 1 and 2 sizes, weight 600 and line-height ~1.05 are global type-scale values that Story 1.8 sets in `src/theme/theme.css`, per the UX-030 sprint change proposal. This story does not edit `theme.css`, and the size part of the AC is checked visually once Story 1.8 lands on this branch. The headshot (4:5, centre crop, `w-48 md:w-64`), the identity strings, `index.html` and the drift tests are unchanged.

</frozen-after-approval>

## Implementation Notes

- Changed only `asprinkleofcode/src/components/Recognition/Recognition.tsx` and its test. Section: `items-start gap-6 pt-14 pb-12`, from `md` up `items-center justify-between gap-10 pt-22 pb-18` (56/48 → 88/72px; 40px gap as in the mockup). Text block always `text-left`. Name `text-text-primary`; title `text-brand-primary mt-2.5` (10px); positioning `max-w-[34ch] mt-5.5` (22px, the mockup's gap; the AC is silent on it).
- Tailwind v4 dynamic spacing (`pt-22`, `pb-18`, `mt-5.5`) confirmed in the built CSS.
- Browser check on `vite preview`: 375px gives 56/48px padding, h1 white at x=16, title rose 10px below, headshot 192×240 at x=16 (left-aligned). 1280px gives 88/72px padding, 40px gap, headshot 256×320 right of the text. h1 is still 24px / 32.8px until Story 1.8 changes `type-identity`/`type-title` in `theme.css`.
- `npm run build`: 149 tests pass.
- This spec carries the UX-030 deltas for Story 1.6. It supersedes the Recognition colour, spacing and mobile-alignment details in `spec-1-6-homepage-recognition-discoverability.md`; everything else in that spec still stands.
- Two mockup values are deliberately not matched, because neither the AC nor DESIGN asks for them: the positioning line keeps `type-body`'s 1.625 line-height (mockup 1.55), and the mobile gutter stays the site-wide `px-4` (16px; mockup 20px).
- Review patch: `Recognition.css` now also reverts `font-weight`, so the type scale owns the h1 weight rather than `App.css`'s legacy `h1 { font-weight: 700 }`.

## Review Triage Log

Blind Hunter:

| # | Finding | Verdict | Evidence / route |
|---|---|---|---|
| 1 | Substring class checks let `md:` variants pass the mobile assertions | low | Confirmed (`md:text-left` contains `text-left`). Patch: assertions now use exact class tokens |
| 2 | Desktop layout and the `gap-6`/`mt-5.5` spacing are untested | low | Confirmed. Patch: added the `md:flex-row`/`items-center`/`justify-between`/`gap-10` test, plus `gap-6` and `mt-5.5` assertions |
| 3 | Deferred level 1/2 size check (and the spacing utilities) tracked nowhere | medium | Confirmed. jsdom can't see CSS, and nothing ties the 1.6 size AC to Story 1.8. Defer: `deferred-work.md` entry for a browser check after Story 1.8 |
| 4 | Frozen Approach conflates level 1/2 weight and line-height | false | Story 1.8 builds from its own AC in `epics.md`, which states `type-identity` 700 / ~1.05 and `type-title` 600 explicitly; this spec does not drive 1.8 |
| 5 | `Recognition.css` doesn't revert `font-weight` | low | Confirmed latent: `App.css` `h1 { font-weight: 700 }` would mask a level-1 weight change. Patch: added `font-weight: revert-layer` |
| 6 | Two Story 1.6 specs whose state disagrees | low | The old spec is the done baseline; this spec is the delta. Resolved by the supersedes note above; editing the old spec would rewrite a finished record |
| 7 | Problem statement says "64px" where mobile was 48px | low | Cosmetic, inside the frozen block, no build impact. Rejected |
| 8 | Mockup line-height 1.55 and 20px gutter not matched or noted | low | Not in the AC or DESIGN. Recorded as deliberate in Implementation Notes; no code change |
