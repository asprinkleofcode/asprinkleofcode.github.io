// Photo-meta fixture: the same glob and options as src/lib/media.ts.
export const photos = import.meta.glob("../assets/media/**/*.{webp,avif}", {
  eager: true,
  query: "?photo",
  import: "default",
});
