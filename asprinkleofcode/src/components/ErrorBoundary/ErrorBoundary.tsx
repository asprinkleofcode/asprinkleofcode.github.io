import { Component, type ReactNode } from "react";
import { Button } from "flowbite-react";
import { Link } from "react-router";
import { textLinkClasses } from "../../lib/linkClasses";
import "./ErrorBoundary.css";

interface ErrorBoundaryProps {
  /** The boundary clears its error whenever this changes (the shell passes `location.key`). */
  resetKey: string;
  children: ReactNode;
  /**
   * Rendered next to the fallback (the shell passes its route-settle probe,
   * so scroll and focus still settle when a route fails).
   */
  alongsideFallback?: ReactNode;
  /**
   * Called when a `resetKey` change clears an error the boundary was showing,
   * before the children render again (the shell lets failed imports retry).
   */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  error: unknown;
  /** The `resetKey` the current error (if any) belongs to. */
  resetKey?: string;
}

/**
 * App-shell boundary (AD-16) around the routed area: a render error or a
 * failed lazy chunk shows the fallback inside `<main>` while the header and
 * footer keep working.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  // Reset before rendering, not after: an error thrown in the same update that
  // changed the key belongs to the new key and is kept, so the fallback mounts
  // once (and its route-settle probe focuses the h1 that stays on screen).
  static getDerivedStateFromProps(props: ErrorBoundaryProps, state: ErrorBoundaryState): Partial<ErrorBoundaryState> | null {
    if (props.resetKey === state.resetKey) return null;
    // Idempotent in effect (it only lets failed imports retry), so a repeated
    // or abandoned render calling it is harmless.
    if (state.error !== null) props.onReset?.();
    return { error: null, resetKey: props.resetKey };
  }

  static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
    return { error: error ?? new Error("Unknown render error") };
  }

  render(): ReactNode {
    if (this.state.error === null) return this.props.children;

    return (
      <>
        <section className="ErrorBoundary mx-auto max-w-3xl px-4 py-12">
          <h1 className="type-section text-text-primary">Something went wrong</h1>
          <p className="type-body mt-4 text-text-secondary">
            This part of the page didn't load. The navigation above still works, or you can try again.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <Button color="primary" onClick={() => window.location.reload()}>
              Try again
            </Button>
            <Link to="/" className={`type-body ${textLinkClasses}`}>
              Go to the homepage
            </Link>
          </div>
        </section>
        {this.props.alongsideFallback}
      </>
    );
  }
}

export default ErrorBoundary;
