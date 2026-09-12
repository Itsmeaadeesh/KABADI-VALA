import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCw, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  clearing: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      clearing: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught runtime error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleClearCacheAndReload = async () => {
    this.setState({ clearing: true });
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      try {
        localStorage.removeItem('kabadiwala_demo_role');
        localStorage.removeItem('kabadiwala_lang');
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.warn('Error clearing caches:', err);
    }

    setTimeout(() => {
      window.location.href = '/';
    }, 200);
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-bold text-slate-900 mb-2">
              App Update or Cache Sync Required
            </h1>
            <p className="text-xs font-semibold text-emerald-700 mb-2 tracking-wide uppercase">
              Kabadiwala Connect | कबाड़ीवाला कनेक्ट
            </p>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              A newer version of the platform has been deployed, or your mobile browser is holding a cached script. Tap below to refresh and load the latest updates.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleClearCacheAndReload}
                disabled={this.state.clearing}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-600/20 disabled:opacity-75 text-sm"
              >
                <RotateCw className={`w-4 h-4 ${this.state.clearing ? 'animate-spin' : ''}`} />
                {this.state.clearing ? 'Refreshing...' : 'Clear Cache & Refresh (कैश साफ़ करें और ताज़ा करें)'}
              </button>

              <button
                onClick={this.handleRetry}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 active:scale-[0.98] transition-all text-xs"
              >
                Try Again
              </button>
            </div>

            {this.state.error && (
              <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200 text-left">
                <p className="text-[11px] font-mono text-slate-500 break-words line-clamp-3">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
