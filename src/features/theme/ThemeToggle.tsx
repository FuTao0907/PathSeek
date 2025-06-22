import React, { useState, useCallback } from 'react';
import { useThemeToggle } from './useThemeToggle';
import { useTheme } from './ThemeContext';
import { ThemeMode } from './types';

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
    
    const { variables } = useTheme();

    const [isOpen, setIsOpen] = useState(false);

    const handleThemeChange = useCallback(
      (newMode: ThemeMode) => {
        switchToTheme(newMode);
        setIsOpen(false);
      },
      [switchToTheme]
    );

    const handleDropdownToggle = useCallback(() => {
      setIsOpen(prev => !prev);
    }, []);

    const handleDropdownClose = useCallback(() => {
      setIsOpen(false);
    }, []);

    const handleReducedMotionChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        toggleReducedMotion(e.target.checked);
      },
      [toggleReducedMotion]
    );

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
                className="absolute top-full left-0 mt-2 w-48 backdrop-blur-md rounded-xl shadow-2xl z-50 transform-gpu transition-all duration-500 ease-out border"
            style={{
              backgroundColor: variables.colors.dropdownBg,
              borderColor: variables.colors.dropdownBorder,
              boxShadow: `0 25px 50px -12px ${variables.colors.dropdownShadow}`,
              animation: isOpen ? 'slideInFromTop 0.5s ease-out' : undefined,
            }}
              >
                {availableThemes.map(theme => {
                  const isActive = theme.isActive;

                  return (
                    <button
                      key={theme.mode}
                      onClick={() => handleThemeChange(theme.mode)}
                      className={`group w-full flex flex-row items-center gap-4 px-4 py-3 mx-1 my-0.5 text-left whitespace-nowrap transition-all duration-300 ease-out relative rounded-lg transform-gpu ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100/80 dark:from-blue-900/40 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500 dark:border-blue-400 shadow-sm scale-[1.02]'
                          : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100/50 dark:hover:from-slate-700/50 dark:hover:to-slate-600/30 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 hover:scale-[1.01] hover:shadow-sm'
                      }`}
                      role="menuitem"
                      aria-current={isActive ? 'true' : 'false'}
                      style={{
                        animation: isActive ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : undefined
                      }}
                    >
                      <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 transform-gpu ${
                        isActive 
                          ? 'bg-gradient-to-br from-blue-100 to-blue-200/80 dark:from-blue-800/60 dark:to-blue-700/40 shadow-md scale-110 rotate-12' 
                          : 'bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-700/50 dark:to-slate-600/30 group-hover:from-slate-200 group-hover:to-slate-300/60 dark:group-hover:from-slate-600/70 dark:group-hover:to-slate-500/50 group-hover:scale-105'
                      }`}>
                        <span className={`text-lg transition-all duration-300 transform-gpu ${
                          isActive ? 'scale-125 drop-shadow-sm' : 'group-hover:scale-110'
                        }`} role="img" aria-hidden="true">
                          {theme.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">
                          {theme.label}
                        </span>
                        {isActive && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                            当前主题
                          </div>
                        )}
                      </div>
                      {isActive && (
                         <div className="relative flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full shadow-lg transform-gpu scale-110 animate-bounce">
                           <svg
                             className="w-3 h-3 text-white drop-shadow-sm"
                             fill="currentColor"
                             viewBox="0 0 20 20"
                             aria-hidden="true"
                             style={{
                               animation: 'checkmark 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                             }}
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
                })}

                {/* 分隔线 */}
                <div className="mx-4 my-2 h-px bg-slate-200 dark:bg-slate-600" />

                {/* 设置选项 */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-600">
                  <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={config.reducedMotion || false}
                      onChange={handleReducedMotionChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
          {availableThemes.slice(0, 3).map(theme => {
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
          })}
        </div>
      );
    }

    return null;
  }
);

// 设置显示名称以便调试
ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
