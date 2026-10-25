import { describe, expect, it } from "vitest";
import { resolveMedia, type MediaPhoto } from "./media";

const PHOTO: MediaPhoto = { src: "/assets/01-raw-gourd-abc123.webp", width: 1600, height: 1200 };
const media = { "../assets/media/birdhouses/01-raw-gourd.webp": PHOTO };

describe("resolveMedia", () => {
  it("resolves a path inside src/assets/media/ to its URL and size", () => {
    expect(resolveMedia("birdhouses/01-raw-gourd.webp", media)).toBe(PHOTO);
  });

  it.each(["birdhouses/missing.webp", "01-raw-gourd.webp", "../assets/media/birdhouses/01-raw-gourd.webp", "constructor"])(
    "throws on an unknown path %j",
    (src) => {
      expect(() => resolveMedia(src, media)).toThrow(`Unknown media path "${src}"`);
    }
  );

  it("throws for any path against the real media folder when it holds no photo of that name", () => {
    expect(() => resolveMedia("no-such-folder/no-such-photo.webp")).toThrow(
      'Unknown media path "no-such-folder/no-such-photo.webp"'
    );
  });
});
