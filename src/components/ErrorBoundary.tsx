import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMsg = "An unexpected error occurred.";
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            errorMsg = parsed.error;
          }
        }
      } catch (e) {
        errorMsg = this.state.error?.message || errorMsg;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="glass-card p-8 rounded-2xl max-w-md w-full text-center border-error-dim/30">
            <span className="material-symbols-outlined text-error text-6xl mb-4">error</span>
            <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">Oops! Something went wrong.</h2>
            <p className="text-on-surface-variant text-sm mb-6">{errorMsg}</p>
            <button
              className="btn-primary px-6 py-3"
              onClick={() => window.location.reload()}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
