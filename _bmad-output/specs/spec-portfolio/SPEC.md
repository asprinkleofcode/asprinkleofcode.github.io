---
id: SPEC-portfolio
companions:
  - glossary.md
  - exploration-paths.md
  - professional-storytelling.md
  - release-quality-floor.md
  - ../../DESIGN.md
  - ../../EXPERIENCE.md
  - ../../architecture/ARCHITECTURE-SPINE.md
  - ../../addendum.md
sources:
  - ../../PRD.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Alisha Sprinkle Korba Portfolio

## Why

This is a **vision to realize** with an **opportunity** attached: make Alisha's professional reputation portable by *demonstrating* — not claiming — that she translates business needs into engineering decisions, owns complicated work from ambiguity through delivery, applies appropriate engineering judgment rather than defaulting to maximal sophistication, and makes the people around her better. It also shows that the professional engineer and the person outside work are one coherent person ("Alisha is all her things").

The backdrop: the live site at `alishasprinklekorba.com` (repo `asprinkleofcode.github.io`) is a minimal two-route SPA that reads like a résumé stub, and Alisha needs something she can confidently share with managers, leadership, peers, professional connections, speaking contacts, and people who find her through search. The people who have actually asked her for the link are talk attendees and colleagues — visitors who arrive by choice, already holding one context for her, and set their own depth (PRD D-21).

The outcome every downstream trade-off resolves against: a visitor leaves thinking *"She's clearly a strong engineer, she thinks beyond the code, and now I understand what makes her distinctly Alisha."*

## Capabilities

- **CAP-1** — Landing / professional recognition
  - **intent:** A visitor can identify Alisha, her role (Senior Software Engineer), and the portfolio's purpose from the landing experience or an immediately adjacent surface.
  - **success:** In a ~90-second scan, a representative visitor states Alisha's professional role and the portfolio's purpose without deep reading (SM-1). The ~90 seconds is a legibility floor on the entry surface, not the intended depth (PRD D-22).

- **CAP-2** — Visible exploration paths
  - **intent:** From the landing surface a visitor can see the distinct paths — "Engineering", "Leadership & Enablement", "Beyond the Code" — and choose one without first reading the whole site.
  - **success:** Shown only the landing surface, a representative visitor names the three paths and picks one to explore (FR-3, PO-4). Path definitions and content targets: `exploration-paths.md`.

- **CAP-3** — Summary → choose → deep story navigation
  - **intent:** Within a professional path a visitor can understand what the path represents, scan concise story summaries, select one, and reach a deeper story experience.
  - **success:** A visitor completes path index → summary scan → story selection → deep story on both professional paths, with the homepage carrying only enough information to make the choice (FR-15, C-6).

- **CAP-4** — Engineering evidence stories
  - **intent:** The Engineering path presents 2–3 public-safe stories giving concrete evidence of technical ownership, business-to-engineering translation, engineering judgment, and ambiguity handling.
  - **success:** A representative professional visitor points to concrete evidence of business-to-engineering translation, end-to-end ownership, judgment, and ambiguity handling across the set (SM-2); each included story traces to a target capability rather than an interesting technology (FR-4).

- **CAP-5** — Leadership & Enablement evidence stories
  - **intent:** The Leadership & Enablement path presents 2–3 public-safe stories showing how Alisha grows or enables the people around her, including repeatable enablement (individual knowledge turned into a reusable asset) where that evidence exists.
  - **success:** A visitor identifies concrete developing-others evidence in at least one story; where an onboarding or knowledge-transfer story is present, the visitor sees how individual knowledge became reusable (SM-2, FR-9, FR-10).

- **CAP-6** — Deep-story reasoning depth
  - **intent:** A deep story exposes the reasoning behind the work — context, ownership, decision, rationale, tradeoffs, collaboration, outcome, reflection — rather than unsupported descriptive claims.
  - **success:** Reviewers confirm each deep story addresses the applicable points of the story-evidence model (`professional-storytelling.md`) and that generic adjectives do not substitute for evidence (FR-16).

- **CAP-7** — Beyond the Code personal dimensions
  - **intent:** A visitor can discover Alisha's personal dimensions — powerlifting and Birdhouses — as authentic explorations, with depth that follows the available material and no forced hobby-to-engineering metaphor. Where a dimension has a real supporting resource, the visitor can reach it from that dimension's own context (FR-14).
  - **success:** A representative visitor names at least one meaningful personal dimension and still recognizes it as the same person as the professional identity (SM-3); no explicit "hobby improves engineering" claim appears (FR-13). When the Birdhouses care guide exists, a visitor can open or download it from the Birdhouses dimension — a downloadable PDF hosted in-portfolio, not an external link (PRD A-12, resolved; `ARCHITECTURE-SPINE.md` AD-20); until it exists, no placeholder is shown (`EXPERIENCE.md` §14 Missing Content, NFR-4).

- **CAP-8** — Professional continuation
  - **intent:** A professional visitor can continue engagement through external destinations — LinkedIn and GitHub — surfaced where appropriate.
  - **success:** A professional visitor locates a working outbound path to LinkedIn and to GitHub (SM-4, FR-17). Exact URLs are pending from Alisha (see Open Questions); until a destination exists that link is omitted, never stubbed or pointed at a placeholder (`EXPERIENCE.md` §14 Missing Content, NFR-4).

- **CAP-9** — Personal continuation
  - **intent:** Where a Beyond the Code dimension has a real external presence, that dimension links out to it from its own context (powerlifting → powerlifting Instagram; making → birdhouse-making Instagram), with the portfolio hosting neither that content nor any commerce.
  - **success:** From each dimension's context a visitor reaches the correct external account; no feed or store is embedded in the portfolio (FR-19, Non-goals). Handles are pending from Alisha (see Open Questions); a dimension whose handle does not yet exist simply carries no outbound link, never a stub (`EXPERIENCE.md` §14 Missing Content, NFR-4).

- **CAP-10** — Speaking surface (conditional)
  - **intent:** When Alisha has public-safe speaking material, the portfolio can present professional speaking visibility.
  - **success:** The speaking surface ships only when public-safe speaking content exists and is never populated with invented content (FR-18); it is a near-term follow-up, not an MVP deliverable.

- **CAP-11** — Semantic and structured discoverability
  - **intent:** The public experience exposes enough semantic content and structured identity metadata for visitors and search / AI systems to understand Alisha's name, Senior Software Engineer role, professional capabilities, and the relationships among portfolio content.
  - **success:** Automated inspection finds machine-readable identity, role, and capability data plus content relationships on the relevant surfaces (FR-22, FR-23).
  - **scope:** Satisfied at the site and person level only. `HashRouter` leaves one crawlable URL, so per-story organic search discoverability is an explicit non-goal (`ARCHITECTURE-SPINE.md` AD-14, PRD §7.8 scope constraint).

- **CAP-12** — Entry legible from a known context
  - **intent:** A visitor who arrives already holding one context for Alisha — most often having just heard her speak, or a colleague following a link — can connect what they already know to what the portfolio shows, without that context being reproduced on the site.
  - **success:** A representative visitor arriving from a talk recognizes the professional identity and exploration paths as the same person they just listened to. Satisfied by the entry surface alone; does **not** require CAP-10's speaking surface to exist (FR-24, PRD D-23).

## Constraints

- **Brownfield, not greenfield.** This evolves the existing public portfolio. The current codebase is a minimal Vite + React 19 SPA (Tailwind v4, `flowbite-react`, `HashRouter`) on GitHub Pages with two routes (`/`, `/about`) and a small shared theme; most path and story surfaces do not exist yet. The existing repo, theme tokens, and media are retained context, not disposable. (C-1)
- **Hosting stays GitHub Pages; the operating model stays low-to-no-cost.** New infrastructure or services require justification against actual product value. Rules out a hosted CMS, paid infrastructure, or a server runtime introduced for novelty. (C-2, D-13)
- **All professional content stays inside a public-safe boundary** (`professional-storytelling.md`). Protecting confidential information must not be used as an excuse to make Alisha's contribution invisible — maximize evidentiary value while minimizing disclosure risk. (C-3, D-14)
- **The experience represents the real Alisha.** Personality is fun, outgoing, confident, and grounded, and must not become quirky or gimmicky for novelty's sake. (C-4, D-3)
- **The product embodies the engineering philosophy it communicates.** Build the solution that serves the actual user and product need, not every technically possible interaction. (C-5)
- **The homepage is a decision surface, not a content destination.** It stacks three sections in order — Recognition (identity, title, and the one-line positioning statement below, D-25), Exploration (the three path entries, label-only), Evidence & Highlights (Engineering and Leadership & Enablement each carry at least one dedicated evidence teaser; Beyond the Code carries one personal-hint teaser, not evidence); deeper evidence, stories, and personal content live on downstream path and story experiences. (C-6, PRD A-10 resolved, `EXPERIENCE.md` v0.8 §6.1–§6.5, UX-025)
- **Homepage positioning statement is decided, verbatim** (D-25): *"Give me a business problem and I'll turn it into an engineering decision worth trusting."* Sits directly under name/title in the Recognition section above.
- **Professional clarity comes first in the initial scan.** Personality and personal dimensions enrich the experience but must not obscure or outrank the professional evidence paths while a visitor is still orienting. (D-10, PO-1)
- **No content is invented to fill a surface.** Speaking material, personal-dimension depth, story specifics, testimonials, and metrics come from real material, or the surface waits. (FR-13, FR-16, FR-18, Non-goals, §13 counter-metrics)
- **No public release below the production-quality floor** (`release-quality-floor.md`). Incomplete or intentionally experimental work stays non-public until it meets that floor. (NFR-4, D-12)
- **WCAG 2.2 AA is the conformance target.** Motion and ambient visual effects must have an accessible reduced-motion experience, with a mandatory static fallback. (NFR-1, NFR-5, D-11, D-20)
- **Usable across supported mobile and desktop viewport sizes.** (NFR-2)
- **Visitor-facing path labels are fixed by product decision:** "Engineering", "Leadership & Enablement", "Beyond the Code" (D-15). **Navigation structure is resolved, not UX-open:** a single, flat, sticky header row — identity, then Home and the three paths, identical on every page — with external and social links footer-only, collapsing via the existing mobile hamburger pattern (PRD A-9, resolved; `EXPERIENCE.md` v0.8 §5.2, UX-015).
- **`DESIGN.md` v0.6 and `EXPERIENCE.md` v0.8 are authoritative** for the visual and experience domains respectively. This spec defers to them and does not restate their token, interaction, or information-architecture decisions. (D-19)

## Non-goals

- Not an exhaustive résumé, career archive, or complete inventory of every technology Alisha has used.
- Not a replacement for a formal performance review, and not a replacement for LinkedIn.
- Not a repository of proprietary engineering documentation, and not a generic engineering tutorial site.
- Not a novelty-driven interactive experience; story count, animation volume, and content volume are not themselves goals.
- Not a social publishing platform and not a birdhouse commerce platform — external presences are contextual outbound links only.
- No forced metaphor connecting every personal interest to an engineering capability.
- No third professional evidence category for MVP; no fixed story count for Beyond the Code; no placeholder for a future personal dimension.
- No custom CMS or cost-/operations-increasing infrastructure unless later planning establishes a genuine need.
- Does not replace UX design, experience design, architecture, or story-level planning — those are downstream artifacts.

## Success signal

Alisha can confidently share the public URL with managers, leadership, peers, professional connections, speaking contacts, and people who discover her through search (SM-5). Concretely: a representative visitor spending only the ~90-second entry-surface budget comes away able to name Alisha's core professional strengths and at least one evidence story worth exploring (SM-1); a representative professional visitor can point to concrete evidence of business-to-engineering translation, end-to-end ownership, engineering judgment, ambiguity handling, or team enablement (SM-2); and a representative visitor can name at least one personal dimension and still recognize it as belonging to the same person as the professional identity (SM-3) — with every public surface meeting the production-quality floor.

## Assumptions

- **Primary audience (PRD A-1 / D-21):** The primary representative audience is the visitor who already knows Alisha in at least one context and arrives by choice, unhurried — talk attendees and colleagues (PRD §4.1, UJ-2). Observation-supported. The time-boxed professional read (PRD §4.2, UJ-1) is secondary and carries the ~90-second entry constraint; that traffic is assumed but unobserved (PRD A-15).
- **Visual media availability (PRD A-11):** MVP visual media is limited — a headshot and powerlifting photos exist; Engineering and Leadership stories are text-first, using diagrams where a visual would aid comprehension; Birdhouses imagery is expected from the making Instagram or new photography. Content risk.
- **Speaking readiness (PRD A-13):** Speaking material is in progress and not yet public-ready; CAP-10's surface is a near-term follow-up, not an MVP deliverable.
- **Performance budgets:** Intentionally deferred to Architecture, to be set after the final content and media strategy; bounded by the low-to-no-cost constraint (NFR-3, PRD A-8).

## Open Questions

These need Alisha's content decisions and must not be invented by downstream agents. They do not block UX or architecture, but the contract is not content-complete until they are answered.

- Which 2–3 Engineering stories form the strongest initial set, and which candidates should be reduced or excluded for weak public-safe evidence? **In progress:** Auth.RcmAppAccessWatcher (ES-1) selected; 1–2 more needed (PRD §5.1, §14.3, `addendum.md`).
- Which 2–3 Leadership & Enablement stories form the strongest initial set? (PRD §14.3)
- What public-safe details can be disclosed for each professional story? Resolved for Auth.RcmAppAccessWatcher (`addendum.md`); still open for every other selected story. (PRD §14.3)
- What speaking topics and events exist once public-safe material is ready? Gates CAP-10. (PRD §14.3, A-13)
- What photography or video is available for the making dimension and for story imagery? (PRD §14.3, A-11)
- What are the exact powerlifting and birdhouse-making Instagram handles and the GitHub profile URL? Pending from Alisha; blocks CAP-8 / CAP-9 implementation. (PRD A-14)
- How does the ambient / star layer and its reduced-motion behavior evolve? Deferred to implementation under fixed constraints in `DESIGN.md` §16 and `EXPERIENCE.md` §14. (PRD §14.2, D-20)
