import { createElement, lazy, type ComponentType, type LazyExoticComponent } from "react";

type Loader<P> = () => Promise<{ default: ComponentType<P> }>;

/** A lazy component that can be re-imported after its import fails. */
export interface RetryingLazy<P> {
  /**
   * The lazy component to render. A failed import is kept until
   * `retryFailedImports()` runs, so the render that hit the failure (and
   * React's own re-renders of it) throws to the error boundary instead of
   * re-importing in a loop.
   */
  get(): LazyExoticComponent<ComponentType<P>>;
}

let generation = 0;

/**
 * Lets every failed import try again the next time it renders. The shell's
 * error boundary calls this when a navigation clears an error it was showing,
 * so leaving a failed page and coming back to it (by link, Back or Forward)
 * imports it again, while re-renders inside the failing navigation do not.
 */
export function retryFailedImports(): void {
  generation++;
}

/**
 * `React.lazy` keeps a rejected import for the life of the page, so one failed
 * chunk request (a network blip, or a redeploy that removed an old hashed
 * chunk) would break that page or story until a full reload. This makes a
 * fresh `lazy()` once `retryFailedImports()` has run since the failure. A
 * browser that caches failed module fetches can still refuse the retry; the
 * error fallback's "Try again" reload covers that case.
 */
export function retryingLazy<P>(load: Loader<P>): RetryingLazy<P> {
  let failedAt: number | undefined;
  const create = () => {
    failedAt = undefined;
    return lazy(() =>
      load().catch((error: unknown) => {
        failedAt = generation;
        throw error;
      })
    );
  };
  let current = create();

  return {
    get() {
      if (failedAt !== undefined && failedAt !== generation) current = create();
      return current;
    },
  };
}

/** `React.lazy` for a route page, re-importing after a failure once the shell retries failed imports. */
export function lazyWithRetry<P extends object>(load: Loader<P>): ComponentType<P> {
  const loader = retryingLazy(load);
  function LazyWithRetry(props: P) {
    return createElement(loader.get() as ComponentType<P>, props);
  }
  return LazyWithRetry;
}
