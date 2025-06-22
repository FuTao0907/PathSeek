# CSS开发指南

本指南介绍如何在Path Seek项目中使用现代CSS架构进行开发。

## 快速开始

### 1. 安装依赖

```bash
# 安装CSS开发相关依赖
npm install --save-dev postcss postcss-cli postcss-import postcss-custom-properties postcss-custom-media postcss-nesting postcss-preset-env autoprefixer cssnano stylelint stylelint-config-standard stylelint-config-css-modules stylelint-order chokidar concurrently cross-env
```

### 2. 开发模式

```bash
# 启动CSS开发模式（监听文件变化并自动构建）
npm run dev:css

# 或者分别运行
npm run css:watch        # 监听CSS文件变化
npm run css:build:watch  # 监听并构建CSS
```

### 3. 代码检查和修复

```bash
# 检查CSS代码风格
npm run css:lint

# 自动修复CSS代码风格问题
npm run css:lint:fix
```

### 4. 构建生产版本

```bash
# 构建压缩的生产版本CSS
npm run build:css
```

## 主题系统使用

### 1. 在React组件中使用主题

```tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

function MyComponent() {
  const { mode, config, variables, setMode, updateConfig } = useTheme();

  return (
    <div className="my-component">
      <h1>当前主题: {mode}</h1>
      <p>主色调: {variables.colors.primary}</p>
      
      {/* 主题切换器 */}
      <ThemeToggle variant="dropdown" showIcon showLabel />
      
      {/* 手动切换主题 */}
      <button onClick={() => setMode('dark')}>切换到深色模式</button>
    </div>
  );
}
```

### 2. 在CSS中使用主题变量

```css
/* 使用设计令牌 */
.my-component {
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

/* 响应式设计 */
@media (min-width: 768px) {
  .my-component {
    padding: var(--spacing-lg);
  }
}

/* 主题特定样式 */
[data-theme="dark"] .my-component {
  border: 1px solid var(--color-border);
}
```

### 3. 创建自定义主题

```typescript
import { ThemeConfig } from '../types/theme';
import { applyTheme, validateThemeConfig } from '../utils/theme';

// 定义自定义主题
const customTheme: ThemeConfig = {
  colors: {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryActive: '#4338ca',
    // ... 其他颜色
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    // ... 其他间距
  },
  // ... 其他配置
};

// 验证并应用主题
if (validateThemeConfig(customTheme)) {
  applyTheme(customTheme);
} else {
  console.error('主题配置无效');
}
```

## CSS开发工具

### 1. CSS工具脚本

```bash
# 构建CSS
node scripts/css-tools.js build

# 监听文件变化
node scripts/css-tools.js watch

# 分析CSS文件
node scripts/css-tools.js analyze

# 生成CSS变量文档
node scripts/css-tools.js docs

# 清理构建文件
node scripts/css-tools.js clean

# 运行所有任务
node scripts/css-tools.js all
```

### 2. CSS分析报告

运行分析命令后，会生成详细的CSS分析报告：

```bash
node scripts/css-tools.js analyze
```

报告包含：
- 文件数量和大小
- CSS变量使用情况
- 选择器统计
- 媒体查询分析
- 性能建议

### 3. CSS变量文档

自动生成CSS变量文档：

```bash
node scripts/css-tools.js docs
```

生成的文档包含：
- 所有CSS变量列表
- 变量分组和说明
- 使用示例
- 变量值和位置

## 工具类使用

### 1. 间距工具类

```html
<!-- 外边距 -->
<div class="m-xs">极小外边距</div>
<div class="m-sm">小外边距</div>
<div class="m-md">中等外边距</div>
<div class="m-lg">大外边距</div>
<div class="m-xl">极大外边距</div>

<!-- 内边距 -->
<div class="p-md">中等内边距</div>

<!-- 方向性间距 -->
<div class="mt-lg">顶部大外边距</div>
<div class="px-md">水平中等内边距</div>
<div class="mx-auto">水平居中</div>
```

### 2. 布局工具类

```html
<!-- Flexbox -->
<div class="flex items-center justify-between">
  <span>左侧内容</span>
  <span>右侧内容</span>
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-md">
  <div>项目1</div>
  <div>项目2</div>
  <div>项目3</div>
</div>

<!-- 响应式 -->
<div class="hidden-mobile visible-tablet">
  平板及以上设备可见
</div>
```

### 3. 文本工具类

```html
<!-- 文本大小 -->
<h1 class="text-xl">大标题</h1>
<p class="text-sm">小文本</p>

<!-- 文本对齐 -->
<p class="text-center">居中文本</p>
<p class="text-right">右对齐文本</p>

<!-- 文本颜色 -->
<p class="text-primary">主色调文本</p>
<p class="text-muted">次要文本</p>
```

## 响应式设计

### 1. 断点系统

```css
/* 移动优先设计 */
.component {
  padding: var(--spacing-sm);
}

/* 平板 */
@media (min-width: 768px) {
  .component {
    padding: var(--spacing-md);
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .component {
    padding: var(--spacing-lg);
  }
}

/* 大屏幕 */
@media (min-width: 1280px) {
  .component {
    padding: var(--spacing-xl);
  }
}
```

### 2. 容器查询（实验性）

```css
@supports (container-type: inline-size) {
  .card {
    container-type: inline-size;
  }
  
  @container (min-width: 300px) {
    .card-content {
      display: flex;
    }
  }
}
```

## 无障碍开发

### 1. 动画偏好

```css
/* 默认动画 */
.animated {
  transition: transform 0.3s ease;
}

/* 尊重用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .animated {
    transition: none;
  }
}
```

### 2. 高对比度支持

```css
/* 高对比度模式 */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid var(--color-border-strong);
  }
}
```

### 3. 焦点管理

```css
/* 键盘导航焦点 */
.interactive:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* 屏幕阅读器专用 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 测试和质量保证

### 1. 运行CSS测试

```bash
# 运行所有CSS测试
npm run css:test

# 测试主题切换功能
npm run theme:test

# 验证主题配置
npm run theme:validate
```

### 2. 手动测试清单

- [ ] 主题切换功能正常
- [ ] 响应式布局在各设备上正确显示
- [ ] 无障碍功能（键盘导航、屏幕阅读器）
- [ ] 动画偏好设置生效
- [ ] 高对比度模式支持
- [ ] 打印样式正确
- [ ] 性能表现良好

### 3. 性能测试

```javascript
// 测试CSS变量性能
import { performanceTestCSSVariables } from './src/utils/cssTestUtils';

const results = performanceTestCSSVariables();
console.log('CSS变量性能测试结果:', results);
```

## 常见问题

### 1. CSS变量不生效

**问题**: CSS变量没有正确应用

**解决方案**:
- 确保变量在`:root`中定义
- 检查变量名拼写
- 验证主题是否正确加载

```css
/* 错误 */
.component {
  color: var(--color-primary-text); /* 变量名错误 */
}

/* 正确 */
.component {
  color: var(--color-text-primary);
}
```

### 2. 主题切换不平滑

**问题**: 主题切换时出现闪烁

**解决方案**:
- 使用CSS过渡
- 预加载主题变量
- 避免重绘重排

```css
/* 添加过渡效果 */
* {
  transition: background-color var(--transition-base),
              color var(--transition-base),
              border-color var(--transition-base);
}
```

### 3. 构建失败

**问题**: PostCSS构建失败

**解决方案**:
- 检查CSS语法错误
- 验证PostCSS配置
- 确保依赖正确安装

```bash
# 重新安装依赖
npm install

# 清理并重新构建
npm run css:clean
npm run css:build
```

## 最佳实践

### 1. CSS变量命名

```css
/* 好的命名 */
--color-text-primary
--spacing-component-padding
--font-size-heading-large
--border-radius-button

/* 避免的命名 */
--blue
--size16
--big-font
--round
```

### 2. 组件样式组织

```css
/* 组件基础样式 */
.button {
  /* 布局 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  /* 尺寸 */
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: 44px; /* 无障碍触摸目标 */
  
  /* 外观 */
  background-color: var(--color-primary);
  color: var(--color-primary-contrast);
  border: none;
  border-radius: var(--border-radius-md);
  
  /* 交互 */
  cursor: pointer;
  transition: all var(--transition-base);
}

/* 状态样式 */
.button:hover {
  background-color: var(--color-primary-hover);
}

.button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### 3. 性能优化

```css
/* 使用transform而不是改变位置 */
.animated {
  transform: translateX(0);
  transition: transform var(--transition-base);
}

.animated:hover {
  transform: translateX(10px);
}

/* 避免昂贵的属性 */
/* 避免 */
.expensive {
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  filter: blur(5px);
}

/* 推荐 */
.efficient {
  box-shadow: var(--shadow-sm);
}
```

## 贡献指南

### 1. 添加新主题

1. 在`src/config/themes.ts`中添加主题配置
2. 更新类型定义（如需要）
3. 添加主题特定样式
4. 运行测试验证
5. 更新文档

### 2. 添加新组件样式

1. 在`src/styles/components.css`中添加样式
2. 使用CSS变量实现主题化
3. 添加响应式支持
4. 确保无障碍兼容
5. 编写测试用例

### 3. 优化性能

1. 分析CSS性能
2. 优化选择器
3. 减少重绘重排
4. 测试性能改进
5. 更新文档

---

更多详细信息请参考：
- [CSS架构文档](./CSS_ARCHITECTURE.md)
- [CSS架构v2文档](./CSS_ARCHITECTURE_V2.md)
- [主题系统API文档](./src/types/theme.ts)