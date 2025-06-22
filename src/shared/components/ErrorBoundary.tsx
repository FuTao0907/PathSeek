import React, { Component, ReactNode, ErrorInfo } from 'react';
import '@/styles/ErrorBoundary.css';

// 错误边界状态接口
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

// 错误边界属性接口
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (
    error: Error,
    errorInfo: ErrorInfo,
    retry: () => void
  ) => ReactNode | undefined;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  enableRetry?: boolean;
  showErrorDetails?: boolean;
  className?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo }, () => {
      if (this.props.onError && this.state.errorId) {
        this.props.onError(error, errorInfo, this.state.errorId);
      }
    });

    this.logErrorToService(error, errorInfo);
  }

  override componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId || 'unknown',
    };

    console.error('Error Boundary caught an error:', errorData);
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  override render() {
    if (this.state.hasError && this.state.error && this.state.errorInfo) {
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.state.errorInfo,
          this.handleRetry
        );
      }

      return (
        <div className={`error-boundary ${this.props.className || ''}`}>
          <div className="error-content">
            <div className="error-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2>出现了一些问题</h2>
            <p>很抱歉，应用程序遇到了意外错误。我们已经记录了这个问题。</p>

            <div className="error-actions">
              {this.props.enableRetry !== false && (
                <button
                  onClick={this.handleRetry}
                  className="error-retry-button"
                >
                  重试
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="error-reload-button"
              >
                刷新页面
              </button>
            </div>

            {(this.props.showErrorDetails ??
              process.env.NODE_ENV === 'development') && (
              <details className="error-details">
                <summary>错误详情</summary>
                <div className="error-info">
                  <div className="error-section">
                    <h4>错误信息:</h4>
                    <pre>{this.state.error.message}</pre>
                  </div>
                  <div className="error-section">
                    <h4>错误堆栈:</h4>
                    <pre>{this.state.error.stack}</pre>
                  </div>
                  <div className="error-section">
                    <h4>组件堆栈:</h4>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
export type { ErrorBoundaryProps };
