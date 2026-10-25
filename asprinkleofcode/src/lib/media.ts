/**
 * Content photos (Conventions → Images): content names a photo by its path
 * inside `src/assets/media/`, e.g. `birdhouses/01-raw-gourd.webp`, and this
 * is the one place that path resolves. `plugins/photoMeta.ts` supplies each
 * photo's URL and its pixel size, so every `<img>` gets explicit
 * `width`/`height`.
 */
export interface MediaPhoto {
  src: string;
  width: number;
  height: number;
}

/** Glob keys are relative to this file, so a media path sits after this prefix. */
const PREFIX = "../assets/media/";

const MEDIA = import.meta.glob<MediaPhoto>("../assets/media/**/*.{webp,avif}", {
  eager: true,
  query: "?photo",
  import: "default",
});

/**
 * The photo at `src` (a path inside `src/assets/media/`). Throws on an unknown
 * path, so a typo fails the render (and the live-body test) instead of
 * shipping a broken `<img>`. `media` replaces the real glob in tests.
 */
export function resolveMedia(src: string, media: Record<string, MediaPhoto> = MEDIA): MediaPhoto {
  const key = PREFIX + src;
  if (!Object.hasOwn(media, key)) throw new Error(`Unknown media path "${src}"`);
  return media[key];
}
