import { ThemeMode } from '@/features/theme/types';
import { useThemeToggle } from '@/features/theme/useThemeToggle';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
  variant?: 'button' | 'dropdown' | 'tabs';
}

const ThemeToggle: React.FC<ThemeToggleProps> = React.memo(
  ({ className = '', showLabels = true, variant = 'button' }) => {
    const {
      config,
      currentThemeInfo,
      availableThemes,
      toggleToNextTheme,
      switchToTheme,
      toggleReducedMotion,
    } = useThemeToggle();

    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({
      top: 0,
      left: 0,
    });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleThemeChange = useCallback(
      (newMode: ThemeMode) => {
        switchToTheme(newMode);
        setIsOpen(false);
      },
      [switchToTheme]
    );

    const handleDropdownToggle = useCallback(() => {
      if (!isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.right - 320, // 320px是下拉菜单宽度
        });
      }
      setIsOpen(prev => !prev);
    }, [isOpen]);

    const handleDropdownClose = useCallback(() => {
      setIsOpen(false);
    }, []);

    const handleReducedMotionChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        toggleReducedMotion(e.target.checked);
      },
      [toggleReducedMotion]
    );

    // 监听窗口大小变化和滚动，更新下拉菜单位置
    useEffect(() => {
      const updatePosition = () => {
        if (isOpen && buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + window.scrollY + 8,
            left: rect.right - 384,
          });
        }
      };

      if (isOpen) {
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
        return () => {
          window.removeEventListener('resize', updatePosition);
          window.removeEventListener('scroll', updatePosition);
        };
      }

      // 确保所有代码路径都有返回值
      return undefined;
    }, [isOpen]);

    if (variant === 'button') {
      return (
        <button
          onClick={toggleToNextTheme}
          className={`
          inline-flex items-center gap-2 px-3 py-2
          bg-glass hover:bg-glass-hover
          border border-primary rounded-lg
          text-primary hover:text-primary-dark
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${className}
        `}
          aria-label={`切换主题`}
          title={`当前: ${currentThemeInfo.label}`}
        >
          <span className="text-lg" role="img" aria-hidden="true">
            {currentThemeInfo.icon}
          </span>
          {showLabels && (
            <span className="text-sm font-medium">
              {currentThemeInfo.label}
            </span>
          )}
        </button>
      );
    }

    if (variant === 'dropdown') {
      return (
        <div className={`relative ${className}`}>
          <button
            ref={buttonRef}
            onClick={handleDropdownToggle}
            className="
            inline-flex items-center gap-2 px-4 py-2.5
            bg-gradient-to-br from-white/60 to-slate-50/60
            dark:from-slate-800/60 dark:to-slate-700/60
            hover:from-slate-50 hover:to-blue-50
            dark:hover:from-slate-700 dark:hover:to-blue-900/50
            border-2 border-transparent hover:border-blue-500
            dark:hover:border-blue-400
            rounded-xl text-slate-600 hover:text-blue-600
            dark:text-slate-300 dark:hover:text-blue-400
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            dark:focus:ring-blue-400
            shadow-sm hover:shadow-md hover:-translate-y-0.5
            font-medium text-sm
          "
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-label="主题选择菜单"
          >
            <span className="text-lg" role="img" aria-hidden="true">
              {currentThemeInfo.icon}
            </span>
            {showLabels && (
              <span className="text-sm font-medium">
                {currentThemeInfo.label}
              </span>
            )}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <>
              {/* 背景遮罩 */}
              <div
                className="fixed inset-0 z-10"
                onClick={handleDropdownClose}
                aria-hidden="true"
              />

              {/* 下拉菜单 */}
              <div
                className="
              fixed w-96 min-w-fit z-20
              bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl
              border border-slate-200/50 dark:border-slate-600/50
              rounded-2xl shadow-xl overflow-hidden
              animate-in slide-in-from-top-2 duration-200
            "
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                }}
              >
                {availableThemes.map(
                  (theme: {
                    mode: ThemeMode;
                    icon: string;
                    label: string;
                    description: string;
                    isActive: boolean;
                  }) => {
                    const isActive = theme.isActive;

                    return (
                      <button
                        key={theme.mode}
                        onClick={() => handleThemeChange(theme.mode)}
                        className={`
                      w-full flex items-center gap-5 px-8 py-4 text-left whitespace-nowrap
                      transition-all duration-200 ease-out
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500 dark:border-blue-400'
                          : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 dark:hover:from-slate-700/50 dark:hover:to-slate-600/50 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100'
                      }
                    `}
                        role="menuitem"
                        aria-current={isActive ? 'true' : 'false'}
                      >
                        <span className="text-lg" role="img" aria-hidden="true">
                          {theme.icon}
                        </span>
                        <span
                          className={`text-base font-semibold flex-1 ${
                            isActive
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {theme.label}
                        </span>
                        {isActive && (
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  }
                )}

                {/* 分隔线 */}
                <div className="border-t border-slate-200/60 dark:border-slate-600/60 my-2" />

                {/* 设置选项 */}
                <div className="px-4 py-3">
                  <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={config.reducedMotion || false}
                      onChange={handleReducedMotionChange}
                      className="w-4 h-4 text-blue-500 dark:text-blue-400 border-slate-300 dark:border-slate-500 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-all duration-200"
                    />
                    <span className="font-medium">减少动画</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    if (variant === 'tabs') {
      return (
        <div
          className={`flex bg-glass rounded-lg p-1 ${className}`}
          role="tablist"
        >
          {availableThemes
            .slice(0, 3)
            .map(
              (theme: {
                mode: ThemeMode;
                icon: string;
                label: string;
                description: string;
                isActive: boolean;
              }) => {
                const isActive = theme.isActive;

                return (
                  <button
                    key={theme.mode}
                    onClick={() => handleThemeChange(theme.mode)}
                    className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${
                  isActive
                    ? 'bg-primary text-light shadow-sm'
                    : 'text-secondary hover:text-primary hover:bg-glass-hover'
                }
              `}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`切换到${theme.label}`}
                  >
                    <span className="text-base" role="img" aria-hidden="true">
                      {theme.icon}
                    </span>
                    {showLabels && (
                      <span className="hidden sm:inline">{theme.label}</span>
                    )}
                  </button>
                );
              }
            )}
        </div>
      );
    }

    return null;
  }
);

// 设置显示名称以便调试
ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
