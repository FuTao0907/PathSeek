// 类型定义导出
// 类型导出（显式导出以避免 Theme 类型歧义）
export type {
  BaseProps,
  LoadingProps,
  Post,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  ValidationError,
  FormState,
  User,
  Language,
  AppConfig,
  SearchParams
} from './types';

// Theme 类型显式导出（来自 shared/types）
export type { Theme } from './types';

// 组件导出
export * from './components';

// Hooks 导出（使用通配符导出，但排除可能冲突的类型）
export {
  useLocalStorage,
  useDebounce,
  useAsync,
  useForm,
  useMediaQuery,
  useBreakpoint,
  useScrollPosition,
  useTheme
} from './hooks';

// Hooks 模块默认导出
export {
  default as storageHooks,
  default as performanceHooks,
  default as asyncHooks,
  default as formHooks,
  default as responsiveHooks,
  default as domHooks,
  default as themeHooks
} from './hooks';

// 工具函数导出
export * from './utils/helpers';

// API 服务导出
export * from './services/api';

// 上下文导出
export * from './context/AppContext';

// 默认导出
export { default as Components } from './components';
export { default as AppContext } from './context/AppContext';
export { default as Hooks } from './hooks';
export { default as ApiService } from './services/api';
export { default as Utils } from './utils/helpers';
