import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ExternalLink from "./ExternalLink";

describe("ExternalLink", () => {
  it("opens in a new tab safely, with a visible arrow and an sr-only notice", () => {
    render(<ExternalLink href="https://example.com/">Example site</ExternalLink>);
    const link = screen.getByRole("link", { name: "Example site (opens in a new tab)" });
    expect(link.getAttribute("href")).toBe("https://example.com/");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");

    const arrow = link.querySelector("svg");
    expect(arrow).not.toBeNull();
    expect(arrow?.getAttribute("aria-hidden")).toBe("true");
    expect(link.querySelector(".sr-only")?.textContent).toBe(" (opens in a new tab)");
  });

  it("uses the shared text-link classes and keeps extra classes", () => {
    render(
      <ExternalLink href="https://example.com/" className="type-meta">
        Example
      </ExternalLink>
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("text-brand-primary");
    expect(link.className).toContain("focus-visible:ring-2");
    expect(link.className).toContain("type-meta");
  });
});
