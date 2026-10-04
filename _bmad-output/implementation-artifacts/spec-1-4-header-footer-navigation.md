---
title: 'Story 1.4: Header, Footer & Navigation'
type: 'feature'
created: '2026-10-04'
status: 'done'
baseline_commit: '82f9c15cc609b47519472179a146e51e76323702'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Today's header has four problems:
- It scrolls away.
- It links only to Home and a legacy "About Me" page.
- Its cupcake mark is invisible on the dark background.
- Legacy CSS overrides its name colour.

The footer's icons have no accessible names, the icons are out of the decided order, and the Flaticon credit is a bare icon. Its copyright `href="#"` triggers a raw hash navigation.

**Approach:**
- **Header:** rebuild it as one flat, sticky flowbite row: identity, Home, Engineering, Leadership & Enablement, Beyond the Code. Recolour the mark to `brand.primary` with a CSS mask.
- **Footer:** rebuild it as UX-028 decides. Add a reusable `ExternalLink` (UX-DR16) for the credit. Keep every URL in a new `src/lib/links.ts`.
- **Cleanup:** fold in the deferred Header/Footer CSS cleanup and theme-slot pruning.

## Boundaries & Constraints

**Always:**
- Use flowbite `Navbar`/`NavbarToggle`/`NavbarCollapse`/`Footer`/`FooterIcon`. Use role tokens and `type-*` only.
- Every interactive element gets the solid `focusRing` and a target of at least 24×24 px.
- Active nav sets `aria-current="page"` and uses an underline on desktop as its non-colour cue.
- The URL literals live only in `src/lib/links.ts`, and LinkedIn and GitHub match `index.html` `sameAs`.
- Header hover effects are static under reduced motion.
- The favicon is unchanged.

**Decisions (owner, 2026-10-04):**
- **Footer row (UX-028):** icon-only, in this order:
  1. LinkedIn
  2. Instagram @asprinkleofcode (`https://www.instagram.com/asprinkleofcode/`)
  3. Instagram @orangecatwoodcraft (`https://www.instagram.com/orangecatwoodcraft/`)
  4. GitHub
- **Footer icon behaviour:**
  - Each icon opens with `target="_blank"` and `rel="noopener noreferrer"`. It has no visible extra marker, because the logo is the cue.
  - Each icon's accessible name gives the platform, the handle if there is one, and "(opens in a new tab)". For example: "Instagram @orangecatwoodcraft (opens in a new tab)".
- **Woodcraft glow:** the @orangecatwoodcraft icon alone shows a `glow.woodcraft` glow (`drop-shadow(0 0 6px)` of `#F5A962` at 60% alpha) on hover and keyboard focus. It never shows at rest, and the solid focus ring still appears.
- **Flaticon credit:** keep it as a small text credit, "Cupcake icon by Flaticon". It uses `ExternalLink`, so it carries the visible arrow and sr-only "(opens in a new tab)".
- **"About Me":** remove the header link. The `/about` route and the Landing "Learn About Me" button stay until Story 1.6.
- **Active state:** a path link is active on its index and its stories. Home is active only on `/`.
- **Mobile menu:** it closes after the visitor picks a link.
- **Copyright:** plain text with the current year, no link.

**Never:**
- No header social icons, breadcrumb, or chrome that changes with depth.
- No edits to `index.html`, `App.css`, Landing or AboutMe content, photos, or deploy config.
- No `glow.woodcraft` anywhere but that icon.
- No ambient-layer work, and no changes to `StarBackground` or `GradientWaves`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Any route | `/`, path index, deep story, `/nope`, error fallback | identical header (5 links, in order) and footer | header and footer render outside the boundary |
| Active path | `/leadership/x` | only "Leadership & Enablement" has `aria-current="page"` | `/about` and `*` routes: no link is active |
| Scroll | long page | header stays pinned; `scrollIntoView(main)` lands below it | N/A |
| Mobile menu | <768px: toggle, then pick a link | menu opens; navigation is PUSH; menu closes | N/A |
| Footer icons | any | 4 icons in order with the names above, `target`, and `rel` | N/A |

</frozen-after-approval>

## Code Map

- `src/components/Header/Header.tsx` -- keep the `HomeLink` brand adapter. Replace the `<img>` with a `<span aria-hidden>` mask mark. The name stays "Alisha Korba" (mockup `key-header.html`).
- `src/components/Header/RouterNavlink.tsx` -- keep the `RouterAnchor` adapter, which gives PUSH navigation. Add prefix matching, `aria-current`, and close-on-click with `useNavbarContext().setIsOpen(false)` (flowbite-react 0.12.5).
- `src/components/Header/Header.css` -- raw `--color-primary-*` and `invert(1)` currently override the theme brand colour (deferred item). Rewrite with tokens only. The `::after` sparkle and transitions apply only under `prefers-reduced-motion: no-preference`.
- `src/components/Footer/Footer.tsx`, `Footer.css` -- rebuild. `FooterIcon` takes `href`, `icon` and `ariaLabel`, and passes the rest through as anchor props. `FooterCopyright` without `href` renders a span.
- `src/theme/colors.css` -- add `--glow-woodcraft: rgb(245 169 98 / 0.6)` with a comment that it is decorative and used only for UX-028.
- `src/theme/theme.css` -- next to `--drop-shadow-glow`, add `--drop-shadow-glow-woodcraft: 0 0 6px var(--glow-woodcraft)`.
- `src/theme/aSprinkleOfCodeTheme.ts`:
  - `navbar.root.base` gains `sticky top-0 z-40`.
  - `link.active.on` gains a `md:underline` cue.
  - Prune slots that never render (`footer.brand`, `groupLink`, `title`, `divider`, `root.bgDark`, `navbar.link.disabled`, `root.rounded`/`bordered`) and slots identical to flowbite defaults, unless the rebuild uses them.
- `src/lib/linkClasses.ts` -- `textLinkClasses`, reused by `ExternalLink`.
- `src/index.css` -- `html, body, #root { height: 100% }` must become a min-height. `#root` is the sticky header's containing block, so a fixed height would let the header scroll away after one viewport. Re-measure `--header-height` in a browser.
- `src/App.tsx` -- no route changes. Update the `/about` legacy comment.
- `src/App.test.tsx:187-210` -- tests click "About Me". Switch them to path links.
- `react-icons` 5.5 -- `BsLinkedin`, `BsInstagram`, `BsGithub`, and `HiArrowUpRight` for the arrow.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/links.ts` -- a typed, ordered `FOOTER_LINKS` (`label`, `handle?`, `href`, `variant?: "woodcraft"`) plus `FLATICON_CREDIT_URL`.
- [x] `src/components/ExternalLink/ExternalLink.tsx` + `.css` (+ test) -- outbound text link: `target`, `rel`, visible arrow, sr-only "(opens in a new tab)", `textLinkClasses`.
- [x] `src/theme/colors.css`, `theme.css`, `aSprinkleOfCodeTheme.ts` -- woodcraft glow token and utility, sticky header, active underline, slot pruning.
- [x] `src/components/Header/*` -- five links, mask mark, active logic, close on navigate.
- [x] `src/components/Footer/*` -- `<footer>` containing the copyright, `<nav aria-label="Social profiles">` with the icon row from `FOOTER_LINKS`, and the Flaticon credit. Woodcraft gets `hover:drop-shadow-glow-woodcraft focus-visible:drop-shadow-glow-woodcraft`.
- [x] `src/index.css` -- min-height fix and the measured `--header-height`.
- [x] `src/components/Header/Header.test.tsx`, `Footer/Footer.test.tsx`, `src/App.test.tsx` -- cover every matrix row. Footer tests check order, accessible names, `href`, `target` and `rel`, that the woodcraft class appears only on its icon, and that no `href="#"` remains.

**Acceptance Criteria:**
- Given `npm run build`, then every gate passes.
- Given `npm run preview` at 375px and 1280px, when scrolling a long page and tabbing through the header and then the footer:
  - the header stays pinned
  - focus order follows the visual order, with a ring on every stop
  - the woodcraft icon glows apricot only on hover or focus
  - nothing is clipped or desktop-only
- Given the header, then the cupcake mark is visibly `brand.primary` and the favicon is unchanged.

## Implementation Notes

- Close on navigate: flowbite-react 0.12.5's `NavbarLink` already calls `useNavbarContext().setIsOpen(false)` in its own click handler, so `RouterNavbarLink` relies on that instead of calling it a second time. `Header.test.tsx` covers the behaviour.
- Active matching lives in `src/lib/isNavActive.ts` (so the component file only exports components). `/leadership/foo` for an unknown slug still marks Leadership active: it matches the `/leadership/:slug` route, not `*`.
- Footer icon glow is set per icon in `Footer.tsx`: `hover:drop-shadow-glow` for three icons and the woodcraft classes for one. The theme `icon.base` carries no glow, so the two drop-shadow utilities never compete on one element.
- Header name uses `type-title` plus a `font-weight: 700` in `Header.css`, which keeps it at the 20px identity size the header had. The mark is a 32px masked span.
- `App.tsx`: the main+footer wrapper changed from `min-h-screen` to `flex-1`. `#root` now has `min-height: 100dvh`, so the footer still sits at the bottom and the page no longer always overflows by one header height.
- `--header-height` re-measured in `vite preview`: 61px mobile, 53px desktop, so the values are unchanged.
- Pruned theme slots: `navbar.root.rounded`/`bordered`/`inner`, `navbar.collapse`, `navbar.link.disabled`, `navbar.toggle.icon`/`title`, `footer.root.bgDark`, `footer.brand`, `footer.groupLink`, `footer.title`, `footer.divider`, `footer.icon.size`, `footer.copyright.href`, `avatar.root.size`.

## Spec Change Log

## Review Triage Log

Pass 1 (blind, edge-case, verification-gap):

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 1 | Mobile menu stays open after the brand link is clicked, after Back, or after any non-NavbarLink navigation (edge-case, incl. claim) | medium | Only flowbite `NavbarLink` calls `setIsOpen(false)` on click; `Navbar` keeps its `isOpen` state across route changes because Header never remounts | patch |
| 2 | Masked cupcake mark disappears in forced-colors mode (blind, edge-case) | low | Forced colors replace `background-color` with a system colour, which is what fills the mask. The fix is one direct CSS rule | patch |
| 3 | Header `<nav>` is unnamed now that the footer adds a named one; the test helper relies on the missing name (blind) | low | `App.test.tsx` finds the header nav with `!hasAttribute("aria-label")`. Adding `aria-label="Main"` is a direct fix | patch |
| 4 | Brand hover glow on the three non-woodcraft icons is not asserted (verification-gap) | low | Pre-verified gap: the glow moved from the theme slot to per-icon `glowClasses`, and no test checks it | patch |
| 5 | `sameAs` drift test skips the shared powerlifting Instagram URL (blind) | low | `index.html` `sameAs` lists `instagram.com/asprinkleofcode/`, but the test checks only LinkedIn and GitHub. A one-line assertion fixes it | patch |
| 6 | Flowbite default classes (`dark:*` raw palette, toggle `focus:ring-gray-200`, copyright `sm:text-center`) merge into themed slots (edge-case, blind) | medium | Real: the build's `dark` variant is `prefers-color-scheme: dark`, and createTheme twMerges defaults into each slot. Pre-existing: the same default classes were merged into these slots before this change (toggle base and copyright base are unchanged) | defer |
| 7 | `links.ts` claims every external URL, but legacy `Hero.jsx:28` hard-codes one, opening in the same tab (verification-gap other) | low | Pre-existing legacy Landing code. Story 1.6 rebuilds Landing | defer |
| 8 | Header wraps between 768 and 1024px, so `--header-height` is too small (blind, edge-case) | false | Measured in `vite preview` at 768px: nav height 52.8px, matching `3.3125rem` (53px); no wrap | reject |
| 9 | Active-link match is case-sensitive while React Router matches case-insensitively (edge-case) | low | Needs a hand-typed miscased URL; the fix adds normalisation branches | reject |
| 10 | `ExternalLink` caller `aria-label` would erase the new-tab notice (blind, edge-case) | low | No caller passes one; guarding it adds API surface | reject |
| 11 | `ExternalLink` `nowrap` could overflow with long text at 320px (edge-case) | low | The only caller is the short Flaticon credit. A proper fix (nowrap only on the last word plus the arrow) adds markup | reject |
| 12 | Copyright year test can flake across New Year (edge-case) | low | Needs a run that straddles midnight on Dec 31; the fix adds fake timers | reject |
| 13 | Theme comment overstates which slots were pruned; pruned slots would bring back raw defaults if used later (edge-case claim) | low | No current renderer uses them; this is a vague future risk | reject |
| 14 | Mask `url("/cupcake.png")` bypasses Vite's asset pipeline (blind) | low | `public/` assets are served at the root, `base` is `/` for this Pages site, and the favicon uses the same path | reject |
| 15 | Copyright textContent is `© 2026Alisha Korba` (blind) | low | Pre-existing `FooterCopyright` structure; the gap is visual margin only | reject |
| 16 | Brand glow is hover-only, not on keyboard focus (blind) | low | The glow is decorative, and the solid focus ring is the focus cue | reject |
| 17 | `isNavActive` lacks trailing-slash tests; `/leadership/foo` not-found marks Leadership current (blind) | low | Follows the frozen Decision "active on its index and its stories"; a missing slug is still under the Leadership route | reject |

## Verification

**Commands:**
- `cd asprinkleofcode && npm run typecheck && npm run lint && npm test && npm run build` -- expected: exit 0.

**Manual checks:**
- In the preview, walk the matrix at mobile and desktop widths with reduced motion on and off.

## Post-Review Change

- 2026-10-04, owner feedback: the @orangecatwoodcraft icon still turned brand pink on hover, because the shared `hover:text-brand-primary` won and the 60%-alpha apricot glow was too faint against it. The icon now turns apricot as well (`hover:text-woodcraft` and `focus-visible:text-woodcraft`, from a new solid `--woodcraft: #F5A962` token) on top of the `glow.woodcraft` glow. DESIGN.md §15, EXPERIENCE.md §13 Footer Links and UX-028, and epics UX-DR18 and Story 1.4 were amended on this branch to match.
