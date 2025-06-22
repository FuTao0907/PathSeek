/**
 * Hooks 模块 - 统一导出所有自定义 Hooks
 * 
 * 模块化结构:
 * - storage: 存储相关 hooks (localStorage, sessionStorage 等)
 * - performance: 性能优化相关 hooks (防抖、节流等)
 * - async: 异步操作相关 hooks (数据获取、状态管理等)
 * - forms: 表单相关 hooks (表单状态、验证等)
 * - responsive: 响应式相关 hooks (媒体查询、断点等)
 * - dom: DOM 操作相关 hooks (滚动、元素操作等)
 * - theme: 主题相关 hooks (主题切换、暗色模式等)
 */

// 导入所有 hooks 用于默认导出
import { useLocalStorage } from '@/shared/hooks/storage';
import { useDebounce } from '@/shared/hooks/performance';
import { useAsync } from '@/shared/hooks/async';
import { useForm } from '@/shared/hooks/forms';
import { useMediaQuery, useBreakpoint } from '@/shared/hooks/responsive';
import { useScrollPosition } from '@/shared/hooks/dom';
import { useTheme } from '@/shared/hooks/theme';

// 存储相关
export * from './storage';
export { default as storageHooks } from './storage';

// 性能优化相关
export * from './performance';
export { default as performanceHooks } from './performance';

// 异步操作相关
export * from './async';
export { default as asyncHooks } from './async';

// 表单相关
export * from './forms';
export { default as formHooks } from './forms';

// 响应式相关
export * from './responsive';
export { default as responsiveHooks } from './responsive';

// DOM 操作相关
export * from './dom';
export { default as domHooks } from './dom';

// 主题相关
export * from './theme';
export { default as themeHooks } from './theme';

// 为了向后兼容，保留原有的默认导出
const hooks = {
  // 存储
  useLocalStorage,
  
  // 性能
  useDebounce,
  
  // 异步
  useAsync,
  
  // 表单
  useForm,
  
  // 响应式
  useMediaQuery,
  useBreakpoint,
  
  // DOM
  useScrollPosition,
  
  // 主题
  useTheme,
} as const;

export default hooks;
