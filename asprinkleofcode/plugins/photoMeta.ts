import { readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import type { Plugin } from "vite";

/**
 * Serves `<photo>?photo` imports of files under `src/assets/media/` as
 * `{ src, width, height }`, with the dimensions read from the file at build
 * time, so authors write only `src` and `alt` and every `<img>` still gets
 * explicit `width`/`height` (no layout shift). `src` is the ordinary Vite
 * asset import of the same file, so hashing and inlining are unchanged.
 *
 * A `?photo` import of anything outside `src/assets/media/`, or of a file
 * whose size can't be read, fails naming the file.
 */

const QUERY = "?photo";
const VIRTUAL_PREFIX = "\0photo-meta:";

export interface PhotoDimensions {
  width: number;
  height: number;
}

/** The pixel size of the image at `file`. Throws naming the file when it has none. */
export function photoDimensions(file: string): PhotoDimensions {
  let size: { width?: number; height?: number } = {};
  try {
    size = imageSize(readFileSync(file));
  } catch {
    // Reported below with the file name, which image-size's own error lacks.
  }
  const { width, height } = size;
  if (!width || !height) throw new Error(`Photo: could not read the width and height of ${file}`);
  return { width, height };
}

/** The module a `?photo` import loads: the asset URL plus its dimensions. */
export function photoModule(file: string, { width, height }: PhotoDimensions): string {
  return `import src from ${JSON.stringify(file)};\nexport default { src, width: ${width}, height: ${height} };\n`;
}

export default function photoMeta(): Plugin {
  let mediaDir = "";

  return {
    name: "photo-meta",
    enforce: "pre",

    configResolved(config) {
      mediaDir = path.resolve(config.root, "src/assets/media");
    },

    async resolveId(source, importer) {
      if (!source.endsWith(QUERY)) return null;
      const resolved = await this.resolve(source.slice(0, -QUERY.length), importer, { skipSelf: true });
      if (!resolved) return null;
      const file = resolved.id.split("?")[0];
      // path.relative, not startsWith: Windows drive-letter case can differ between root and resolved id.
      const rel = path.relative(mediaDir, file);
      if (rel === "" || rel.startsWith("..") || path.isAbsolute(rel)) {
        this.error(`Photo: "${source}" resolves outside src/assets/media/; ?photo imports only content photos`);
      }
      return VIRTUAL_PREFIX + file;
    },

    load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) return null;
      const file = id.slice(VIRTUAL_PREFIX.length);
      this.addWatchFile(file);
      return photoModule(file, photoDimensions(file));
    },
  };
}
