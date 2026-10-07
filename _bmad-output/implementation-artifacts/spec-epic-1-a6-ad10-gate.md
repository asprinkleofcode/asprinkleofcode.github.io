---
title: 'Epic 1 retro A-6: AD-10 semantic-token gate'
type: 'chore'
created: '2026-10-07'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** AD-10 (UI uses semantic role tokens only) has no automated guard beyond `expectNoFlowbiteDefaults`, which rejects only `dark:` and `gray-` classes on the rendered header, footer and app shell. A primitive ramp variable (`var(--color-dark-300)`), raw hex, or any other palette utility (`text-slate-400`) in new code passes every test, so the clean state after Epic 1 depends on discipline (retro R-6, action A-6). Epic 2 is about to add a batch of new components.

**Approach:** Add a source-scan test that reads every app stylesheet and script under `src/` and fails on primitive ramp variables (`--color-(primary|dark)-<n>`), raw colour literals (hex, `rgb()`/`hsl()`/`oklch()`-style functions) and raw Tailwind palette utilities, excluding only `src/theme/colors.css` (where the primitives and role values are defined), legacy `/about` (`src/pages/AboutMe/`, retired in Epic 4), and test code. Share the palette-utility rule with `expectNoFlowbiteDefaults` so the rendered-DOM check also rejects every palette and arbitrary-colour class, not just `gray-`. Leave Tailwind's default palette enabled: legacy `/about` uses `text-blue-600`/`text-yellow-600`/`text-orange-600`, and flowbite components outside the header and footer still merge palette defaults, so disabling it would visibly change those pages.

</frozen-after-approval>

## Implementation Notes

- Scope decision: the scan covers `theme.css` and `aSprinkleOfCodeTheme.ts` too, not only files outside `src/theme/` as the retro worded it. Both are clean today, and the flowbite theme object is exactly where a stray palette class would land. Only `colors.css` is exempt.
- Named CSS colour keywords (`color: white`) are not detected: too many false positives against ordinary words in TSX. Palette utilities `*-white`/`*-black` are detected.
- `.mdx` story bodies are not scanned yet (none exist, and `?raw` imports would run through the MDX plugin). Story 2.1/2.4 can add them once the first file exists.
- Files: new `src/test/semanticTokenRules.ts` (`findColorViolations`, the shared rules), new `src/test/semanticTokens.test.ts` (source scan + rule self-tests + a check that the legacy `/about` exemption is still needed), `src/test/expectNoFlowbiteDefaults.ts` (now rejects `dark:` plus any rule violation in a class, replacing the `gray-` substring check), and one clause in `AGENTS.md` naming the gate.
- Surprise 1: `theme.css` defines `--shadow-recessed-inset: inset 0 2px 6px rgb(0 0 0 / 0.5)`, the value DESIGN §15 names. Decision: `theme.css` may hold raw colour literals in token values (`allowLiterals`), but is still checked for primitive vars and palette utilities.
- Surprise 2: `import.meta.glob` keys for files in `src/test/` start with `./`, not `../test/`, so the test-code exclusion matches `./`. A self-test asserts no test code is scanned.
- Verified: inserting `text-slate-400` into `Recognition.tsx` fails the gate with the file named; `npm run build` passes (20 files, 207 tests).
- Review patches: the variable rule now covers Tailwind palette variables (`--color-gray-300`, `--color-white`), and the utility rule covers the flowbite plugin's `primary-<n>` scale and the `dark-<n>` ramp (`bg-primary-700` is a real utility from `@plugin "flowbite-react/plugin/tailwindcss"`). `color(` and `light-dark(` count as colour functions. The legacy `/about` exemption is pinned to its three files, each checked separately. Test-file exclusion covers `.test`/`.spec` with any JS/TS extension. The file-count magic number became a per-directory check. Re-verified: `bg-primary-700` in `Recognition.tsx` fails the gate; `npm run build` passes (20 files, 209 tests).

## Review Triage Log

- medium: flowbite plugin `primary-*` utilities passed both checks. Verified in `node_modules/flowbite-react/dist/plugin/tailwindcss/colors.js` (`semanticColors.primary`). Patched.
- medium: Tailwind palette variables (`var(--color-gray-300)`, `text-(--color-slate-400)`) passed. Patched.
- low: hex rule could match an issue reference in a comment (`#123`) or an anchor like `#add`. Rejected: no current occurrence, the failure names the file and match, and excluding digit-only hex would also exempt real colours such as `#333`.
- low: tracking. Sprint status and spec status are set at close-out; the spec records the scope change from the retro wording. `.mdx` scanning deferred to `deferred-work.md`.
- medium (deferred): rendered-DOM check never runs on a component that still merges flowbite defaults (ErrorBoundary `Button`). Pre-existing leak already tracked (Story 1.8 entry); new entry to apply the check once fixed.
- low (deferred): CSS colour keywords in `.css` files not detected. `color(` and `light-dark(` patched now.
- low: legacy `/about` exemption was a directory prefix with an aggregate check. Patched (pinned files, per-file check).
- low: test exclusion missed `.test.js(x)`/`.spec.*`. Patched.
- low: `AGENTS.md` line omits exemptions and the comment rule; "colour" vs "Color" spelling. Rejected: the test file documents exemptions and the failure message is explicit; agent-file edits are deferred by rule.
- low: DOM check reads only `class`, not `style`/`fill`/`stroke`. Rejected: literal values in source are caught by the scan, and runtime-only colour values have no current path (`cssVar` does not exist yet).
- low: file-count magic number. Patched (per-directory assertion).
