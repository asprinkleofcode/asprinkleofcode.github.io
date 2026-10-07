/*
 * AD-10: UI references semantic role tokens only. These rules find the three
 * ways around that: a primitive ramp or palette variable, a raw colour literal,
 * and a raw palette utility. Shared by the source scan (semanticTokens.test.ts)
 * and the rendered-DOM check (expectNoFlowbiteDefaults).
 */

// Tailwind v4's default palette (node_modules/tailwindcss/theme.css). Every
// name but black and white comes in shades.
const SHADED = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
// Shaded scales that are not Tailwind's: the primitive ramps private to
// src/theme/colors.css, and flowbite's plugin `primary` scale (blue).
const RAMP = "primary|dark";

// A palette or ramp shade read as a variable: `var(--color-dark-300)`, `text-(--color-slate-400)`.
const COLOR_VAR = new RegExp(`--color-(?:(?:${RAMP}|${SHADED})-\\d[\\w-]*|black|white)(?![\\w-])`, "g");
// `&` excludes HTML character references such as `&#169;`.
const HEX = /(?<![\w&-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
const COLOR_FUNCTION = /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|light-dark)\(/g;
// Every utility that takes a colour.
const COLOR_UTILITY =
  "bg|text|border(?:-[xytrblse])?|outline|ring(?:-offset)?|inset-ring|shadow|inset-shadow|drop-shadow|text-shadow|divide|decoration|accent|caret|fill|stroke|from|via|to|placeholder";
const PALETTE_UTILITY = new RegExp(
  `(?<![\\w-])(?:${COLOR_UTILITY})-(?:(?:${SHADED})(?:-\\d{2,3})?|black|white|(?:${RAMP})-\\d{2,3})(?:\\/\\d+)?(?![\\w-])`,
  "g"
);

/**
 * Every AD-10 violation in `text`, in order of appearance. `allowLiterals`
 * skips raw colour literals, for the theme layer that defines token values.
 */
export function findColorViolations(text: string, { allowLiterals = false } = {}): string[] {
  const rules = allowLiterals ? [COLOR_VAR, PALETTE_UTILITY] : [COLOR_VAR, HEX, COLOR_FUNCTION, PALETTE_UTILITY];
  return rules
    .flatMap((rule) => [...text.matchAll(rule)])
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((match) => match[0]);
}
