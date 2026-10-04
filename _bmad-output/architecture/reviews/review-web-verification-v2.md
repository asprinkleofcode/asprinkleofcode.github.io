# Reviewer Gate — Lens: web-research / reality-check verification (pass 2)

**Target:** `_bmad-output/architecture/ARCHITECTURE-SPINE.md` (status `final`, updated 2026-09-11)
**Date of checks:** 2026-09-11
**Method:** every version claim resolved live against `registry.npmjs.org` (`/latest` + `/-/package/<p>/dist-tags` + publish times), plus vendor docs and the TypeScript iteration plan for the reasoning claims. Brownfield "ratified/new" claims diffed against `asprinkleofcode/package.json`.
**Prior pass:** `review-web-verification.md` (2026-09-10) — re-checked, and two of its conclusions are amended below.

---

## 1. Brownfield reality-check — Stack table vs `asprinkleofcode/package.json`

Every row marked **ratified** must match a real dependency; every row marked **new** must genuinely be absent.

| Spine row | Marked | `package.json` | Verdict |
| --- | --- | --- | --- |
| Vite `^7.0` | ratified | `vite: ^7.0.4` (dev) | OK |
| React / react-dom `^19.1` | ratified | `react: ^19.1.0`, `react-dom: ^19.1.0` | OK |
| react-router `^7.9` | ratified | `react-router: ^7.9.6` | OK |
| Tailwind CSS / `@tailwindcss/vite` `^4.1` | ratified | `tailwindcss: ^4.1.11`, `@tailwindcss/vite: ^4.1.11` | OK |
| flowbite-react `^0.12 (0.12.17)` | ratified | `flowbite-react: ^0.12.5` | OK — but see F6 (the parenthetical is npm-latest, not the repo pin) |
| react-icons `^5.5` | ratified | `react-icons: ^5.5.0` | OK |
| eslint `^9.30` | ratified | `eslint: ^9.30.1`, `@eslint/js: ^9.30.1` | OK — but see F3 |
| `@mdx-js/rollup` `^3.1` | new | absent | OK — genuinely new |
| `typescript` `~5.9` | new as direct dep | absent (`@types/react ^19.1.8`, `@types/react-dom ^19.1.6` **are** present) | OK — the "as a direct dep" wording is precise and correct; the types are pre-existing |
| `typescript-eslint` `^8.70` | new | absent | OK |
| `eslint-plugin-jsx-a11y` `^6.10` | new | absent | OK |
| `vitest` / `@testing-library/react` `^5.0` / `^16.3` | new | both absent | OK |
| `rollup-plugin-visualizer` `^7.1` | new, dev-only | absent | OK |

Also reality-checked: the spine's AD-17 claim that `build` is currently ungated is true — `package.json` `scripts.build` is bare `vite build`, and there is no `tsconfig.json` in `asprinkleofcode/`. The AGENTS.md note that lint covers only `.js`/`.jsx` is consistent with `scripts.lint: "eslint ."` plus a flat config that has no TS parser.

**Not in the Stack table but load-bearing:** `@vitejs/plugin-react ^4.6.0` (see F4), plus `generate-react-cli`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`. Only `@vitejs/plugin-react` matters for this lens.

---

## 2. Version currency — claimed vs verified-current

| Technology | Spine claim | Verified current (2026-09-11) | Verdict |
| --- | --- | --- | --- |
| Vite | `^7.0` ratified | `latest` **8.3.0**; `previous` tag 7.3.6 | **OK** — deliberate (repo is on 7.x); but Vite 8 is now GA, not hypothetical. See F1. |
| React / react-dom | `^19.1` ratified | 19.3.0 | OK — caret resolves cleanly |
| react-router | `^7.9` ratified; "v8 exists; not upgrading" | `latest` **8.3.1**; `version-7` tag 7.18.3 | OK — v8 confirmed to exist, deferral intact. Note rr8 peers `react >=19.2.7`, which the repo would satisfy on resolve, so the deferral rests on scope alone (as the spine says). |
| Tailwind CSS / `@tailwindcss/vite` | `^4.1` | 4.3.3 (both packages); `@tailwindcss/vite` peers `vite ^5.2 \|\| ^6 \|\| ^7 \|\| ^8` | OK — Vite 7 supported |
| flowbite-react | `^0.12 (0.12.17)` | 0.12.17, **published 2026-02-09**; peers `react ^18 \|\| ^19`, `tailwindcss ^3 \|\| ^4` | OK — version and peers confirmed; staleness noted as F5 |
| react-icons | `^5.5` | 5.7.0 | OK |
| eslint | `^9.30` ratified | `latest` **10.10.0** | OK for the repo; F3 |
| `@mdx-js/rollup` | `^3.1`, `enforce: 'pre'` before `@vitejs/plugin-react`, ESM-only | 3.1.1 (published 2025-08-29); peer `rollup >=2`. MDX docs confirm verbatim: "If you also use `@vitejs/plugin-react`, you must force `@mdx-js/rollup` to run in the `pre` phase before it" | **OK** — the *plugin and ordering* claims verify. The separate Vite-8 claim does not — F1. |
| `typescript` | `~5.9`; "stay on 5.x; **not** 7.x" | `latest` **7.0.2** (2026-07-08); latest 5.x = **5.9.3 (2025-09-30)**; **6.0.3 (2026-04-16) is a stable GA release** | **Stale reasoning** — F2. The 5.x pin is safe, but 6.0.x was never considered and is inside the toolchain's supported range. |
| `typescript-eslint` | `^8.70` | 8.70.0 (published 2026-09-07); peers `eslint ^8.57 \|\| ^9 \|\| ^10`, `typescript >=4.8.4 **<6.1.0**`; no v9 line; dist-tags show only `latest`/`canary` | OK — and the peer range independently confirms both that TS 7 is excluded **and** that TS 6.0.x is permitted |
| `eslint-plugin-jsx-a11y` | `^6.10` | 6.10.2, **published 2024-10-26**; peer `eslint ^3 … ^9` | OK today (repo on eslint 9); F3 |
| `vitest` | `^5.0` | 5.0.0 (published 2026-09-03); peer `vite ^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0` | **OK — re-confirmed.** Vite 7 is explicitly in range; no downgrade to Vitest 4 needed. |
| `@testing-library/react` | `^16.3` | 16.3.3 (2026-08-27); peers `react ^18 \|\| ^19` + `@types/react`, `@types/react-dom`, `@testing-library/dom ^10` | OK — note the `@testing-library/dom` peer is an extra install the baseline story must not forget |
| `rollup-plugin-visualizer` | `^7.1` dev-only | 7.1.1 (2026-08-14); peers `rollup 2.x \|\| 3.x \|\| 4.x` + `rolldown 1.x` | OK — Vite 7 bundles Rollup 4 |

### Re-check of the TypeScript 5.x-vs-7.x reasoning (explicitly requested)

The spine's stated reason — *"no stable programmatic API until TS 7.1; typescript-eslint + MDX tooling incompatible"* — **still holds as of today, and is now datable**:

- TypeScript `latest` is 7.0.2 and has not moved since 2026-07-08. The `next` tag is `7.1.0-dev.20260911.1` — 7.1 is still nightly-only.
- The TypeScript 7.1 iteration plan (microsoft/TypeScript#63703) schedules **beta 2026-10-06, RC 2026-11-10, stable 2026-11-24**, and 7.1 is where the stable programmatic API lands.
- typescript-eslint#12518 ("TypeScript 7.0.2 Support") was closed *not planned*, and the shipped 8.70.0 peer range `typescript >=4.8.4 <6.1.0` confirms it mechanically.
- The blocker is ecosystem-wide (typescript-eslint, ts-jest, ts-morph, Vue/Svelte/Astro template checkers), not spine-specific.

**Verdict: the TS 7 deferral is correctly researched, not asserted.** The spine's Deferred row could now carry the concrete date (revisit ~2026-11-24) instead of "expected ≥ TS 7.1".

---

## 3. Findings

### F1 — [Medium] "On Vite 8+ MDX needs no separate plugin" is unsupported and would break the content pipeline if acted on

Spine, Deferred: *"Drop `@mdx-js/rollup` plugin wiring — On Vite 8+ MDX needs no separate plugin; not worth a Vite-major bump now. Revisit when: the repo moves to Vite 8."* The prior review recorded the same sentence as coming from the `@mdx-js/rollup` docs.

It does not. The MDX documentation (`mdxjs.com/docs/getting-started/`, `mdxjs.com/packages/rollup/`) describes **no** built-in MDX support at any Vite version and directs all Vite users to install and configure `@mdx-js/rollup`. The sentence traces to the README of the unrelated third-party wrapper `vite-plugin-mdx`: *"If you're on Vite 8 or later, you don't need this plugin and can use @mdx-js/rollup directly"* — i.e. **that wrapper** is obsolete on Vite 8, precisely *because* you use `@mdx-js/rollup` instead. The claim was inverted in transcription.

Vite 8 ships Rolldown rather than Rollup; the live work in that direction is mdx-js#2671, an open proposal for an `@mdx-js/rolldown` package, still at planning stage — a plugin *swap*, not a plugin *removal*.

Impact: AD-1 makes `@mdx-js/rollup` the single content pipeline. A future Vite 8 bump taken on this Deferred row's word would delete the wiring that compiles every story. The row should say "swap `@mdx-js/rollup` for `@mdx-js/rolldown` when that package ships" — the deferral itself (don't bump Vite now) remains sound.

### F2 — [Medium] The `typescript ~5.9` pin never evaluated TypeScript 6.0, which is stable and inside the supported peer range

The Stack row and the Deferred row both frame the decision as binary: 5.x vs 7.x. But **TypeScript 6.0 GA'd on 2026-03-23** (6.0.2), with 6.0.3 on 2026-04-16 — announced as the last JavaScript-codebase release, the designated migration step toward 7.0. Crucially, `typescript-eslint@8.70.0`'s peer range is `>=4.8.4 <6.1.0`, so **6.0.x is explicitly supported** by the exact linter the spine pins, and the ecosystem guidance for API-dependent tooling is to sit on TS 6 (not TS 5) while waiting for 7.1.

The spine's pin resolves to 5.9.3, published 2025-09-30 — roughly a year old, and the release *before* the one designed to smooth the 7.x migration AD-9 will eventually need. Nothing breaks at 5.9.3, so this is not an error; it is a version choice that was reality-checked against the wrong question ("is 7 safe?") instead of the right one ("what is the newest version my toolchain supports?"). The prior review repeated the gap by validating the pin as "correctly pins 5.x".

Suggested: re-pin to `~6.0` (or state explicitly why 6.0's deprecations/default changes are not worth absorbing in the baseline story), and update the Deferred row to a two-step path 6.0 → 7.1.

### F3 — [Low] `eslint ^9.30` is ratified-true but is no longer current, and the a11y plugin pins the ceiling

ESLint `latest` is **10.10.0**; the repo is on `^9.30.1`, so the "ratified" mark is accurate. But `eslint-plugin-jsx-a11y@6.10.2` has not been published since **2024-10-26** and its peer range tops out at `^9` — it does not declare ESLint 10 support. `typescript-eslint@8.70.0` already spans `^8.57 || ^9 || ^10`.

Impact: AD-15 makes `jsx-a11y` the enforcement mechanism for the statically-checkable accessibility rules, so it is load-bearing for NFR-1. The baseline story is where an implementer might "modernise while I'm in here" and bump ESLint to 10, which would peer-conflict. Worth one sentence in the Stack note: ESLint stays on 9.x for this initiative because `jsx-a11y` has not declared 10 support.

### F4 — [Low] `@vitejs/plugin-react` is absent from the Stack table, and its current release requires Vite 8

The `@mdx-js/rollup` row's whole correctness condition is ordering relative to `@vitejs/plugin-react`, yet that package has no row and no pin in the spine. The repo has `^4.6.0`; npm `latest` is **6.1.1**, whose peer is `vite: ^8.0.0`. A baseline-story `npm i -D @vitejs/plugin-react@latest` alongside the MDX install would force a Vite 8 bump the spine explicitly defers. Add the row as `@vitejs/plugin-react ^4.6 — ratified; stays on 4.x while Vite is 7.x`.

### F5 — [Info] flowbite-react is a pre-1.0 dependency with no release in seven months

0.12.17 was published 2026-02-09 and is still `latest`; the package has never reached 1.0. AGENTS.md and the spine's Conventions make it the mandated way to build all UI ("do not hand-roll equivalents"), so it is the single largest third-party surface in the architecture. Peers verify clean against React 19 / Tailwind 4. No action required and no claim is stale — but "ratified" should not be read as "actively maintained", and this is the dependency most likely to become a real constraint.

### F6 — [Info] The flowbite-react cell mixes two different numbers

`^0.12 (0.12.17)` — `^0.12` is the repo's declared range (actually `^0.12.5`) and `0.12.17` is the npm-latest resolution. Every other ratified row quotes only the declared range. Cosmetic, but in a table whose header says "ratified from `asprinkleofcode/package.json`" it reads as a package.json value it is not.

---

## 4. Could not verify

Nothing material was left unverified. All fourteen Stack technologies resolved live from the npm registry, including peer ranges and publish dates; the TS 7.1 schedule, the typescript-eslint TS7 position, the TS 6.0 GA, and the MDX plugin-ordering requirement were confirmed against primary or near-primary sources. The one claim that could **not** be substantiated is F1, and that is reported as a finding rather than as an unverifiable — the evidence affirmatively contradicts it.

Two items are forward-looking and therefore unverifiable by nature, correctly flagged as such in the spine: the TS 7.1 stable date (scheduled 2026-11-24, could slip) and whether `typescript-eslint` ships TS 7 support promptly after it.

---

## Verdict

**PASS with two corrections.** No version in the Stack table is fabricated, every "ratified" row matches `asprinkleofcode/package.json` exactly, every "new" row is genuinely absent, and the TypeScript 5.x-over-7.x pin plus its stated reason re-verify cleanly against the TS 7.1 iteration plan and `typescript-eslint@8.70.0`'s shipped peer range — as do vitest 5 on Vite 7, `@mdx-js/rollup` 3.1.1 with its `enforce: 'pre'` ordering, flowbite-react 0.12.17, and react-router 8's existence. The two corrections are **F1** (the Deferred row's "Vite 8 needs no MDX plugin" is an inverted reading of a different package's README and would delete the content pipeline if followed) and **F2** (the `~5.9` pin skipped stable TypeScript 6.0, which `typescript-eslint` explicitly supports). F3–F6 are notes for the toolchain-baseline story, not blockers.
