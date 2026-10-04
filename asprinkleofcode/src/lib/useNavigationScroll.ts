import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { NavigationType, useLocation } from "react-router";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export type SettleRoute = (key: string, navigationType: NavigationType) => void;

/**
 * The shell's single scroll and focus handler (AD-19). Call it once, outside
 * the route `Suspense` boundary, and call the returned `settle` from inside
 * that boundary once a location's content has committed.
 *
 * - Initial load: no scroll or focus change.
 * - PUSH / REPLACE: scroll to the top of `<main>` (instant under reduced
 *   motion) and focus its `<h1>`, adding `tabindex="-1"` if needed.
 * - POP: restore the entry's saved scroll position instantly (top when the
 *   entry is unknown); focus is left alone.
 *
 * Scroll positions are recorded per settled `location.key`, in memory only.
 * Recording pauses between a location change and its settle so a loading
 * fallback can't overwrite the position saved for the page being left.
 * `settle` is idempotent per key (StrictMode and `Suspense` re-reveal re-run
 * layout effects).
 */
export function useNavigationScroll(mainRef: RefObject<HTMLElement | null>): SettleRoute {
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  const positions = useRef(new Map<string, number>());
  // Seeded with the initial key: the initial settle is a same-key no-op (no
  // scroll or focus), and a first route that throws before settling doesn't
  // make the next real navigation look like the initial load.
  const settledKey = useRef(location.key);
  // Recording starts once the initial route has settled.
  const paused = useRef(true);
  const reducedMotionRef = useRef(reducedMotion);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const { history } = window;
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";

    const onScroll = () => {
      if (paused.current) return;
      positions.current.set(settledKey.current, window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      history.scrollRestoration = previous;
    };
  }, []);

  // Child layout effects run first, so when the new route didn't suspend it
  // has already settled by now and recording stays on.
  useLayoutEffect(() => {
    if (settledKey.current !== location.key) paused.current = true;
  }, [location.key]);

  return useCallback<SettleRoute>(
    (key, navigationType) => {
      // Clear the pause even for an already-settled key, e.g. a POP back from
      // a route that errored before it could settle.
      paused.current = false;
      if (settledKey.current === key) return;
      settledKey.current = key;

      if (navigationType === NavigationType.Pop) {
        window.scrollTo({ top: positions.current.get(key) ?? 0, behavior: "instant" });
        return;
      }

      const main = mainRef.current;
      if (!main) return;
      main.scrollIntoView({ block: "start", behavior: reducedMotionRef.current ? "instant" : "smooth" });

      const heading = main.querySelector("h1");
      if (!heading) return;
      if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    },
    [mainRef]
  );
}
