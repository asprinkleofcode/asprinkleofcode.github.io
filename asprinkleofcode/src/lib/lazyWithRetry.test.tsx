import { Suspense, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation, useNavigate, type NavigateFunction } from "react-router";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import { lazyWithRetry, retryFailedImports, retryingLazy } from "./lazyWithRetry";

const Page = ({ label }: { label: string }) => <h1>{label}</h1>;

let navigate: NavigateFunction;
function Shell({ children }: { children: ReactNode }) {
  navigate = useNavigate();
  const { key } = useLocation();
  return (
    <ErrorBoundary resetKey={key} onReset={retryFailedImports}>
      <Suspense fallback={<p>Loading…</p>}>{children}</Suspense>
    </ErrorBoundary>
  );
}

describe("lazyWithRetry", () => {
  let consoleError: MockInstance<typeof console.error>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("renders the loaded component with its props", async () => {
    const Lazy = lazyWithRetry(() => Promise.resolve({ default: Page }));
    render(
      <MemoryRouter>
        <Shell>
          <Lazy label="Loaded" />
        </Shell>
      </MemoryRouter>
    );
    expect(await screen.findByRole("heading", { name: "Loaded" })).toBeDefined();
  });

  it("shows the error boundary on a failed import, then imports again on the next navigation", async () => {
    const load = vi
      .fn<() => Promise<{ default: typeof Page }>>()
      .mockRejectedValueOnce(new Error("Failed to fetch dynamically imported module"))
      .mockResolvedValue({ default: Page });
    const Lazy = lazyWithRetry(load);
    render(
      <MemoryRouter>
        <Shell>
          <Lazy label="Recovered" />
        </Shell>
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Something went wrong" })).toBeDefined();
    // The failing render (and React's own retries of it) must not re-import.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(load).toHaveBeenCalledTimes(1);

    act(() => navigate("/again"));
    expect(await screen.findByRole("heading", { name: "Recovered" })).toBeDefined();
    expect(load).toHaveBeenCalledTimes(2);
  });
});

describe("lazyWithRetry on Back", () => {
  let consoleError: MockInstance<typeof console.error>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("imports again when Back returns to the entry whose import failed", async () => {
    const load = vi
      .fn<() => Promise<{ default: typeof Page }>>()
      .mockRejectedValueOnce(new Error("Failed to fetch dynamically imported module"))
      .mockResolvedValue({ default: Page });
    const Lazy = lazyWithRetry(load);
    render(
      <MemoryRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/lazy" element={<Lazy label="Recovered" />} />
          </Routes>
        </Shell>
      </MemoryRouter>
    );
    await screen.findByRole("heading", { name: "Home" });

    act(() => navigate("/lazy"));
    expect(await screen.findByRole("heading", { name: "Something went wrong" })).toBeDefined();
    act(() => navigate("/"));
    await screen.findByRole("heading", { name: "Home" });

    // A POP restores the failed entry's old location key; it must still retry.
    act(() => navigate(-1));
    expect(await screen.findByRole("heading", { name: "Recovered" })).toBeDefined();
    expect(load).toHaveBeenCalledTimes(2);
  });
});

describe("retryingLazy", () => {
  it("keeps one lazy component while the import has not failed", () => {
    const loader = retryingLazy(() => Promise.resolve({ default: Page }));
    expect(loader.get()).toBe(loader.get());
  });
});
