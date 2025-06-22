# 代码质量指南

本文档描述了项目的代码质量标准、工具配置和最佳实践。

## 📋 目录

- [代码质量工具](#代码质量工具)
- [配置文件说明](#配置文件说明)
- [开发工作流](#开发工作流)
- [代码规范](#代码规范)
- [测试策略](#测试策略)
- [性能监控](#性能监控)
- [安全性](#安全性)
- [可访问性](#可访问性)
- [CI/CD 流程](#cicd-流程)
- [故障排除](#故障排除)

## 🛠️ 代码质量工具

### 核心工具

| 工具 | 用途 | 配置文件 |
|------|------|----------|
| **TypeScript** | 类型检查 | `tsconfig.json` |
| **ESLint** | 代码检查 | `.eslintrc.js` |
| **Prettier** | 代码格式化 | `.prettierrc` |
| **Jest** | 单元测试 | `jest.config.js` |
| **Husky** | Git 钩子 | `.husky/` |
| **lint-staged** | 暂存文件检查 | `.lintstagedrc.json` |

### 辅助工具

- **webpack-bundle-analyzer**: 包大小分析
- **Lighthouse CI**: 性能监控
- **Snyk**: 安全漏洞扫描
- **Codecov**: 测试覆盖率报告

## ⚙️ 配置文件说明

### TypeScript 配置 (`tsconfig.json`)

启用了严格的类型检查选项：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true
  }
}
```

### ESLint 配置 (`.eslintrc.js`)

集成了以下规则集：
- `@typescript-eslint/recommended`
- `plugin:react/recommended`
- `plugin:react-hooks/recommended`
- `plugin:jsx-a11y/recommended`

### Prettier 配置 (`.prettierrc`)

统一的代码格式化规则，确保团队代码风格一致。

## 🔄 开发工作流

### 1. 开发前准备

```bash
# 安装依赖
npm ci

# 启动开发服务器
npm start
```

### 2. 代码编写

- 使用 VS Code 推荐的扩展
- 启用自动保存和格式化
- 遵循 TypeScript 严格模式

### 3. 代码检查

```bash
# 运行所有质量检查
npm run quality:check

# 自动修复可修复的问题
npm run quality:fix

# 生成质量报告
npm run quality:report
```

### 4. 测试

```bash
# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# CI 模式运行测试
npm run test:ci
```

### 5. 提交代码

```bash
# 暂存文件
git add .

# 提交（会自动运行 pre-commit 钩子）
git commit -m "feat(component): add new feature"
```

## 📝 代码规范

### 命名约定

- **组件**: PascalCase (`UserProfile`)
- **函数/变量**: camelCase (`getUserData`)
- **常量**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **文件名**: kebab-case (`user-profile.tsx`)

### 文件结构

```
src/
├── components/          # 可复用组件
├── pages/              # 页面组件
├── hooks/              # 自定义 Hooks
├── utils/              # 工具函数
├── types/              # TypeScript 类型定义
├── constants/          # 常量定义
├── services/           # API 服务
└── __tests__/          # 测试文件
```

### 导入顺序

1. React 相关
2. 第三方库
3. 内部模块（绝对路径）
4. 相对路径导入
5. 类型导入（使用 `type` 关键字）

```typescript
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';

import './Component.css';

import type { User } from '@/types';
```

## 🧪 测试策略

### 测试金字塔

1. **单元测试** (70%): 测试独立的函数和组件
2. **集成测试** (20%): 测试组件间的交互
3. **端到端测试** (10%): 测试完整的用户流程

### 测试覆盖率要求

- **语句覆盖率**: ≥ 80%
- **分支覆盖率**: ≥ 75%
- **函数覆盖率**: ≥ 80%
- **行覆盖率**: ≥ 80%

### 测试最佳实践

- 使用描述性的测试名称
- 遵循 AAA 模式（Arrange, Act, Assert）
- 模拟外部依赖
- 测试边界情况和错误处理

## 📊 性能监控

### Core Web Vitals

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 600ms

### 性能工具

```typescript
import { PerformanceMonitor } from '@/shared/utils/performanceMonitor';

// 监控组件渲染时间
PerformanceMonitor.measureComponentRender('UserProfile', () => {
  // 组件渲染逻辑
});

// 监控 API 响应时间
PerformanceMonitor.measureApiResponse('getUserData', async () => {
  return await api.getUser();
});
```

## 🔒 安全性

### 安全检查清单

- ✅ XSS 防护
- ✅ CSRF 防护
- ✅ 输入验证和清理
- ✅ 安全的随机数生成
- ✅ 敏感信息保护
- ✅ 依赖漏洞扫描

### 安全工具使用

```typescript
import { Security } from '@/shared/utils/security';

// HTML 转义
const safeHtml = Security.escapeHtml(userInput);

// URL 清理
const safeUrl = Security.sanitizeUrl(userUrl);

// 密码强度验证
const isStrong = Security.validatePasswordStrength(password);
```

## ♿ 可访问性

### WCAG 2.1 AA 标准

- 键盘导航支持
- 屏幕阅读器兼容
- 颜色对比度 ≥ 4.5:1
- 焦点管理
- 语义化 HTML

### 可访问性工具

```typescript
import { Accessibility } from '@/shared/utils/accessibility';

// 焦点管理
Accessibility.FocusManager.trapFocus(modalElement);

// 屏幕阅读器公告
Accessibility.ScreenReaderAnnouncer.announce('操作完成');

// 颜色对比度检查
const isAccessible = Accessibility.ColorContrastChecker.checkContrast(
  '#000000', '#ffffff'
);
```

## 🚀 CI/CD 流程

### GitHub Actions 工作流

1. **代码质量检查**
   - ESLint 检查
   - Prettier 格式检查
   - TypeScript 类型检查

2. **测试**
   - 单元测试
   - 集成测试
   - 覆盖率报告

3. **安全扫描**
   - npm audit
   - Snyk 漏洞扫描

4. **性能测试**
   - Lighthouse CI
   - Bundle 大小分析

5. **部署**
   - 预览环境（PR）
   - 生产环境（main 分支）

### 部署要求

- 所有检查必须通过
- 测试覆盖率达标
- 无安全漏洞
- 性能指标达标

## 🔧 故障排除

### 常见问题

#### ESLint 错误

```bash
# 查看具体错误
npm run lint

# 自动修复
npm run lint -- --fix
```

#### TypeScript 错误

```bash
# 类型检查
npm run type-check

# 查看详细错误信息
npx tsc --noEmit --pretty
```

#### 测试失败

```bash
# 运行特定测试
npm test -- --testNamePattern="ComponentName"

# 调试模式
npm test -- --verbose
```

#### 性能问题

```bash
# 分析包大小
npm run analyze

# 生成性能报告
npm run quality:report
```

### 获取帮助

- 查看项目文档
- 检查 GitHub Issues
- 联系团队成员
- 参考官方文档

## 📚 相关资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [ESLint 规则文档](https://eslint.org/docs/rules/)
- [React 测试最佳实践](https://testing-library.com/docs/react-testing-library/intro/)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)

---

**注意**: 本文档会随着项目发展持续更新，请定期查看最新版本。