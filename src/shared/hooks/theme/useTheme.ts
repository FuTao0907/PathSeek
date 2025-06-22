import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/shared/hooks/storage/useLocalStorage';

/**
 * 主题类型
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * 主题状态
 */
export interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

/**
 * 主题切换 Hook
 * @returns 主题状态和切换方法
 * @example
 * ```tsx
 * const { theme, toggleTheme, isDark } = useTheme();
 * 
 * return (
 *   <div className={isDark ? 'dark-theme' : 'light-theme'}>
 *     <button onClick={toggleTheme}>
 *       切换主题 (当前: {theme})
 *     </button>
 *     Content here
 *   </div>
 * );
 * ```
 */
export function useTheme(): ThemeState {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'auto');

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      switch (prev) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'auto';
        case 'auto':
          return 'light';
        default:
          return 'light';
      }
    });
  }, [setTheme]);

  const isDark = useMemo(() => {
    if (theme === 'auto') {
      return typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false;
    }
    return theme === 'dark';
  }, [theme]);

  return { theme, toggleTheme, isDark };
}

export default useTheme;