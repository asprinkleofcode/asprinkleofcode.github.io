import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ErrorBoundary } from "./ErrorBoundary";

let shouldThrow = true;
function Flaky() {
  if (shouldThrow) throw new Error("boom");
  return <p>Recovered content</p>;
}

function ui(resetKey: string) {
  return (
    <MemoryRouter>
      <ErrorBoundary resetKey={resetKey}>
        <Flaky />
      </ErrorBoundary>
    </MemoryRouter>
  );
}

describe("ErrorBoundary", () => {
  let consoleError: MockInstance<typeof console.error>;

  beforeEach(() => {
    shouldThrow = true;
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("renders children when nothing throws", () => {
    shouldThrow = false;
    render(ui("a"));
    expect(screen.getByText("Recovered content")).toBeDefined();
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
});
