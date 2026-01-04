// components/providers/ErrorBoundaryWrapper.tsx
'use client';

/**
 * Client Component wrapper cho ErrorBoundary
 * Cho phép sử dụng ErrorBoundary trong Server Components
 */
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { serverLogger } from '@/lib/server-logger';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

export default function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error với server logger
        // Note: serverLogger có thể được gọi từ client component
        // nhưng sẽ chỉ log trong development hoặc nếu có error tracking service
        if (typeof window !== 'undefined') {
          console.error('ErrorBoundary caught error:', error, errorInfo);
          
          // Trong production, có thể gửi lên error tracking service
          // Example: Sentry.captureException(error, { extra: errorInfo });
        }
      }}
      title="Lỗi tải trang"
      description="Đã xảy ra lỗi khi tải ứng dụng. Vui lòng thử lại hoặc làm mới trang."
    >
      {children}
    </ErrorBoundary>
  );
}

