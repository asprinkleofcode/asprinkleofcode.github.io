import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Recognition from "./Recognition";

const props = {
  name: "Ada Example",
  title: "Principal Engineer",
  positioning: "A positioning line.",
  headshotSrc: "/headshot.webp",
};

describe("Recognition", () => {
  it("renders the name as the only h1, then the title and positioning", () => {
    render(<Recognition {...props} />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("Ada Example");
    expect(screen.getByText("Principal Engineer").tagName).toBe("P");
    expect(screen.getByText("A positioning line.").tagName).toBe("P");
  });

  // Exact class tokens, so an `md:` variant never satisfies a mobile-first assertion.
  const classes = (el: Element | null | undefined) => el?.className.split(/\s+/) ?? [];

  it("uses the type scale and role tokens", () => {
    render(<Recognition {...props} />);
    const h1 = classes(screen.getByRole("heading", { level: 1 }));
    const title = classes(screen.getByText("Principal Engineer"));
    const positioning = classes(screen.getByText("A positioning line."));
    // UX-030 (DESIGN §7a): white name, rose title.
    expect(h1).toEqual(expect.arrayContaining(["type-identity", "text-text-primary"]));
    expect(h1).not.toContain("text-brand-primary");
    expect(title).toEqual(expect.arrayContaining(["type-title", "text-brand-primary", "mt-2.5"]));
    expect(positioning).toEqual(expect.arrayContaining(["type-body", "text-text-secondary", "max-w-[34ch]", "mt-5.5"]));
  });

  it("left-aligns text and headshot on mobile, with the UX-030 vertical spacing", () => {
    const { container } = render(<Recognition {...props} />);
    const section = classes(container.querySelector("section"));
    expect(section).toEqual(expect.arrayContaining(["flex-col", "items-start", "gap-6", "pt-14", "pb-12", "md:pt-22", "md:pb-18"]));
    expect(section).not.toContain("items-center");
    const textBlock = classes(screen.getByRole("heading", { level: 1 }).parentElement);
    expect(textBlock).toContain("text-left");
    expect(textBlock).not.toContain("text-center");
  });

  it("puts the headshot to the right of the text from md up", () => {
    const { container } = render(<Recognition {...props} />);
    expect(classes(container.querySelector("section"))).toEqual(
      expect.arrayContaining(["md:flex-row", "md:items-center", "md:justify-between", "md:gap-10"])
    );
  });

  it("renders the headshot eagerly with alt text and intrinsic dimensions", () => {
    render(<Recognition {...props} />);
    const img = screen.getByRole("img", { name: "Ada Example" });
    expect(img.getAttribute("src")).toBe("/headshot.webp");
    expect(img.getAttribute("width")).toBe("640");
    expect(img.getAttribute("height")).toBe("800");
    expect(img.getAttribute("loading")).toBeNull();
    expect(img.getAttribute("fetchpriority")).toBe("high");
    expect(img.className).toContain("rounded-default");
    expect(img.className).toContain("border-border-default");
  });

  it("places the text before the headshot in DOM order", () => {
    const { container } = render(<Recognition {...props} />);
    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    const h1 = screen.getByRole("heading", { level: 1 });
    const title = screen.getByText("Principal Engineer");
    const positioning = screen.getByText("A positioning line.");
    const img = screen.getByRole("img");
    expect(h1.compareDocumentPosition(img) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(title.compareDocumentPosition(img) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(positioning.compareDocumentPosition(img) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
