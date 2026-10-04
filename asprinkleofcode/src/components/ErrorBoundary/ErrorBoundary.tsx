import { Component, type ReactNode } from "react";
import { Button } from "flowbite-react";
import { Link } from "react-router";
import { textLinkClasses } from "../../lib/linkClasses";
import "./ErrorBoundary.css";

interface ErrorBoundaryProps {
  /** The boundary clears its error whenever this changes (the shell passes `location.key`). */
  resetKey: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: unknown;
}

/**
 * App-shell boundary (AD-16) around the routed area: a render error or a
 * failed lazy chunk shows the fallback inside `<main>` while the header and
 * footer keep working.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: error ?? new Error("Unknown render error") };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.error !== null && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render(): ReactNode {
    if (this.state.error === null) return this.props.children;

    return (
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
    );
  }
}

export default ErrorBoundary;
