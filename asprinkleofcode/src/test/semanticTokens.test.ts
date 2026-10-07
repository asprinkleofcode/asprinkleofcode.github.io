import { describe, expect, it } from "vitest";
import { findColorViolations } from "./semanticTokenRules";

/*
 * AD-10 gate. jsdom applies no stylesheet and renders only what a test
 * reaches, so this reads the source itself: every stylesheet and script under
 * src/ must reach colour through the semantic role tokens. Comments count too,
 * so name a palette class in prose without its shade or prefix.
 */
const sources = import.meta.glob<string>("../**/*.{css,ts,tsx,js,jsx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

// The one file allowed to name primitives and raw values: it defines them.
const TOKEN_SOURCE = "../theme/colors.css";
// The theme layer may give a token a raw value DESIGN names (the recessed inset shadow), but
// must still map role tokens, never primitives or palette utilities.
const THEME_LAYER = "../theme/theme.css";
// Legacy `/about` files that keep primitive and palette colours until Epic 4 retires them.
// Each must still need the exemption; any other file under pages/AboutMe/ is scanned.
const LEGACY_ABOUT = [
  "../pages/AboutMe/AboutMe.css",
  "../pages/AboutMe/BeyondTheCodePowerlifting.css",
  "../pages/AboutMe/Primary.jsx",
];
// Glob keys for this directory start with "./" (src/test/, test helpers); tests elsewhere end in .test or .spec.
const isTestCode = (path: string) => path.startsWith("./") || /\.(test|spec)\.[jt]sx?$/.test(path);

const scanned = Object.keys(sources).filter(
  (path) => path !== TOKEN_SOURCE && !LEGACY_ABOUT.includes(path) && !isTestCode(path)
);

describe("AD-10 semantic tokens", () => {
  it("scans the app's stylesheets, scripts and theme", () => {
    expect(scanned).toEqual(
      expect.arrayContaining(["../index.css", "../App.tsx", "../theme/theme.css", "../theme/aSprinkleOfCodeTheme.ts"])
    );
    expect(scanned).not.toContain(TOKEN_SOURCE);
    expect(scanned.some(isTestCode)).toBe(false);
    for (const dir of ["../components/", "../pages/", "../lib/", "../theme/"]) {
      expect(scanned.some((path) => path.startsWith(dir)), dir).toBe(true);
    }
  });

  it("detects each kind of violation", () => {
    expect(
      findColorViolations(
        "color: var(--color-dark-300); fill: #E48FB1; stroke: rgb(0 0 0 / 50%); hover:text-slate-400 bg-white/50 border-x-red-500"
      )
    ).toEqual(["--color-dark-300", "#E48FB1", "rgb(", "text-slate-400", "bg-white/50", "border-x-red-500"]);
    expect(
      findColorViolations("--shadow: inset 0 2px 6px rgb(0 0 0 / 0.5); --x: #fff; --y: var(--color-dark-800) text-red-500", {
        allowLiterals: true,
      })
    ).toEqual(["--color-dark-800", "text-red-500"]);
    expect(findColorViolations("bg-[#1E1E2F] text-[var(--color-primary-100)]")).toEqual([
      "#1E1E2F",
      "--color-primary-100",
    ]);
    // Tailwind's palette as variables, and flowbite's plugin `primary` scale.
    expect(
      findColorViolations("var(--color-gray-300) text-(--color-slate-400) --color-white bg-primary-700 focus:ring-primary-300")
    ).toEqual(["--color-gray-300", "--color-slate-400", "--color-white", "bg-primary-700", "ring-primary-300"]);
    expect(findColorViolations("color(display-p3 1 0 0) light-dark(red, blue)")).toEqual(["color(", "light-dark("]);
  });

  it("allows role tokens and things that only look like colours", () => {
    expect(
      findColorViolations(
        "text-text-primary bg-background-secondary border-border-essential text-accent-secondary ring-brand-primary " +
          "--color-brand-primary --color-text-primary --color-accent-secondary background-color: " +
          "var(--brand-primary) &#169; #root href=\"#main\" shadow-lg text-whitespace-nowrap color-mix(in srgb, var(--focus-ring) 30%, transparent)"
      )
    ).toEqual([]);
  });

  it("finds no primitive ramp variable, raw colour literal or palette utility outside colors.css and legacy /about", () => {
    const offenders = scanned.flatMap((path) =>
      findColorViolations(sources[path], { allowLiterals: path === THEME_LAYER }).map((violation) => `${path}: ${violation}`)
    );
    expect(offenders).toEqual([]);
  });

  it.each(LEGACY_ABOUT)("still needs the legacy /about exemption for %s", (path) => {
    expect(sources[path], path).toBeDefined();
    expect(findColorViolations(sources[path]).length).toBeGreaterThan(0);
  });
});
