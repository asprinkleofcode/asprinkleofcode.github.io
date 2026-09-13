---
title: Alisha Sprinkle Korba Portfolio — PRD
status: final
version: 0.8
created: 2026-09-09
updated: 2026-09-13
---

# Product Requirements Document

## Alisha Sprinkle Korba Portfolio

Status, version, and dates live in the YAML frontmatter above — the single source for this document's metadata.

**Product:** Professional and personal portfolio website  
**Existing Site:** `alishasprinklekorba.com`  
**Existing Repository:** `asprinkleofcode.github.io`  
**Companion UX contracts:** `DESIGN.md` v0.6 (visual), `EXPERIENCE.md` v0.8 (experience) — both final

---

# 1. Document Purpose

This PRD defines the product goals, user needs, journeys, scope, features, requirements, success measures, constraints, and open decisions for the evolution of Alisha Sprinkle Korba's public portfolio.

The PRD builds on the finalized UX spines (`DESIGN.md` v0.6, `EXPERIENCE.md` v0.8) and is intended to become the product contract for downstream BMAD planning.

It should enable:

- UX to refine information architecture, visual direction, interaction, and experience.
- Architecture to make appropriate technical and hosting decisions.
- Epics and stories to trace implementation work back to product intent.
- Future reviewers to understand why the portfolio contains the experiences it does.

This PRD does **not** define:

- Final visual design or design tokens — see `DESIGN.md` v0.6.
- Final navigation structure and layout — see `EXPERIENCE.md` v0.8.
- Detailed interaction specifications.
- Technical architecture or implementation approach.
- Specific performance budgets.
- User stories or acceptance criteria.

Those decisions belong to downstream artifacts. The visitor-facing **labels** for the
three exploration paths are a product decision and are set here (D-15).

## 1.1 Glossary

| Term | Meaning in this PRD |
|---|---|
| **Path** | One of the three top-level ways to understand Alisha: Engineering, Leadership & Enablement, Beyond the Code. |
| **Dimension** | A single personal topic within the Beyond the Code path (powerlifting; Birdhouses). |
| **Story** | A single piece of professional evidence within the Engineering or Leadership & Enablement path. |
| **Summary** | The concise, scannable representation of a story shown before a visitor commits to reading it. |
| **Deep story** | The full story experience: context, ownership, decision, rationale, tradeoffs, collaboration, outcome, reflection (§6). |
| **Surface** | A place in the experience where a need is met — homepage recognition, a path index, a deep story, the footer. |
| **Evidence** | Concrete demonstration of how Alisha operates, as opposed to an unsupported descriptive claim. |
| **Public-safe** | Expressible in public without exposing confidential information (§7.7, C-3). |

---

# 2. Product Vision

The portfolio should make Alisha's professional reputation portable.

It should demonstrate, rather than merely claim, that Alisha:

- Translates business needs into engineering decisions.
- Owns complicated work from ambiguity through delivery.
- Makes the people around her better.
- Applies appropriate engineering judgment rather than defaulting to maximal sophistication.
- Can communicate across business, product, and engineering contexts.

The portfolio should also make clear that the professional engineer and the person outside work are not separate personas.

The intended identity is:

> **Alisha is all her things.**

The experience should leave a visitor thinking:

> **"She's clearly a strong engineer, she thinks beyond the code, and now I understand what makes her distinctly Alisha."**

The portfolio should feel like a representation of a real person rather than a collection of résumé entries.

---

# 3. Product Outcomes

The product should produce five outcomes.

### PO-1: Rapid professional recognition

A visitor should quickly understand who Alisha is professionally, including the required public title:

> **Senior Software Engineer**

### PO-2: Evidence-based understanding

A visitor should be able to see evidence of how Alisha operates, especially:

- Business-to-engineering translation.
- End-to-end ownership.
- Engineering judgment.
- Ability to operate through ambiguity.
- Contribution to the growth and effectiveness of others.

### PO-3: Whole-person recognition

A visitor should encounter personal dimensions that make Alisha feel like a complete person rather than a résumé.

The experience should support personal discovery without forcing hobbies into professional metaphors.

### PO-4: Intentional exploration

Visitors should immediately see distinct paths through which they can understand Alisha.

The experience should support:

> **Summary → Choose → Deep Story**

rather than requiring the homepage to contain complete case studies.

### PO-5: Credible professional continuation

The portfolio should make it easy for a visitor to continue a professional relationship through appropriate external destinations such as LinkedIn or relevant speaking destinations when those destinations are available.

---

# 4. Target Users and JTBD

Both personas below are grounded in observed demand — people who have actually asked
Alisha for the link. The ordering changed in v0.4 (D-21): the visitor who arrives **by
choice** is primary, and the time-boxed professional read is secondary.

Journey IDs were deliberately **not** renumbered with that reordering. `UJ-1` remains the
time-boxed journey and `UJ-2` the by-choice journey, so existing references in
`EXPERIENCE.md`, `SPEC.md`, and §18 stay valid. Section order carries the primacy; the
IDs are stable identifiers, not a ranking.

Both personas use they/them. They are archetypes, not real people.

## 4.1 Primary User: Priya, a Visitor Who Already Knows Alisha — UJ-2

Priya knows Alisha through at least one context — a talk Alisha gave, a shared team, a
mutual project, a powerlifting meet, a birdhouse order — and follows the link **by
choice** rather than as part of an evaluation.

How much Priya already knows is a variable within the persona, not a second persona. They
may know one side of Alisha well and nothing of the rest, or they may know Alisha's
professional work closely and be curious about what she builds when the work is entirely
her own. The job to be done is the same in both cases.

### Job to be done

> Understand how Alisha operates and who she is — across professional and personal
> dimensions — and come away seeing one coherent person rather than a set of unrelated
> contexts.

### Success condition

Priya reaches at least one dimension they did not already know, encounters reasoning and
evidence rather than claims, and recognizes the dimensions as belonging to the same person.

Priya is **not time-boxed**. They set their own depth, and the portfolio should reward
going further rather than assuming they will not.

Priya is the persona the UX North Star (§20) describes. All three of its clauses —
strong engineer, thinks beyond the code, distinctly Alisha — require a visitor who
actually explores, which the time-boxed read (§4.2) structurally cannot do. Priya is
also who Beyond the Code is for: that path serves every visitor rather than a secondary
one (D-18, D-21).

### UJ-2: Priya discovers the whole of Alisha

**Entry:** Priya follows the link by choice — from a talk, a shared team, a mutual
project, or a personal context — already holding at least one side of Alisha.

**Path:**

1. Recognizes Alisha and the dimension they already know.
2. Notices the other distinct paths, and that there is more here than a résumé.
3. Chooses a dimension they do not already know — professional or personal.
4. Reads deeply enough to encounter reasoning, context, and evidence rather than claims.
5. Returns to explore a second dimension, because the first one rewarded the visit.
6. Sees that the professional and personal dimensions belong to one coherent person.

**Climax:** Priya recognizes Alisha as a whole person rather than as the single context in
which they met, and holds a concrete sense of how she works.

**Resolution:** Priya continues to an appropriate destination (D-16, D-17), or simply
leaves with a changed picture of Alisha.

**Edge case:** Priya arrives from a talk while the portfolio still has no speaking surface
(FR-18 is conditional on A-13). The entry surface must make sense to them regardless —
see FR-24.

---

## 4.2 Secondary User: Jody, a Time-Boxed Professional Read — UJ-1

Jody is a professional — a hiring manager, a recruiter, a leader with a gap between
meetings, someone who arrived from a search result — who will spend roughly 90 seconds
before deciding whether to go further or close the tab.

Jody may arrive knowing nothing about Alisha. No visitor of this kind has yet asked Alisha
for the link; Jody is retained because the constraint they carry is useful, not because
the traffic is evidenced (D-21, A-15).

### Job to be done

> Form a fast, credible read on how Alisha operates and at what level, without deep
> reading.

### The 90-second budget

The ~90-second budget is a **legibility floor on the entry surface**, not a statement
about who the portfolio is for (D-22). It is what earns summary-first navigation (FR-15),
the homepage-as-decision-surface constraint (C-6), and intentional exploration (PO-4):
whatever a visitor's time budget, the entry must let them self-route rather than
force-feed them.

Within roughly 90 seconds, Jody should:

1. Understand Alisha's core professional strengths.
2. Identify at least one professional evidence story worth exploring further.

The portfolio does not need to make a case about Alisha's readiness for anything. The
evidence should let a reader draw their own conclusion.

### UJ-1: Jody forms a fast professional read

**Entry:** Jody arrives with limited time, possibly with no prior knowledge of Alisha.

**Path:**

1. Recognizes Alisha and her professional role.
2. Encounters distinct evidence paths.
3. Scans concise summaries of high-signal professional work.
4. Identifies evidence of business-to-engineering translation, ownership, judgment, or
   team contribution.
5. Chooses a story worth deeper exploration, or leaves with a credible read.
6. Encounters reasoning, context, and evidence rather than unsupported claims.

**Climax:** Jody holds a credible read on how Alisha operates and at what level.

**Resolution:** Jody can point to specific evidence from the portfolio.

**Edge case:** Jody only scans the landing experience and summaries. The professional
value must remain legible without requiring deep reading.

---

## 4.3 Standing Stakeholder: Alisha

Alisha is not a visitor, but she is the criterion the whole product is gated on. SM-5 is
the only success metric phrased about her rather than about a visitor: that she can
confidently share the public URL with managers, leadership, peers, professional
connections, speaking contacts, and people who find her through search.

This is a long-standing want that predates any specific career moment (D-21). A portfolio
she is glad to send is the precondition for every other metric here — if SM-5 fails, no
visitor-side metric gets a chance to succeed.

---

# 5. Professional Evidence Model

The portfolio should organize professional evidence into **distinct paths**, rather than a single undifferentiated "Selected Work" collection.

The subsection headings below ("Engineering / Technical", "Leadership / Enablement") are
internal names for the paths. Their visitor-facing labels are set in D-15.

## 5.1 Engineering / Technical

This path demonstrates:

- Technical ownership.
- Complex problem-solving.
- Business-to-engineering translation.
- Architecture and infrastructure judgment.
- Ambiguity handling.
- Decisions and tradeoffs.
- Delivery and outcomes.

### Content target

- Preferred: 3 polished, visitor-ready stories.
- Minimum: 2 when the available evidence is sufficiently strong that adding another story would dilute quality or introduce weaker material.
- Stretch: Up to 5 when additional stories materially improve the evidence.

### Selected stories (content pass, §14.3 item 1)

**2 of 2–3 selected — minimum (A-4) met; a 3rd remains a stretch option.** Full source
material and technical depth live in `addendum.md` — ES-1, ES-2; these entries state
only what the PRD needs.

- **Auth.RcmAppAccessWatcher** — Alisha designed and delivered, end-to-end and solo,
  an event-driven synchronization system closing an authorization gap between a
  healthcare platform's unified sign-in portal and the separate system of record that
  actually held what each user could do. She determined the integration point had to
  be database-level change capture (CDC) — the one layer every write path (UI, API, or
  script) passes through — rather than an API-level hook, then built the first
  Debezium-based CDC pipeline in the organization to publish those changes through
  pub/sub for downstream processing. Evidences business-to-engineering translation
  (FR-5: an authorization-drift risk with real revenue and adoption consequences,
  translated into a specific architecture), ownership and complexity (FR-6: solo,
  end-to-end, first integrator with a team that had never been integrated with before),
  engineering judgment (FR-7: seven documented decisions with rejected alternatives and
  tradeoffs, appropriate-investment reasoning per C-5), and ambiguity handling (FR-8: no
  prior pattern existed to follow). Public-safe: confirmed by Alisha (2026-09-12) —
  system and product names may be used as-is.
- **Azure Infrastructure-as-Code platform conversion** — Alisha led an end-to-end
  conversion of a ~11-microservice platform from manually provisioned, single-environment
  Azure infrastructure to a reusable Terraform platform, designing the architecture,
  reusable modules, deployment pipelines, migration strategy, and engineering standards
  herself while translating her own prior GCP-based infrastructure experience into
  Azure-specific patterns. She ran the migration as a four-phase, parallel-environment
  rollout (build the permanent environment via Terraform, validate behavioral parity
  against the temporary one across several sprints, then retire it) rather than an
  immediate cutover, taking the team from one temporary Dev-only environment to Dev, QA,
  and UAT within ~3 months and later to Production on the same foundation. Evidences
  business-to-engineering translation and architecture/infrastructure judgment (FR-5: an
  ungoverned, drifting manual-provisioning model translated into a repeatable, layered
  platform), ownership and complexity (FR-6: sole architect and technical lead, later
  the platform's infrastructure technical lead), engineering judgment (FR-7: eight
  documented decisions with tradeoffs, including a hindsight-flagged one she'd
  reconsider), and ambiguity handling (FR-8: no prior team experience with large-scale
  Terraform conversion, plus a cloud-platform translation from GCP to Azure). Also
  carries a strong risk/judgment moment: after a destructive Cosmos DB replacement
  (an in-place rename Azure doesn't support), she designed a defense-in-depth
  data-protection strategy (prevention, detection, authorization, recovery) rather than
  trusting a single safeguard. **Public-safe: the underlying product/system name is
  proprietary and must not be used** — referred to only as "the platform" per Alisha's
  explicit instruction (2026-09-13); cloud provider/tool names (Terraform, Azure, Cosmos
  DB, Container Apps, Key Vault, Azure DevOps) are public-safe third-party technology
  names and may be used as-is.

## 5.2 Leadership / Enablement

This path demonstrates:

- Mentorship.
- Onboarding.
- Knowledge sharing.
- Team development.
- Cross-team enablement.
- Raising the effectiveness of others.

Relevant evidence includes contractor/offshore onboarding, peer development conversations, and intern mentorship.

### Content target

- Preferred: 3 polished, visitor-ready stories.
- Minimum: 2 when the available evidence is sufficiently strong that adding another story would dilute quality.

## 5.3 Beyond the Code

This is a personal exploration path rather than a professional evidence category.

For MVP it includes exactly two dimensions (D-18):

- Powerlifting.
- Birdhouses.

No third dimension is planned for MVP. A future dimension may be added if genuine
material emerges, but the path must not carry a placeholder.

There is **no arbitrary story-count requirement** for this path.

The purpose is to reveal the person behind the professional identity, not to argue that hobbies make Alisha a better engineer.

---

# 6. Professional Story Requirements

A professional story should provide enough evidence for a visitor to understand how Alisha operated, not merely what she worked on.

Where applicable, a deep story should address:

1. **Problem and business context**
2. **Ambiguity or complexity**
3. **Constraints**
4. **Alisha's personal ownership**
5. **Decision made**
6. **Decision rationale**
7. **Tradeoffs or consequences**
8. **Collaboration and team impact**
9. **Outcome**
10. **Hindsight or reflection**

The story should make room for statements such as:

- Why this decision was appropriate at the time.
- What information influenced the decision.
- What changed because of the decision.
- What Alisha would do differently in hindsight.
- Why she would make the same decision again, when appropriate.

The portfolio may use an ADR-like reasoning model where useful, but ADR terminology is not itself a visitor-facing requirement.

The product requirement is the **evidence of reasoning**, not the format used to present it.

---

# 7. Features and Functional Requirements

These FRs state product capabilities, not acceptance criteria. "Done" for each is
established downstream in story creation, drawing on the story evidence model (§6), the
Success Metrics (§13), and the user journeys (§4). Experience-quality FRs (FR-1, FR-2,
FR-3, FR-15) are verified against SM-1 and the entry beats of UJ-1 and UJ-2.

## 7.1 Feature: Landing Experience and Professional Recognition

### FR-1: Identity and professional role

The landing experience must establish Alisha's identity and professional role, either directly or through an immediately accessible adjacent experience.

The required public title is:

> **Senior Software Engineer**

The title should be presented naturally and does not need to be repeated throughout the experience.

### FR-2: Engaging and confident first impression

The landing experience must create an engaging, cohesive first impression that conveys a confident and approachable professional identity.

Personality should feel fun and outgoing without relying on quirky, gimmicky, or deliberately eccentric presentation.

### FR-3: Clear exploration paths

The landing experience must make the portfolio's distinct exploration paths apparent enough that a visitor can choose how to understand Alisha without first reading the entire site.

At minimum, the experience must expose paths corresponding to:

- Engineering / Technical.
- Leadership / Enablement.
- Beyond the Code.

The visitor-facing labels are: **"Engineering"**, **"Leadership & Enablement"**, and
**"Beyond the Code"** (D-15). Navigation structure and placement are decided in
`EXPERIENCE.md` v0.8 §5.2 (A-9, UX-015).

---

## 7.2 Feature: Engineering / Technical Evidence

### FR-4: Engineering evidence

The Engineering / Technical path must provide evidence of Alisha's technical capability and responsibility through selected professional stories.

A story should qualify for inclusion because it provides meaningful evidence of one or more target capabilities, not merely because it demonstrates an interesting technology.

Engineering stories are expected to be text-first, using diagrams rather than photography where a visual would aid comprehension (A-11).

### FR-5: Business-to-engineering translation

Professional evidence must demonstrate Alisha's ability to translate business or customer needs into engineering decisions.

The evidence should make the relationship between the need and the resulting engineering decision understandable at an appropriate level of public detail.

### FR-6: Ownership and complexity

Professional evidence must demonstrate Alisha's ability to own complicated work through meaningful portions of the path from ambiguity or problem definition through delivery.

The experience should distinguish Alisha's contribution from the work of the broader team where doing so is possible and public-safe.

### FR-7: Engineering judgment

Professional stories must provide evidence of how Alisha makes engineering decisions, including relevant constraints, rationale, tradeoffs, and consequences.

The portfolio should demonstrate that Alisha selects an appropriate level of engineering investment for the situation rather than consistently maximizing sophistication.

### FR-8: Ambiguity

At least some professional evidence must demonstrate how Alisha handles ambiguous situations.

The evidence should show an ability to:

- Get to the root of a problem.
- Understand constraints.
- Develop a viable path forward.
- Offer sound suggestions.
- Navigate disagreement without unnecessarily creating conflict.

---

## 7.3 Feature: Leadership / Enablement Evidence

### FR-9: Developing others

The Leadership / Enablement path must provide evidence of how Alisha contributes to the effectiveness or growth of people around her.

Relevant evidence may include:

- Mentorship.
- Onboarding.
- Knowledge sharing.
- Team enablement.
- Peer development.
- Intern development.
- Process improvements that make others more effective.

### FR-10: Repeatable enablement

Where an enablement story involves onboarding or knowledge transfer, the portfolio should make visible how Alisha converted individual knowledge into something useful to others when that evidence exists.

The contractor/offshore onboarding guide is a potential example.

### FR-11: Leadership beyond role boundaries

The portfolio may include contributions Alisha makes outside the formal requirements of her role when they provide meaningful evidence of leadership, mentorship, or investment in others.

The purpose is to demonstrate behavior, not to imply a formal management role where one does not exist.

---

## 7.4 Feature: Beyond the Code

### FR-12: Personal dimensions

The portfolio must provide intentional opportunities to discover personal dimensions of Alisha beyond software engineering.

The two dimensions for MVP are powerlifting and Birdhouses (D-18). Making imagery is expected to come from the birdhouse-making Instagram or new photography (A-11).

### FR-13: Authenticity without forced metaphor

Personal stories must stand on their own as authentic representations of Alisha.

The experience must not require an explicit claim that a hobby maps to a professional engineering capability.

Recurring themes or connections may emerge naturally, but should not be imposed as a marketing device.

### FR-14: Personal exploration depth

Where a personal dimension is presented as a meaningful experience rather than a simple profile detail, the visitor should have a path to explore the story, process, or context behind it.

The amount of depth should follow the strength of the available material rather than an arbitrary content quota.

---

## 7.5 Feature: Story Exploration

### FR-15: Summary-to-depth navigation

Each professional evidence path must allow visitors to:

1. Understand what the path represents.
2. Scan concise summaries of available stories.
3. Select a story.
4. Explore a deeper story experience.

The homepage must provide enough information for visitors to make an informed exploration choice without requiring full story content. Deeper evidence should be available through the selected path rather than competing for attention on the homepage. Homepage content allocation follows C-6 and is decided in `EXPERIENCE.md` v0.8 §6.1–§6.5 (A-10, UX-025).

### FR-16: Evidence over claims

Deep stories must prioritize evidence, reasoning, and context over unsupported descriptive claims.

Generic adjectives should not substitute for evidence.

---

## 7.6 Feature: Context and Connection

### FR-17: Professional continuation

The portfolio must provide clear opportunities for professional visitors to continue engagement through appropriate external destinations when those destinations are available.

The intended professional destinations are **LinkedIn** and **GitHub** (D-16). Others may
be added if they provide genuine professional value.

### FR-18: Speaking

The portfolio should support professional speaking visibility when Alisha has appropriate public speaking content to present.

Speaking content must not be invented to satisfy this requirement.

Speaking material is **in progress but not yet ready** (A-13). This requirement stays
conditional for MVP: the speaking surface is built only when public-safe content exists,
and its introduction is tracked as a near-term follow-up rather than an MVP deliverable.
Specific topics and events remain open content questions.

### FR-19: Personal continuation

Where a Beyond the Code dimension has a real external presence, the portfolio should
link out to it from that dimension's own context (D-17):

- Powerlifting links to the powerlifting Instagram account.
- Birdhouses links to the birdhouse-making Instagram account.

The portfolio hosts neither that content nor any commerce; it is a contextual outbound
link only, consistent with Non-Goals 8 and 9. Exact account handles are supplied by
Alisha (A-14).

---

## 7.7 Feature: Public-Safe Professional Storytelling

### FR-20: Public-safe evidence

Professional stories must be expressible at a level that demonstrates Alisha's thinking and responsibility without exposing confidential information.

Appropriate material may include:

- Generalized problem classes.
- Generalized business context.
- Alisha's role.
- Public-safe technologies.
- Generalized architecture patterns.
- Decisions.
- Tradeoffs.
- Collaboration patterns.
- Generalized outcomes.
- Lessons learned.

### FR-21: Confidentiality boundary

Professional stories must not expose:

- Proprietary architecture.
- Customer information.
- Internal system names.
- Sensitive metrics.
- Credentials or secrets.
- Sensitive operational details.
- Company-confidential implementation specifics.

Guiding principle:

> **Show the thinking, not the secrets.**

---

## 7.8 Feature: Discoverability

### FR-22: Semantic professional identity

The public experience must expose sufficient semantic content for visitors and search systems to understand:

- Alisha's name.
- Senior Software Engineer role.
- Relevant professional capabilities.
- Meaningful relationships among the portfolio's content.

### FR-23: Structured discoverability

The experience should provide appropriate structured identity information and metadata to support search and AI discovery.

Exact structured-data implementation belongs downstream.

### Scope constraint on FR-22 / FR-23

Both requirements are satisfied at the **site and person level**. `HashRouter` on GitHub
Pages (C-1, `ARCHITECTURE-SPINE.md` AD-5) leaves the site with one crawlable URL, so
individual stories are not independently findable through organic search — an explicit
non-goal (AD-14). Read "meaningful relationships among the portfolio's content" as
structured identity and capability data on the one crawlable surface, not as per-story
search presence.

---

## 7.9 Feature: Entry Context

### FR-24: Entry surface legible to arrivals from a known context

The entry surface must make sense to a visitor who arrives already holding one context for
Alisha — most often someone who has just heard her speak, or a colleague following a
link — without requiring that context to be reproduced on the site.

Concretely, a visitor arriving from a talk must be able to connect what they heard to what
the portfolio shows: the professional identity and the exploration paths must be
recognizable as the same person they just listened to.

This requirement does **not** depend on a speaking surface existing. Speaking content
(FR-18) remains conditional on public-safe material being ready (A-13); FR-24 is satisfied
by the entry surface itself.

Arrival from a talk is the most frequently observed real entry path, and carried no
requirement before v0.4 (D-23).

**Verified by:** UJ-2 entry and step 1; SM-1.

---

# 8. Cross-Cutting Non-Functional Requirements

## NFR-1: Accessibility

The portfolio must target **WCAG 2.2 AA** conformance.

The downstream experience and implementation artifacts should define the specific interaction, content, and verification requirements.

## NFR-2: Responsive experience

The portfolio must provide a usable experience across supported mobile and desktop viewport sizes.

Exact responsive behavior belongs in the experience and design artifacts.

## NFR-3: Performance

The portfolio must provide a responsive, usable public experience.

Specific performance budgets should be established downstream based on the final content and experience rather than invented at the PRD stage.

Performance decisions must remain consistent with the low-to-no-cost operating constraint.

## NFR-4: Production quality

Any version made publicly available must meet the portfolio's production-quality floor.

Incomplete or intentionally experimental work must remain non-public until it meets that floor.

The production-quality floor includes:

- Core journeys work end-to-end.
- No known critical accessibility issues.
- Responsive experience works across supported viewport sizes.
- No obviously broken or placeholder content.
- Professional content is public-safe.
- Basic performance and discoverability requirements are met.

## NFR-5: Reduced motion

Motion and ambient visual effects must have an accessible reduced-motion experience.

---

# 9. Constraints and Guardrails

## C-1: Existing public product

This is an evolution of an existing public portfolio rather than a greenfield product.

The current codebase is a minimal Vite + React 19 single-page app (Tailwind v4,
`flowbite-react`, `HashRouter`) deployed to GitHub Pages. Today it has only two routes
(`/` and `/about`) and a small shared theme; most story and path surfaces described in
this PRD do not exist yet. The existing repository, theme tokens, and media are
important context for downstream technical planning.

## C-2: Hosting and operating cost

The portfolio should remain hosted through the existing GitHub Pages model unless a later product or architecture decision explicitly changes that constraint.

The ongoing operating model should remain **low to no cost**.

New infrastructure or services should require justification against the portfolio's actual product value.

## C-3: Confidentiality

Professional content must remain within a public-safe boundary.

The need to protect confidential information must not become an excuse to make professional contribution invisible.

The product should maximize evidentiary value while minimizing disclosure risk.

## C-4: Authenticity

The experience must represent Alisha rather than manufacture a persona.

Personality should be:

- Fun.
- Outgoing.
- Confident.
- Grounded.

It should not become quirky for novelty's sake.

## C-5: Appropriate engineering investment

The product itself should embody the engineering philosophy it communicates.

Not every possible interaction or feature should be built merely because it is technically possible.

The appropriate solution is the one that serves the actual user and product need.

## C-6: Homepage as decision surface

The homepage is a decision surface, not a destination for every piece of content. It should establish identity, create interest, expose the portfolio's distinct exploration paths, and help visitors decide where to go next. Deeper evidence, stories, and personal content should live in appropriate downstream experiences rather than being forced onto the homepage.

---

# 10. Non-Goals

The portfolio is not intended to become:

1. An exhaustive résumé or career archive.
2. A complete inventory of every technology Alisha has used.
3. A replacement for a formal performance review.
4. A repository of proprietary engineering documentation.
5. A generic engineering tutorial site.
6. A collection of manufactured testimonials or unsupported claims.
7. A novelty-driven interactive experience.
8. A social publishing platform.
9. A birdhouse commerce platform.
10. A replacement for LinkedIn.
11. A forced metaphor connecting every personal interest to engineering.
12. A reason to introduce complex infrastructure solely for technical novelty.
13. A replacement for UX design, experience design, architecture, or story-level planning.

---

# 11. MVP Scope

## 11.1 MVP In Scope

The MVP must provide:

### Professional identity
- Alisha's identity.
- Senior Software Engineer title.
- Confident, engaging landing experience.
- Clear exploration paths.
- An entry surface legible to visitors arriving from a known context (FR-24).

### Engineering / Technical
- 2–3 polished visitor-ready stories.
- Evidence of business-to-engineering translation.
- Evidence of ownership and complexity.
- Evidence of engineering judgment.
- Evidence of ambiguity handling.
- Reasoning, tradeoffs, outcomes, and reflection where applicable.

### Leadership / Enablement
- 2–3 polished visitor-ready stories.
- Evidence of developing or enabling others.
- Evidence of meaningful contribution beyond formal role boundaries where applicable.

### Beyond the Code
- Meaningful personal dimensions.
- Powerlifting and making as established candidates.
- Authentic personal exploration without forced professional metaphor.

### Story exploration
- Concise story summaries.
- Clear selection into deeper stories.
- Context and reasoning in deep stories.

### Professional continuation
- Appropriate professional connection destination.
- Speaking support when actual content exists.

### Public safety
- Public-safe professional storytelling.
- No confidential implementation details.

### Public experience quality
- Responsive experience.
- WCAG 2.2 AA target.
- Basic discoverability.
- Production-quality public release floor.
- GitHub Pages-compatible, low-to-no-cost operating model.

---

# 12. MVP Out of Scope

The MVP does not require:

- An exhaustive project history.
- Five stories in every category.
- A third professional evidence category.
- A fixed story count for Beyond the Code.
- Complex interactive storytelling created primarily for novelty.
- Personalization.
- A custom CMS unless later planning establishes a genuine need.
- A large speaking archive without sufficient source content.
- Birdhouse commerce.
- A social publishing system.
- Invented metrics or testimonials.
- Proprietary project details.
- Explicit claims that personal hobbies improve engineering performance.
- Custom infrastructure that materially increases cost or operational burden without corresponding product value.

---

# 13. Success Metrics

Because this is a personal portfolio, many outcomes are qualitative and should be validated through review and user feedback rather than treated as vanity analytics.

## SM-1: Rapid professional recognition

A representative visitor can identify Alisha's professional role and understand the purpose of the portfolio quickly.

### Target outcome

A visitor who spends only the entry-surface budget (~90 seconds, D-22) comes away
able to name Alisha's core professional strengths and at least one story worth exploring.
This is the floor, not the intended depth — the primary journey (UJ-2) is measured by
SM-2 and SM-3.

## SM-2: Evidence-based understanding

A representative professional visitor can identify concrete evidence of at least some of the following:

- Business-to-engineering translation.
- End-to-end ownership.
- Engineering judgment.
- Ambiguity handling.
- Team development or enablement.

## SM-3: Whole-person recognition

A representative visitor can identify at least one meaningful personal dimension and still understand how it belongs to the same person as the professional identity.

## SM-4: Professional continuation

A professional visitor can identify an appropriate way to continue engagement when a destination is available.

## SM-5: Public-quality confidence

Alisha can confidently share the public portfolio with managers, leadership, peers, professional connections, speaking contacts, and people who discover her through search.

### Counter-metrics

The following should not be treated as success by themselves:

- Time on site.
- Number of interactions.
- Number of pages.
- Number of portfolio stories.
- Amount of animation.
- Amount of content.

More content or interaction is not inherently better.

---

# 14. Open Questions

## 14.1 Resolved

### In v0.3

| Was | Now |
|---|---|
| Final labels for the three exploration paths | D-15 — "Engineering", "Leadership & Enablement", "Beyond the Code" |
| External professional destinations beyond LinkedIn | D-16 — LinkedIn + GitHub |
| Instagram destination for making/birdhouse content | D-17 — the birdhouse-making Instagram (handle per A-14); a separate powerlifting Instagram for that dimension |
| Third Beyond the Code dimension | D-18 — none for MVP |
| Visual treatment (fun / confident / cohesive without being quirky) | D-19 — see `DESIGN.md` (current version) |

### In v0.4

| Was | Now |
|---|---|
| Whether a time-boxed manager evaluation is the primary audience | D-21 — no; the by-choice visitor is primary, the time-boxed read secondary |
| Whether the ~90-second budget survives that reordering | D-22 — yes, as a legibility floor on the entry surface |
| How arrivals from Alisha's talks are served | D-23 + FR-24 (§7.9); speaking *content* stays conditional on A-13 |
| Whether the planning artifacts are published in the public repository | D-24 — finalized docs yes, `.memlog.md` no |

### In v0.5

| Was | Now |
|---|---|
| Navigation structure that exposes the paths compactly (§14.2, A-9) | Resolved by `EXPERIENCE.md` v0.8 §5.2 (UX-015) — flat top-level nav row (identity, Home, three paths), identical and sticky on every page, footer-only external links |
| Homepage content vs deeper experiences (§14.2, A-10) | Resolved by `EXPERIENCE.md` v0.8 §6.1–§6.5 (UX-025) — Recognition → Exploration → Evidence & Highlights, in that order; Engineering and Leadership & Enablement each carry a dedicated evidence teaser, Beyond the Code carries a one-line personal-dimension hint |
| Final homepage copy that establishes Alisha's identity (§14.3 item 1) | D-25 — positioning statement decided: "Give me a business problem and I'll turn it into an engineering decision worth trusting." |
| Whether the birdhouse care guide is a page or a link (§14.3, A-12) | A-12 — resolved: a downloadable PDF hosted within the portfolio, surfaced from Beyond the Code's Birdhouses dimension |

## 14.2 Deferred with constraints set

| Question | Owner | Where the constraints live |
|---|---|---|
| How the stars / ambient layer evolves | Implementation | `DESIGN.md` §16 (treatment DEFERRED; static reduced-motion fallback mandatory; never blocks or competes with content) |
| Reduced-motion behavior for ambient effects | Implementation | `EXPERIENCE.md` §14, `DESIGN.md` §16 |
| Performance budgets | Architecture | NFR-3, A-8 — set after final content/media strategy |

## 14.3 Still open — content pass

These require Alisha's content decisions and must not be invented by downstream agents.
They do not block UX or architecture, but the PRD is not content-complete until they are
answered.

1. Which Engineering stories form the strongest initial set (2–3) — **minimum met:**
   Auth.RcmAppAccessWatcher and the Azure Infrastructure-as-Code platform conversion
   selected (§5.1); a 3rd remains an optional stretch, not required.
2. Which Leadership & Enablement stories form the strongest initial set (2–3).
3. Which candidate stories to reduce or exclude because their public-safe evidence is too weak.
4. Public-safe details that can be disclosed for each professional story — resolved for
   Auth.RcmAppAccessWatcher (§5.1); the Azure IaC platform story is resolved with one
   standing constraint (the product/system name is proprietary and permanently withheld,
   not merely pending confirmation like the rest); still open for any additional selected story.
5. Speaking topics and events, once public-safe material is ready (A-13).
6. What photography or video is available for the making dimension and for story imagery (A-11).

---

# 15. Assumptions Index

## A-1: Primary audience

The primary audience is the visitor who already knows Alisha in at least one context and
arrives by choice (§4.1, UJ-2). Grounded in observed demand: everyone who has actually
asked Alisha for the link has been a talk attendee or a colleague.

**Status:** Observation-supported (D-21). Supersedes the v0.3 assumption that a time-boxed
manager evaluation was primary.

## A-2: Three exploration paths

Engineering / Technical, Leadership / Enablement, and Beyond the Code provide a useful initial model for portfolio exploration.

**Status:** Product decision, subject to UX validation.

## A-3: Story depth

Summary → Choose → Deep Story is the preferred content interaction model.

**Status:** Product decision, subject to UX validation.

## A-4: Evidence quality threshold

Two strong stories are preferable to three weak stories within a professional category.

**Status:** Product decision.

## A-5: Beyond the Code

Making and powerlifting are meaningful personal dimensions, but additional personal categories should emerge from genuine material rather than a required quota.

**Status:** Product decision.

## A-6: Hosting

GitHub Pages remains the intended hosting model.

**Status:** Product constraint.

## A-7: Operating cost

The portfolio should maintain a low-to-no-cost operating model.

**Status:** Product constraint.

## A-8: Performance

Specific performance budgets are intentionally deferred until the content and experience are defined.

**Status:** Open downstream decision.

## A-9: Navigation structure

Navigation is a single, flat, top-level header row — identity (logo + name), then
**Home**, **Engineering**, **Leadership & Enablement**, **Beyond the Code** — identical
and sticky on every page including deep stories. External and social links (LinkedIn,
GitHub, powerlifting IG, birdhouse-making IG) are footer-only; the header carries no
quick-access icons for them. On mobile the row collapses via the existing flowbite-react
hamburger pattern.

**Status:** Resolved — `EXPERIENCE.md` v0.8 §5.2 (UX-015). No longer a working
assumption.

## A-10: Homepage content

The homepage stacks three separate sections, in this order: **Recognition** (identity,
title, and a one-line positioning statement), **Exploration** (the three path entries,
label-only), and **Evidence & Highlights** (Engineering and Leadership & Enablement each
carry at least one dedicated evidence teaser; Beyond the Code carries one personal-hint
teaser, not evidence). All deeper content lives on path and story experiences (C-6).

**Status:** Resolved — `EXPERIENCE.md` v0.8 §6.1–§6.5 (UX-025). No longer a working
assumption.

## A-11: Visual media availability

MVP visual media is limited. A headshot and powerlifting photos exist. Birdhouse
imagery is assumed to come from the making Instagram or new photography; Engineering
and Leadership stories are assumed to be text-first, using diagrams rather than photos
where a visual would aid comprehension.

**Status:** [ASSUMPTION] — content risk; see §14.3.

## A-12: Birdhouse care guide

The care guide is a downloadable PDF document, hosted within the portfolio (not an
external link), surfaced from the Birdhouses dimension of Beyond the Code (§5.3).

**Status:** Resolved (2026-09-12, owner decision).

## A-13: Speaking material

Speaking content is in progress and not yet ready for public presentation. FR-18 stays
conditional; the speaking surface is a near-term follow-up, not an MVP deliverable.

**Status:** Product status, to be revisited when material is ready.

## A-14: Social account handles

The exact powerlifting and birdhouse-making Instagram handles, and the GitHub profile
URL, are supplied by Alisha before implementation of FR-17 / FR-19.

**Status:** [ASSUMPTION] — values pending from Alisha.

## A-15: Time-boxed professional traffic

The time-boxed professional read (§4.2, UJ-1) is assumed to be real traffic —
recruiters, search arrivals, leaders between meetings — but no instance of it has been
observed.

**Status:** Unvalidated. Retained because the constraint it carries (D-22) is useful
whether or not the traffic materializes.

---

# 16. Product Decisions

The following decisions have been made during discovery and PRD refinement.

### D-1: Professional title

Use **Senior Software Engineer** as the public-facing professional title.

### D-2: Landing experience

The landing experience should be engaging and cohesive and should invite exploration.

### D-3: Personality

The intended personality is fun, outgoing, confident, and grounded without being quirky or gimmicky.

### D-4: Professional proof

The three primary professional capabilities to demonstrate are:

1. Translating business needs into engineering decisions.
2. Making the people around Alisha better.
3. Owning complicated work from start to finish.

### D-5: Evidence model

Professional stories should expose context, ownership, decisions, rationale, collaboration, outcomes, and hindsight where applicable.

### D-6: Evidence categories

Professional evidence should be separated into Engineering / Technical and Leadership / Enablement.

### D-7: Beyond the Code

Beyond the Code is a personal exploration path rather than a professional evidence category.

### D-8: Content depth

Professional categories should contain three polished visitor-ready stories where possible, with two accepted when evidence quality warrants the reduction.

### D-9: Navigation behavior

The preferred content model is Summary → Choose → Deep Story.

### D-10: Initial professional priority

Professional clarity takes priority during the initial scan. Personality and personal dimensions should enrich the experience without obscuring professional evidence paths.

### D-11: Accessibility

WCAG 2.2 AA is the portfolio accessibility target.

### D-12: Public release gate

Any public version must meet the production-quality floor.

### D-13: Hosting and cost

The portfolio should remain on GitHub Pages and operate at low to no cost unless a future decision establishes a compelling reason to change.

### D-14: Confidentiality

The governing professional storytelling principle is:

> Show the thinking, not the secrets.

### D-15: Exploration path labels

The visitor-facing labels are **"Engineering"**, **"Leadership & Enablement"**, and
**"Beyond the Code"**. Navigation structure and placement are UX-owned and now decided
(A-9).

### D-16: Professional continuation destinations

**LinkedIn** and **GitHub**. Additional professional destinations may be added only
when they provide genuine value.

### D-17: Personal continuation destinations

The powerlifting dimension links to the powerlifting Instagram; the making dimension
links to the birdhouse-making Instagram. The portfolio hosts neither that content nor
any commerce — contextual outbound links only.

### D-18: Beyond the Code scope

MVP carries exactly two personal dimensions: powerlifting and Birdhouses. No third
dimension for MVP, and no placeholder for one.

The dimension's visitor-facing name is **"Birdhouses"** only — not "Birdhouse and Gourd
Making" or "Birdhouse / Gourd Making" (owner decision, 2026-09-12). Gourds are a material
and construction technique within the dimension's content, not part of its label.

### D-19: UX contracts

The visual design contract is `DESIGN.md` v0.6 (dark-only, system sans stack, rose
`brand.primary` + periwinkle `accent.secondary`, hierarchy via borders and background
steps, cupcake brand mark). The experience contract is `EXPERIENCE.md` v0.8. Both are
final and authoritative for their domains.

### D-20: Ambient effect deferred

The ambient visual layer (currently a star field) and its reduced-motion behavior are
deferred to implementation, under fixed constraints in `DESIGN.md` §16 and
`EXPERIENCE.md` §14: a static reduced-motion fallback is mandatory, and the effect must
never block, compete with, or be required to understand the experience.

### D-21: Primary audience re-set

The primary audience is the visitor who already knows Alisha in at least one context and
arrives **by choice**, unhurried (§4.1, UJ-2). The time-boxed professional read
(§4.2, UJ-1) is secondary.

This reverses the v0.3 ordering. Grounds: observed demand comes entirely from people who
attended Alisha's talks and from colleagues — no manager has asked for the link; the
portfolio is not a dependency of any career decision; the UX North Star (§20) requires
a visitor who explores, which a ~90-second read structurally cannot do; and Beyond the
Code serves every visitor rather than a secondary one.

The v0.3 framing described the portfolio as evidence for one specific internal career
conversation. That was a mis-encoding of a motivation as an audience behavior. The portfolio's contribution to
Alisha's professional case is the way it is built — specified, reviewed, and traceable
— not the site functioning as a pitch to a particular reader. What survives from the
v0.3 framing is the legibility floor (D-22). Journey IDs were deliberately not renumbered
(§4).

### D-22: The 90-second budget is a legibility floor

The ~90-second budget is retained as a constraint on the entry surface, not as a statement
of audience. It continues to justify FR-15, C-6, PO-4, and SM-1. Designing the entry for
the most time-starved visitor also serves the unhurried one; the reverse is not true.

### D-23: Post-talk arrival is a recognized entry path

Arrival from a talk Alisha has given is a named entry path carrying its own requirement
(FR-24, §7.9). Speaking *content* stays conditional on A-13; FR-24 deliberately does
not depend on a speaking surface existing.

### D-24: Planning-artifact publication scope

The finalized planning documents — this PRD, `DESIGN.md`, `EXPERIENCE.md`, `specs/`,
`architecture/`, and promoted `mockups/` — are committed to the public repository. The
`.memlog.md` deliberation trails are not (`_bmad-output/.gitignore`).

Rationale: for a portfolio whose thesis is *demonstrate, don't claim*, the finished
planning artifacts are themselves evidence of business-to-engineering translation (PO-2,
FR-5). The memlogs are raw working memory — rejected options, content-risk notes,
corrections in flight — with little public value. Accepted consequence: the memlogs
exist only in the local working copy.

### D-25: Homepage positioning statement

The one-line positioning statement in the Recognition surface (`EXPERIENCE.md` v0.8
§6.2), directly under the name and title, is:

> **"Give me a business problem and I'll turn it into an engineering decision worth trusting."**

This closes the first item of §14.3's content pass. It leads with the professional-
judgment angle (D-4 item 1: translating business needs into engineering decisions) in a
direct-address, confident voice consistent with C-4.

---

# 17. Responsibility Boundaries

## PRD owns

- Product goals.
- User outcomes.
- Scope.
- Features.
- Product requirements.
- Success measures.
- Product constraints.
- Product-level priorities.

## UX / Experience owns

- Final information architecture.
- Navigation labels.
- Visual hierarchy.
- Interaction behavior.
- Detailed journeys.
- Responsive behavior.
- Accessibility interaction patterns.
- Content presentation patterns.
- Visual treatment of personality.

## Architecture owns

- Technical structure.
- Content architecture.
- Hosting implementation.
- Deployment.
- Performance budgets.
- Technical tradeoffs.
- Infrastructure and service decisions.

## Stories own

- Implementation-level behavior.
- Acceptance criteria.
- Task-level sequencing.
- Technical implementation detail.

---

# 18. Traceability Goal

The downstream BMAD artifact set should make it possible to trace:

```text
Product Goal
    ↓
User Need
    ↓
Journey
    ↓
Experience Surface
    ↓
Feature
    ↓
User Story
    ↓
Acceptance Criteria
    ↓
Implementation
```

Examples:

```text
PO-2 Evidence-based understanding
    ↓
UJ-1 Jody forms a fast professional read
    ↓
Engineering / Technical path
    ↓
FR-5 Business-to-engineering translation
    ↓
Professional story
    ↓
Story acceptance criteria
    ↓
Implemented portfolio experience
```

And:

```text
PO-3 Whole-person recognition
    ↓
UJ-2 Priya discovers the whole of Alisha
    ↓
Beyond the Code path
    ↓
FR-12 Personal dimensions
    ↓
Powerlifting / Making experience
    ↓
Story acceptance criteria
    ↓
Implemented portfolio experience
```

Every downstream feature should be explainable in terms of a genuine product or user need.

---

# 19. Current Product Hypothesis

A portfolio for Alisha should function less like a résumé and more like concise proof of how she operates:

- Technically capable.
- Thoughtful about tradeoffs.
- Comfortable with ownership and ambiguity.
- Able to bridge product and engineering.
- Invested in the growth of others.
- Distinctly human.

The homepage should make that proof legible quickly.

The deeper experiences should provide the evidence and allow visitors to decide how far they want to explore.

---

# 20. UX North Star

The experience should leave a visitor thinking something close to:

> **"She's clearly a strong engineer, she thinks beyond the code, and now I understand what makes her distinctly Alisha."**

This is the product outcome that downstream UX, architecture, epics, stories, and implementation decisions should protect.