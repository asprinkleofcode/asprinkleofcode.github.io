# Reviewer Gate — Rubric Walker

Target: `ARCHITECTURE-SPINE.md` (status draft → final). Deterministic `lint_spine.py`: **clean** (0 findings after the "TODO"-token false-positive was reworded).

**Verdict: solid.** Paradigm is named and load-bearing, ADs each carry Binds/Prevents/Rule, brownfield conventions are ratified not contradicted, spec coverage is complete, tech is web-verified including a real landmine (TS 7). Findings below are tightening, not structural.

| # | Sev | Finding | Disposition |
| --- | --- | --- | --- |
| R1 | med | `capabilities` frontmatter tag vocabulary is uncontrolled — two `work` stories can tag the same idea differently ("ownership" vs "end-to-end delivery"), fragmenting the Capability Signal component. | **apply** — add a controlled list to Conventions + a clause in AD-2. |
| R9 | med | AD-2 says `draft: true` is "excluded from the production build" but not *where* — render-time filtering still ships draft prose in the JS bundle (public in repo AND deployed assets). Violates AD-4 / public-safe. | **apply** — AD-2: exclusion is at registry/build level, draft bodies never enter `dist`. |
| R2 | med | Operations/runtime envelope not stated explicitly (static hosting, no runtime, no logging/monitoring/alerting). A silent dimension. | **apply** — one line in Structural Seed / Build & deploy. |
| R3 | med | No convention for external links — `target="_blank"` + `rel="noopener noreferrer"` + a "leaving the site" affordance (EXPERIENCE §13). Two builders will do this inconsistently. | **apply** — Conventions row. |
| R8 | med | `cssVar()` behaviour when the custom property is unresolved (jsdom tests, first paint) is unspecified — a component could get `''` and render invisibly. | **apply** — AD-10: `cssVar` returns a documented per-call fallback. |
| R4 | low | Registry key: same `slug` in a `work/engineering` file and a `work/leadership` file. Routing survives (different prefix) but a slug-keyed registry collides. | **apply** — AD-5: registry key is `type`+`path`+`slug`. |
| R5 | low | Path-index summary ordering unspecified (`/engineering` order). | **apply** — Conventions: `featured` first, then `date` desc; `date` optional frontmatter. |
| R6 | low | AGENTS.md "lint covers only .js/.jsx, does not lint .tsx" goes stale once AD-17 lands. | **apply** — AD-17: baseline story updates AGENTS.md accordingly. |
| R7 | low | `useDocumentMeta` must restore default `<head>` (title + injected JSON-LD) on unmount, or story metadata leaks across navigation. | **apply** — half-sentence in AD-14. |

Checklist coverage: divergence points ✓ (with R1/R9 closed) · Rules enforceable ✓ (AD-3/AD-4b are review-gated, acceptable) · Deferred items can't diverge ✓ · tech verified-current ✓ · brownfield ratified ✓ · spec capabilities covered ✓ (FR-18 correctly deferred) · no parent spine · every owned dimension decided/deferred/open ✓ (with R2 added).
