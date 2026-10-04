import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "./App";

describe("App smoke test", () => {
  let consoleError: MockInstance<typeof console.error>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error");
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it.each([
    { route: "/", heading: "Welcome!" },
    { route: "/about", heading: "Alisha Sprinkle Korba" },
  ])("renders $route without throwing or console errors", ({ route, heading }) => {
    expect(() =>
      render(
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      )
    ).not.toThrow();

    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeDefined();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("links the header brand to the home route", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /Cupcake Logo/ }).getAttribute("href")).toBe("/");
  });
});
