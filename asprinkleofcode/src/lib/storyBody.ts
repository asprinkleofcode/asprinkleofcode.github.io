import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { loadBody, type Entry } from "./registry";

type StoryBody = LazyExoticComponent<ComponentType>;

const cache = new Map<string, StoryBody>();

/**
 * A lazily loaded MDX body, cached per entry key so re-renders reuse the same
 * component (and its resolved chunk). Render it without an inner `Suspense`:
 * the route's boundary covers it, so the shell settles scroll and focus only
 * once the body has loaded.
 */
export function getStoryBody(entry: Entry): StoryBody {
  let body = cache.get(entry.key);
  if (!body) {
    body = lazy(() => loadBody(entry).then((module) => ({ default: module.default as ComponentType })));
    cache.set(entry.key, body);
  }
  return body;
}
