import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, NavigationType, useLocation, useNavigate } from "react-router";
import { useNavigationScroll } from "./useNavigationScroll";

let main: HTMLElement;
let scrollTo: ReturnType<typeof vi.fn>;
let scrollIntoView: ReturnType<typeof vi.fn>;

function setScrollY(y: number) {
  Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: y });
  window.dispatchEvent(new Event("scroll"));
}

function setup() {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={["/a"]}>{children}</MemoryRouter>
  );
  return renderHook(
    () => ({ settle: useNavigationScroll({ current: main }), navigate: useNavigate(), key: useLocation().key }),
    { wrapper }
  );
}

beforeEach(() => {
  main = document.createElement("main");
  main.innerHTML = "<h1>Title</h1>";
  document.body.appendChild(main);
  scrollTo = vi.fn();
  scrollIntoView = vi.fn();
  window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
  main.scrollIntoView = scrollIntoView as unknown as typeof main.scrollIntoView;
});

afterEach(() => {
  main.remove();
  setScrollY(0);
});

describe("useNavigationScroll", () => {
  it("sets manual scroll restoration while mounted", () => {
    window.history.scrollRestoration = "auto";
    const { unmount } = setup();
    expect(window.history.scrollRestoration).toBe("manual");
    unmount();
    expect(window.history.scrollRestoration).toBe("auto");
  });

  it("does nothing on the initial settle", () => {
    const { result } = setup();
    const first = result.current.key;
    act(() => result.current.settle(first, NavigationType.Pop));
    expect(scrollTo).not.toHaveBeenCalled();
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.body);
  });

  it("scrolls to main and focuses the h1 on forward navigation", () => {
    const { result } = setup();
    const first = result.current.key;
    act(() => result.current.settle(first, NavigationType.Pop));
    act(() => result.current.settle("second", NavigationType.Push));

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start", behavior: "smooth" });
    const heading = main.querySelector("h1")!;
    expect(heading.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(heading);
  });

  it("keeps an existing tabindex and scrolls only when there is no h1", () => {
    const { result } = setup();
    const first = result.current.key;
    act(() => result.current.settle(first, NavigationType.Pop));
    main.innerHTML = '<h1 tabindex="0">Title</h1>';
    act(() => result.current.settle("second", NavigationType.Replace));
    expect(main.querySelector("h1")!.getAttribute("tabindex")).toBe("0");

    main.innerHTML = "<p>No heading</p>";
    (document.activeElement as HTMLElement).blur();
    act(() => result.current.settle("third", NavigationType.Push));
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
    expect(document.activeElement).toBe(document.body);
  });

  it("scrolls instantly under reduced motion", () => {
    const matchMedia = window.matchMedia;
    window.matchMedia = ((media: string) => ({ ...matchMedia(media), matches: true })) as typeof window.matchMedia;
    try {
      const { result } = setup();
      const first = result.current.key;
      act(() => result.current.settle(first, NavigationType.Pop));
      act(() => result.current.settle("second", NavigationType.Push));
      expect(scrollIntoView).toHaveBeenCalledWith({ block: "start", behavior: "instant" });
    } finally {
      window.matchMedia = matchMedia;
    }
  });

  it("restores a saved position on POP without moving focus, and goes to top for unknown entries", () => {
    const { result } = setup();
    const first = result.current.key;
    act(() => result.current.settle(first, NavigationType.Pop));
    setScrollY(240);
    act(() => result.current.settle("second", NavigationType.Push));
    const focused = document.activeElement;

    act(() => result.current.settle(first, NavigationType.Pop));
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 240, behavior: "instant" });
    expect(document.activeElement).toBe(focused);

    act(() => result.current.settle("never-seen", NavigationType.Pop));
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "instant" });
  });

  it("is idempotent per key", () => {
    const { result } = setup();
    const first = result.current.key;
    act(() => result.current.settle(first, NavigationType.Pop));
    act(() => result.current.settle("second", NavigationType.Push));
    act(() => result.current.settle("second", NavigationType.Push));
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("stops recording between a location change and its settle", () => {
    const { result } = setup();
    const first = result.current.key;
    act(() => result.current.settle(first, NavigationType.Pop));
    setScrollY(300);

    // A location change that hasn't settled yet (e.g. still showing the fallback).
    act(() => result.current.navigate("/b"));
    setScrollY(5);

    act(() => result.current.settle("second", NavigationType.Push));
    act(() => result.current.settle(first, NavigationType.Pop));
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 300, behavior: "instant" });
  });
});
