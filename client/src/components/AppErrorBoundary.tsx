import { Component, type ErrorInfo, type ReactNode } from "react";
import SomethingWentWrong from "./SomethingWentWrong";

/**
 * The app had no error boundary at all. In React 19 an uncaught render error
 * unmounts the whole root, so any one bad component produced a blank white
 * page rather than a degraded region — report/vulnerabilities/05.
 *
 * This has to be a class: `getDerivedStateFromError` still has no hook
 * equivalent. Fields are declared and assigned rather than written as
 * constructor parameter properties, because `erasableSyntaxOnly` is on.
 *
 * This is for *render crashes only*. React Query errors are values, not
 * throws — those get `<ErrorState>`.
 */

type Props = {
  children: ReactNode;
  /** Render your own fallback instead; `reset` clears the error and retries. */
  fallback?: (reset: () => void) => ReactNode;
};

type State = { error: Error | null };

class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Without this a boundary silently swallows bugs in development. No
    // error-reporting service is configured, so the console is the only sink
    // — and production stays quiet on purpose.
    if (import.meta.env.DEV) {
      console.error("Uncaught render error:", error, info.componentStack);
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      this.props.fallback?.(this.reset) ?? (
        <SomethingWentWrong onRetry={this.reset} />
      )
    );
  }
}

export default AppErrorBoundary;
