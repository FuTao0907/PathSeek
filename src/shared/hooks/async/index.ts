/**
 * 异步操作相关 Hooks
 * 包含异步数据获取、状态管理等功能
 */

import { useAsync } from './useAsync';

export { useAsync, type AsyncState } from './useAsync';

// 默认导出所有异步相关的 hooks
const asyncHooks = {
  useAsync,
} as const;

export default asyncHooks;