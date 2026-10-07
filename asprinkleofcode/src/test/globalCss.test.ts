import { describe, expect, it } from "vitest";

/*
 * jsdom applies no cascade layers, so no rendered test can see a global
 * stylesheet beating the layered `type-*` and colour utilities. These checks
 * read the stylesheets themselves instead, guarding the two ways the legacy
 * App.css broke the theme: a second Tailwind root (which reset `--font-sans`)
 * and unlayered global element rules (which overrode `type-*` on every page).
 * CSS from a lazy chunk is never unloaded, so a global rule in any stylesheet
 * applies site-wide once its page has been visited.
 */
const stylesheets = import.meta.glob<string>("../**/*.css", { query: "?raw", import: "default", eager: true });

const INDEX = "../index.css";
// Legacy `/about` keeps its element rules, scoped to `.about-me`, until Epic 4.
const LEGACY_ABOUT = "../pages/AboutMe/AboutMe.css";
// The only selectors allowed to reach elements without a class: the page shell in index.css.
const INDEX_GLOBALS = new Set([":root", "html", "body", "#root", 'h1[tabindex="-1"]:focus']);
const KEYFRAME_STEP = /^(from|to|\d+(\.\d+)?%)$/;

/** Splits a selector list on its top-level commas, keeping `:is(a, b)` whole. */
function splitSelectorList(prelude: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < prelude.length; i++) {
    const char = prelude[i];
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === "," && depth === 0) {
      parts.push(prelude.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(prelude.slice(start));
  return parts.map((part) => part.trim()).filter(Boolean);
}

/** Every selector in a stylesheet, comments and at-rule preludes removed. */
function selectors(css: string): string[] {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  return [...withoutComments.matchAll(/([^{};]+)\{/g)]
    .map((match) => match[1].trim())
    .filter((prelude) => !prelude.startsWith("@"))
    .flatMap(splitSelectorList);
}

describe("global stylesheets", () => {
  it("finds the app's stylesheets", () => {
    expect(Object.keys(stylesheets)).toContain(INDEX);
    expect(Object.keys(stylesheets)).toContain(LEGACY_ABOUT);
    expect(Object.keys(stylesheets).length).toBeGreaterThan(5);
  });

  it("splits selector lists only on top-level commas", () => {
    expect(selectors(":is(h1, p), .a b {}")).toEqual([":is(h1, p)", ".a b"]);
  });

  it("has exactly one Tailwind root, in index.css", () => {
    const roots = Object.entries(stylesheets)
      .filter(([, css]) => /@import\s+(url\()?["']tailwindcss(\/[^"']*)?["']/.test(css))
      .map(([path]) => path);
    expect(roots).toEqual([INDEX]);
  });

  it("scopes every rule to a class, apart from index.css's page-shell globals and legacy /about", () => {
    const offenders = Object.entries(stylesheets)
      .filter(([path]) => path !== LEGACY_ABOUT)
      .flatMap(([path, css]) =>
        selectors(css)
          .filter((selector) => !KEYFRAME_STEP.test(selector))
          .filter((selector) => !(path === INDEX && INDEX_GLOBALS.has(selector)))
          .filter((selector) => !(path !== INDEX && selector === ":root"))
          .filter((selector) => !selector.includes("."))
          .map((selector) => `${path}: ${selector}`)
      );
    expect(offenders).toEqual([]);
  });

  it("scopes the legacy /about element rules to the page", () => {
    const legacy = selectors(stylesheets[LEGACY_ABOUT]).filter((selector) => !KEYFRAME_STEP.test(selector));
    expect(legacy.length).toBeGreaterThan(0);
    for (const selector of legacy) {
      expect(selector).toMatch(/^:where\(\.about-me\) /);
    }
  });
});
