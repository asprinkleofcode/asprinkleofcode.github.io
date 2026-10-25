import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "flowbite-react";
import type { ReactElement } from "react";
import VideoEmbed from "./VideoEmbed";
import { aSprinkleOfCodeApplyTheme, aSprinkleOfCodeTheme } from "../../theme/aSprinkleOfCodeTheme";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";

// An injected media map: src/assets/media/ holds no photos until Story 4.4.
vi.mock("../../lib/media", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../lib/media")>();
  const media = { "../assets/media/powerlifting/x.webp": { src: "/fixture/x.webp", width: 1280, height: 720 } };
  return { ...actual, resolveMedia: (src: string) => actual.resolveMedia(src, media) };
});

const SRC = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=30";
const DRIVE = "https://drive.google.com/file/d/1AbCdEf/preview";
const TITLE = "Squat, 140 kg, 2025 state meet";

const renderThemed = (ui: ReactElement) => render(<ThemeProvider theme={aSprinkleOfCodeTheme} applyTheme={aSprinkleOfCodeApplyTheme}>{ui}</ThemeProvider>);

/** Every URL in the subtree's attributes that points off the site. */
function thirdPartyUrls(root: Element): string[] {
  return [root, ...root.querySelectorAll("*")].flatMap((el) =>
    [...el.attributes].map((attribute) => attribute.value).filter((value) => /https?:\/\//.test(value))
  );
}

describe("VideoEmbed", () => {
  it("renders a facade with no iframe and no third-party URL before activation", () => {
    const { container } = renderThemed(<VideoEmbed src={SRC} title={TITLE} />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(thirdPartyUrls(container)).toEqual([]);
    expect(container.innerHTML).not.toContain("youtube");
  });

  it("shows the title on a role-token panel without a poster, with a play button named by the title", () => {
    const { container } = renderThemed(<VideoEmbed src={SRC} title={TITLE} />);
    const button = screen.getByRole("button", { name: TITLE });
    expect(button.textContent).toBe("");
    expect(button.className.split(" ")).toEqual(expect.arrayContaining(["min-h-11", "min-w-11", "focus-visible:ring-focus-ring"]));
    expect(screen.getByText(TITLE).tagName).toBe("P");
    const box = container.querySelector("figure > div")!;
    // A fixed 16:9 box sized before load fills the column, so nothing shifts or overflows at 375px.
    expect(box.className.split(" ")).toEqual(expect.arrayContaining(["aspect-video", "w-full", "bg-background-secondary"]));
    expect(container.querySelector("img")).toBeNull();
    expectNoFlowbiteDefaults(container);
  });

  it("covers the box with a lazy, decorative poster of explicit size", () => {
    const { container } = renderThemed(<VideoEmbed src={SRC} title={TITLE} poster="powerlifting/x.webp" />);
    const img = container.querySelector("img")!;
    expect(img.getAttribute("alt")).toBe("");
    expect(img.getAttribute("src")).toBe("/fixture/x.webp");
    expect(img.getAttribute("width")).toBe("1280");
    expect(img.getAttribute("height")).toBe("720");
    expect(img.getAttribute("loading")).toBe("lazy");
    expect(img.className.split(" ")).toEqual(expect.arrayContaining(["h-full", "w-full", "object-cover"]));
    expect(screen.getByRole("button", { name: TITLE })).toBeTruthy();
    expect(screen.queryByText(TITLE)).toBeNull();
    expect(container.querySelector("iframe")).toBeNull();
    expectNoFlowbiteDefaults(container);
  });

  it.each([
    ["a click", () => fireEvent.click(screen.getByRole("button", { name: TITLE }))],
    [
      // A native <button>: the browser turns Enter/Space on the focused control into this click.
      "keyboard activation",
      () => {
        const button = screen.getByRole("button", { name: TITLE });
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        button.focus();
        expect(document.activeElement).toBe(button);
        fireEvent.click(button, { detail: 0 });
      },
    ],
  ])("loads exactly one focused iframe in the same box on %s", (_, activate) => {
    const { container } = renderThemed(<VideoEmbed src={SRC} title={TITLE} poster="powerlifting/x.webp" />);
    const box = container.querySelector("figure > div")!;
    act(activate);
    const frames = container.querySelectorAll("iframe");
    expect(frames).toHaveLength(1);
    const frame = frames[0];
    expect(frame.parentElement).toBe(box);
    expect(frame.getAttribute("title")).toBe(TITLE);
    expect(frame.getAttribute("src")).toBe(SRC);
    expect(frame.hasAttribute("allowfullscreen")).toBe(true);
    expect(frame.getAttribute("allow")).toBe("encrypted-media; picture-in-picture; fullscreen");
    expect(document.activeElement).toBe(frame);
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });

  it("embeds a Drive preview unchanged", () => {
    const { container } = renderThemed(<VideoEmbed src={DRIVE} title={TITLE} />);
    fireEvent.click(screen.getByRole("button", { name: TITLE }));
    expect(container.querySelector("iframe")?.getAttribute("src")).toBe(DRIVE);
    // The panel background stays under the player while it loads.
    expect(container.querySelector("figure > div")!.className.split(" ")).toContain("bg-background-secondary");
  });

  it.each([
    ["a watch URL", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "is not a sanctioned embed"],
    ["autoplay", `${SRC}&autoplay=1`, "must not set autoplay="],
    ["another host", "https://vimeo.com/1", "is not a sanctioned embed"],
    ["no src", undefined, "src must be a non-empty URL"],
  ])("throws on %s, since MDX isn't type-checked", (_, src, message) => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderThemed(<VideoEmbed src={src as string} title={TITLE} />)).toThrow(message);
    quiet.mockRestore();
    expect(document.querySelector("figure")).toBeNull();
  });

  it.each([undefined, "", "   "])("throws when title is %j", (title) => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderThemed(<VideoEmbed src={SRC} title={title as string} />)).toThrow(`VideoEmbed "${SRC}" needs a title`);
    quiet.mockRestore();
  });

  it("throws on an unknown poster", () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderThemed(<VideoEmbed src={SRC} title={TITLE} poster="powerlifting/missing.webp" />)).toThrow(
      'Unknown media path "powerlifting/missing.webp"'
    );
    quiet.mockRestore();
  });
});
