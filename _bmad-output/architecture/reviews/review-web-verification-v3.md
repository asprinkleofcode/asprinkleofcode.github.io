# Reviewer Gate — Lens: web-research / reality-check verification (pass 3)

**Target:** `_bmad-output/architecture/ARCHITECTURE-SPINE.md` (status `final`, updated 2026-09-13)
**Date of checks:** 2026-09-13
**Scope:** this pass covers only the two changes introduced in the 2026-09-12/13 update run — the AD-19 amendment (`--header-height` driving `scroll-padding-top` / `scroll-margin-top`) and new AD-20 (`personal.pdf` static-asset field, direct link + optional `<iframe>`/`<object>` preview, no PDF.js-style library). Everything else in the spine was already web-verified in `review-web-verification.md` / `review-web-verification-v2.md` and is not re-checked here. Reasoning source: `.memlog.md` entries from "bmad-architecture Update run started (2026-09-12/13)" onward.
**Method:** live web search + MDN / Bugzilla / registry lookups against current (2026-09) browser behavior and hosting model, not training-data recall.

---

## 1. GitHub Pages serving a static PDF with zero backend (AD-20)

**Claim:** `public/downloads/<slug>.pdf` is "served directly by GitHub Pages, zero backend, consistent with the existing no-server/no-runtime non-goals."

**Verified TRUE.** GitHub Pages serves any static file placed in the published output verbatim, with no server-side processing — PDFs included, at the same stable path-based URL as any other asset under `public/`. A direct request for such a URL returns the file with a browser-appropriate `Content-Type` (`application/pdf`), and GitHub Pages does not attach a `Content-Disposition: attachment` header, so the browser's own handling policy (see §2) decides inline-vs-download, not the host. This is exactly the mechanism the rest of the Vite build already relies on for every other `public/` asset — no divergent claim here.

## 2. Browser default inline PDF rendering — link and `<iframe>`/`<object>` (AD-20)

**Claim:** a direct link opens the browser's native PDF viewer, and/or the same asset can be embedded inline via `<iframe>`/`<object src>`, with no PDF.js-style library needed for MVP.

**Verified TRUE, with two caveats worth adding to the spine's text (not blockers):**

- **Desktop Chrome, Firefox, Safari, Edge** all render a linked or same-origin-`<iframe>`/`<object>`-embedded PDF inline with their built-in viewer by default today — no JS library required. This is the still-current, unchanged behavior all four engines have shipped for years.
- **Mobile caveat (real, current):** on Chrome for Android, an `<iframe>`-embedded PDF frequently triggers a download prompt instead of rendering inline, rather than behaving like desktop Chrome. On iOS Safari, an embedded PDF inside an `<iframe>`/`<object>` typically renders **only the first page** until the visitor taps to expand it to the full-screen native viewer — the multi-page scroll view most people expect from "viewing a PDF" only appears after that tap.
- **Consequence for AD-20, not a defect in it:** the direct link ("opens the browser's native PDF viewer in a new tab") is the more uniformly reliable option across mobile and desktop; the inline `<iframe>`/`<object>` preview is a reasonable *and* on desktop, but should be understood as a supplementary affordance rather than a guaranteed full-document inline view on every device. AD-20 already frames the iframe as "and/or" alongside the direct link rather than as the sole mechanism, so the rule as written already tolerates this — but the spine's prose reads more confidently ("the page embeds the same asset inline... for an in-page preview") than the mobile reality supports. Worth one added clause noting the direct link is the fallback-safe path on mobile.
- No CSP or same-origin concern applies here: GitHub Pages sets no restrictive `Content-Security-Policy` header by default, and the PDF is same-origin (`public/downloads/`), so a same-origin `<iframe src="...">` is not blocked by any framing policy. No PDF.js-style library is needed for the MVP claim to hold — confirmed, this is not an assumption.

## 3. `scroll-padding-top` / `scroll-margin-top` as the sticky-header offset mechanism (AD-19 amendment)

**Claim:** one `--header-height` custom property drives `scroll-padding-top` on the routing root (so "scroll to top of `<main>`" and the focused `<h1>` land below the sticky header) and `scroll-margin-top` on any future in-page anchor target.

**Verified TRUE and current — this is the technically correct, currently-supported mechanism, with no live browser-support gap:**

- Per MDN, both `scroll-padding-top` and `scroll-margin-top` are **Baseline: Widely available**, supported across Chrome, Edge, Firefox, and Safari since **April 2021** — well inside the "currently supported" bar for a spine written in September 2026.
- A historical caveat exists but is **stale, not current**: Safari at one point only honored `scroll-margin` inside scroll-snap containers, and Firefox's `Element.focus()` did not initially factor `scroll-margin`/`scroll-padding` into where it scrolled a newly focused element (Firefox Bugzilla #1535232). That bug was fixed in **Firefox 68 (2019)**; the general cross-engine baseline (including Safari applying `scroll-margin` outside snap containers) landed by the April 2021 date MDN cites. Neither gap is live in any current major browser, so it does not need to be caveated in the spine — it would only be worth a footnote if the spine were claiming this as newly risky, which it isn't.
- The mechanism AD-19 describes matches how these properties are specified to work: `scroll-padding-top` on the scroll container offsets where "scroll to top" / `scrollIntoView` targets land within that container; `scroll-margin-top` on an individual anchor target offsets where *that specific element* is considered "in view," which is exactly the "future in-page anchor" use AD-19 names. Applying `scroll-padding-top` to the routing root for the whole-page "scroll to top of `<main>`" case and reserving `scroll-margin-top` for individual anchor targets is the standard division of labor between the two properties, not a misuse of either.
- One implementation nuance, not a spec gap: `element.focus()` triggering a scroll-into-view that honors `scroll-margin`/`scroll-padding` is now consistent across engines (per the Firefox 68 fix above and the equivalent behavior already present in Chromium/WebKit), so AD-19's `tabIndex={-1}` + `.focus()` pattern for the post-navigation `<h1>` will correctly land below the sticky header in every current major browser. No better-practice alternative displaces this pattern for a hash-router SPA — it remains the standard CSS-only way to solve "content hides behind a sticky header," as opposed to a JS-computed manual scroll offset, which is exactly what AD-19's closing line ("No page or anchor computes its own offset") correctly avoids.

No current caveat needs to gate or soften AD-19's rule; it is decided sound and stated at the correct confidence level.

## 4. Stack table / dependency sweep

**Claim (implicit in the task framing):** nothing in this update introduces a new npm dependency or version pin.

**Verified TRUE.** Both AD-19 and AD-20 are pure CSS-custom-property / static-asset-convention changes:

- AD-19's `--header-height` / `scroll-padding-top` / `scroll-margin-top` mechanism is plain CSS, already expressible with the existing Vite + Tailwind v4 toolchain — no new package, no version bump to any Stack row.
- AD-20's `personal.pdf` field is a frontmatter schema addition (`frontmatter.ts`, already Deferred/owned by the baseline story) plus a `public/downloads/` convention — again no runtime dependency. The spine is explicit that a PDF.js-style viewer library is *not* added, which is the one place a dependency could have crept in, and it deliberately doesn't.
- A full skim of the Stack table (Vite, React/react-dom, react-router, Tailwind/`@tailwindcss/vite`, flowbite-react, react-icons, eslint, `@mdx-js/rollup`, typescript, typescript-eslint, `eslint-plugin-jsx-a11y`, vitest/`@testing-library/react`, `rollup-plugin-visualizer`) turns up nothing implicitly touched by either change — no row's version, peer range, or "ratified/new" marking is affected. This confirms the task's own expectation rather than assuming it; the two changes are additive at the CSS/content-schema layer only.

---

## 5. Findings

No findings rise to Medium or above. Two Low/Info notes:

### F1 — [Low] AD-20's inline-preview claim should name the mobile caveat

The rule states the iframe/object preview satisfies "viewable" without qualification. In practice, Chrome for Android can force a download prompt instead of inline rendering for an embedded PDF, and iOS Safari's embedded view shows only the first page until expanded to full-screen. This doesn't break AD-20 (the direct link already covers "viewable" reliably, and the rule already offers the iframe as "and/or," not as the sole path) but the spine currently reads as if the inline preview is uniformly equivalent to the direct link across devices, which the current mobile browser landscape doesn't fully support. Suggested: one added clause noting the direct link is the cross-device-reliable path and the inline preview is a desktop-strength nice-to-have.

### F2 — [Info] The historical Safari/Firefox scroll-margin gaps are fully closed and don't need a spine caveat

Included here only because the task asked whether a current caveat exists. It doesn't: both properties have been Baseline-widely-available since April 2021, and the specific `Element.focus()` + `scroll-margin` interaction (the exact mechanism AD-19's `tabIndex={-1}` pattern depends on) was fixed in Firefox 68 (2019) and has long been consistent in Chromium/WebKit. No action needed; recorded so this pass's "did you actually check" question has a documented answer rather than a silent assumption.

---

## 6. Could not verify

Nothing material was left unverified. GitHub Pages' static-file-serving behavior, current major-browser inline-PDF-rendering defaults (including the mobile caveats), and the Baseline support status + fix history of `scroll-padding-top`/`scroll-margin-top` were all confirmed against live web search results, MDN, and a primary Firefox Bugzilla record rather than assumed from training data. The Stack-table sweep (§4) is a direct re-read of the spine's own table against the two new ADs, not an external lookup, and found nothing implicitly touched.

---

## Verdict

**PASS.** Both new/amended clauses hold up against current, real-world browser and hosting behavior: GitHub Pages genuinely serves an arbitrary static PDF with zero backend at a stable URL; all four major desktop browsers genuinely render a linked or same-origin-embedded PDF inline by default with no JS library, modulo a real but non-blocking mobile caveat (F1); and `scroll-padding-top` / `scroll-margin-top` are the technically correct, currently well-supported (Baseline since April 2021) mechanism for the sticky-header-occlusion problem AD-19 describes, with no live browser-support gap (F2 explains why the one historical gap that existed doesn't apply anymore). No new dependency or version pin was introduced or missed. Only F1 is worth folding into the spine's prose; nothing here blocks the spine's `status: final`.
