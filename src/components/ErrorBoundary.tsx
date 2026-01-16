 // src/components/ErrorBoundary.tsx - UPDATED WITH ANIMESTAR BLUE THEME
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-950 to-blue-950 flex items-center justify-center p-4">
          <div className="bg-blue-900/30 backdrop-blur-sm border border-red-500/50 rounded-xl p-8 max-w-md text-center shadow-2xl">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-blue-200 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition font-medium"
              >
                🔄 Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="w-full bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition font-medium"
              >
                🔄 Try Again
              </button>
              <a
                href="/"
                className="inline-block w-full bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-medium"
              >
                🏠 Go to Homepage
              </a>
            </div>
            <div className="mt-6 pt-6 border-t border-blue-700/50">
              <p className="text-blue-300 text-sm">
                If the problem persists, please contact support at{' '}
                <a href="mailto:animestarofficial@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
                  animestarofficial@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;