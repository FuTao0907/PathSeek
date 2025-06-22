/**
 * 响应式相关 Hooks
 * 包含媒体查询、断点检测等功能
 */

import { useMediaQuery } from './useMediaQuery';
import { useBreakpoint } from './useBreakpoint';

export { useMediaQuery } from './useMediaQuery';
export { useBreakpoint, type Breakpoint, type BreakpointState } from './useBreakpoint';

// 默认导出所有响应式相关的 hooks
const responsiveHooks = {
  useMediaQuery,
  useBreakpoint,
} as const;

export default responsiveHooks;