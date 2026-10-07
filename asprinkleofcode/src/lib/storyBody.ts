import type { ComponentType, LazyExoticComponent } from "react";
import { retryingLazy, type RetryingLazy } from "./lazyWithRetry";
import { loadBody, type Entry } from "./registry";

type StoryBody = LazyExoticComponent<ComponentType>;

const cache = new Map<string, RetryingLazy<object>>();

/**
 * A lazily loaded MDX body, cached per entry key so re-renders reuse the same
 * component (and its resolved chunk). Render it without an inner `Suspense`:
 * the route's boundary covers it, so the shell settles scroll and focus only
 * once the body has loaded. A body whose import failed is imported again
 * after the shell retries failed imports (see `retryFailedImports`).
 */
export function getStoryBody(entry: Entry): StoryBody {
  let body = cache.get(entry.key);
  if (!body) {
    body = retryingLazy(() => loadBody(entry).then((module) => ({ default: module.default as ComponentType })));
    cache.set(entry.key, body);
  }
  return body.get();
}
