import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "flowbite-react";
import indexHtml from "../../../index.html?raw";
import { aSprinkleOfCodeTheme } from "../../theme/aSprinkleOfCodeTheme";
import { GITHUB_URL, INSTAGRAM_POWERLIFTING_URL, LINKEDIN_URL } from "../../lib/links";
import Footer from "./Footer";

function renderFooter() {
  return render(
    <ThemeProvider theme={aSprinkleOfCodeTheme}>
      <Footer />
    </ThemeProvider>
  );
}

const EXPECTED_ICONS = [
  { name: "LinkedIn (opens in a new tab)", href: "https://www.linkedin.com/in/alishasprinklekorba" },
  { name: "Instagram @asprinkleofcode (opens in a new tab)", href: "https://www.instagram.com/asprinkleofcode/" },
  { name: "Instagram @orangecatwoodcraft (opens in a new tab)", href: "https://www.instagram.com/orangecatwoodcraft/" },
  { name: "GitHub (opens in a new tab)", href: "https://github.com/asprinkleofcode" },
];

const WOODCRAFT_GLOW = ["hover:drop-shadow-glow-woodcraft", "focus-visible:drop-shadow-glow-woodcraft"];

describe("Footer", () => {
  it("is the contentinfo landmark", () => {
    renderFooter();
    expect(screen.getByRole("contentinfo").tagName).toBe("FOOTER");
  });

  it("renders the four social icons in order with names, href, target and rel", () => {
    renderFooter();
    const social = screen.getByRole("navigation", { name: "Social profiles" });
    const links = within(social).getAllByRole("link");
    expect(links.map((link) => ({ name: link.getAttribute("aria-label"), href: link.getAttribute("href") }))).toEqual(
      EXPECTED_ICONS
    );
    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.className).toContain("focus-visible:ring-2");
      expect(link.querySelector("svg")).not.toBeNull();
    }
    for (const { name } of EXPECTED_ICONS) {
      expect(within(social).getByRole("link", { name })).toBeDefined();
    }
  });

  it("puts the woodcraft glow on the @orangecatwoodcraft icon only", () => {
    const { container } = renderFooter();
    const woodcraft = screen.getByRole("link", { name: "Instagram @orangecatwoodcraft (opens in a new tab)" });
    const woodcraftClasses = woodcraft.className.split(/\s+/);
    for (const cls of WOODCRAFT_GLOW) {
      expect(woodcraftClasses).toContain(cls);
    }
    // Apricot on hover/focus, not the brand pink the other icons use.
    expect(woodcraftClasses).toContain("hover:text-woodcraft");
    expect(woodcraftClasses).toContain("focus-visible:text-woodcraft");
    expect(woodcraftClasses).not.toContain("hover:text-brand-primary");
    const otherIcons = within(screen.getByRole("navigation", { name: "Social profiles" }))
      .getAllByRole("link")
      .filter((link) => link !== woodcraft);
    expect(otherIcons).toHaveLength(3);
    for (const icon of otherIcons) {
      expect(icon.className.split(/\s+/)).toContain("hover:drop-shadow-glow");
    }
    const others = [...container.querySelectorAll("*")].filter((el) => el !== woodcraft);
    for (const el of others) {
      expect(el.getAttribute("class") ?? "").not.toContain("woodcraft");
    }
  });

  it("shows a plain-text copyright with the current year and no link", () => {
    renderFooter();
    const copyright = screen.getByTestId("flowbite-footer-copyright");
    expect(copyright.textContent).toBe(`© ${new Date().getFullYear()}Alisha Korba`);
    expect(copyright.querySelector("a")).toBeNull();
  });

  it("credits Flaticon with an external text link", () => {
    renderFooter();
    const credit = screen.getByRole("link", { name: "Cupcake icon by Flaticon (opens in a new tab)" });
    expect(credit.getAttribute("href")).toBe("https://www.flaticon.com/free-icons/dessert");
    expect(credit.getAttribute("target")).toBe("_blank");
    expect(credit.getAttribute("rel")).toBe("noopener noreferrer");
    expect(credit.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  });

  it("has no raw hash links", () => {
    const { container } = renderFooter();
    expect(container.querySelector('a[href="#"]')).toBeNull();
    for (const link of container.querySelectorAll("a")) {
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
    }
  });

  it("uses the LinkedIn and GitHub URLs from index.html sameAs", () => {
    const sameAs = /"sameAs"\s*:\s*\[([\s\S]*?)\]/.exec(indexHtml)?.[1] ?? "";
    expect(sameAs).toContain(`"${LINKEDIN_URL}"`);
    expect(sameAs).toContain(`"${GITHUB_URL}"`);
    expect(sameAs).toContain(`"${INSTAGRAM_POWERLIFTING_URL}"`);
  });
});
