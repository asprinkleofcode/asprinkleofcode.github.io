import "./Recognition.css";

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
 * mobile. Text comes first in DOM order so it is read first.
 */
export default function Recognition({ name, title, positioning, headshotSrc }: RecognitionProps) {
  return (
    <section className="recognition mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-12 md:flex-row md:justify-between md:gap-12 md:py-16">
      <div className="max-w-xl text-center md:text-left">
        <h1 className="type-identity text-brand-primary">{name}</h1>
        <p className="type-title mt-2 text-text-primary">{title}</p>
        <p className="type-body mt-4 text-text-secondary">{positioning}</p>
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
