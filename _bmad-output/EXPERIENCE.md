# EXPERIENCE.md

**Name:** Alisha Sprinkle Korba Portfolio  
**Description:** Experience contract defining the information architecture, journeys, interaction patterns, and accessibility behavior for the portfolio.  
**Status:** Final  
**Version:** 0.11  
**Updated:** 2026-10-04  
**Peer document:** `DESIGN.md` v0.8 — owns visual identity; all color, type, radius, and elevation tokens referenced here are defined there.  
**Upstream:** `PRD.md` v0.8 — path labels (D-15), destinations (D-16/D-17), the Birdhouses naming (D-18), speaking status (A-13), the care guide (A-12), the audience re-ordering (D-21/D-22), the entry-context requirement (FR-24 / D-23), and the positioning statement (D-25) are consumed below.

---

## 1. Document Purpose

This document defines how visitors experience the portfolio.

It converts product outcomes and UX decisions into:

- information architecture
- navigation behavior
- experience surfaces
- user journeys
- content presentation
- interaction patterns
- state behavior
- responsive behavior
- accessibility expectations

This is the experience contract for downstream Architecture and Stories work.

---

## 2. Decision Authority

| Level | Meaning |
|---|---|
| **AUTHORITATIVE** | Downstream work may rely on this as the UX contract. |
| **DECIDED** | UX direction is established. |
| **HYPOTHESIS** | Proposed direction requiring validation. |
| **OPEN** | No decision has been made. Do not invent one. |
| **DEFERRED** | Belongs to Architecture, Stories, or Implementation. |
| **CONDITIONAL** | The decision holds, but the surface is built only once a stated precondition is met. The precondition is named wherever the level is used. |

**Qualified and split levels.** A level may be narrowed by a parenthetical scope, and one item may carry two levels for two different aspects — for example `DECIDED (role) / DEFERRED (treatment)`, or `DECIDED — values pending`. Read each level as applying only to the aspect named beside it; the aspect with the weaker level governs what downstream may act on. No level outside this table is valid, qualified or not.

---

## 3. Foundation

### 3.1 Experience Purpose

**AUTHORITATIVE**

The portfolio should make Alisha's professional reputation portable.

It should demonstrate:

- business-to-engineering translation
- ownership of complicated work
- engineering judgment
- ability to work through ambiguity
- contribution to other people's effectiveness
- communication across business, product, and engineering

It should also make the person behind the engineering work visible.

The portfolio is intentionally not an exhaustive résumé.

---

### 3.2 Primary Audience

**AUTHORITATIVE**

Primary representative user (PRD §4.1, D-21):

**Priya, a visitor who already knows Alisha**

Priya knows Alisha through at least one context — a talk she gave, a shared team, a mutual
project, a powerlifting meet, a birdhouse order — and follows the link **by choice** rather
than as part of an evaluation. How much they already know varies; the job does not.

Their job is to understand:

- how Alisha operates, across professional and personal dimensions
- who she is beyond the professional surface
- that the dimensions belong to one coherent person

Priya is **not time-boxed**. They set their own depth, and the experience should reward
going further. This is the audience the Experience North Star (§25) is written for: its
third question — "what makes her distinctly Alisha?" — is only reachable by a visitor who
explores. Journey: UJ-2 (§19).

---

### 3.3 Secondary Audience

**AUTHORITATIVE**

Secondary representative user (PRD §4.2, D-21):

**Jody, a time-boxed professional read**

Jody — a hiring manager, recruiter, leader between meetings, or search arrival — has
roughly 90 seconds and may arrive knowing nothing about Alisha. Their job is to form a
fast, credible read on how Alisha operates and at what level, without deep reading.

The ~90-second budget is a **legibility floor on the entry surface**, not a statement of
who the experience is for (PRD D-22). It is what earns summary-first navigation, the
homepage-as-decision-surface rule (UX-002), and Summary → Choose → Deep Story (UX-004).
Journey: UJ-1 (§19).

---

## 4. Experience Principles

### Recognize before exploring

**AUTHORITATIVE**

A visitor must understand who Alisha is professionally before being asked to explore.

---

### Summary → Choose → Deep Story

**AUTHORITATIVE**

The experience should progressively disclose information.

```text
Recognize
   ↓
Understand the paths
   ↓
Scan summaries
   ↓
Choose
   ↓
Read the evidence
```

---

### Evidence must be scannable

**AUTHORITATIVE**

Professional value must remain legible even when a visitor only scans the landing experience and summaries.

---

### Depth is earned

**DECIDED**

Deep content should be available for visitors who want it, rather than imposed on every visitor.

---

### Whole person, not separate personas

**AUTHORITATIVE**

Professional and personal dimensions should feel like parts of one person.

---

## 5. Information Architecture

### 5.1 Conceptual Model

**DECIDED**

The experience currently uses three conceptual exploration paths:

```text
                         ALISHA
                            │
          ┌─────────────────┼─────────────────┐
          ↓                 ↓                 ↓
   ENGINEERING /      LEADERSHIP /      BEYOND THE
     TECHNICAL         ENABLEMENT         CODE
```

These are experience concepts, not final navigation labels.

---

### 5.2 Navigation

**DECIDED**

**Labels** (PRD D-15): the three paths are labelled **"Engineering"**,
**"Leadership & Enablement"**, and **"Beyond the Code"**.

**Structure:** the header is a single, flat, top-level nav row — no hub-and-spoke
sub-navigation, no progressive disclosure — and it is **identical on every page**,
including inside a deep story: no breadcrumb, no collapse-to-back-affordance. Depth is
signaled inside the content, not by changing the chrome around it.

Left to right: identity (logo + name) — **Home** — **Engineering** — **Leadership &
Enablement** — **Beyond the Code**. Identity is a left-aligned brand mark, links sit to
its right (conventional pattern, matches the existing `Header.tsx`). "Home" is kept as
its own explicit link rather than relying on visitors recognizing the logo as clickable.

The header is **sticky** (stays visible while scrolling) — nav stays reachable at any
scroll depth, consistent with the header never changing shape. Any in-page anchors must
account for the sticky header's height (scroll-margin / offset) so it is never occluded.

On mobile (UX-013), the row collapses via the existing flowbite-react `NavbarToggle` /
`NavbarCollapse` hamburger pattern already used in `Header.tsx` — no always-visible
compact bar, no bottom tab bar.

External and social destinations (LinkedIn, GitHub, powerlifting IG @asprinkleofcode,
birdhouse-making IG @orangecatwoodcraft — PRD D-16/D-17) are **footer-only**; the header
carries no quick-access icons for them. The footer shows them as an icon row (§13 Footer
Links, UX-028).

Reference: [`mockups/key-header.html`](mockups/key-header.html) shows the desktop row
and the mobile collapsed / expanded states on the DESIGN.md dark palette. It is a visual
reference only — this section wins on conflict.

The navigation must expose the exploration paths while maintaining professional clarity
during the initial scan.

---

## 6. Homepage Experience

### 6.1 Homepage Job

**AUTHORITATIVE**

The homepage is a **decision surface**, not a complete résumé.

It must help a visitor:

1. recognize Alisha
2. understand her professional role
3. understand what she is good at
4. see credible evidence paths
5. choose where to explore
6. discover enough personality to recognize the person
7. continue to an appropriate next destination

**Section order — DECIDED:** top to bottom, the homepage stacks **Recognition (§6.2) →
Exploration (§6.3) → Evidence & Highlights (§6.4)** as three separate sections, in that
order — not interleaved. A visitor is recognized, then offered the choice of where to
go, then shown proof, in that sequence. §6.5's personality composition is resolved into
§6.4 rather than forming its own stacked section.

Reference: [`mockups/key-homepage.html`](mockups/key-homepage.html) shows the desktop and
mobile homepage on the DESIGN.md dark palette: header, Recognition with the D-25
positioning statement, label-only Exploration, Evidence & Highlights, and footer. Content
that is still open (§24 items 1–4) is drawn as dashed placeholders rather than invented.
It is a visual reference only, and this section wins on conflict.

---

### 6.2 Recognition Surface

**AUTHORITATIVE**

The initial experience must clearly communicate:

**Alisha Sprinkle Korba**  
**Senior Software Engineer**

The professional title is a product decision and must not be replaced by a clever alternative.

**Positioning statement — DECIDED:** a single short line sits directly under the
name/title, folded into this same Recognition block rather than forming its own visual
section. Exact wording is a product/content decision (owned by `bmad-prd` / a content
pass, §24) — not invented here.

**Headshot — DECIDED (UX-027):** the existing headshot
(`asprinkleofcode/src/assets/alisha-sprinkle-korba-headshot.jpg`) sits in the Recognition
block as a rounded-rectangle portrait. On desktop it sits to the **right** of the
name / title / positioning statement. On mobile it stacks **below** that text, so the
name and title are still the first things read (§4.3, DESIGN.md §4.3). It uses the
default radius and a `border.default` edge. It is identity, not decoration: it gets
meaningful alt text (the name), not an empty `alt`. Exact dimensions and crop are
implementation-level.

---

### 6.3 Exploration Surface

**AUTHORITATIVE**

The homepage should expose the major ways to understand Alisha.

The three paths, using their decided labels (PRD D-15):

- Engineering
- Leadership & Enablement
- Beyond the Code

**Structure — DECIDED:** this surface is **label-only** — the three path entries, no
teaser copy attached here. Each path's one-line highlight lives in Evidence &
Highlights (§6.4), which follows as its own section rather than being interleaved with
the entries here.

---

### 6.4 Evidence & Highlights Surface

**DECIDED**

Follows Exploration (§6.3) as its own stacked section. Each of the three paths gets
**exactly one highlight line here, at minimum**:

- **Engineering** — at least one concise, high-signal evidence teaser.
- **Leadership & Enablement** — at least one concise, high-signal evidence teaser of
  its own, dedicated rather than pooled away in favor of Engineering having more. Both
  professional paths must be visibly represented before a visitor picks one.
- **Beyond the Code** — one one-line personal-dimension hint. This is **not**
  professional evidence (UX-007) — it shares the same one-line, same-position visual
  treatment as the other two for consistency, but its content is a personality signal,
  not a capability claim.

Professional evidence should appear as concise, high-signal summaries. The homepage
should not require complete case studies for every story.

---

### 6.5 Personality Surface

**DECIDED**

Personality should be visible without interrupting the professional story.

**Composition — DECIDED:** on the homepage itself, personality surfaces exactly as the
Beyond the Code one-line hint in §6.4 — there is no separate, additional homepage
personality section. Full material (powerlifting, Birdhouses — PRD D-18's two
Beyond the Code dimensions) lives only once a visitor enters the Beyond the Code path.
The ambient star layer is unaffected by this decision — it is a persistent, site-wide
atmospheric layer, not a homepage-specific inclusion choice (role/treatment already
governed by UX-011 / §14). Speaking is likewise unaffected — its surface stays
CONDITIONAL per §10 / UX-021, independent of this homepage allocation.

---

## 7. Engineering / Technical Path

### 7.1 Goal

**AUTHORITATIVE**

Help a visitor understand how Alisha approaches complicated engineering work.

The path should demonstrate:

- ownership
- architecture and systems thinking
- ambiguity
- business-to-engineering translation
- engineering judgment
- appropriate technical investment

---

### 7.2 Summary Experience

**AUTHORITATIVE**

Visitors should first encounter concise story summaries.

Each summary should communicate:

- problem class
- why it mattered
- Alisha's role
- demonstrated capability
- invitation to explore

---

### 7.3 Deep Story

**AUTHORITATIVE**

A selected professional story should expose evidence through:

```text
Context
  ↓
Problem / ambiguity
  ↓
Constraints
  ↓
Ownership
  ↓
Decision
  ↓
Rationale
  ↓
Tradeoffs
  ↓
Collaboration
  ↓
Outcome
  ↓
Reflection
```

This reflects the established evidence model.

---

## 8. Leadership / Enablement Path

### 8.1 Goal

**AUTHORITATIVE**

Show how Alisha makes the people and systems around her more effective.

Relevant evidence may include:

- onboarding
- mentorship
- knowledge sharing
- team enablement
- peer development
- intern development
- process improvements

The experience must demonstrate leadership behavior without falsely implying a formal management role.

---

### 8.2 Repeatable Enablement

**AUTHORITATIVE**

Where a story involves onboarding or knowledge transfer, the experience should make visible how individual knowledge became useful and repeatable for others when that evidence exists.

---

## 9. Beyond the Code

### 9.1 Purpose

**AUTHORITATIVE**

Provide intentional opportunities to discover Alisha beyond software engineering.

---

### 9.2 Powerlifting

**DECIDED**

Powerlifting is a meaningful personal story.

The experience should allow visitors to understand the journey and context rather than reducing it to a set of numbers.

---

### 9.3 Birdhouses

**DECIDED**

Birdhouses are a meaningful personal dimension. The visitor-facing name is
**"Birdhouses"** only (PRD D-18) — gourds and making are material and technique within
the content, not part of the label.

The experience may include:

- transformation from raw gourd to finished object
- design process
- making process
- customer interaction
- care information
- social content

Destinations — **DECIDED**:

- **Birdhouse-making Instagram** (PRD D-17) — **@orangecatwoodcraft**
  (`https://www.instagram.com/orangecatwoodcraft/`), a contextual outbound link from the
  Birdhouses context (§13 External Links). It also appears in the footer (§13 Footer
  Links).
- **Care guide** (PRD A-12, `ARCHITECTURE-SPINE.md` AD-20) — a downloadable PDF
  **hosted within the portfolio**, not an external link, reached from the Birdhouses
  dimension's own content. It is a supporting page, not a third Beyond the Code
  dimension (D-18): it never appears in the `/beyond` index or a teaser. Link behavior is
  §13 Document Links. The PDF itself is pending from Alisha; until it exists, no care-guide
  link is rendered (§14 Missing Content).

The exact content composition remains OPEN.

---

### 9.4 Authenticity Rule

**AUTHORITATIVE**

Personal stories must stand on their own.

Do not force:

> hobby → engineering metaphor

as a required interpretation.

Connections may emerge naturally.

---

## 10. Speaking

### Status: CONDITIONAL — material in progress (PRD A-13)

Speaking material is being prepared but is not yet ready. The speaking surface is a
near-term follow-up, not an MVP deliverable; it is built only when public-safe content
exists.

The portfolio should support speaking visibility when real public speaking content exists.

Do not invent:

- topics
- events
- talks
- destinations
- testimonials

Speaking content should become a real experience only when there is authentic material to present.

---

## 11. Professional Story Content Model

**AUTHORITATIVE**

| Element | Purpose |
|---|---|
| Context | Establish the situation |
| Problem | Explain what needed to change |
| Ambiguity | Show uncertainty or complexity |
| Constraints | Explain boundaries |
| Ownership | Clarify Alisha's responsibility |
| Decision | Show what she chose |
| Rationale | Show why |
| Tradeoffs | Demonstrate judgment |
| Collaboration | Show how others were involved |
| Outcome | Establish what changed |
| Reflection | Show hindsight and learning |

Not every story needs equal depth in every category.

---

## 12. Confidentiality Pattern

**AUTHORITATIVE**

The governing rule is:

> **Show the thinking, not the secrets.**

Safe storytelling may include:

- generalized problem classes
- generalized business context
- role
- public-safe technologies
- generalized architecture patterns
- decisions
- tradeoffs
- collaboration patterns
- generalized outcomes
- lessons learned

Do not expose:

- proprietary architecture
- customer information
- internal system names
- sensitive metrics
- credentials
- secrets
- sensitive operational details

This is an explicit product requirement.

---

## 13. Interaction Primitives

### Navigation

**AUTHORITATIVE**

Visitors must be able to orient themselves and move between major experience paths without relying on browser back behavior.

---

### Exploration

**AUTHORITATIVE**

Path summaries and story summaries should clearly communicate that deeper content exists.

---

### External Links

**AUTHORITATIVE**

External destinations should clearly communicate that the visitor is leaving the portfolio.

Destinations (PRD D-16 / D-17):

- **Professional** — LinkedIn, GitHub. Placed as professional continuation.
- **Personal** — the powerlifting Instagram **@asprinkleofcode**
  (`https://www.instagram.com/asprinkleofcode/`, from the powerlifting context) and the
  birdhouse-making Instagram **@orangecatwoodcraft**
  (`https://www.instagram.com/orangecatwoodcraft/`, from the Birdhouses context). These
  are outbound links only; the portfolio hosts neither that content nor any commerce.
  Both also appear in the footer (Footer Links below).

Handles supplied by Alisha on 2026-10-04 (PRD A-14, UX-028). LinkedIn and GitHub use
the URLs already in `index.html`'s `sameAs`.

Every outbound link opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"`)
and shows a visible "leaves the site" marker. The footer icon row is the one exception
(Footer Links below).

The care guide is **not** an external link — see Document Links below.

---

### Footer Links

**DECIDED** (UX-028)

The footer carries the external destinations as an **icon-only row**, continuing the
existing footer pattern. Order, left to right:

1. LinkedIn
2. Instagram — **@asprinkleofcode** (powerlifting)
3. Instagram — **@orangecatwoodcraft** (Birdhouses / woodcraft)
4. GitHub

The two Instagram icons share the same glyph, so the handle in each accessible name is what
tells them apart.

- **The logo is the exit cue.** A platform logo already tells the visitor they are going to
  that platform, so footer icons carry no extra visible "leaves the site" marker. They
  still open in a new tab with `rel="noopener noreferrer"`.
- **Accessible name** — every icon has one that names the platform, the handle where there
  is one, and the new tab: for example, "Instagram @orangecatwoodcraft (opens in a new
  tab)". An icon with no accessible name is a defect.
- **@orangecatwoodcraft apricot** — on hover and keyboard focus only, the woodcraft icon
  turns apricot and gets a slight apricot glow (`{colors.glow.woodcraft}`, DESIGN.md §15),
  where the other icons turn `brand.primary`. It is decorative: the solid
  `{colors.focus.ring}` stays the focus cue, and nothing depends on seeing the colour.
  No apricot at rest.
- **Reachability** — the row stays reachable and legible at mobile and desktop widths, and
  its keyboard focus order follows the visual order.
- Other footer content, such as the copyright line and the existing icon-attribution link,
  is unchanged by this decision.

---

### Document Links

**DECIDED**

A document hosted within the portfolio (currently only the Birdhouses care guide, PRD
A-12) is reached by a same-origin link that opens the PDF in the browser
(`ARCHITECTURE-SPINE.md` AD-20):

- **Opens in place** — no new tab, no forced download, and no "leaves the site"
  affordance; the visitor has not left the portfolio. The browser's own viewer handles
  viewing and saving.
- **Identifies itself as a PDF** — the visible link text or an adjacent visible marker
  tells the visitor it is a PDF before they activate it (for example, a "(PDF)" suffix),
  so it is distinct from both in-site navigation and outbound links. The marker is part of
  the accessible name, not only an icon. Exact label wording is content (§24).
- **Optional inline preview** — the care-guide page may also embed the same PDF. The
  embed has an accessible name and fallback text, and it never replaces the plain
  link: mobile browsers vary (some force a download, some show only the first page), so
  the link stays the reliable path.

---

### Story Transitions

**DECIDED**

Moving from summary to deep story should preserve enough context that the visitor
understands what they selected.

The transition is a **~180 ms cross-fade** with the selected story's title / context
carried across, and is **instant** (no animation) under `prefers-reduced-motion`. The
transition never gates access to the deep-story content — the content is usable if the
animation does not run.

---

## 14. State Patterns

### Cold Load

**AUTHORITATIVE**

The page should expose meaningful semantic content without requiring decorative effects to complete.

---

### Loading

**AUTHORITATIVE**

Loading behavior must not block basic identity recognition unnecessarily.

---

### Error

**AUTHORITATIVE**

An error must preserve access to available navigation and recovery paths where possible.

---

### Missing Content

**AUTHORITATIVE**

Do not render empty visual shells for content that does not exist.

If optional content is unavailable, the experience should gracefully omit or simplify that surface.

---

### Reduced Motion

**AUTHORITATIVE**

Core content and navigation remain fully usable without animation.

The exact ambient-effect behavior is **DEFERRED** to implementation (see DESIGN.md §16).
Regardless of which ambient treatment is chosen, a static, reduced-motion-safe fallback
is mandatory, and the effect must never block, compete with, or be required to
understand the experience.

---

### Focus

**AUTHORITATIVE**

Keyboard focus must remain visible and logically ordered. The visible-focus target is a
solid ring (DESIGN.md §18a A1), not the inherited 30%-alpha ring.

---

## 15. Responsive & Platform

**AUTHORITATIVE**

Mobile and desktop are the same experience hierarchy expressed at different sizes.

Mobile must preserve:

- professional recognition
- evidence paths
- story summaries
- deep-story readability
- external actions
- accessibility

Do not create mobile-only or desktop-only professional evidence.

---

## 16. Accessibility Floor

**AUTHORITATIVE**

Target: **WCAG 2.2 AA**.

Minimum experience requirements:

- semantic document structure
- keyboard navigation
- visible focus
- accessible names for interactive controls
- adequate contrast
- meaningful heading hierarchy
- no color-only communication
- reduced-motion support
- usable mobile layout
- readable text
- accessible external links
- pointer targets at least 24 × 24 CSS px (SC 2.5.8)

Three patterns inherited from the existing codebase (focus-ring alpha, primary-button
text contrast, secondary-fill text contrast) do not meet this floor and are logged as
implementation remediation in DESIGN.md §18a.

---

## 17. Discoverability

**AUTHORITATIVE**

The portfolio must expose semantic professional identity in content and structure.

The experience should make it clear to search systems that:

- Alisha Sprinkle Korba is the subject
- Senior Software Engineer is her public professional title
- the site contains professional work
- the site contains personal dimensions
- relevant external professional destinations exist

Structured data is a product requirement, although its implementation belongs downstream.

**Scope constraint.** Under `HashRouter` the site presents one crawlable URL, so this
requirement is met at the **site and person level** — identity, role, and the existence of
professional and personal content. Per-story organic search discoverability is an explicit
non-goal (`ARCHITECTURE-SPINE.md` AD-14). Do not read this section as promising that
individual stories are findable through search.

---

## 18. Performance Experience

### Status: DEFERRED

The product requires a production-quality experience, but exact performance budgets remain intentionally unresolved until content and media strategy are defined.

Architecture owns final technical performance budgets.

UX owns the experience expectation:

- core identity should appear promptly
- decorative effects must not block content
- media must not make the experience feel sluggish
- interaction should feel intentional rather than excessive

---

## 19. Key Flows

UJ-2 is the **primary** journey as of PRD v0.4 (D-21); UJ-1 is secondary. The IDs were
deliberately not renumbered, so flow order below is historical, not a ranking.

### UJ-1: Jody's Fast Professional Read

```text
Arrive
  ↓
Recognize Alisha + Senior Software Engineer
  ↓
Understand professional strengths
  ↓
See distinct evidence paths
  ↓
Scan story summaries
  ↓
Choose one high-signal story
  ↓
See reasoning + ownership + evidence
  ↓
Form a credible read of level and approach
```

Success does not require reading a complete story.

---

### UJ-2: Priya Discovers the Whole of Alisha — primary journey

```text
Arrive through known context
  ↓
Recognize professional identity
  ↓
Notice another dimension
  ↓
Explore personal or speaking content
  ↓
Understand more of Alisha
  ↓
Continue to an appropriate destination
```

---

### Professional Story Flow

```text
Path
  ↓
Summary
  ↓
Choose
  ↓
Deep Story
  ↓
Outcome / Reflection
  ↓
Return or Continue
```

---

### Birdhouse Flow

```text
Discover personal side
  ↓
Explore Birdhouses
  ↓
See transformation and process
  ↓
Continue to the birdhouse-making Instagram, or open the care guide (PDF)
```

Destinations (PRD D-17 / A-12): the birdhouse-making Instagram (outbound, §13 External
Links), and the care guide, a downloadable PDF hosted within the portfolio (§13 Document
Links, §9.3). The Instagram handle is **@orangecatwoodcraft** (PRD A-14, UX-028). The
care-guide PDF is still pending from Alisha; it appears only once it exists, and no
placeholder link is rendered until then (§14 Missing Content).

---

### Powerlifting Flow

```text
Discover personal side
  ↓
Encounter powerlifting
  ↓
Understand journey and context
  ↓
Explore story
  ↓
Continue to the powerlifting Instagram, or return to Alisha's broader identity
```

Destination (PRD D-17): the powerlifting Instagram **@asprinkleofcode**, as a contextual
outbound link from the powerlifting context — matching the Birdhouses dimension's
treatment (§13). Handle supplied (PRD A-14, UX-028).

---

## 20. Surface Closure

Every meaningful product need should map to an experience surface, and every experience surface should map to a user journey.

| Need | Surface | Journey |
|---|---|---|
| Rapid professional recognition | Homepage recognition | UJ-1 Jody (fast read) |
| Legible arrival from a known context | Homepage recognition | UJ-2 Priya (primary) |
| Business-to-engineering evidence | Engineering summaries + stories | Professional story |
| Ownership and ambiguity | Engineering deep story | UJ-2 Priya (primary) |
| Making people better | Leadership / Enablement | UJ-2 Priya (primary) |
| Whole-person recognition | Beyond the Code | UJ-2 Priya (primary) |
| Personal exploration | Powerlifting / Birdhouses | UJ-2 Priya (primary) |
| Birdhouse care information | Care guide (in-portfolio PDF) | Birdhouse Flow |
| Professional continuation | LinkedIn / speaking destinations | UJ-1 / UJ-2 |
| Public-safe storytelling | Story presentation pattern | Professional story |
| Discoverability | Semantic page structure | Search entry (UJ-1 variant) |

Deep-story rows moved from UJ-1 to UJ-2 in v0.6: a ~90-second read does not reach a deep
story, so mapping deep-story needs to UJ-1 was an error carried from the v0.3 audience
ordering (PRD D-21).

---

## 21. Content Governance

**AUTHORITATIVE**

Content must not be invented merely to satisfy the IA.

If authentic material does not exist:

- omit the surface
- mark it as pending
- or reduce the scope

The PRD explicitly states that speaking content must not be invented and that two strong professional stories are preferable to three weak ones.

---

## 22. Content Selection

**DECIDED**

Initial professional evidence should prioritize high-signal work.

Preferred category depth:

- Engineering / Technical: approximately 3 strong stories
- Leadership / Enablement: approximately 3 strong stories
- Beyond the Code: no arbitrary quota

Two strong stories are preferable to three weak stories.

The current product decisions explicitly establish this quality-over-quota rule.

---

## 23. Decision Log

| ID | Decision | Status |
|---|---|---|
| UX-001 | Professional title is Senior Software Engineer | AUTHORITATIVE |
| UX-002 | Homepage is a decision surface | AUTHORITATIVE |
| UX-003 | Professional clarity precedes deeper exploration | AUTHORITATIVE |
| UX-004 | Summary → Choose → Deep Story | AUTHORITATIVE |
| UX-005 | Evidence over claims | AUTHORITATIVE |
| UX-006 | Engineering / Technical and Leadership / Enablement are professional evidence paths | DECIDED |
| UX-007 | Beyond the Code is personal, not professional evidence | AUTHORITATIVE |
| UX-008 | Powerlifting and Birdhouses are authentic personal dimensions | DECIDED |
| UX-009 | Personal stories must not depend on forced engineering metaphors | AUTHORITATIVE |
| UX-010 | Show the thinking, not the secrets | AUTHORITATIVE |
| UX-011 | Ambient layer (currently a star field) is personality, not navigation; its treatment is DEFERRED to implementation with fixed constraints | DECIDED (role) / DEFERRED (treatment) |
| UX-012 | WCAG 2.2 AA | AUTHORITATIVE |
| UX-013 | Mobile is first-class | AUTHORITATIVE |
| UX-014 | Speaking must use authentic material only | AUTHORITATIVE |
| UX-015 | Path labels = "Engineering" / "Leadership & Enablement" / "Beyond the Code" (PRD D-15); nav structure = flat top-level row (identity + Home + 3 paths), identical on every page, sticky, footer-only external links, flowbite hamburger on mobile (§5.2) | DECIDED |
| UX-016 | Visual tokens (color, type, radius, elevation) | DECIDED in DESIGN.md v0.5 |
| UX-017 | Performance budgets remain Architecture-owned | DEFERRED |
| UX-018 | Summary → deep-story transition: ~180 ms cross-fade, context preserved, instant under reduced-motion | DECIDED |
| UX-019 | Reduced-motion / ambient-effect behavior | DEFERRED to implementation (DESIGN.md §16) |
| UX-020 | External + personal destinations: LinkedIn, GitHub, powerlifting IG, birdhouse-making IG (PRD D-16/D-17) | DECIDED — Instagram handles supplied in UX-028 |
| UX-028 | Footer is an icon-only row: LinkedIn, Instagram @asprinkleofcode (powerlifting), Instagram @orangecatwoodcraft (Birdhouses), GitHub. The logo is the exit cue (no extra visible marker; new tab and an accessible name naming platform + handle). @orangecatwoodcraft turns apricot with a slight apricot glow on hover/focus only (`glow.woodcraft`, DESIGN.md §15). Closes PRD A-14 for Instagram (§13 Footer Links) | DECIDED |
| UX-026 | Birdhouses care guide is a PDF hosted within the portfolio, opened by a same-origin link labeled as a PDF — not an outbound link (PRD A-12, AD-20; §13 Document Links) | DECIDED — PDF pending |
| UX-021 | Speaking surface is conditional; material in progress (PRD A-13) | CONDITIONAL — precondition: public-safe speaking material exists |
| UX-022 | Primary audience is the by-choice visitor who already knows Alisha (§3.2, UJ-2); the time-boxed read is secondary (PRD D-21) | AUTHORITATIVE |
| UX-023 | The ~90-second budget is a legibility floor on the entry surface, not a statement of audience (PRD D-22) | AUTHORITATIVE |
| UX-024 | The entry surface must be legible to someone arriving from a talk, without requiring a speaking surface to exist (PRD FR-24 / D-23) | DECIDED — surface treatment UX-owned |
| UX-027 | Homepage headshot: existing headshot in Recognition as a portrait right of the text on desktop, stacked below the text on mobile (§6.2) | DECIDED |
| UX-025 | Homepage allocation (PRD A-10 / C-6): section order Recognition → Exploration → Evidence & Highlights (§6.1); positioning statement folded into Recognition (§6.2); Exploration stays label-only (§6.3); each of the 3 paths gets ≥1 highlight line in §6.4 (Engineering + Leadership & Enablement each get their own evidence teaser, Beyond the Code gets a personal-hint teaser, not evidence); homepage personality composition = exactly that one hint, nothing more (§6.5) | DECIDED |

---

## 24. Open UX Decisions

Resolved in v0.4: visual tokens (DESIGN.md §7–8, §15), the summary → deep-story
transition (§13). Reduced-motion / ambient treatment is DEFERRED to implementation with
fixed constraints (§14, DESIGN.md §16).

Resolved in v0.5 by PRD v0.3: path labels (D-15), external + personal destinations
(D-16 / D-17), speaking status (A-13), no third Beyond the Code dimension (D-18),
care-guide destination assumption (A-12).

Resolved in v0.6 by PRD v0.4: primary vs secondary audience (D-21), the meaning of the
~90-second budget (D-22), and the entry-context requirement for arrivals from a talk
(D-23 / FR-24). The surface treatment that satisfies FR-24 is UX design work — folded
into item 1 below.

Resolved in v0.7: compact navigation structure and placement (§5.2, UX-015) — flat
top-level row, identical on every page, sticky, footer-only external links, flowbite
hamburger on mobile. `PRD.md` (references to `EXPERIENCE.md` v0.6 and to nav structure
as an open A-9 working assumption), `ARCHITECTURE-SPINE.md` (bound to `EXPERIENCE.md`
v0.6), and `epics.md` (cites `EXPERIENCE.md` v0.6) are now one revision behind this —
flagged for their owning skills to re-consume, not corrected here. The same applies one
level down: `DESIGN.md` bumped to v0.5 for the brand-mark decision below, so `PRD.md`,
`epics.md`, `ARCHITECTURE-SPINE.md`, and `SPEC.md` (which cites `DESIGN.md` v0.4 /
`EXPERIENCE.md` v0.5, already one full revision stale on the EXPERIENCE side) all now
lag `DESIGN.md` too.

Resolved in v0.8: homepage versus deeper-content allocation (§6.1–§6.5, UX-025) —
section order, positioning-statement placement, exploration-surface label-only
structure, per-path evidence/highlight minimums, and homepage personality composition.

Reconciled in v0.9: the Birdhouses care guide now follows PRD A-12 (resolved 2026-09-12)
and `ARCHITECTURE-SPINE.md` AD-20, replacing the v0.5 assumption of "a lightweight page,
external link acceptable." It is a PDF hosted within the portfolio, opened by a
same-origin link that is labeled as a PDF (§9.3, §13 Document Links, Birdhouse Flow,
UX-026). The dimension is also renamed "Birdhouses" throughout, in place of "Making /
Birdhouses" (PRD D-18). This clears the "Known cross-document staleness" notes in
`epics.md` and AD-20. Those notes are now out of date themselves, so they are flagged for
their owning skills rather than edited here.

Resolved in v0.10: homepage headshot placement (§6.2, UX-027) — portrait beside the
Recognition text on desktop, below it on mobile. Downstream docs (`PRD.md` v0.8, `SPEC.md`,
`ARCHITECTURE-SPINE.md`, `epics.md`) now cite `DESIGN.md` v0.7 / `EXPERIENCE.md` v0.10, so
the staleness flagged in the v0.7 and v0.9 notes above is cleared
(sprint-change-proposal-2026-10-04).

Resolved in v0.11: Instagram handles and the footer icon row (§13 Footer Links, UX-028) —
@asprinkleofcode is the powerlifting Instagram and @orangecatwoodcraft the
birdhouse-making one; both sit in the footer, the woodcraft icon turning apricot with an
apricot glow on hover/focus (`DESIGN.md` v0.8 `glow.woodcraft`; icon colour amended
2026-10-04). This closes PRD A-14 for Instagram.

**UX design work still to do:** none remaining. Both items tracked in this section
since v0.6 (nav structure, homepage allocation) are now resolved.

**Product / content decisions still open** (owned by `bmad-prd` §14.3; downstream must
not invent them):

1. Final homepage copy (including the positioning-statement wording, §6.2).
2. Engineering story selection (2–3).
3. Leadership & Enablement story selection (2–3).
4. Public-safe details for each story.
5. Speaking topics and events, once material is ready.
6. Photography / video available for the Birdhouses dimension and story imagery.
7. The care-guide PDF itself, and its link label wording (§13 Document Links).

---

## 25. Experience North Star

The portfolio should answer three questions in order:

### “Who is she?”

**Senior Software Engineer.**

### “How does she operate?”

Through evidence of ownership, judgment, business-to-engineering translation, ambiguity handling, and making others better.

### “What makes her distinctly Alisha?”

She is not only the engineer represented by those stories.

**Alisha is all her things.**

The experience succeeds when the professional case feels earned, the personal identity feels genuine, and neither requires the visitor to work unnecessarily hard to understand the other.