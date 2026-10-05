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

const layer = (container: HTMLElement) => container.querySelector(".ambient-layer") as HTMLElement;

describe("AmbientLayer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<AmbientLayer />);
    expect(layer(container).getAttribute("aria-hidden")).toBe("true");
    expect(layer(container).querySelectorAll(".ambient-layer__dot")).toHaveLength(28);
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

  it("places dots from the fixed seed", () => {
    const { container } = render(<AmbientLayer />);
    const first = container.querySelector(".ambient-layer__dot") as HTMLElement;
    expect(first.style.top).toBe("28.63%");
    expect(first.style.left).toBe("95.19%");
    expect(first.style.width).toBe("19px");
  });
});
