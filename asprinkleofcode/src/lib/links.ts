/**
 * Every external URL the site links to (AD: URL literals live only here or in
 * frontmatter). LinkedIn and GitHub must match the `sameAs` list in
 * `index.html`; Footer.test.tsx enforces that.
 */

export const LINKEDIN_URL = "https://www.linkedin.com/in/alishasprinklekorba";
export const GITHUB_URL = "https://github.com/asprinkleofcode";
export const INSTAGRAM_POWERLIFTING_URL = "https://www.instagram.com/asprinkleofcode/";
export const INSTAGRAM_WOODCRAFT_URL = "https://www.instagram.com/orangecatwoodcraft/";

/** Attribution for the cupcake brand mark (`public/cupcake.png`). */
export const FLATICON_CREDIT_URL = "https://www.flaticon.com/free-icons/dessert";

export type FooterPlatform = "LinkedIn" | "Instagram" | "GitHub";

export interface FooterLink {
  /** Platform name; also selects the icon. */
  label: FooterPlatform;
  /** Shown in the accessible name when the platform has more than one account. */
  handle?: string;
  href: string;
  /** `woodcraft` gets the apricot `glow.woodcraft` hover/focus glow (UX-028). */
  variant?: "woodcraft";
}

/** Footer icon row, in display order (UX-028). */
export const FOOTER_LINKS: readonly FooterLink[] = [
  { label: "LinkedIn", href: LINKEDIN_URL },
  { label: "Instagram", handle: "@asprinkleofcode", href: INSTAGRAM_POWERLIFTING_URL },
  { label: "Instagram", handle: "@orangecatwoodcraft", href: INSTAGRAM_WOODCRAFT_URL, variant: "woodcraft" },
  { label: "GitHub", href: GITHUB_URL },
];

/** Accessible name for a footer icon, e.g. "Instagram @orangecatwoodcraft (opens in a new tab)". */
export const footerLinkName = ({ label, handle }: FooterLink): string =>
  `${label}${handle ? ` ${handle}` : ""} (opens in a new tab)`;
