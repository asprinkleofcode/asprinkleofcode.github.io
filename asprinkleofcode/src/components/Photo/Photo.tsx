import { resolveMedia } from "../../lib/media";

interface PhotoProps {
  /** Path inside `src/assets/media/`, e.g. `birdhouses/01-raw-gourd.webp`. */
  src: string;
  /** Required: what the photo shows and why it is there (EXPERIENCE §22). */
  alt: string;
  caption?: string;
  /** Loads eagerly, for the photo at the top of the page (the hero); every other photo lazy-loads. */
  priority?: boolean;
}

/**
 * The sanctioned MDX photo block (AD-8). Width and height come from the file
 * (`plugins/photoMeta.ts`), so the page never shifts as it loads. An unknown
 * `src` throws rather than rendering a broken image. The photo fills its
 * column at its own aspect ratio; any further treatment (ratio, radius, edge)
 * is OPEN until real photos land (Story 4.4), and spacing in a story body
 * comes from the prose wrapper.
 */
export default function Photo({ src, alt, caption, priority = false }: PhotoProps) {
  // MDX isn't type-checked, so a missing or blank alt is caught here.
  if (typeof alt !== "string" || alt.trim() === "") throw new Error(`Photo "${src}" needs alt text`);
  const photo = resolveMedia(src);
  return (
    <figure>
      <img
        src={photo.src}
        alt={alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? undefined : "async"}
        className="block h-auto w-full"
      />
      {caption && <figcaption className="type-meta mt-2 text-text-secondary">{caption}</figcaption>}
    </figure>
  );
}
