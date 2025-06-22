# 共享组件库文档

这是一个基于 React 和 TypeScript 构建的现代化组件库，提供了丰富的 UI 组件和工具函数，旨在提高开发效率和保持设计一致性。

## 📁 项目结构

```
src/shared/
├── components/          # UI 组件
│   ├── Button.tsx      # 按钮组件
│   ├── Card.tsx        # 卡片组件
│   ├── Form.tsx        # 表单组件
│   ├── Layout.tsx      # 布局组件
│   ├── Loading.tsx     # 加载组件
│   ├── Modal.tsx       # 模态框组件
│   ├── Notification.tsx # 通知组件
│   ├── ErrorBoundary.tsx # 错误边界
│   └── index.ts        # 组件导出
├── hooks/              # 自定义 Hooks
│   └── index.ts        # Hooks 集合
├── utils/              # 工具函数
│   └── helpers.ts      # 辅助函数
├── services/           # API 服务
│   └── api.ts          # API 封装
├── context/            # 上下文
│   └── AppContext.tsx  # 应用状态管理
├── types/              # 类型定义
│   └── index.ts        # 通用类型
└── index.ts            # 统一导出
```

## 🚀 快速开始

### 安装和导入

```typescript
// 导入所有组件
import * as Components from './shared';

// 或者按需导入
import { Button, Card, Form, TextInput } from './shared';

// 导入类型
import type { ButtonProps, CardProps } from './shared';
```

### 基础使用

```typescript
import React from 'react';
import { Button, Card, CardHeader, CardContent } from './shared';

const MyComponent = () => {
  return (
    <Card variant="outlined">
      <CardHeader title="示例卡片" />
      <CardContent>
        <Button variant="primary" onClick={() => alert('Hello!')}>
          点击我
        </Button>
      </CardContent>
    </Card>
  );
};
```

## 📚 组件文档

### 🎨 布局组件

#### Container 容器
提供响应式容器布局，支持不同的最大宽度和内边距。

```typescript
<Container maxWidth="lg" padding="md" center>
  <p>容器内容</p>
</Container>
```

**属性：**
- `maxWidth`: 最大宽度 (`xs` | `sm` | `md` | `lg` | `xl` | `2xl` | `full`)
- `padding`: 内边距 (`none` | `sm` | `md` | `lg` | `xl`)
- `center`: 是否居中对齐
- `fluid`: 是否流体布局

#### Grid 网格系统
基于 CSS Grid 的响应式网格布局。

```typescript
<Grid columns={3} gap="md">
  <GridItem span={2}>
    <p>跨越 2 列</p>
  </GridItem>
  <GridItem>
    <p>单列</p>
  </GridItem>
</Grid>
```

#### Flex 弹性布局
基于 Flexbox 的布局组件。

```typescript
<Flex justify="between" align="center" gap="md">
  <div>左侧</div>
  <div>右侧</div>
</Flex>
```

### 🔘 按钮组件

#### Button 按钮
支持多种样式、尺寸和状态的按钮组件。

```typescript
<Button 
  variant="primary" 
  size="md" 
  loading={false}
  leftIcon={<PlusIcon />}
  onClick={handleClick}
>
  添加项目
</Button>
```

**变体：** `primary` | `secondary` | `outline` | `ghost` | `danger` | `success` | `warning`

**尺寸：** `xs` | `sm` | `md` | `lg` | `xl`

#### IconButton 图标按钮
专门用于显示图标的圆形按钮。

```typescript
<IconButton 
  icon={<SettingsIcon />} 
  aria-label="设置"
  variant="ghost"
/>
```

#### ButtonGroup 按钮组
将多个按钮组合在一起。

```typescript
<ButtonGroup orientation="horizontal">
  <Button variant="outline">左</Button>
  <Button variant="outline">中</Button>
  <Button variant="outline">右</Button>
</ButtonGroup>
```

### 📝 表单组件

#### TextInput 文本输入
支持多种输入类型的文本输入框。

```typescript
<TextInput
  label="用户名"
  value={username}
  onChange={setUsername}
  placeholder="请输入用户名"
  required
  error={usernameError}
/>
```

#### Textarea 文本域
多行文本输入组件。

```typescript
<Textarea
  label="描述"
  value={description}
  onChange={setDescription}
  rows={4}
  maxLength={500}
/>
```

#### Select 选择框
下拉选择组件。

```typescript
const options = [
  { value: 'option1', label: '选项 1' },
  { value: 'option2', label: '选项 2' },
];

<Select
  label="选择项"
  value={selectedValue}
  onChange={setSelectedValue}
  options={options}
  placeholder="请选择"
/>
```

#### Checkbox 复选框
单个复选框组件。

```typescript
<Checkbox
  checked={agreed}
  onChange={setAgreed}
  label="我同意服务条款"
/>
```

#### RadioGroup 单选组
单选按钮组。

```typescript
const radioOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
];

<RadioGroup
  label="性别"
  value={gender}
  onChange={setGender}
  options={radioOptions}
  name="gender"
  direction="horizontal"
/>
```

### 🃏 卡片组件

#### Card 卡片
通用卡片容器，支持多种样式。

```typescript
<Card variant="elevated" hoverable>
  <CardHeader 
    title="卡片标题" 
    subtitle="副标题"
    action={<Button size="sm">操作</Button>}
  />
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
  <CardFooter justify="end">
    <Button variant="outline">取消</Button>
    <Button>确定</Button>
  </CardFooter>
</Card>
```

**变体：** `default` | `outlined` | `elevated` | `filled`

### 🔔 交互组件

#### Modal 模态框
可定制的模态对话框。

```typescript
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="模态框标题"
  size="md"
  showCloseButton
>
  <p>模态框内容</p>
</Modal>
```

#### ConfirmModal 确认对话框
预设样式的确认对话框。

```typescript
<ConfirmModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleConfirm}
  title="确认删除"
  message="此操作无法撤销，确定要删除吗？"
  type="danger"
/>
```

#### Notification 通知
消息通知组件。

```typescript
<Notification
  type="success"
  title="操作成功"
  message="数据已保存"
  position="top-right"
  autoClose
  duration={3000}
  onClose={handleClose}
/>
```

**类型：** `success` | `error` | `warning` | `info`

### ⚠️ 错误处理

#### ErrorBoundary 错误边界
React 错误边界组件，用于捕获和处理组件错误。

```typescript
<ErrorBoundary
  fallback={<div>出错了</div>}
  onError={(error, errorInfo) => console.error(error)}
>
  <MyComponent />
</ErrorBoundary>
```

#### withErrorBoundary HOC
高阶组件，为组件添加错误边界。

```typescript
const SafeComponent = withErrorBoundary(MyComponent, {
  fallback: <div>组件加载失败</div>
});
```

## 🎣 自定义 Hooks

### useLocalStorage
本地存储状态管理。

```typescript
const [value, setValue] = useLocalStorage('key', 'defaultValue');
```

### useDebounce
防抖处理。

```typescript
const debouncedValue = useDebounce(inputValue, 500);
```

### useAsync
异步操作状态管理。

```typescript
const { data, loading, error, execute } = useAsync(asyncFunction);
```

### useForm
表单状态管理。

```typescript
const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  resetForm
} = useForm({
  initialValues: { name: '', email: '' },
  validationSchema: schema,
  onSubmit: handleFormSubmit
});
```

### useMediaQuery
媒体查询响应式处理。

```typescript
const isMobile = useMediaQuery('(max-width: 768px)');
const isDesktop = useBreakpoint('lg');
```

## 🛠️ 工具函数

### 字符串工具
```typescript
import { stringUtils } from './shared';

stringUtils.capitalize('hello'); // 'Hello'
stringUtils.truncate('long text', 10); // 'long text...'
stringUtils.slugify('Hello World'); // 'hello-world'
```

### 日期工具
```typescript
import { dateUtils } from './shared';

dateUtils.formatDate(new Date(), 'YYYY-MM-DD');
dateUtils.getRelativeTime(date); // '2 小时前'
dateUtils.isToday(date);
```

### 数组工具
```typescript
import { arrayUtils } from './shared';

arrayUtils.unique([1, 2, 2, 3]); // [1, 2, 3]
arrayUtils.groupBy(items, 'category');
arrayUtils.sortBy(items, 'name');
```

### 验证工具
```typescript
import { validationUtils } from './shared';

validationUtils.isEmail('test@example.com'); // true
validationUtils.isPhone('13800138000'); // true
validationUtils.isURL('https://example.com'); // true
```

## 🌐 API 服务

### HttpClient
HTTP 请求封装。

```typescript
import { ApiService } from './shared';

// GET 请求
const users = await ApiService.users.getAll();

// POST 请求
const newUser = await ApiService.users.create(userData);

// 文件上传
const uploadResult = await ApiService.files.upload(file);
```

## 🎯 状态管理

### AppContext
全局应用状态管理。

```typescript
import { AppProvider, useAppContext } from './shared';

// 在应用根部使用 Provider
<AppProvider>
  <App />
</AppProvider>

// 在组件中使用状态
const {
  state,
  dispatch,
  user,
  theme,
  language,
  setUser,
  setTheme,
  setLanguage,
  showNotification,
  clearNotifications
} = useAppContext();
```

## 🎨 样式系统

### 设计令牌
组件库使用一致的设计令牌：

- **颜色：** 主色调、语义色彩（成功、警告、错误等）
- **间距：** xs(0.25rem) → 4xl(4rem)
- **字体：** 多种字体大小和权重
- **圆角：** 统一的边框圆角
- **阴影：** 多层次阴影效果

### 响应式设计
所有组件都支持响应式设计，断点如下：

- **sm:** 640px+
- **md:** 768px+
- **lg:** 1024px+
- **xl:** 1280px+
- **2xl:** 1536px+

## 🔧 开发指南

### 添加新组件

1. 在 `src/shared/components/` 创建组件文件
2. 导出组件和相关类型
3. 在 `components/index.ts` 中添加导出
4. 编写文档和示例

### 类型安全
所有组件都提供完整的 TypeScript 类型定义，确保类型安全。

### 性能优化
- 使用 `React.memo` 优化组件渲染
- 懒加载大型组件
- 防抖和节流处理用户输入
- 虚拟化长列表

## 📖 示例

查看 `src/pages/ComponentDemo.tsx` 文件，了解所有组件的完整使用示例。

## 🤝 贡献指南

1. 遵循现有的代码风格和命名约定
2. 为新功能添加类型定义
3. 编写单元测试
4. 更新相关文档
5. 确保所有组件都支持无障碍访问

## 📄 许可证

本项目采用 MIT 许可证。