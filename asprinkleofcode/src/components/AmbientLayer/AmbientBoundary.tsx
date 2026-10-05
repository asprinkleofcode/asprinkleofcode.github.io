import { Component, type ReactNode } from "react";

/** Renders nothing if the decorative layer throws, so the app keeps running. */
export class AmbientBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
