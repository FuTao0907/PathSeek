/**
 * DOM 相关 Hooks
 * 包含滚动、元素操作等功能
 */

import { useScrollPosition } from './useScrollPosition';

export { useScrollPosition } from './useScrollPosition';

// 默认导出所有 DOM 相关的 hooks
const domHooks = {
  useScrollPosition,
} as const;

export default domHooks;