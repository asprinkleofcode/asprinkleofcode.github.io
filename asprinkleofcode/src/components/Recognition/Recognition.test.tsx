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

  it("uses the type scale and role tokens", () => {
    render(<Recognition {...props} />);
    const h1 = screen.getByRole("heading", { level: 1 }).className;
    const title = screen.getByText("Principal Engineer").className;
    const positioning = screen.getByText("A positioning line.").className;
    expect(h1).toContain("type-identity");
    expect(h1).toContain("text-brand-primary");
    expect(title).toContain("type-title");
    expect(title).toContain("text-text-primary");
    expect(positioning).toContain("type-body");
    expect(positioning).toContain("text-text-secondary");
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
