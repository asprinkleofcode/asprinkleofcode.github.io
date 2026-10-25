import { useEffect, useRef, useState } from "react";
import { Button } from "flowbite-react";
import { resolveMedia } from "../../lib/media";
import { videoSrcProblem } from "../../lib/video";

interface VideoEmbedProps {
  /** A `youtube-nocookie.com/embed/<id>` or Drive `/file/d/<id>/preview` URL (`src/lib/video.ts`). */
  src: string;
  /** Required: names what the clip shows; it is the play control's name and the iframe's title. */
  title: string;
  /** Path inside `src/assets/media/`, e.g. `powerlifting/x.webp`; without one, a panel shows the title. */
  poster?: string;
}

/**
 * The sanctioned MDX video block (AD-8, EXPERIENCE §22 Video, UX-032). It
 * renders a click-to-load facade in a fixed 16:9 box, so nothing shifts and
 * nothing third-party loads until the visitor activates the play control;
 * only then does the `<iframe>` replace the facade in the same box, and focus
 * moves to it. There is no autoplay or loop: the visitor presses play again
 * inside the player. MDX isn't type-checked, so an invalid `src`, a blank
 * `title` or an unknown `poster` throws (the content plugin also fails the
 * build on the first two). The poster only covers the box; any further photo
 * treatment is OPEN until real photos land (Story 4.4).
 */
export default function VideoEmbed({ src, title, poster }: VideoEmbedProps) {
  const [active, setActive] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (active) frame.current?.focus();
  }, [active]);

  const problem = videoSrcProblem(src);
  if (problem !== null) throw new Error(`VideoEmbed: ${problem}`);
  if (typeof title !== "string" || title.trim() === "") throw new Error(`VideoEmbed "${src}" needs a title`);
  const image = poster === undefined ? null : resolveMedia(poster);

  return (
    <figure>
      {/* The panel background stays under the poster and the player, so the box is never a transparent hole while the iframe loads. */}
      <div className="relative aspect-video w-full overflow-hidden bg-background-secondary">
        {active ? (
          <iframe
            ref={frame}
            src={src}
            title={title}
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <>
            {image !== null && (
              <img
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
              <Button color="primary" aria-label={title} className="min-h-11 min-w-11" onClick={() => setActive(true)}>
                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-6 fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </Button>
              {image === null && <p className="type-body line-clamp-2 text-center text-text-primary">{title}</p>}
            </div>
          </>
        )}
      </div>
    </figure>
  );
}
