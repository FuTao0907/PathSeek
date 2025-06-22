/**
 * 表单相关 Hooks
 * 包含表单状态管理、验证等功能
 */

import { useForm } from './useForm';

export { useForm } from './useForm';

// 默认导出所有表单相关的 hooks
const formHooks = {
  useForm,
} as const;

export default formHooks;