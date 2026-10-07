import { expect } from "vitest";
import { findColorViolations } from "./semanticTokenRules";

/**
 * Asserts that no element in `root`'s subtree (root included) carries a
 * flowbite default `dark:` class, a raw palette class (`gray-`, `text-white`,
 * ...) or an arbitrary colour value, so OS dark mode keeps the role tokens
 * (AD-10). Guards the theme's `applyTheme` "replace" map.
 */
export function expectNoFlowbiteDefaults(root: Element) {
  const elements = [root, ...root.querySelectorAll("*")];
  expect(elements.length).toBeGreaterThan(5);
  for (const el of elements) {
    const classes = (el.getAttribute("class") ?? "").split(/\s+/);
    expect(
      classes.filter((cls) => cls.includes("dark:") || findColorViolations(cls).length > 0),
      el.tagName
    ).toEqual([]);
  }
}
