# Path Seek - 个人博客系统

这是一个使用 React 和 TypeScript 构建的现代化个人博客系统，采用模块化架构设计，支持主题切换和响应式布局。

## 功能特点

- 🎨 **主题系统** - 支持明暗主题切换，带有缓存和性能监控
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 📝 **文章管理** - 支持 Markdown 编辑，语法高亮
- 🏷️ **标签分类** - 灵活的文章分类和标签系统
- 👤 **个人资料** - 完整的个人信息展示
- 🎯 **现代化UI** - 基于 CSS Grid 和 Flexbox 的现代设计
- ⚡ **性能优化** - 代码分割、懒加载、缓存策略

## 技术栈

- **前端框架**: React 19.1.0
- **类型系统**: TypeScript 4.9.5
- **路由管理**: React Router DOM 7.6.0
- **Markdown**: React Markdown + 语法高亮
- **构建工具**: CRACO (Create React App Configuration Override)
- **样式方案**: CSS3 模块化 + CSS 变量系统
- **代码质量**: ESLint + Prettier + TypeScript 严格模式
- **测试框架**: Jest + React Testing Library

## 开发指南

### 环境准备

确保你的开发环境中已安装：
- Node.js (14.0.0+)
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm start
```

这将启动开发服务器，你可以在浏览器中访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建项目

```bash
npm run build
```

这将在 `build` 目录下生成用于生产环境的优化版本。

### 代码质量检查

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix

# 格式化代码
npm run format

# 检查代码格式
npm run format:check

# TypeScript 类型检查
npm run type-check

# 运行测试
npm test
```

## 项目结构

```
src/
├── App.tsx                    # 应用主组件
├── index.tsx                  # 应用入口
├── api/                       # API 接口层
├── assets/                    # 静态资源
│   ├── icons/                 # 图标文件
│   └── images/                # 图片资源
├── components/                # 通用组件
│   └── Content.tsx            # 内容组件
├── features/                  # 功能模块
│   ├── navigation/            # 导航功能
│   ├── posts/                 # 文章功能
│   └── theme/                 # 主题系统
│       ├── ThemeContext.tsx   # 主题上下文
│       ├── theme.ts           # 主题核心逻辑
│       ├── themeCache.ts      # 主题缓存系统
│       ├── types.ts           # 主题类型定义
│       └── themes.ts          # 主题预设配置
├── layout/                    # 布局组件
│   └── layout.tsx             # 主布局
├── lib/                       # 第三方库配置
├── pages/                     # 页面组件
│   ├── About.tsx              # 关于页面
│   ├── Class.tsx              # 分类页面
│   ├── Home.tsx               # 首页
│   ├── NotFound.tsx           # 404页面
│   ├── Post.tsx               # 文章详情页
│   └── Profile.tsx            # 个人资料页
├── routes/                    # 路由配置
│   └── index.tsx              # 路由定义
├── shared/                    # 共享资源
│   ├── components/            # 共享组件
│   ├── constants/             # 常量定义
│   ├── hooks/                 # 自定义 Hooks
│   ├── types/                 # 类型定义
│   └── utils/                 # 工具函数
└── styles/                    # 样式文件
    ├── global.css             # 全局样式
    ├── variables.css          # CSS 变量
    ├── components.css         # 组件样式
    ├── utilities.css          # 工具类样式
    ├── responsive.css         # 响应式样式
    └── [component].css        # 各组件样式
```

## 架构特点

### 🎨 主题系统
- **智能缓存**: 基于 LRU 算法的主题缓存系统
- **性能监控**: 实时监控主题切换性能
- **预设主题**: 内置多套精美主题配置
- **动态加载**: 按需加载主题资源

### 📁 模块化设计
- **Feature-based**: 按功能模块组织代码
- **关注点分离**: 清晰的业务逻辑分层
- **可复用组件**: 高度抽象的共享组件库
- **类型安全**: 完整的 TypeScript 类型覆盖

### 🚀 性能优化
- **代码分割**: 基于路由的懒加载
- **缓存策略**: 多层级缓存机制
- **资源优化**: 图片懒加载和压缩
- **构建优化**: CRACO 自定义构建配置

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
