# Reviewer Gate — Lens: web-research / reality-check verification

Every committed technology checked against npm + the web, September 2026.

| Claim | Check | Result |
| --- | --- | --- |
| Vite ^7.0, React ^19.1, react-router ^7.9, Tailwind ^4.1, flowbite-react ^0.12, react-icons ^5.5, eslint ^9.30 | ratified from `asprinkleofcode/package.json` | ✓ reality-checked against the repo |
| flowbite-react latest | `npm view` → 0.12.17 | ✓ compatible with repo `^0.12.5` |
| react-router v8 exists | 8.3.1 published; repo on 7.x | ✓ noted, explicitly **not** upgrading — spine ratifies 7.x |
| `@mdx-js/rollup` ^3.1 fits Vite 7 + React 19 | 3.1.1; docs: `enforce: 'pre'` before `@vitejs/plugin-react`, ESM-only, "Vite 8+ needs no extra plugin" | ✓ fits |
| `typescript` pin | TS 7.0.2 is npm `latest`, but no stable programmatic API until 7.1 (Autumn 2026); typescript-eslint closed TS7 support "not planned"; MDX/Vue/Svelte/Astro tooling blocked | ✓ **spine correctly pins 5.x** (5.9.3), defers TS7 |
| `typescript-eslint` ^8.70 supports the pin | 8.70.0 peer `typescript: ">=4.8.4 <6.1.0"` | ✓ 5.9 in range; confirms TS7 is out of range |
| `vitest` ^5.0 fits Vite 7 | 5.0.0 peer `vite: "^6.4.0 || ^7.0.0 || ^8.0.0"` | ✓ Vite 7 supported — no need to downgrade to Vitest 4 |
| `@testing-library/react` ^16.3 | 16.3.3 | ✓ current |
| `eslint-plugin-jsx-a11y` ^6.10 + eslint 9 flat config | 6.10.2 peer `eslint: "... || ^9"` | ✓ |
| `rollup-plugin-visualizer` ^7.1 | 7.1.1 | ✓ dev-only, on-demand |

**Verdict: clean.** No asserted-from-memory version. The TypeScript pin is the notable save — following npm `latest` would have broken the `typescript-eslint` + `@mdx-js` toolchain the spine sets up. One residual item to log: `@mdx-js/rollup` "Vite 8+ needs no extra plugin" means a future Vite 8 bump can drop the plugin — worth a Deferred note but not a finding.
