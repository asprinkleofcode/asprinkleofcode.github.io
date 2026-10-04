import { afterEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const original = Object.getOwnPropertyDescriptor(window, "matchMedia");

function installMatchMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (media: string) => ({
      get matches() {
        return matches;
      },
      media,
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    }),
  });
  return {
    set(next: boolean) {
      matches = next;
      listeners.forEach((listener) => listener());
    },
    listeners,
  };
}

afterEach(() => {
  if (original) Object.defineProperty(window, "matchMedia", original);
});

describe("usePrefersReducedMotion", () => {
  it("reads the current preference", () => {
    installMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates when the preference changes and unsubscribes on unmount", () => {
    const media = installMatchMedia(false);
    const { result, unmount } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => media.set(true));
    expect(result.current).toBe(true);

    unmount();
    expect(media.listeners.size).toBe(0);
  });

  it("returns false when matchMedia is missing", () => {
    Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: undefined });
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });
});
