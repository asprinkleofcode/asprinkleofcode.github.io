import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ErrorBoundary } from "./ErrorBoundary";

let shouldThrow = true;
const onReset = vi.fn();
function Flaky() {
  if (shouldThrow) throw new Error("boom");
  return <p>Recovered content</p>;
}

function ui(resetKey: string) {
  return (
    <MemoryRouter>
      <ErrorBoundary resetKey={resetKey} onReset={onReset} alongsideFallback={<span data-testid="alongside" />}>
        <Flaky />
      </ErrorBoundary>
    </MemoryRouter>
  );
}

describe("ErrorBoundary", () => {
  let consoleError: MockInstance<typeof console.error>;

  beforeEach(() => {
    shouldThrow = true;
    onReset.mockClear();
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("renders children when nothing throws, without the alongside-fallback content", () => {
    shouldThrow = false;
    render(ui("a"));
    expect(screen.getByText("Recovered content")).toBeDefined();
    expect(screen.queryByTestId("alongside")).toBeNull();
  });

  it("renders the alongside-fallback content with the fallback", () => {
    render(ui("a"));
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeDefined();
    expect(screen.getByTestId("alongside")).toBeDefined();
  });

  it("shows the fallback with a reload button and a home link", () => {
    render(ui("a"));
    expect(screen.getByRole("heading", { level: 1, name: "Something went wrong" })).toBeDefined();
    expect(
      screen.getByText("This part of the page didn't load. The navigation above still works, or you can try again.")
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Try again" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Go to the homepage" }).getAttribute("href")).toBe("/");
  });

  it("stays in the error state until resetKey changes, then retries", () => {
    const { rerender } = render(ui("a"));
    shouldThrow = false;
    rerender(ui("a"));
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeDefined();

    rerender(ui("b"));
    expect(screen.getByText("Recovered content")).toBeDefined();
  });

  it("calls onReset only when a key change clears an error it was showing", () => {
    shouldThrow = false;
    const { rerender } = render(ui("a"));
    rerender(ui("b"));
    expect(onReset).not.toHaveBeenCalled();

    shouldThrow = true;
    rerender(ui("c"));
    expect(onReset).not.toHaveBeenCalled();

    shouldThrow = false;
    rerender(ui("d"));
    expect(screen.getByText("Recovered content")).toBeDefined();
    expect(onReset).toHaveBeenCalled();
  });

  it("keeps an error thrown in the same update that changed resetKey, mounting the fallback once", () => {
    shouldThrow = false;
    const { rerender } = render(ui("a"));
    expect(screen.getByText("Recovered content")).toBeDefined();

    shouldThrow = true;
    rerender(ui("b"));
    const heading = screen.getByRole("heading", { name: "Something went wrong" });
    // A later render with the same key keeps that very fallback (no clear-and-rethrow remount).
    rerender(ui("b"));
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBe(heading);
  });
});
