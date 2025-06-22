import React, { useState, useCallback } from 'react';
import '@/styles/FloatingButton.css';

export interface FloatingButtonProps {
  onToggleFullscreen: () => void;
  onChangeBackground: (file: File) => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onToggleFullscreen,
  onChangeBackground,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div
      className={`floating-button-container ${isExpanded ? 'expanded' : ''}`}
    >
      {isExpanded && (
        <div className="floating-actions">
          <button
            onClick={scrollToTop}
            className="action-button"
            title="回到顶部"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
              />
            </svg>
          </button>
          <button
            onClick={onToggleFullscreen}
            className="action-button"
            title="切换全屏"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
              />
            </svg>
          </button>
          <label className="action-button" title="选择背景图片">
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  onChangeBackground(file);
                }
              }}
            />
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-9-1c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
              />
            </svg>
          </label>
        </div>
      )}
      <button onClick={toggleExpand} className="main-button" title="展开/收起">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"
          />
        </svg>
      </button>
    </div>
  );
};

export default FloatingButton;
