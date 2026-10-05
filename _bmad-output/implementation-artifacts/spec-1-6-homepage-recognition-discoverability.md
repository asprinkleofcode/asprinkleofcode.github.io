---
title: 'Story 1.6: Homepage Recognition & Discoverability'
type: 'feature'
created: '2026-10-04'
status: 'done'
baseline_commit: '79ba249253b3995f54c7e9d15220de32837039d3'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The homepage is the legacy "Welcome!" hero. It never states Alisha's name, title or positioning, and the static head says "Sr. Software Engineer" with no canonical, Open Graph or Twitter tags. So neither visitors nor link previews recognize her (FR-1, FR-24, AD-14, AD-18).

**Approach:** Replace the legacy Landing with a typed `Landing` page whose first section is a `Recognition` block: name `<h1>`, title, D-25 positioning line and the headshot. Rewrite the `index.html` head so it is the single owner of that identity wording. Extend the smoke test so it fails if the two drift apart.

## Boundaries & Constraints

**Always:**
- Visible strings are exactly "Alisha Sprinkle Korba", "Senior Software Engineer" and "Give me a business problem and I'll turn it into an engineering decision worth trusting."
- The Person JSON-LD `name`, `jobTitle` and `description` carry the same three strings.
- The headshot is a rounded-default portrait with a `border-border-default` edge. It sits right of the text from `md` up and stacks below it on mobile, so text comes first in DOM order.
- The headshot has `alt="Alisha Sprinkle Korba"`, explicit `width`/`height`, no `loading="lazy"`, and `fetchPriority="high"`.
- UI uses role tokens and `type-*` utilities only.
- The page has exactly one `<h1>`.

**Never:**
- Modify or replace any existing file in `src/assets/` or `public/`.
- Add `og:image` or `twitter:image`, or add a new `image` field (the existing JSON-LD `image` stays as is).
- Build Exploration or Evidence & Highlights (Story 1.7).
- Add `useDocumentMeta`, SSG or prerendering.
- Add a dependency.
- Restyle other pages.

**Decisions (2026-10-04, human):**
- **Legacy hero buttons:** drop both "Learn About Me" and "Follow the Build". Keep the `/about` route and the `AboutMe` page, reachable by URL only, until Epic 4 replaces them. Update the App.tsx comment to say so.
- **`knowsAbout`:** keep the current five (Software Engineering, APIs, Backend Systems, Platform Architecture, User Experience Design) and add Technical Leadership, Engineering Enablement, Mentoring and Scrum.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Cold load `/` | Any viewport | Name, title and positioning render without waiting on the ambient layer | N/A |
| Head/page drift | `index.html` identity text edited without the Landing (or vice versa) | `npm test` fails | Smoke test compares parsed JSON-LD to rendered text |
| Image fails | Headshot request fails | Alt text names Alisha; layout holds via `width`/`height` | N/A |

</frozen-after-approval>

## Code Map

- `asprinkleofcode/index.html` -- static head.
  - Current state: title and description say "Sr."; there are no canonical, OG or Twitter tags; there is one Person JSON-LD.
  - Keep `sameAs` (`Footer.test.tsx:98` regex-parses it), `image`, `worksFor`, `alumniOf`, `address` and `hasCredential`.
  - The canonical/site URL is `https://alishasprinklekorba.com/` (the JSON-LD `url`).
- `asprinkleofcode/src/pages/Landing/LandingPage.jsx`, `Hero.jsx`, `Hero.css` -- legacy; replaced and deleted.
- `asprinkleofcode/src/App.tsx:14,21-24,61` -- lazy Landing import; legacy `/about` route and its comment.
- `asprinkleofcode/src/App.test.tsx` -- AD-17 smoke test.
  - "Welcome!" is the `/` heading in about 8 places, and there is a "Learn About Me" test.
  - `/about` also has the h1 "Alisha Sprinkle Korba", so tests that navigate between `/` and `/about` need a different await target.
- `asprinkleofcode/src/components/Footer/Footer.test.tsx:4` -- precedent for `import indexHtml from "…/index.html?raw"`.
- `asprinkleofcode/src/App.css` -- unlayered global `h1`/`p` rules: font-size, margin, color, text-shadow. Being unlayered, they override Tailwind `type-*` utilities. Legacy; don't edit (other pages depend on it).
- `asprinkleofcode/src/theme/theme.css` -- `type-identity`, `type-title`, `type-body`, `rounded-default`, `border-border-default`, `text-brand-primary`, `text-text-secondary`.
- `asprinkleofcode/src/assets/alisha-sprinkle-korba-headshot.jpg` -- 1668×2085, 322 KB. Original; never touch.

## Tasks & Acceptance

**Execution:**
- [x] `asprinkleofcode/src/assets/alisha-sprinkle-korba-headshot-640.webp` -- new 640×800 derivative of the headshot -- an LCP-friendly image. Generate it with a one-off `npx sharp-cli` run in the scratchpad, never as a project dependency.
- [x] `asprinkleofcode/src/lib/identity.ts` -- export `IDENTITY = { name, title, positioning }` -- one TS source for the page; `index.html` mirrors it and the smoke test guards the mirror.
- [x] `asprinkleofcode/src/components/Recognition/Recognition.tsx` + `Recognition.css` + `Recognition.test.tsx` -- takes props `name`, `title`, `positioning`, `headshotSrc`; renders a `<section>` with h1, two `<p>` and the `<img>` per Always; tests cover alt, dimensions, no lazy, DOM order.
- [x] `asprinkleofcode/src/pages/Landing/Landing.tsx` -- renders `<Recognition {...IDENTITY} headshotSrc={webp} />`, the only section for now; delete `LandingPage.jsx`, `Hero.jsx`, `Hero.css`.
- [x] `asprinkleofcode/src/App.tsx` -- point the lazy import at `./pages/Landing/Landing`; update the `/about` comment per the Decisions.
- [x] `asprinkleofcode/index.html` -- add or rewrite these tags:
  - title `Alisha Sprinkle Korba | Senior Software Engineer`;
  - a description that leads with name, title and positioning;
  - `<link rel="canonical">`;
  - `og:type`/`title`/`description`/`url`/`site_name`;
  - `twitter:card=summary`/`title`/`description`;
  - a JSON-LD `@graph` containing the Person (with `jobTitle`, `description` and `knowsAbout` per the Decisions), a `WebSite` and a `ProfilePage` whose `mainEntity` is the Person.
- [x] `asprinkleofcode/src/App.test.tsx` -- add the following and update the "Welcome!" expectations and remove the Learn About Me test:
  - parse the Person node from `index.html?raw` and assert that `name`, `jobTitle` and `description` equal the rendered h1, title and positioning text, and equal `IDENTITY`;
  - assert `<title>` and the meta description contain them;
  - assert `/` has exactly one h1.

**Acceptance Criteria:**
- Given `/` at 375px and at 1280px, when it renders in a browser, then name, title and positioning use the `type-*` scale (no legacy 3rem/4rem h1 or text-shadow), and the headshot is right of the text on desktop and below it on mobile.
- Given the built `dist/index.html`, when inspected, then it contains the canonical, OG and Twitter tags and the Person JSON-LD with `knowsAbout` and LinkedIn + GitHub `sameAs`.

## Review Triage Log

Pass 1 (blind, edge-case, verification-gap):

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 1 | Drift test skips `og:title`, `twitter:title`, ProfilePage `name` (blind, edge, vg-other) | low | Confirmed: only `<title>` and description metas are looped, while the head and identity.ts comments promise drift coverage | patch |
| 2 | Homepage headshot never asserted at App level (blind) | low | Confirmed: Recognition tests use a fake src/name; Landing could drop or misroute the asset | patch |
| 3 | `/about` tests pass even if `/about` renders Landing, since both h1s are the name (edge) | low | Confirmed: `App.test.tsx` route table awaits only the h1 text | patch |
| 4 | "Role tokens" test checks no role classes; DOM-order test skips the title (blind) | low | Confirmed in `Recognition.test.tsx` | patch |
| 5 | `.highlight` in App.css dead, `Identity` type unused (blind, edge) | low | Grep: no remaining consumer of either | patch |
| 6 | Recognition `revert-layer` cascade fix not verified by any test (vg gap, blind) | medium | Pre-verified gap: jsdom has no cascade layers and the repo has no browser harness | defer |
| 7 | JSON-LD `image` is a Vite-hashed jpg kept alive only by AboutMe's import (blind, edge) | low | Pre-existing; the URL resolves today (`dist/assets/...-BqFgpPGr.jpg`), and the frozen Never rule keeps it as-is. It breaks once Epic 4 removes AboutMe | defer |
| 8 | `fetchPriority="high"` image discovered only after the lazy Landing chunk; no preload (blind, edge) | maybe-false | Route chunks are lazy by AD-6. Whether LCP misses 2.5s needs a throttled Lighthouse run; would be medium if it does | defer |
| 9 | URLs (canonical, og:url, @id) not checked for agreement (blind) | low | A domain change is rare, and a guard adds test surface | reject |
| 10 | Description mixes third and first person; employer dropped (blind) | false | The Person `description` must carry the D-25 line verbatim (frozen Always); employer stays in `worksFor` | reject |
| 11 | `og:type=profile` lacks `profile:*` and `og:locale` (blind) | false | Those Open Graph properties are optional; no preview breaks without them | reject |
| 12 | `RecognitionProps` re-declares identity fields (blind) | low | The component is generic by design (props-only per AD-7); coupling it to `IDENTITY` adds no user value | reject |
| 13 | Identity test reads `<p>` by position; JSON-LD parsed at collection time (blind, edge) | false | Both fail loudly (assertion or collection error), never silently pass | reject |
| 14 | `/about` orphaned with a duplicate h1 (blind) | false | Human decision (keep `/about` URL-only until Epic 4) | reject |
| 15 | `revert-layer` unsupported in old browsers (edge) | low | Supported since 2022 in all engines; older ones degrade to legacy styling, not breakage | reject |

## Design Notes

To beat App.css inside the section without touching other pages, scope a reset in `Recognition.css`: `.recognition :is(h1, p) { font-size: revert-layer; line-height: revert-layer; margin: revert-layer; color: revert-layer; text-shadow: revert-layer; }`. That lets the layered Tailwind utilities win again. Size the portrait responsively (for example `w-48 md:w-64`, `aspect-[4/5]`, `object-cover`) while keeping the intrinsic `width={640} height={800}`.

## Verification

**Commands:**
- `cd asprinkleofcode && npm run build` -- expected: exit 0 (typecheck, lint, tests, vite build).

**Manual checks:**
- `npm run preview`, then `/` at 375px and 1280px:
  - layout and type match the ACs;
  - the headshot request isn't lazy;
  - one h1 in the accessibility tree.
