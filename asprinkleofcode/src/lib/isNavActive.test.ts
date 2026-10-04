import { describe, expect, it } from "vitest";
import { isNavActive } from "./isNavActive";

describe("isNavActive", () => {
  it.each([
    ["/", "/", true],
    ["/engineering", "/", false],
    ["/engineering", "/engineering", true],
    ["/engineering/foo", "/engineering", true],
    ["/engineering-x", "/engineering", false],
    ["/leadership/x", "/engineering", false],
    ["/about", "/beyond", false],
    ["/nope", "/", false],
  ])("pathname %s, link %s -> %s", (pathname, to, expected) => {
    expect(isNavActive(pathname, to)).toBe(expected);
  });
});
