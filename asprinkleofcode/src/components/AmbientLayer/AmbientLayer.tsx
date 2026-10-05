import { useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import "./AmbientLayer.css";

const DOT_COUNT = 28;

/** Seeded mulberry32 PRNG: a given seed always yields the same field. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Builds the bokeh field for one seed. */
function makeDots(seed: number): CSSProperties[] {
  const random = mulberry32(seed);
  return Array.from({ length: DOT_COUNT }, () => {
    const size = 10 + Math.round(random() * 12);
    return {
      top: `${(random() * 100).toFixed(2)}%`,
      left: `${(random() * 100).toFixed(2)}%`,
      width: `${size}px`,
      height: `${size}px`,
      // Custom properties feed the per-dot animation delays in AmbientLayer.css.
      "--twinkle-delay": `${(random() * -5).toFixed(2)}s`,
      "--drift-delay": `${(random() * -14).toFixed(2)}s`,
    } as CSSProperties;
  });
}

const randomSeed = () => Math.floor(Math.random() * 2 ** 32);

/**
 * Site-wide decorative "breathing bokeh" (AD-12). Mounted once in the app
 * shell; never imported by a page. Purely presentational: hidden from
 * assistive tech, ignores pointer input, and is static under reduced motion.
 * The shell remounts it per navigation (`key`), so each page gets a fresh
 * field; the seed is drawn once per mount, never per render.
 */
export default function AmbientLayer({ seed }: { seed?: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const [dots] = useState(() => makeDots(seed ?? randomSeed()));
  const className = reducedMotion ? "ambient-layer ambient-layer--static" : "ambient-layer";
  return (
    <div className={className} aria-hidden="true">
      {dots.map((style, i) => (
        <span key={i} className="ambient-layer__dot" style={style} />
      ))}
    </div>
  );
}
