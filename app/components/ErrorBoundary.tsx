"use client";

import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackAction?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary — catches rendering crashes in child components
 * and shows a recovery UI instead of a white screen.
 *
 * Why a class component? React doesn't support error boundaries with hooks (yet).
 * This is the only case where you still need a class component in React.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // This lifecycle method catches errors during rendering
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.fallbackAction?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-white">
              Something went wrong
            </h3>
            <p className="text-sm text-zinc-500 max-w-md">
              The result couldn&apos;t be rendered. This usually means the AI
              returned data in an unexpected format.
            </p>
          </div>

          <button
            onClick={this.handleReset}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>

          {this.state.error && (
            <details className="mt-4 max-w-md">
              <summary className="text-[10px] text-zinc-600 cursor-pointer hover:text-zinc-400 uppercase tracking-widest">
                Error Details
              </summary>
              <pre className="mt-2 p-3 bg-zinc-950 border border-zinc-900 rounded text-[11px] text-red-400/70 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
