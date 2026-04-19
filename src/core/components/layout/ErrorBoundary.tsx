/**
 * ErrorBoundary — React class component that catches unhandled render errors.
 *
 * Layer: core/components/layout — wraps the entire application router so that
 * routing or feature-level render errors are caught and replaced with a
 * user-friendly fallback UI instead of a blank screen.
 *
 * React error boundaries must be class components; function components cannot
 * implement `componentDidCatch` or `getDerivedStateFromError`.
 *
 * When an error is caught:
 * 1. `getDerivedStateFromError` sets `hasError: true` synchronously (before
 *    the next render), causing the fallback UI to be displayed.
 * 2. `componentDidCatch` logs the error and component stack to the console for
 *    debugging.
 *
 * Constraint: must NOT import from features/ or pages/.
 */
import React from "react";

/**
 * Catches synchronous render errors anywhere in its subtree and displays a
 * "Something went wrong" screen with a page-refresh button.
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: unknown) {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("Routing error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper text-ink flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-jade mb-4">Something went wrong</h1>
            <p className="text-ink/70 mb-6">Please refresh the page or try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg border border-jade bg-jade text-white px-6 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
