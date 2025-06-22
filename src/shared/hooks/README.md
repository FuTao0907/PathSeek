# Hooks 模块化重构

## 概述

本次重构将原本集中在单个文件中的所有 Hooks 按功能模块进行了拆分，提高了代码的可维护性和可读性。

## 模块结构

```
src/shared/hooks/
├── storage/           # 存储相关 Hooks
│   ├── useLocalStorage.ts
│   └── index.ts
├── performance/       # 性能优化相关 Hooks
│   ├── useDebounce.ts
│   └── index.ts
├── async/            # 异步操作相关 Hooks
│   ├── useAsync.ts
│   └── index.ts
├── forms/            # 表单相关 Hooks
│   ├── useForm.ts
│   └── index.ts
├── responsive/       # 响应式相关 Hooks
│   ├── useMediaQuery.ts
│   ├── useBreakpoint.ts
│   └── index.ts
├── dom/              # DOM 操作相关 Hooks
│   ├── useScrollPosition.ts
│   └── index.ts
├── theme/            # 主题相关 Hooks
│   ├── useTheme.ts
│   └── index.ts
├── index.ts          # 统一导出文件
└── README.md         # 本文档
```

## 使用方式

### 1. 按模块导入（推荐）

```typescript
// 导入特定模块的 Hooks
import { useLocalStorage } from '@/shared/hooks/storage';
import { useDebounce } from '@/shared/hooks/performance';
import { useAsync } from '@/shared/hooks/async';
import { useForm } from '@/shared/hooks/forms';
import { useMediaQuery, useBreakpoint } from '@/shared/hooks/responsive';
import { useScrollPosition } from '@/shared/hooks/dom';
import { useTheme } from '@/shared/hooks/theme';
```

### 2. 从主入口导入

```typescript
// 从主入口导入所有 Hooks
import {
  useLocalStorage,
  useDebounce,
  useAsync,
  useForm,
  useMediaQuery,
  useBreakpoint,
  useScrollPosition,
  useTheme
} from '@/shared/hooks';
```

### 3. 导入整个模块（适用于需要多个相关 Hooks 的场景）

```typescript
// 导入整个模块
import { storageHooks } from '@/shared/hooks';
import { responsiveHooks } from '@/shared/hooks';

// 使用
const [value, setValue] = storageHooks.useLocalStorage('key', 'default');
const { isMobile } = responsiveHooks.useBreakpoint();
```

## 各模块功能说明

### Storage 模块
- `useLocalStorage`: 本地存储管理，支持类型安全的读写操作

### Performance 模块
- `useDebounce`: 防抖处理，用于优化频繁触发的操作

### Async 模块
- `useAsync`: 异步操作状态管理，包含 loading、error、data 状态

### Forms 模块
- `useForm`: 表单状态管理，包含验证、提交等功能

### Responsive 模块
- `useMediaQuery`: 媒体查询检测
- `useBreakpoint`: 响应式断点检测

### DOM 模块
- `useScrollPosition`: 滚动位置监听

### Theme 模块
- `useTheme`: 主题切换管理

## 向后兼容性

为了保持向后兼容性，原有的导入方式仍然有效：

```typescript
// 这种方式仍然可以正常工作
import hooks from '@/shared/hooks';
const [value, setValue] = hooks.useLocalStorage('key', 'default');
```

## 优势

1. **模块化**: 按功能分组，便于查找和维护
2. **类型安全**: 每个模块都有完整的 TypeScript 类型定义
3. **按需导入**: 可以只导入需要的 Hooks，减少打包体积
4. **文档完善**: 每个 Hook 都有详细的 JSDoc 注释和使用示例
5. **向后兼容**: 保持原有 API 不变

## 注意事项

1. 建议使用按模块导入的方式，这样可以获得更好的 IDE 支持和类型提示
2. 每个 Hook 都有详细的使用示例，可以参考注释中的代码
3. 如果需要添加新的 Hooks，请按照相应的模块进行分类