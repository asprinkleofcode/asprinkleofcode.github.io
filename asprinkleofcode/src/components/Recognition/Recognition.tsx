interface RecognitionProps {
  name: string;
  title: string;
  positioning: string;
  /** Portrait source; a 4:5 image, rendered at its intrinsic 640×800 ratio. */
  headshotSrc: string;
}

/**
 * Homepage recognition block (FR-1): name, title and positioning line as one
 * text block, with the headshot right of it from `md` up and below it on
 * mobile, both left-aligned (UX-030). Text comes first in DOM order so it is
 * read first. Level 1/2 sizes come from the global type scale (DESIGN §8).
 */
export default function Recognition({ name, title, positioning, headshotSrc }: RecognitionProps) {
  return (
    <section className="recognition mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 pt-14 pb-12 md:flex-row md:items-center md:justify-between md:gap-10 md:pt-22 md:pb-18">
      <div className="min-w-0 max-w-xl text-left">
        <h1 className="type-identity text-text-primary">{name}</h1>
        <p className="type-title mt-2.5 text-brand-primary">{title}</p>
        <p className="type-body mt-5.5 max-w-[34ch] text-text-secondary">{positioning}</p>
      </div>
      <img
        src={headshotSrc}
        alt={name}
        width={640}
        height={800}
        fetchPriority="high"
        className="aspect-[4/5] h-auto w-48 shrink-0 rounded-default border border-border-default object-cover md:w-64"
      />
    </section>
  );
}
