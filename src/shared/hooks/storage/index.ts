/**
 * 存储相关 Hooks
 * 包含本地存储、会话存储等功能
 */

import { useLocalStorage } from './useLocalStorage';

export { useLocalStorage } from './useLocalStorage';

// 默认导出所有存储相关的 hooks
const storageHooks = {
  useLocalStorage,
} as const;

export default storageHooks;