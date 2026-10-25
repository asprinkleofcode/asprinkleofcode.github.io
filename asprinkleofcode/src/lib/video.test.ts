import { describe, expect, it } from "vitest";
import { MAX_VIDEOS_PER_PAGE, videoSrcProblem } from "./video";

describe("videoSrcProblem", () => {
  it.each([
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    "https://www.youtube-nocookie.com/embed/a_b-C1d2E3f",
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=30",
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&start=30",
    "https://drive.google.com/file/d/1AbC-d_EfGhIjKlMnOpQrStUvWxYz0123/preview",
  ])("accepts %s", (src) => {
    expect(videoSrcProblem(src)).toBeNull();
  });

  it.each([
    ["a watch URL", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    ["the cookie YouTube embed host", "https://www.youtube.com/embed/dQw4w9WgXcQ"],
    ["a short link", "https://youtu.be/dQw4w9WgXcQ"],
    ["another host", "https://vimeo.com/123456"],
    ["a lookalike host", "https://www.youtube-nocookie.com.evil.example/embed/dQw4w9WgXcQ"],
    ["plain http", "http://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"],
    ["a 10-character id", "https://www.youtube-nocookie.com/embed/dQw4w9WgXc"],
    ["a 12-character id", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQQ"],
    ["a Drive view link", "https://drive.google.com/file/d/1AbCdEf/view"],
    ["a Drive preview with a query", "https://drive.google.com/file/d/1AbCdEf/preview?usp=sharing"],
    ["a relative path", "/videos/clip.mp4"],
  ])("rejects %s, naming the sanctioned forms", (_, src) => {
    expect(videoSrcProblem(src)).toContain("youtube-nocookie.com/embed/<11-character id>");
  });

  it.each([
    ["?autoplay=1", "autoplay="],
    ["?autoplay=0", "autoplay="],
    ["?loop=1&playlist=dQw4w9WgXcQ", "loop="],
    ["?start=5&autoplay=1&loop=1", "autoplay=, loop="],
  ])("rejects a YouTube query %s", (query, found) => {
    expect(videoSrcProblem(`https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ${query}`)).toBe(
      `src must not set ${found}; clips never autoplay or loop`
    );
  });

  it.each([undefined, null, 42, "", "  "])("rejects a missing or non-string src %j", (src) => {
    expect(videoSrcProblem(src)).toBe("src must be a non-empty URL");
  });

  it("caps a page at 4 clips", () => {
    expect(MAX_VIDEOS_PER_PAGE).toBe(4);
  });
});
