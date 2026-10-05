import { useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import "./AmbientLayer.css";

// Density from the mockup (DESIGN §16): about 10 stars per 420×520px of viewport.
const STARS_PER_PX = 10 / (420 * 520);
const MIN_STARS = 12;
const MAX_STARS = 80;
// Used when there is no window to measure (e.g. a non-browser render).
const FALLBACK_STARS = 36;

/** Star tints, each a modifier class in AmbientLayer.css mapped to a role token. */
type StarTint = "light" | "accent" | "brand";

interface Star {
  tint: StarTint;
  style: CSSProperties;
}

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

/** Star count for the current viewport, read once per mount. */
function starCount(): number {
  if (typeof window === "undefined") return FALLBACK_STARS;
  const area = window.innerWidth * window.innerHeight;
  if (!Number.isFinite(area)) return FALLBACK_STARS;
  return Math.min(MAX_STARS, Math.max(MIN_STARS, Math.round(area * STARS_PER_PX)));
}

/** About 70% text.primary, 15% accent.secondary, 15% brand.primary. */
function pickTint(roll: number): StarTint {
  if (roll < 0.7) return "light";
  if (roll < 0.85) return "accent";
  return "brand";
}

/** Builds the star field for one seed. */
function makeStars(seed: number): Star[] {
  const random = mulberry32(seed);
  return Array.from({ length: starCount() }, () => {
    const top = `${(random() * 100).toFixed(2)}%`;
    const left = `${(random() * 100).toFixed(2)}%`;
    // Mostly 1.5px; about 1 in 6 at 2px.
    const size = random() < 1 / 6 ? "2px" : "1.5px";
    const tint = pickTint(random());
    // A random point in the full 10s (5s each way, alternating) twinkle cycle,
    // so every star runs on its own phase.
    const delay = `${(random() * -10).toFixed(2)}s`;
    return {
      tint,
      style: { top, left, width: size, height: size, "--twinkle-delay": delay } as CSSProperties,
    };
  });
}

const randomSeed = () => Math.floor(Math.random() * 2 ** 32);

/**
 * Site-wide decorative star field (AD-12, DESIGN §16 / UX-030). Mounted once
 * in the app shell; never imported by a page. Purely presentational: hidden
 * from assistive tech, ignores pointer input, and is static under reduced
 * motion. The shell remounts it per navigation (`key`), so each page gets a
 * fresh field; the seed and star count are drawn once per mount, never per
 * render.
 */
export default function AmbientLayer({ seed }: { seed?: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const [stars] = useState(() => makeStars(seed ?? randomSeed()));
  const className = reducedMotion ? "ambient-layer ambient-layer--static" : "ambient-layer";
  return (
    <div className={className} aria-hidden="true">
      {stars.map(({ tint, style }, i) => (
        <span key={i} className={`ambient-layer__star ambient-layer__star--${tint}`} style={style} />
      ))}
    </div>
  );
}
