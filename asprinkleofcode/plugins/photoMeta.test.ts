// @vitest-environment node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer, type ViteDevServer } from "vite";
import { afterEach, describe, expect, it } from "vitest";
import viteConfig from "../vite.config";
import { photoDimensions } from "./photoMeta";

/** Runs vite.config.ts's plugins on a fixture root holding one committed 3×2 WebP. */

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "__fixtures__", "photo-meta");
const fixturePhoto = path.join(root, "src/assets/media/fixture/three-by-two.webp");

let server: ViteDevServer | undefined;

async function load(module: string): Promise<Record<string, unknown>> {
  server = await createServer({
    configFile: false,
    root,
    plugins: viteConfig.plugins,
    logLevel: "silent",
    appType: "custom",
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  return server.ssrLoadModule(module);
}

afterEach(async () => {
  await server?.close();
  server = undefined;
});

describe("photoMeta", () => {
  it("reads a photo's pixel size from the file", () => {
    expect(photoDimensions(fixturePhoto)).toEqual({ width: 3, height: 2 });
  });

  it("fails naming the file when it is not an image", () => {
    expect(() => photoDimensions(fileURLToPath(import.meta.url))).toThrow("photoMeta.test.ts");
  });

  it("serves a ?photo glob of src/assets/media/ as { src, width, height }", async () => {
    const { photos } = (await load("/src/lib/photos.ts")) as { photos: Record<string, { src: string }> };
    expect(photos).toEqual({
      "../assets/media/fixture/three-by-two.webp": {
        src: expect.stringMatching(/^\/.*three-by-two\.webp$/),
        width: 3,
        height: 2,
      },
    });
    // A root-relative URL, never the file's absolute path on disk.
    const { src } = photos["../assets/media/fixture/three-by-two.webp"];
    expect(src).toBe("/src/assets/media/fixture/three-by-two.webp");
    expect(src).not.toContain(root.split(path.sep).join("/"));
  });

  it("rejects a ?photo import from outside src/assets/media/", async () => {
    const error: unknown = await load("/src/lib/outside.ts").then(
      () => undefined,
      (e: unknown) => e
    );
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain("resolves outside src/assets/media/");
  });
});
