import React from 'react';
import { LoadingProps } from '@/shared/types';

// 加载动画组件 - 使用 React.memo 优化性能

const Loading = React.memo<LoadingProps>(
  ({ size = 'medium', text = '加载中...', className = '' }: LoadingProps) => {
    return (
      <div className={`loading-container ${className}`}>
        <div className={`loading-spinner loading-spinner--${size}`}>
          <div className="loading-spinner__circle"></div>
          <div className="loading-spinner__circle"></div>
          <div className="loading-spinner__circle"></div>
        </div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    );
  }
);

Loading.displayName = 'Loading';

export default Loading;
export type { LoadingProps };
