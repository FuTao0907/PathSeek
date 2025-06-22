# Path Seek - 个人博客系统

这是一个使用 React 19 和 TypeScript 构建的现代化个人博客系统，采用模块化架构设计，支持主题切换和响应式布局。项目注重代码质量、性能优化和开发体验。

## ✨ 功能特点

- 🎨 **智能主题系统** - 支持明暗主题切换，带有 LRU 缓存和性能监控
- 📱 **响应式设计** - 完美适配移动端和桌面端，支持容器查询
- 📝 **Markdown 支持** - 完整的 Markdown 编辑器，支持语法高亮和 GFM 扩展
- 🏷️ **标签分类系统** - 灵活的文章分类和标签管理
- 👤 **个人资料页** - 完整的个人信息展示和社交链接
- 🎯 **现代化 UI** - 基于 CSS Grid、Flexbox 和 CSS 变量的设计系统
- ⚡ **性能优化** - 代码分割、懒加载、图片优化和多层缓存策略
- 🔧 **开发体验** - 完整的代码质量工具链和自动化工作流
- 🛡️ **类型安全** - 严格的 TypeScript 配置和类型覆盖
- 🚀 **现代构建** - 基于 CRACO 的自定义构建配置

## 🛠️ 技术栈

### 核心技术
- **前端框架**: React 19.1.0
- **类型系统**: TypeScript 4.9.5 (严格模式)
- **路由管理**: React Router DOM 7.6.0
- **构建工具**: CRACO 7.1.0 + React Scripts 5.0.1

### Markdown 处理
- **渲染引擎**: React Markdown 10.1.0
- **语法高亮**: rehype-highlight 7.0.2
- **扩展支持**: remark-gfm 4.0.1 (GitHub Flavored Markdown)

### 样式系统
- **架构**: CSS3 模块化 + CSS 变量系统
- **设计模式**: BEM + 原子化设计
- **响应式**: CSS Grid + Flexbox + 容器查询
- **主题**: 动态主题切换 + LRU 缓存

### 代码质量
- **代码检查**: ESLint 8.57.1 + TypeScript ESLint 6.21.0
- **代码格式**: Prettier 3.5.3
- **Git 钩子**: Husky 8.0.3 + lint-staged 15.2.0
- **类型检查**: 严格的 TypeScript 配置

### 测试与监控
- **测试框架**: Jest + React Testing Library 16.3.0
- **覆盖率**: 集成测试覆盖率报告
- **性能分析**: webpack-bundle-analyzer 4.10.1
- **Web 性能**: Web Vitals 2.1.4

## 🚀 开发指南

### 环境准备

确保你的开发环境中已安装：
- **Node.js**: 18.0.0+ (推荐使用 LTS 版本)
- **包管理器**: npm 9.0.0+ 或 yarn 1.22.0+
- **编辑器**: VS Code (推荐，已配置项目设置)

### 快速开始

```bash
# 1. 克隆项目
git clone <repository-url>
cd path_seek

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 📦 可用脚本

#### 开发相关
```bash
npm start              # 启动开发服务器
npm run build          # 构建生产版本
npm test               # 运行测试（交互模式）
npm run test:coverage  # 运行测试并生成覆盖率报告
npm run test:ci        # CI 环境测试（非交互）
```

#### 代码质量
```bash
npm run lint           # 运行 ESLint 并自动修复
npm run lint:check     # 仅检查 ESLint 问题
npm run format         # 格式化代码
npm run format:check   # 检查代码格式
npm run type-check     # TypeScript 类型检查
```

#### 质量工作流
```bash
npm run quality:check  # 完整质量检查（lint + type + format）
npm run quality:fix    # 自动修复质量问题
npm run quality:report # 生成质量报告
npm run pre-commit     # 提交前检查（自动运行）
```

#### 分析工具
```bash
npm run analyze        # 分析打包体积
```

### 🔧 开发工作流

1. **功能开发**
   ```bash
   git checkout -b feature/your-feature
   npm start  # 启动开发服务器
   # 进行开发...
   npm run quality:check  # 检查代码质量
   ```

2. **提交代码**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   # Husky 会自动运行 pre-commit 检查
   ```

3. **测试验证**
   ```bash
   npm run test:coverage  # 确保测试覆盖率
   npm run build         # 验证构建成功
   ```

## 📁 项目结构

```
path_seek/
├── 📄 配置文件
│   ├── package.json           # 项目依赖和脚本
│   ├── tsconfig.json          # TypeScript 配置
│   ├── craco.config.js        # CRACO 构建配置
│   ├── .eslintrc.js           # ESLint 规则
│   ├── .prettierrc            # Prettier 格式化
│   ├── jest.config.js         # Jest 测试配置
│   └── tailwind.config.js     # Tailwind CSS 配置
│
├── 📚 文档目录
│   ├── README.md              # 项目主文档
│   ├── CSS_ARCHITECTURE.md    # CSS 架构设计
│   ├── CSS_DEVELOPMENT_GUIDE.md # CSS 开发指南
│   └── docs/
│       ├── CODE_QUALITY.md    # 代码质量标准
│       └── DEVELOPMENT_SETUP.md # 开发环境设置
│
├── 🔧 开发工具
│   ├── .husky/                # Git 钩子
│   ├── .vscode/               # VS Code 配置
│   ├── .github/workflows/     # GitHub Actions
│   └── scripts/               # 自定义脚本
│       ├── css-tools.js       # CSS 工具脚本
│       └── quality-check.js   # 质量检查脚本
│
├── 🎯 源代码 (src/)
│   ├── App.tsx                # 应用主组件
│   ├── index.tsx              # 应用入口
│   │
│   ├── 📡 api/                # API 接口层
│   │
│   ├── 🎨 assets/             # 静态资源
│   │   ├── icons/             # SVG 图标
│   │   └── images/            # 图片资源
│   │
│   ├── 🧩 components/         # 通用组件
│   │   ├── Content.tsx        # 内容组件
│   │   └── ThemeToggle.tsx    # 主题切换
│   │
│   ├── ⚡ features/           # 功能模块
│   │   ├── navigation/        # 导航功能
│   │   ├── posts/             # 文章功能
│   │   └── theme/             # 主题系统
│   │       ├── ThemeContext.tsx # 主题上下文
│   │       ├── theme.ts       # 主题核心逻辑
│   │       ├── themeCache.ts  # LRU 缓存系统
│   │       ├── types.ts       # 主题类型定义
│   │       └── themes.ts      # 主题预设配置
│   │
│   ├── 🏗️ layout/             # 布局组件
│   │   └── layout.tsx         # 主布局
│   │
│   ├── 📚 lib/                # 第三方库配置
│   │
│   ├── 📄 pages/              # 页面组件
│   │   ├── About.tsx          # 关于页面
│   │   ├── Class.tsx          # 分类页面
│   │   ├── ComponentDemo.tsx  # 组件演示
│   │   ├── Home.tsx           # 首页
│   │   ├── NotFound.tsx       # 404 页面
│   │   ├── Post.tsx           # 文章详情页
│   │   └── Profile.tsx        # 个人资料页
│   │
│   ├── 🛣️ routes/             # 路由配置
│   │   └── index.tsx          # 路由定义
│   │
│   ├── 🤝 shared/             # 共享资源
│   │   ├── components/        # 共享组件
│   │   ├── constants/         # 常量定义
│   │   ├── context/           # React Context
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── services/          # 业务服务
│   │   ├── types/             # TypeScript 类型
│   │   └── utils/             # 工具函数
│   │
│   └── 🎨 styles/             # 样式系统
│       ├── variables.css      # CSS 变量（设计令牌）
│       ├── global.css         # 全局样式
│       ├── components.css     # 可复用组件样式
│       ├── markdown.css       # Markdown 内容样式
│       ├── responsive.css     # 响应式设计
│       ├── utilities.css      # 工具类样式
│       └── [page].css         # 页面特定样式
│
└── 🏗️ 构建输出
    ├── build/                 # 生产构建
    ├── public/                # 静态资源
    └── reports/               # 质量报告
```

## 🏛️ 架构特点

### 🎨 智能主题系统
- **LRU 缓存**: 基于最近最少使用算法的主题缓存系统
- **性能监控**: 实时监控主题切换性能和内存使用
- **CSS 变量**: 基于 CSS 自定义属性的动态主题切换
- **预设主题**: 内置明暗主题和多套配色方案
- **持久化**: 主题偏好本地存储和恢复
- **无闪烁**: 优化的主题切换动画和过渡效果

### 📁 模块化架构
- **Feature-First**: 按功能模块组织代码，便于维护和扩展
- **关注点分离**: 清晰的业务逻辑、UI 组件和数据层分离
- **共享资源**: 统一的组件库、工具函数和类型定义
- **路径别名**: `@/` 别名简化导入路径
- **严格类型**: 完整的 TypeScript 类型覆盖和严格模式

### 🎯 现代 CSS 架构
- **设计令牌**: 基于 CSS 变量的设计系统
- **原子化设计**: BEM 方法论 + 原子化 CSS 类
- **响应式优先**: Mobile-first 设计和容器查询
- **模块化样式**: 按组件和功能模块组织的 CSS 文件
- **性能优化**: CSS 压缩、去重和关键路径优化

### 🚀 性能优化策略
- **代码分割**: 基于路由的动态导入和懒加载
- **资源优化**: 图片懒加载、WebP 格式和压缩
- **缓存策略**: 浏览器缓存、Service Worker 和 CDN
- **构建优化**: Tree-shaking、代码压缩和 Bundle 分析
- **Web Vitals**: 核心 Web 指标监控和优化

### 🛡️ 代码质量保障
- **静态分析**: ESLint + TypeScript 严格检查
- **代码格式**: Prettier 自动格式化
- **Git 钩子**: Husky + lint-staged 提交前检查
- **测试覆盖**: Jest + React Testing Library
- **CI/CD**: GitHub Actions 自动化流程

### 🔧 开发体验优化
- **热重载**: 快速的开发服务器和模块热替换
- **VS Code**: 完整的编辑器配置和扩展推荐
- **调试工具**: React DevTools 和性能分析
- **脚本自动化**: 质量检查、构建和部署脚本
- **文档完善**: 详细的开发指南和架构文档

## 💡 最佳实践

### 代码规范
- 使用 TypeScript 严格模式，确保类型安全
- 遵循 ESLint 和 Prettier 配置的代码风格
- 组件使用 PascalCase，文件名与组件名保持一致
- 使用有意义的变量和函数命名
- 添加适当的注释和 JSDoc 文档

### 组件开发
- 优先使用函数组件和 React Hooks
- 保持组件单一职责，避免过度复杂
- 使用 TypeScript 接口定义 Props 类型
- 实现适当的错误边界和加载状态
- 考虑组件的可复用性和可测试性

### 样式开发
- 使用 CSS 变量实现主题和响应式设计
- 遵循 BEM 命名规范和模块化架构
- 优先使用 CSS Grid 和 Flexbox 布局
- 实现 Mobile-first 响应式设计
- 注意性能优化和关键渲染路径

### 性能优化
- 使用 React.memo 和 useMemo 避免不必要的重渲染
- 实现图片懒加载和代码分割
- 监控 Bundle 大小和 Web Vitals 指标
- 优化网络请求和缓存策略

## ❓ 常见问题

### 开发环境问题

**Q: 启动项目时出现端口被占用错误？**
A: 可以通过以下方式解决：
```bash
# 查找占用端口的进程
netstat -ano | findstr :3000
# 或者使用不同端口启动
set PORT=3001 && npm start
```

**Q: TypeScript 类型检查失败？**
A: 确保安装了正确的类型定义：
```bash
npm run type-check  # 检查具体错误
npm install --save-dev @types/node @types/react @types/react-dom
```

**Q: ESLint 或 Prettier 配置冲突？**
A: 运行以下命令重置配置：
```bash
npm run quality:fix  # 自动修复格式问题
```

### 构建和部署问题

**Q: 构建时出现内存不足错误？**
A: 增加 Node.js 内存限制：
```bash
set NODE_OPTIONS=--max_old_space_size=4096 && npm run build
```

**Q: 图片资源无法正确加载？**
A: 确保图片路径使用正确的别名导入：
```typescript
import image from '@/assets/images/example.jpg';
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

### 提交代码

1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/path_seek.git
   cd path_seek
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   # 或者修复 bug
   git checkout -b fix/bug-description
   ```

3. **开发和测试**
   ```bash
   npm install
   npm start
   # 进行开发...
   npm run quality:check  # 检查代码质量
   npm run test:coverage  # 运行测试
   ```

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   # 遵循 Conventional Commits 规范
   ```

5. **推送和创建 PR**
   ```bash
   git push origin feature/amazing-feature
   # 在 GitHub 上创建 Pull Request
   ```

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建或工具相关

### 代码审查

所有 PR 都需要通过：
- ✅ 自动化测试
- ✅ 代码质量检查
- ✅ 至少一位维护者的审查
- ✅ 文档更新（如需要）

## 📚 相关文档

- [开发环境设置](./docs/DEVELOPMENT_SETUP.md)
- [代码质量标准](./docs/CODE_QUALITY.md)
- [CSS 架构设计](./CSS_ARCHITECTURE.md)
- [CSS 开发指南](./CSS_DEVELOPMENT_GUIDE.md)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和设计师！

---

**Path Seek** - 让写作和分享变得更美好 ✨
