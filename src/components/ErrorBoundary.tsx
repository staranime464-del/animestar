 // src/components/ErrorBoundary.tsx  
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
        <div className="min-h-screen bg-[#636363] flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            {/* Background Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#60CC3F]/10 to-[#4CAF50]/10 rounded-2xl blur-xl opacity-50"></div>
            
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-[#4A4A4A] to-[#636363] border-2 border-[#60CC3F]/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-sm">
              
              {/* Error Icon */}
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#60CC3F] to-[#4CAF50] rounded-full blur-lg opacity-20"></div>
                <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-[#636363] to-[#4A4A4A] rounded-2xl border-2 border-[#60CC3F] flex items-center justify-center shadow-lg">
                  <span className="text-4xl text-[#60CC3F]">⚠️</span>
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  ANIMESTAR <span className="text-[#60CC3F]">ERROR</span>
                </h2>
                <p className="text-gray-300 text-lg mb-4">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
                <div className="inline-block bg-[#636363] border border-gray-600 rounded-lg px-4 py-2">
                  <p className="text-sm text-gray-400">
                    Please try reloading the page
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] text-white px-6 py-4 rounded-xl transition-all transform hover:scale-[1.02] font-bold shadow-lg border border-[#60CC3F] flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reload Page
                </button>
                
                <button
                  onClick={() => this.setState({ hasError: false })}
                  className="w-full bg-[#636363] hover:bg-[#5a5a5a] border border-gray-600 hover:border-[#60CC3F]/50 text-gray-300 hover:text-white px-6 py-4 rounded-xl transition-all font-medium flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  Try Again
                </button>
                
                <a
                  href="/"
                  className="inline-block w-full bg-gradient-to-r from-[#4A4A4A] to-[#636363] hover:from-[#5a5a5a] hover:to-[#4A4A4A] border border-gray-600 hover:border-[#60CC3F]/50 text-white px-6 py-4 rounded-xl transition-all font-bold flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to Homepage
                </a>
              </div>

              {/* Support Section */}
              <div className="pt-6 border-t border-gray-700">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#60CC3F]/20 to-[#4CAF50]/10 rounded-lg flex items-center justify-center border border-[#60CC3F]/30">
                    <svg className="w-4 h-4 text-[#60CC3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[#60CC3F] text-sm font-medium">
                    Need Help?
                  </p>
                </div>
                <p className="text-gray-400 text-sm">
                  Contact support at{' '}
                  <a 
                    href="mailto:animestarofficial@gmail.com" 
                    className="text-[#60CC3F] hover:text-[#4CAF50] font-medium underline underline-offset-2"
                  >
                    animestarofficial@gmail.com
                  </a>
                </p>
              </div>

              {/* Footer Note */}
              <div className="mt-6">
                <p className="text-xs text-gray-600">
                  Error Code: {this.state.error?.name || 'UNKNOWN'} • Animestar v1.0
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-[#60CC3F] to-[#4CAF50] rounded-full blur-md opacity-30"></div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#60CC3F] to-[#4CAF50] rounded-full blur-md opacity-20"></div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;