/**
 * 性能优化相关 Hooks
 * 包含防抖、节流等功能
 */

import { useDebounce } from './useDebounce';

export { useDebounce } from './useDebounce';

// 默认导出所有性能相关的 hooks
const performanceHooks = {
  useDebounce,
} as const;

export default performanceHooks;