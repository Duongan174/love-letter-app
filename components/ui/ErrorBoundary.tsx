// components/ui/ErrorBoundary.tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Button from './Button';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI component */
  fallback?: ReactNode;
  /** Callback khi có lỗi xảy ra (dùng cho logging/analytics) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Hiển thị nút "Thử lại" để reset error boundary */
  showRetry?: boolean;
  /** Custom title cho error message */
  title?: string;
  /** Custom description cho error message */
  description?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state để render fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error để debug
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state với error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom onError callback nếu có
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Có thể gửi error lên error reporting service ở đây
    // Ví dụ: Sentry, LogRocket, etc.
  }

  handleReset = () => {
    // Reset error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Nếu có custom fallback, dùng nó
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.props.showRetry !== false ? this.handleReset : undefined}
          title={this.props.title}
          description={this.props.description}
        />
      );
    }

    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR FALLBACK UI COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset?: () => void;
  title?: string;
  description?: string;
}

function ErrorFallback({
  error,
  errorInfo,
  onReset,
  title,
  description,
}: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-cream-light to-cream flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Error Card */}
        <div className="bg-cream-light border-2 border-burgundy/20 rounded-3xl shadow-elevated p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="relative mb-6 flex justify-center">
            {/* Glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-burgundy/10 blur-2xl" />
            </div>
            {/* Icon container */}
            <div className="relative w-20 h-20 rounded-full bg-burgundy/10 flex items-center justify-center border-2 border-burgundy/20">
              <AlertTriangle className="w-10 h-10 text-burgundy" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
            {title || 'Đã xảy ra lỗi'}
          </h1>

          {/* Description */}
          <p className="font-body text-lg text-ink/70 mb-8 leading-relaxed">
            {description || (
              <>
                Rất tiếc, có vấn đề xảy ra khi tải trang này.
                <br />
                Vui lòng thử lại hoặc quay về trang chủ.
              </>
            )}
          </p>

          {/* Error Message (nếu có) */}
          {error && (
            <div className="mb-6 p-4 bg-cream/50 border border-gold/20 rounded-2xl">
              <p className="font-body text-sm text-ink/60 font-mono break-words">
                {error.message || 'Lỗi không xác định'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            {onReset && (
              <Button
                variant="primary"
                size="lg"
                icon={<RefreshCw className="w-5 h-5" />}
                onClick={onReset}
                className="min-w-[200px]"
              >
                Thử lại
              </Button>
            )}

            <Link href="/" className="sm:self-stretch">
              <Button
                variant="gold"
                size="lg"
                icon={<Home className="w-5 h-5" />}
                className="min-w-[200px] w-full sm:w-auto"
              >
                Về trang chủ
              </Button>
            </Link>

            <Link href="/templates" className="sm:self-stretch">
              <Button
                variant="ghost"
                size="lg"
                icon={<ArrowLeft className="w-5 h-5" />}
                className="min-w-[200px] w-full sm:w-auto border border-gold/20"
              >
                Xem mẫu thiệp
              </Button>
            </Link>
          </div>

          {/* Error Details Toggle (chỉ hiển thị trong dev mode) */}
          {process.env.NODE_ENV === 'development' && errorInfo && (
            <div className="mt-8 pt-8 border-t border-gold/20">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="font-body text-sm text-ink/50 hover:text-ink/70 transition-colors mb-4"
              >
                {showDetails ? 'Ẩn' : 'Hiển thị'} chi tiết lỗi (Dev only)
              </button>

              {showDetails && (
                <div className="text-left bg-cream/30 border border-gold/10 rounded-2xl p-4 overflow-auto max-h-96">
                  <div className="space-y-3">
                    <div>
                      <p className="font-body text-xs font-bold text-ink/60 mb-2 uppercase tracking-wide">
                        Error Stack:
                      </p>
                      <pre className="font-mono text-xs text-ink/70 whitespace-pre-wrap break-words">
                        {error?.stack || 'No stack trace available'}
                      </pre>
                    </div>

                    {errorInfo.componentStack && (
                      <div>
                        <p className="font-body text-xs font-bold text-ink/60 mb-2 uppercase tracking-wide">
                          Component Stack:
                        </p>
                        <pre className="font-mono text-xs text-ink/70 whitespace-pre-wrap break-words">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="mt-8 text-center">
          <p className="font-elegant text-sm text-ink/40">
            Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ{' '}
            <Link href="/help" className="text-burgundy hover:underline">
              bộ phận hỗ trợ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

