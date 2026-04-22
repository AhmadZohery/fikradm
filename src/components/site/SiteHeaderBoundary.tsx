import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Lightweight error boundary around SiteHeader so a runtime hook/import
 * failure doesn't blank the whole page. Renders a minimal nav fallback.
 */
export class SiteHeaderBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (typeof console !== "undefined") {
      console.error("[SiteHeader] crashed:", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
          <div className="container-app flex h-16 items-center justify-between">
            <a href="/" className="font-bold text-foreground">Fikra</a>
            <a
              href="/contact"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Contact
            </a>
          </div>
        </header>
      );
    }
    return this.props.children;
  }
}