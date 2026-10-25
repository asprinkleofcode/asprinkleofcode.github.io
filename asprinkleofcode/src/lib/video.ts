/**
 * The sanctioned video sources for the `VideoEmbed` block (AD-8, EXPERIENCE
 * §22 Video). `plugins/contentFrontmatter.ts` checks every literal `src` at
 * build time and the component re-checks at render, so both share this one
 * validator.
 */

/** A story page embeds at most this many clips (UX-032). */
export const MAX_VIDEOS_PER_PAGE = 4;

/** `https://www.youtube-nocookie.com/embed/<11-char id>`, optionally with a query. */
const YOUTUBE = /^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}(?:\?([^#\s]*))?$/;
/** `https://drive.google.com/file/d/<id>/preview`. */
const DRIVE = /^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/preview$/;
/** Query parameters that would start or repeat a clip on its own; nothing moves unless the visitor asks (UX-032). */
const FORBIDDEN_PARAMS = ["autoplay", "loop"];

/** Why `src` can't be embedded, or `null` when it is a sanctioned YouTube-nocookie or Drive embed URL. */
export function videoSrcProblem(src: unknown): string | null {
  if (typeof src !== "string" || src.trim() === "") return "src must be a non-empty URL";
  const youtube = YOUTUBE.exec(src);
  if (youtube) {
    const params = new URLSearchParams(youtube[1] ?? "");
    const forbidden = FORBIDDEN_PARAMS.filter((name) => params.has(name));
    return forbidden.length > 0
      ? `src must not set ${forbidden.map((name) => `${name}=`).join(", ")}; clips never autoplay or loop`
      : null;
  }
  if (DRIVE.test(src)) return null;
  return (
    `src "${src}" is not a sanctioned embed; use https://www.youtube-nocookie.com/embed/<11-character id> ` +
    `or https://drive.google.com/file/d/<id>/preview`
  );
}
