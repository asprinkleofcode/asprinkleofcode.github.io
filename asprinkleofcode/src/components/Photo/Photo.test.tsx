import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Photo from "./Photo";

// An injected media map: src/assets/media/ holds no photos until Story 4.4.
vi.mock("../../lib/media", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../lib/media")>();
  const media = { "../assets/media/birdhouses/01-raw-gourd.webp": { src: "/fixture/raw.webp", width: 1600, height: 1200 } };
  return { ...actual, resolveMedia: (src: string) => actual.resolveMedia(src, media) };
});

const ALT = "A raw gourd on the workbench, before cleaning.";

describe("Photo", () => {
  it("renders a lazy figure image with its alt, URL and explicit size", () => {
    const { container } = render(<Photo src="birdhouses/01-raw-gourd.webp" alt={ALT} />);
    const img = screen.getByRole("img", { name: ALT });
    expect(img.closest("figure")).not.toBeNull();
    expect(img.getAttribute("src")).toBe("/fixture/raw.webp");
    expect(img.getAttribute("width")).toBe("1600");
    expect(img.getAttribute("height")).toBe("1200");
    expect(img.getAttribute("loading")).toBe("lazy");
    // Fills the column at its own ratio, so nothing overflows a 375px viewport.
    expect(img.className.split(" ")).toEqual(expect.arrayContaining(["block", "h-auto", "w-full"]));
    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("loads eagerly with priority", () => {
    render(<Photo src="birdhouses/01-raw-gourd.webp" alt={ALT} priority />);
    const img = screen.getByRole("img", { name: ALT });
    expect(img.getAttribute("loading")).toBe("eager");
    expect(img.getAttribute("fetchpriority")).toBe("high");
    expect(img.hasAttribute("decoding")).toBe(false);
  });

  it("decodes a lazy photo asynchronously with no fetch priority", () => {
    render(<Photo src="birdhouses/01-raw-gourd.webp" alt={ALT} />);
    const img = screen.getByRole("img", { name: ALT });
    expect(img.getAttribute("decoding")).toBe("async");
    expect(img.hasAttribute("fetchpriority")).toBe(false);
  });

  it.each([undefined, "", "   "])("throws when alt is %j, since MDX isn't type-checked", (alt) => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Photo src="birdhouses/01-raw-gourd.webp" alt={alt as string} />)).toThrow(
      'Photo "birdhouses/01-raw-gourd.webp" needs alt text'
    );
    quiet.mockRestore();
    expect(document.querySelector("img")).toBeNull();
  });

  it("shows a caption under the photo", () => {
    render(<Photo src="birdhouses/01-raw-gourd.webp" alt={ALT} caption="Fixture caption." />);
    const caption = screen.getByText("Fixture caption.");
    expect(caption.tagName).toBe("FIGCAPTION");
    expect(caption.className).toContain("text-text-secondary");
    expect(caption.parentElement).toBe(screen.getByRole("img", { name: ALT }).closest("figure"));
  });

  it("throws on an unknown src instead of rendering a broken image", () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Photo src="birdhouses/missing.webp" alt={ALT} />)).toThrow(
      'Unknown media path "birdhouses/missing.webp"'
    );
    quiet.mockRestore();
    expect(document.querySelector("img")).toBeNull();
  });
});
