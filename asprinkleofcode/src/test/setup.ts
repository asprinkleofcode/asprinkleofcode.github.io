import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Vitest globals are off, so Testing Library can't register auto-cleanup itself.
afterEach(() => {
  cleanup();
});

// jsdom does not implement matchMedia; flowbite-react reads it for theme mode.
// Node-environment tests (e.g. the plugin integration test) have no window.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// jsdom lacks scrollIntoView and reports window.scrollTo as "not implemented";
// the shell's navigation scroll handler calls both.
if (typeof window !== "undefined") {
  if (typeof Element.prototype.scrollIntoView !== "function") {
    Element.prototype.scrollIntoView = () => {};
  }
  window.scrollTo = (() => {}) as typeof window.scrollTo;
}
