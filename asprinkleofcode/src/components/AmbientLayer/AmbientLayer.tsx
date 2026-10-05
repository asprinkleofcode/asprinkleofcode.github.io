import type { CSSProperties } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import "./AmbientLayer.css";

const DOT_COUNT = 28;

/** Seeded mulberry32 PRNG so the field is identical on every load and render. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(0x5eed);
const DOTS = Array.from({ length: DOT_COUNT }, () => {
  const size = 10 + Math.round(random() * 12);
  return {
    top: `${(random() * 100).toFixed(2)}%`,
    left: `${(random() * 100).toFixed(2)}%`,
    width: `${size}px`,
    height: `${size}px`,
    "--twinkle-delay": `${(random() * -5).toFixed(2)}s`,
    "--drift-delay": `${(random() * -14).toFixed(2)}s`,
    // Custom properties feed the per-dot animation delays in AmbientLayer.css.
  } as CSSProperties;
});

/**
 * Site-wide decorative "breathing bokeh" (AD-12). Mounted once in the app
 * shell; never imported by a page. Purely presentational: hidden from
 * assistive tech, ignores pointer input, and is static under reduced motion.
 */
export default function AmbientLayer() {
  const reducedMotion = usePrefersReducedMotion();
  const className = reducedMotion ? "ambient-layer ambient-layer--static" : "ambient-layer";
  return (
    <div className={className} aria-hidden="true">
      {DOTS.map((style, i) => (
        <span key={i} className="ambient-layer__dot" style={style} />
      ))}
    </div>
  );
}
