# Reviewer Gate — Lens: adversarial divergence attack

Construct two units one level down that obey every AD yet build incompatibly.

| Attack | Obeys all ADs? | Divergence | Disposition |
| --- | --- | --- | --- |
| Story A `capabilities: ["ownership","ambiguity"]`; Story B `["end-to-end delivery","dealing with ambiguity"]` | yes (AD-1/2/3) | Capability Signal UI shows 4 chips meaning 2 things; any grouping/filter fragments | **hole → close.** Same as rubric R1. Controlled tag list. |
| Page A implements `draft` as render-time filter; Page B excludes at the glob | yes (AD-2 as written) | A ships draft prose in the deployed JS bundle → not public-safe (AD-4) | **hole → close.** Same as rubric R9. Exclusion at registry/build level. |
| Component A: `cssVar('--brand-primary')`; Component B: `cssVar('--brand-primary')` inside a Vitest render (jsdom, no computed styles) | yes (AD-10) | B receives `''`, draws nothing; no error | **hole → close.** Same as rubric R8. Documented fallback. |
| Two `work` files, same `slug`, different `path` | yes (AD-5) | routes resolve (prefix differs); a `Map` keyed by `slug` in the registry silently overwrites one | **hole → close.** Same as rubric R4. Composite key. |
| Story A hand-rolls a "decision" look with raw `<div className="decision">` in MDX; Story B imports `DecisionBlock` | AD-8 forbids arbitrary *components*, not raw HTML | visual + semantic drift between stories | **accept with note.** AD-3 required-core + AD-8 + review cover intent; add a sentence to AD-8 discouraging hand-rolled equivalents. |
| Page A sets title in `useEffect`; Page B sets it during render | AD-14 doesn't say | React 19 concurrent rendering: render-phase side effect is unsafe / double-fires | **fold into R7.** `useDocumentMeta` contract = effect-based + restore on unmount. |
| Index page A sorts by filename; Index page B sorts by `featured` | AD-2/5 don't say | different scan order per path; undermines the 90-second journey | **fold into R5.** Fix ordering rule. |

**Verdict: four real holes (R1, R9, R8, R4), all closable with tightening — no new AD required, no inherited-AD conflict (no parent).** The paradigm's one-way dependency rule (AD-7) held up under every attack; the divergences are all in under-specified *data* (tag vocab, registry key, draft mechanism, helper fallback), not structure.
