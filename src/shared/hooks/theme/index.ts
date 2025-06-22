/**
 * 主题相关 Hooks
 * 包含主题切换、暗色模式检测等功能
 */

import { useTheme } from './useTheme';

export { useTheme, type Theme, type ThemeState } from './useTheme';

// 默认导出所有主题相关的 hooks
const themeHooks = {
  useTheme,
} as const;

export default themeHooks;