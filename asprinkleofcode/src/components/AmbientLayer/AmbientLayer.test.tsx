import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import AmbientLayer from "./AmbientLayer";

function stubMatchMedia(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList
  );
}

const initialViewport = { width: window.innerWidth, height: window.innerHeight };
function setViewport(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, writable: true, value: height });
}

const layer = (container: HTMLElement) => container.querySelector(".ambient-layer") as HTMLElement;
const stars = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>(".ambient-layer__star")];

const TINT_CLASSES = ["ambient-layer__star--light", "ambient-layer__star--accent", "ambient-layer__star--brand"];
const tintOf = (star: HTMLElement) => [...star.classList].filter((cls) => cls.startsWith("ambient-layer__star--"));

describe("AmbientLayer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setViewport(initialViewport.width, initialViewport.height);
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<AmbientLayer />);
    expect(layer(container).getAttribute("aria-hidden")).toBe("true");
  });

  it("sizes the field from the viewport area (about 10 stars per 420×520px)", () => {
    // Not 1024×768: its count (36) equals the no-window fallback.
    setViewport(1280, 800);
    expect(stars(render(<AmbientLayer seed={1} />).container)).toHaveLength(47);
  });

  it.each([
    { width: 200, height: 200, count: 12 },
    { width: 3840, height: 2160, count: 80 },
  ])("clamps the star count to $count at $width×$height", ({ width, height, count }) => {
    setViewport(width, height);
    expect(stars(render(<AmbientLayer seed={1} />).container)).toHaveLength(count);
  });

  it("uses the static modifier under reduced motion", () => {
    stubMatchMedia(true);
    const { container } = render(<AmbientLayer />);
    expect(layer(container).classList.contains("ambient-layer--static")).toBe(true);
  });

  it("omits the static modifier when motion is allowed", () => {
    stubMatchMedia(false);
    const { container } = render(<AmbientLayer />);
    expect(layer(container).classList.contains("ambient-layer--static")).toBe(false);
  });

  it("places stars from a given seed", () => {
    const [first] = stars(render(<AmbientLayer seed={0x5eed} />).container);
    expect(first.style.top).toBe("71%");
    expect(first.style.left).toBe("28.63%");
    expect(first.style.width).toBe("1px");
    expect(first.style.getPropertyValue("--twinkle-delay")).toBe("-3.78s");
    expect(tintOf(first)).toEqual(["ambient-layer__star--light"]);
  });

  it("draws only 1px and 1.5px stars, tinted from the allowed set", () => {
    setViewport(3840, 2160);
    const field = stars(render(<AmbientLayer seed={0x5eed} />).container);
    const sizes = new Set(field.map((star) => star.style.width));
    const tints = new Set(field.flatMap(tintOf));
    for (const star of field) {
      expect(star.style.height).toBe(star.style.width);
      expect(tintOf(star)).toHaveLength(1);
      expect(star.style.getPropertyValue("--twinkle-delay")).toMatch(/^-?\d+\.\d{2}s$/);
    }
    expect([...sizes].sort()).toEqual(["1.5px", "1px"]);
    expect([...tints].sort()).toEqual([...TINT_CLASSES].sort());
  });

  it("shuffles the field on each new mount", () => {
    const first = (c: HTMLElement) => stars(c)[0].style.cssText;
    const a = render(<AmbientLayer />);
    const b = render(<AmbientLayer />);
    expect(first(a.container)).not.toBe(first(b.container));
  });
});
