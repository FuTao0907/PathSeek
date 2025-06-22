import React from 'react';
import ErrorBoundary, { ErrorBoundaryProps } from './ErrorBoundary';

// 高阶组件：为组件添加错误边界
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WithErrorBoundaryComponent = (props: P) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
}

// Hook：用于在函数组件中处理错误
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    setError(errorObj);
  }, []);

  // 如果有错误，抛出它以便错误边界捕获
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

// 异步错误处理Hook
export function useAsyncError() {
  const { captureError } = useErrorHandler();

  return React.useCallback(
    (error: Error) => {
      // 在下一个事件循环中抛出错误，确保错误边界能够捕获
      setTimeout(() => {
        captureError(error);
      }, 0);
    },
    [captureError]
  );
}

// 错误边界组件的便捷包装器
export const SimpleErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: (
    error: Error,
    errorInfo: React.ErrorInfo,
    retry: () => void
  ) => React.ReactNode | undefined;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}> = ({ children, fallback, onError }) => {
  const defaultFallback = (error: Error, errorInfo: React.ErrorInfo, retry: () => void) => (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <button onClick={retry}>Try again</button>
    </div>
  );

  const defaultOnError = (error: Error, errorInfo: React.ErrorInfo, errorId: string) => {
    console.error('Error caught by SimpleErrorBoundary:', error, errorInfo, errorId);
  };

  return (
    <ErrorBoundary
      fallback={fallback || defaultFallback}
      onError={
        onError
          ? (error, errorInfo, _errorId) => onError(error, errorInfo)
          : defaultOnError
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default {
  withErrorBoundary,
  useErrorHandler,
  useAsyncError,
  SimpleErrorBoundary,
};

// 为了向后兼容，导出SafeComponent作为SimpleErrorBoundary的别名
export const SafeComponent = SimpleErrorBoundary;
