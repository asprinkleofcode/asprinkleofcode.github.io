---
name: Alisha Sprinkle Korba Portfolio
description: Visual and interaction design contract for the Alisha Sprinkle Korba professional portfolio.
status: final
version: 0.9
updated: 2026-10-04
mode: dark-only
colors:
  background: { primary: "#1E1E2F", secondary: "#2B2B3B", recessed: "#0F0F15" }
  text: { primary: "#F8F8FA", secondary: "#9C9CBA", inverse: "#1E1E2F" }
  border: { default: "#3A3A4D", essential: "#85879D" }
  # Fill and focus values below are the §18a-remediated ones (= ARCHITECTURE-SPINE AD-11).
  # primaryFillHover is deliberately absent: §18a (A3) calls for "a darker hover" but does
  # not name a value. It is OPEN — do not invent one.
  brand: { primary: "#E48FB1", primaryFill: "#A73E6C" }
  accent: { secondary: "#93A4F6", secondaryFill: "#4F63D8" }
  focus: { ring: "#E48FB1", style: "solid", width: "2px", offset: "2px", glowAlpha: 0.3 }
  status: { success: "#4FCF7F", error: "#F87171", warning: "#F5B343" }
  # Apricot for the @orangecatwoodcraft footer icon only (UX-028): its hover/focus icon colour (solid) and glow (at alpha). Never body text, fill, or border.
  glow: { woodcraft: "#F5A962", woodcraftAlpha: 0.6 }
  # Pre-contract values these three replaced, kept for reference only (see §18a). Never emit.
  inherited: { brandPrimaryFill: "#C45F87", accentSecondaryFill: "#6F82EE", focusRingAlpha: 0.3 }
typography:
  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
  # v0.9 (UX-030): anchors from the homepage mockup, applied to the global scale (§8).
  identity: { size: "~3rem desktop / ~2.1rem mobile", weight: 700, lineHeight: 1.05, tracking: "0.02em" }
  title: { size: "~1.35rem desktop / ~1.1rem mobile", weight: 600 }
  headerBrand: { size: "~1rem", weight: 700, tracking: "0.02em" }
rounded: { default: "0.5rem", control: "0.375rem", pill: "9999px" }
spacing:
  note: "Existing Tailwind spacing scale; exact values are implementation-level."
components:
  note: "flowbite-react + src/theme/aSprinkleOfCodeTheme.ts; conceptual roles in body section 11."
---

# DESIGN.md

Name, description, status, version, and date live in the YAML frontmatter above — the single source for this document's metadata.

**Consumed by:** `EXPERIENCE.md` v0.13, `PRD.md` v0.8, `SPEC.md`, and `epics.md` cite this document at v0.9, and `ARCHITECTURE-SPINE.md` binds v0.9. The UX-030 correct-course (2026-10-04) brought them all up to date.

---

## 1. Document Purpose

This document defines the visual and interaction design contract for the portfolio.

It translates product intent into experience-level design decisions that downstream architecture, story, and implementation work can rely on.

This document does **not** define technical architecture, implementation details, final story copy, or content that has not yet been validated.

---

## 2. Decision Authority

Every design statement in this document uses one of these authority levels:

| Level | Meaning |
|---|---|
| **AUTHORITATIVE** | Downstream work may rely on this as the UX contract. |
| **DECIDED** | A UX direction has been established, but implementation may still require normal design interpretation. |
| **HYPOTHESIS** | Proposed direction requiring validation before becoming authoritative. |
| **OPEN** | No decision has been made. Downstream agents must not invent one. |
| **DEFERRED** | Intentionally belongs to Architecture, Stories, or Implementation. |

When an OPEN decision is encountered, downstream agents must preserve the uncertainty rather than silently choosing a value.

**Qualified and split levels.** A level may be narrowed by a parenthetical scope, and one item may carry two levels for two different aspects — for example `OPEN (destination)` or `DECIDED (role) / DEFERRED (treatment)`. Read each level as applying only to the aspect named beside it; the aspect with the weaker level governs what downstream may act on. No level outside this table is valid, qualified or not.

---

## 3. Design North Star

**AUTHORITATIVE**

The portfolio should feel like a representation of a real person rather than a collection of résumé entries.

The visitor should leave thinking:

> “She's clearly a strong engineer, she thinks beyond the code, and now I understand what makes her distinctly Alisha.”

The intended identity is:

> **Alisha is all her things.**

Professional credibility comes first. Personality makes the experience memorable without competing with the professional evidence.

---

## 4. Design Principles

### 4.1 I am all my things

**AUTHORITATIVE**

Professional identity and personal identity should coexist within one coherent experience.

Do not create separate “professional Alisha” and “personal Alisha” personas.

---

### 4.2 Evidence over claims

**AUTHORITATIVE**

Visual hierarchy should make evidence, reasoning, decisions, outcomes, and context more prominent than unsupported adjectives.

---

### 4.3 Professional clarity first

**AUTHORITATIVE**

The first scan must clearly communicate:

**Alisha Sprinkle Korba**  
**Senior Software Engineer**

Personality may enrich the first impression, but must not obscure professional recognition.

---

### 4.4 Summary before depth

**AUTHORITATIVE**

The experience should support:

**Summary → Choose → Deep Story**

Visitors should be able to understand what a story is about before committing to its full depth.

---

### 4.5 Deliberate hybrid

**DECIDED**

The visual and interaction language should combine professional engineering credibility with genuine personal character.

Avoid both extremes:

- sterile résumé site
- novelty-driven personal playground

---

### 4.6 Ambient personality, not decorative noise

**DECIDED**

An ambient layer may provide personality. It is currently the existing star field, and
the exact treatment may be revisited during implementation (§16).

It is not navigation, content, or a required metaphor.

It must never compete with professional evidence or become necessary to understand the experience.

---

### 4.7 Show the thinking, not the secrets

**AUTHORITATIVE**

Professional visual storytelling should communicate:

- problem class
- business context at a safe level
- role
- decisions
- rationale
- tradeoffs
- collaboration
- outcomes
- hindsight

Do not visually imply that confidential implementation details are required to make a story credible.

---

### 4.8 Appropriate engineering investment

**AUTHORITATIVE**

The experience should favor meaningful interaction over interaction for its own sake.

The product explicitly rejects the amount of animation, the number of interactions, the number of pages, and content volume as success measures.

---

## 5. Existing Visual Context

**AUTHORITATIVE**

The existing product uses:

- React
- Tailwind
- Flowbite React
- shared theme tokens
- an existing stars background
- existing portfolio media

The visual redesign should evolve the existing product rather than assume a blank canvas.

---

## 6. Visual Direction

**DECIDED**

The intended impression is:

- competent
- polished
- fun
- outgoing
- confident
- grounded
- distinctly human

The experience should feel cohesive and intentional.

It should not feel:

- quirky for its own sake
- gimmicky
- overly corporate
- visually noisy
- like a technology résumé
- like a game disguised as a portfolio

The PRD explicitly establishes fun, outgoing, confident, and grounded as the desired personality while rejecting quirky or gimmicky treatment.

### Brand Mark

**DECIDED**

The existing cupcake icon (`/cupcake.png`) is the brand mark, used consistently as
both the header logo and the site favicon. It is a personal signature —
"a sprinkle of code" / Alisha *Sprinkle* Korba — not decoration for its own sake, and
it stays small and quiet (icon-sized, beside the name) so it never competes with the
professional scan (§4). This is continuity with existing visual context (§5), not a
new element.

**In-page (header) recolor — DECIDED:** the source asset is solid black line-art on a
transparent background, which is effectively invisible on `background.primary`
(`#1E1E2F`) — this is a contrast defect, not just a style preference. In the header, the
icon recolors to **`brand.primary`** (`#E48FB1`, 6.9:1 on `background.primary`).
`brand.primary` is already the identity token (§7: "identity, links, focus"), so this
keeps the mark's color consistent with the same role it plays for the professional title
and links (§7a). *Implementation note:* a raster PNG can't be recolored with CSS alone — this
needs either an SVG version of the icon or a CSS mask (`mask-image` using the PNG as the
mask, filled with `brand.primary`). Technique is implementation-owned; the token is not.

**Header brand text — DECIDED (v0.9, UX-030):** beside the mark, the header reads
**"Alisha Korba"** in `text.primary`, ~1rem, weight 700, tracking ~0.02em. It is its own
treatment, not a type-scale level, so it does not grow with §8 level 2. The rose lives in
the mark beside it.

**Favicon — DECIDED:** stays the **original, unrecolored** icon. A favicon renders in
browser chrome (tabs, bookmarks, history), a context this product doesn't theme — it is
not tied to `background.primary` and should not be forced into the page's accent color.

---

## 7. Color System

**AUTHORITATIVE**

Mode: **dark only**. Neutrals and the rose brand hue are adopted from the existing
repository theme (`asprinkleofcode/src/theme/colors.css`, `aSprinkleOfCodeTheme.ts`); the
three status colors and the secondary accent are additions tuned to the dark surface. The
two fill tokens and the focus ring carry the **§18a-remediated** values, not the inherited
ones — see §18a for what they replaced and why. Downstream must use these token roles —
not raw hex, and not raw Tailwind grays.

Contrast figures are computed with the WCAG 2.x relative-luminance formula (SC 1.4.3 /
1.4.11) against the stated surface, rounded down to one decimal. Recompute rather than
copy if a value changes.

| Token role | Value | Source | Notes |
|---|---|---|---|
| `background.primary` | `#1E1E2F` | `--color-dark-800` | dominant surface: the page background on every route, under the ambient layer (§16). Replaces the legacy grey `--color-dark-600` on `body`, which is retired (v0.9, UX-030) |
| `background.secondary` | `#2B2B3B` | `--color-dark-700` | hover, secondary button, raised panel |
| `background.recessed` | `#0F0F15` | `--color-dark-900` | deepest sections, such as the footer (§15) |
| `text.primary` | `#F8F8FA` | `--color-dark-50` | 15.4:1 on `background.primary` |
| `text.secondary` | `#9C9CBA` | `--color-dark-300` | 6.2:1 on `background.primary`, 5.2:1 on `background.secondary`; replaces hardcoded `gray-300/400` |
| `text.inverse` | `#1E1E2F` | `--color-dark-800` | text on `brand.primary` / `accent.secondary` fills (6.9:1 on both) |
| `border.default` | `#3A3A4D` | `--color-dark-600` | decorative dividers and non-essential edges only (1.5:1) |
| `border.essential` | `#85879D` | `--color-dark-400` | any boundary that is the sole cue for an interactive element (4.6:1, meets WCAG 1.4.11) |
| `brand.primary` | `#E48FB1` | `--color-primary-400` | identity, links, focus; 6.9:1 on `background.primary` |
| `brand.primaryFill` | `#A73E6C` | `--color-primary-600` | solid button background only; never as text on dark. White label text 5.9:1. Remediated value — replaces the inherited `#C45F87` (3.9:1, fails AA); see §18a (A3) |
| `brand.primaryFillHover` | **OPEN** | — | §18a (A3) calls for a darker hover than the resting fill but names no value. Do not invent one |
| `accent.secondary` | `#93A4F6` | new (periwinkle) | functional emphasis only — see §7a; 6.9:1 on `background.primary` |
| `accent.secondaryFill` | `#4F63D8` | new | solid button background; white label text 5.1:1. Remediated value — replaces the inherited `#6F82EE` (3.4:1, fails AA); see §18a (A4) |
| `focus.ring` | `#E48FB1`, 2 px solid, 2 px offset | §18a (A1) | remediated; replaces the inherited 30%-alpha tint, which may remain only as an extra glow, never the sole cue |
| `status.success` | `#4FCF7F` | new (tuned) | 8.2:1 on `background.primary`; always paired with icon or text |
| `status.error` | `#F87171` | new (tuned) | 5.9:1 on `background.primary`; always paired with icon or text |
| `status.warning` | `#F5B343` | new (tuned) | 8.9:1 on `background.primary`; always paired with icon or text |
| `glow.woodcraft` | `#F5A962` (apricot): solid as the icon colour, 60% alpha as the glow | new (UX-028) | decorative only, @orangecatwoodcraft footer icon only (§15): on hover and keyboard focus the icon turns apricot and glows apricot. Never body text, fill, border, or the sole cue for a state |

Reference: [`mockups/color-secondary-accent.html`](mockups/color-secondary-accent.html)
shows the palette and the rejected accent options on the dark surfaces. It is a record of
the accent comparison and predates the §18a remediation — its fill swatches show the
inherited values.

### 7a. Secondary accent usage rule

**AUTHORITATIVE**

`brand.primary` (rose) is the identity color: the professional title, the brand mark, the
active navigation link, links, the primary call to action, and focus.

The name itself is `text.primary` (white) in both the Recognition block and the header.
Inactive header navigation links are `text.secondary`; only the active link is rose.
*Amended v0.9 (UX-030):* through v0.8, this rule made the name rose. The homepage mockup put
the name in white with a rose title, and the owner chose the mockup.

`accent.secondary` (periwinkle) carries *functional* emphasis only — capability signals,
secondary calls to action, in-page highlights, "explore" affordances. It is **not** a
"personal vs professional" hue; splitting the palette by section would violate §4.1.

### 7b. Non-color communication

**AUTHORITATIVE**

`status.*` colors must never be the only signal. Pair every status use with an icon,
label, or shape change (WCAG 2.2 AA, SC 1.4.1).

### 7c. Light mode

**DEFERRED**

The `--color-primary-50…100` and `--color-dark-50…100` ramps in `colors.css` are unused
by this contract. A light mode is out of scope for this pass; token roles are named
semantically so one remains possible without renaming.

---

## 8. Typography

**DECIDED**

Family: the existing Tailwind **system sans stack** —
`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. No web font is loaded, and
none is added in this pass. Personality comes from copy, layout, and color, not the typeface.

Weights (from repo usage): 400 body, 500 navigation / secondary, 600 headings and
emphasis, 700 identity.

| # | Level | Treatment | Repo anchor |
|---|---|---|---|
| 1 | Identity / name | ~`3rem` desktop, ~`2.1rem` mobile, weight 700, line-height ~1.05, `tracking-wide` (~0.02em), `text.primary` | homepage mockup (v0.9, UX-030) |
| 2 | Professional title | ~`1.35rem` desktop, ~`1.1rem` mobile, weight 600, `brand.primary`, ~10px below identity, sentence case (no all-caps) | homepage mockup (v0.9, UX-030) |
| 3 | Section heading | weight 600, sentence case | new |
| 4 | Story title | weight 600, smaller than section heading | new |
| 5 | Supporting heading | `0.75rem`, weight 600, `uppercase`, `tracking-widest` (~0.14em) | footer title convention |
| 6 | Body | `1rem`, weight 400, comfortable measure for deep stories | `text-base` |
| 7 | Metadata | `0.875rem`, weight 400, `text.secondary` | `text-sm` (use the token, not raw `gray-400`) |

Levels 1 and 2 are **global**: every page that shows the name and title uses these sizes,
not just the homepage (v0.9, UX-030). These are target values; how sizes scale between
mobile and desktop is implementation-level. Exact px sizes and line-heights for
levels 3–4 are implementation-level within this hierarchy. The homepage positioning line
uses level 6 (body, `1rem`) in `text.secondary`. The header brand text is not a scale
level (§6 Header brand text).

Typography must support rapid scanning and readable deep stories. Do not introduce
typography solely to create visual novelty.

---

## 9. Layout and Spacing

**DECIDED**

The layout should:

- use the existing Tailwind design system where appropriate
- provide generous identity space
- keep the professional summary compact
- provide readable width and rhythm for deep stories
- avoid excessive card grids
- maintain clear visual hierarchy between summary and detail

Exact spacing values remain implementation-level decisions unless established through the final visual system.

**Homepage Recognition — DECIDED (v0.9, UX-030):** generous vertical space, as in the
mockup: about 88px above and 72px below on desktop, 56px and 48px on mobile. The
positioning line wraps at about 34ch. On mobile the text block and the headshot are both
left-aligned.

---

## 10. Content Hierarchy

**AUTHORITATIVE**

### Primary

- name
- Senior Software Engineer title
- professional evidence
- primary exploration paths
- meaningful next actions

### Secondary

- engineering philosophy
- leadership and enablement
- personal dimensions
- speaking

### Supporting

- technology references
- metadata
- external and social destinations where appropriate
- the Birdhouses care guide (an in-portfolio PDF, not an external destination)

---

## 11. Experience Components

The following are **conceptual component roles**, not mandatory implementation names.

| Concept | Purpose | Authority |
|---|---|---|
| Header | Global orientation and navigation | DECIDED |
| Hero | Identity and initial professional recognition | AUTHORITATIVE |
| Exploration Path | Helps visitors choose how to understand Alisha | AUTHORITATIVE |
| Evidence Summary | Makes professional proof scannable | AUTHORITATIVE |
| Story Card | Concise story representation | DECIDED |
| Story Detail | Deep evidence and reasoning | AUTHORITATIVE |
| Capability Signal | Connects evidence to demonstrated behavior | HYPOTHESIS |
| Decision Block | Makes engineering reasoning visible | DECIDED |
| Outcome Block | Makes impact legible | DECIDED |
| Personal Story | Supports authentic personal exploration | AUTHORITATIVE |
| Speaking Item | Represents public speaking activity when available | AUTHORITATIVE |
| External Link | Continues a professional or personal journey | AUTHORITATIVE |
| Care Guide Link | Opens the Birdhouses care guide — a PDF hosted in the portfolio (PRD A-12, AD-20); visibly labeled as a PDF, with no outbound "leaves the site" marker (EXPERIENCE §13 Document Links) | DECIDED (PDF pending) |
| Footer | Closing orientation and external paths: an icon-only row of LinkedIn, Instagram @asprinkleofcode, Instagram @orangecatwoodcraft, and GitHub (EXPERIENCE §13 Footer Links, UX-028), on a `background.recessed` surface (§15) | DECIDED |
| Ambient Layer | Ambient personality: a field of tiny, slowly twinkling stars on `background.primary` (§16) | DECIDED |

Implementation names may change.

---

## 12. Story Summary Behavior

**AUTHORITATIVE**

A story summary should allow a visitor to quickly understand:

- what kind of problem was involved
- why the work mattered
- Alisha's role
- what behavior or capability the story demonstrates
- whether deeper exploration is worthwhile

A summary should not require the visitor to read a complete case study.

---

## 13. Story Detail Behavior

**AUTHORITATIVE**

A deep professional story should prioritize:

1. Context
2. Problem
3. Ambiguity or constraints
4. Ownership
5. Decision
6. Rationale
7. Tradeoffs
8. Collaboration
9. Outcome
10. Hindsight or reflection

Not every story must expose every field equally, but unsupported claims should not replace evidence.

---

## 14. Personal Story Behavior

**AUTHORITATIVE**

Personal experiences should stand on their own.

Powerlifting and Birdhouses should not be presented as forced metaphors for engineering.

Connections between the experiences may emerge naturally through storytelling, but the UI should not require a visitor to accept a marketing metaphor.

---

## 15. Shape and Elevation

**DECIDED**

The visual language should be approachable and modern.

Radius: `rounded` tokens — `0.5rem` default (cards, buttons, panels), `0.375rem` for
small controls, full pill for chips and capability signals. Matches existing
`rounded-lg` / `rounded` usage.

Hierarchy is communicated by **borders and background steps**
(`background.primary` → `background.secondary` → `background.recessed`), **not** by
stacked shadows. Elevation is limited to a single low `shadow`, plus `shadow-inner`
for inset areas such as the footer.

**Footer surface — DECIDED (v0.9, UX-030):** the footer sits on `background.recessed`
with a 1px `border.default` top edge and a visible inset shadow
(`inset 0 2px 6px rgb(0 0 0 / 0.5)`), as in the homepage mockup. Now that the page is
`background.primary`, this step down is what separates the footer from the page.

Any border that is the sole cue for an interactive element or an input uses
`border.essential`; `border.default` (~1.5:1) is for decorative separation only.

Links: `brand.primary`, underlined on hover and focus (the repo `hover:underline`
convention); the underline is not the only affordance when a link sits in body text —
colour plus context carry it, and focus adds the ring from §18a.

Avoid making every piece of information a floating card. Borders and containers
communicate hierarchy rather than decorate the page.

One signature effect is retained: a soft `brand.primary` glow
(`drop-shadow(0 0 6px …)`) on hover for brand-colored interactive elements. It is
decorative, never the sole carrier of a state, and — if it animates — is suppressed
under `prefers-reduced-motion` (a static glow may remain).

One named variant (UX-028): on hover and keyboard focus, the **@orangecatwoodcraft**
footer icon uses **`glow.woodcraft`** (apricot `#F5A962`) instead of `brand.primary`
for both its icon colour and its glow. The icon turns solid apricot and gets the same
`drop-shadow(0 0 6px …)` at 60% alpha; neither shows at rest. The other footer icons keep
the `brand.primary` hover. It marks the woodcraft account as its own small brand.
`focus.ring` is unchanged and stays the real focus cue. No other element uses this color.
*Amended 2026-10-04:* the icon colour was added after implementation, because a pink icon
hid the faint apricot glow.

---

## 16. Motion

**AUTHORITATIVE**

Motion must support comprehension and orientation.

Requirements:

- no interaction may depend on animation
- no long or distracting transitions
- ambient effects must have a reduced-motion strategy
- motion must not delay access to core content

Named transition: summary → deep story is a ~180 ms cross-fade with selected context
preserved, and is instant under `prefers-reduced-motion` (see EXPERIENCE.md §13).

### Reduced motion and ambient effects

**DECIDED (treatment, v0.9, UX-030)**

The ambient layer is a field of **tiny stars** on `background.primary`, uniform on every
route, as in the homepage mockup:

- **Stars:** about 1.5px, a few at 2px, sparse (the mockup shows roughly 10 per
  420×520px area). No glow, no blur.
- **Tints:** `text.primary` for most stars, with a few in `accent.secondary` and a few in
  `brand.primary`. They stay faint because the layer's opacity is low, not because they
  use special pale colors. No new tokens.
- **Motion:** each star twinkles slowly and on its own phase (opacity roughly 0.25 → 0.8
  over ~5s). Nothing drifts.
- **Reduced motion:** the same field, static, at a fixed faint opacity.

*Amended 2026-10-05 (owner, after build):* star sizes raised from about 1px (a few at 1.5px) to about 1.5px (a few at 2px), because at 1px the field read as dust.

This replaces the Story 1.5 "breathing bokeh" (28 glowing pink dots on the legacy grey).
The owner preferred the cleaner mockup look. Exact counts, opacities, and timings are
implementation-level within the description above. Whether each navigation reshuffles the
field is implementation-level too.

These constraints stay **AUTHORITATIVE** regardless of the treatment chosen:

- a reduced-motion-safe **static** fallback is mandatory
- the effect must never block or compete with professional evidence
- the effect must never be required to understand the experience
- the effect is not navigation and not content

---

## 17. Responsive Design

**AUTHORITATIVE**

Mobile is a first-class experience.

At every viewport:

- professional identity remains immediately understandable
- exploration paths remain obvious
- evidence remains scannable
- deep stories remain readable
- external actions remain accessible
- no critical information exists only on desktop

Desktop may provide additional breathing room but must not introduce a different information hierarchy.

---

## 18. Accessibility

**AUTHORITATIVE**

The portfolio targets **WCAG 2.2 AA**.

The experience must provide:

- keyboard access
- visible focus
- sufficient contrast — see the ratios in §7 and the non-color rule in §7b
- semantic headings
- meaningful link names
- accessible controls
- non-color-only communication
- reduced-motion support
- readable content at mobile sizes
- no hover-only critical information
- pointer targets at least 24 × 24 CSS px (SC 2.5.8)

### 18a. Known gaps in the inherited theme

**DECIDED** — the token values in §7 are the remediated ones; inherited components keep their current appearance until they are next touched, then adopt them (matches `ARCHITECTURE-SPINE.md` AD-11).

The current repository styling predates this contract. Three inherited patterns do not
meet the AA target. Each was replaced in the §7 token table, and the replacement is a
**new-development requirement** for any component built or substantively edited from here:

| Ref | Inherited pattern | Measured | Remediated value (now the §7 token) |
|---|---|---|---|
| A1 | Focus ring at 30% alpha (`ring-…/30`) | borderline; risks SC 2.4.7 / 2.4.11 | 2 px **solid** `brand.primary` ring with a 2 px offset; the 30% tint may stay as an extra glow, not the sole cue |
| A3 | White text on `brand.primaryFill` `#C45F87` | 3.9:1 (fails AA normal text) | resting fill `#A73E6C` (`--color-primary-600`, white 5.9:1). A darker hover is required but its value is **OPEN**. Button labels ≥ 18.66 px / ≥ 14 px bold remain an acceptable alternative route for a specific control |
| A4 | White text on `accent.secondaryFill` `#6F82EE` | 3.4:1 (fails AA normal text) | fill `#4F63D8` (white 5.1:1); `accent.secondary` `#93A4F6` is unaffected as text/border on dark |

Ratios recomputed per the method note in §7.

---

## 19. Visual Guardrails

**AUTHORITATIVE**

Do:

- make professional evidence easy to scan
- let personality appear naturally
- use visual hierarchy to tell the story
- preserve room for genuine human details
- use interaction where it clarifies or delights

Do not:

- hide the professional title
- make visitors decode the navigation
- turn hobbies into required engineering metaphors
- bury evidence beneath animation
- create interaction merely to demonstrate technical ability
- invent content to fill visual layouts
- expose confidential professional information

---

## 20. Open Design Decisions

Resolved in v0.4: exact color values (§7), typography family and measurements (§8),
shape and elevation (§15). Reduced-motion / ambient treatment is now **DEFERRED** to
implementation with fixed constraints (§16).

Resolved in v0.9 (UX-030): the homepage look now matches
[`mockups/key-homepage.html`](mockups/key-homepage.html), and the ambient treatment is
decided. See §6, §7, §7a, §8, §9, §15, and §16.

The following remain intentionally unresolved. They are **product / content** decisions,
owned by the PRD (`bmad-prd`), and must not be invented by downstream agents:

1. Final homepage copy.
2. Final labels for the exploration paths.
3. Final compact navigation structure.
4. Exact homepage versus deeper-content allocation.
5. Photography, imagery, and video availability.
6. Final speaking content and destinations.
7. ~~Instagram destination.~~ Resolved in v0.8 (UX-028): @asprinkleofcode (powerlifting) and @orangecatwoodcraft (Birdhouses), each linked from the footer and from its dimension's own context.
8. Final story selection and public-safe details.

The Birdhouses care-guide destination is no longer open. In v0.7 it was resolved as a PDF
hosted in the portfolio (PRD A-12, `ARCHITECTURE-SPINE.md` AD-20); only the PDF file
itself is still pending.

---

## 21. Deferred Decisions

The following should not be solved in DESIGN.md:

- technical architecture
- routing implementation
- content data architecture
- deployment architecture
- performance budgets
- implementation task sequencing
- acceptance criteria
- infrastructure decisions

These belong to downstream Architecture and Stories work.

---

## 22. Stitch Handoff

**AUTHORITATIVE**

Google Stitch may be used to explore visual mockups after the experience spine and major UX decisions are sufficiently resolved.

Stitch output is exploratory.

It does **not** override this document.

The Stitch prompt should be derived from:

- visual direction
- content hierarchy
- responsive requirements
- component roles
- interaction principles
- established UX decisions

Do not use Stitch to resolve unresolved product questions by accident.

---

## 23. Readiness Rule

This document is implementation-safe only when downstream agents can distinguish established design decisions from unresolved design questions.

If a decision is marked OPEN, implementation must either:

1. wait for the decision, or
2. use an existing repository convention without presenting that convention as a new UX decision.

No downstream agent should silently convert an OPEN decision into an AUTHORITATIVE one.