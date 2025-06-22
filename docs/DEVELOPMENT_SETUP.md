# 开发环境设置指南

本文档将指导您设置完整的开发环境，确保您能够高效地参与项目开发。

## 📋 目录

- [系统要求](#系统要求)
- [必需软件安装](#必需软件安装)
- [项目设置](#项目设置)
- [VS Code 配置](#vs-code-配置)
- [Git 配置](#git-配置)
- [开发工具](#开发工具)
- [环境变量](#环境变量)
- [常用命令](#常用命令)
- [故障排除](#故障排除)

## 💻 系统要求

### 最低要求
- **操作系统**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+
- **内存**: 8GB RAM（推荐 16GB+）
- **存储**: 至少 5GB 可用空间
- **网络**: 稳定的互联网连接

### 推荐配置
- **CPU**: 多核处理器（Intel i5/AMD Ryzen 5 或更高）
- **内存**: 16GB+ RAM
- **存储**: SSD 硬盘
- **显示器**: 1920x1080 或更高分辨率

## 🛠️ 必需软件安装

### 1. Node.js

安装 Node.js 18.x 或更高版本：

```bash
# 使用 nvm (推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 或直接从官网下载
# https://nodejs.org/
```

验证安装：
```bash
node --version  # 应显示 v18.x.x
npm --version   # 应显示 9.x.x 或更高
```

### 2. Git

```bash
# Windows (使用 Chocolatey)
choco install git

# macOS (使用 Homebrew)
brew install git

# Ubuntu/Debian
sudo apt-get install git
```

### 3. VS Code

从 [官网](https://code.visualstudio.com/) 下载并安装 Visual Studio Code。

## 🚀 项目设置

### 1. 克隆项目

```bash
git clone <repository-url>
cd path_seek
```

### 2. 安装依赖

```bash
# 清理安装（推荐）
npm ci

# 或常规安装
npm install
```

### 3. 环境配置

复制环境变量模板：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，设置必要的环境变量。

### 4. 验证设置

```bash
# 运行类型检查
npm run type-check

# 运行代码检查
npm run lint

# 运行测试
npm test

# 启动开发服务器
npm start
```

如果所有命令都成功执行，说明环境设置正确。

## 🎨 VS Code 配置

### 推荐扩展

项目已配置了推荐扩展列表，VS Code 会自动提示安装：

**核心扩展**:
- TypeScript and JavaScript Language Features
- ESLint
- Prettier - Code formatter
- GitLens

**React 开发**:
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer

**测试和调试**:
- Jest
- Debugger for Chrome

### 工作区设置

项目包含预配置的 VS Code 设置：

- **自动格式化**: 保存时自动运行 Prettier
- **自动修复**: 保存时自动修复 ESLint 错误
- **类型检查**: 实时 TypeScript 错误提示
- **调试配置**: 预配置的调试启动项

### 快捷键设置

推荐的快捷键配置：

```json
[
  {
    "key": "ctrl+shift+f",
    "command": "editor.action.formatDocument"
  },
  {
    "key": "ctrl+shift+o",
    "command": "editor.action.organizeImports"
  },
  {
    "key": "ctrl+shift+t",
    "command": "workbench.action.tasks.runTask",
    "args": "npm: test"
  }
]
```

## 🔧 Git 配置

### 基本配置

```bash
# 设置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 设置默认分支名
git config --global init.defaultBranch main

# 启用颜色输出
git config --global color.ui auto
```

### Git Hooks

项目使用 Husky 管理 Git hooks：

```bash
# 安装 Git hooks
npm run prepare
```

这将设置以下 hooks：
- **pre-commit**: 运行代码检查和格式化
- **commit-msg**: 验证提交信息格式

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
type(scope): description

[optional body]

[optional footer]
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例**:
```bash
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(ui): resolve button alignment issue"
git commit -m "docs(readme): update installation instructions"
```

## 🛠️ 开发工具

### 包管理器

推荐使用 npm，项目已配置 `.npmrc` 文件：

```bash
# 查看 npm 配置
npm config list

# 清理缓存
npm cache clean --force

# 检查过期包
npm outdated
```

### 调试工具

#### Chrome DevTools

1. 启动开发服务器：`npm start`
2. 在 Chrome 中打开 `http://localhost:3000`
3. 按 F12 打开开发者工具
4. 使用 Sources 面板进行断点调试

#### VS Code 调试

1. 设置断点
2. 按 F5 或使用调试面板
3. 选择 "Launch Chrome" 配置
4. 开始调试

### 性能分析

```bash
# 分析包大小
npm run analyze

# 运行性能测试
npm run lighthouse

# 生成质量报告
npm run quality:report
```

## 🌍 环境变量

### 环境文件

项目支持多个环境文件：

- `.env`: 默认环境变量
- `.env.local`: 本地开发环境（不提交到 Git）
- `.env.development`: 开发环境
- `.env.production`: 生产环境

### 常用环境变量

```bash
# API 配置
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_API_TIMEOUT=10000

# 功能开关
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG=true

# 第三方服务
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
REACT_APP_SENTRY_DSN=SENTRY_DSN_URL
```

### 环境变量验证

```typescript
// src/config/env.ts
const requiredEnvVars = [
  'REACT_APP_API_BASE_URL',
] as const;

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## 📝 常用命令

### 开发命令

```bash
# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test

# 运行测试并监听文件变化
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

### 代码质量命令

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复 ESLint 错误
npm run lint -- --fix

# 运行 Prettier 格式化
npm run format

# 检查代码格式
npm run format:check

# 运行 TypeScript 类型检查
npm run type-check

# 运行所有质量检查
npm run quality:check

# 自动修复所有可修复的问题
npm run quality:fix
```

### 分析命令

```bash
# 分析包大小
npm run analyze

# 生成质量报告
npm run quality:report

# 检查依赖漏洞
npm audit

# 修复依赖漏洞
npm audit fix
```

## 🔍 故障排除

### 常见问题

#### 1. 依赖安装失败

```bash
# 清理 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 清理 npm 缓存
npm cache clean --force

# 重新安装
npm install
```

#### 2. 端口被占用

```bash
# 查找占用端口的进程
lsof -ti:3000

# 杀死进程
kill -9 <PID>

# 或使用不同端口
PORT=3001 npm start
```

#### 3. TypeScript 错误

```bash
# 重启 TypeScript 服务
# 在 VS Code 中: Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# 清理 TypeScript 缓存
npx tsc --build --clean
```

#### 4. ESLint 配置错误

```bash
# 检查 ESLint 配置
npx eslint --print-config src/index.tsx

# 重新安装 ESLint 相关包
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### 5. Git hooks 不工作

```bash
# 重新安装 Husky
npm run prepare

# 检查 hooks 权限
ls -la .husky/
chmod +x .husky/*
```

### 性能问题

#### 1. 开发服务器启动慢

```bash
# 禁用类型检查（仅开发时）
TSC_COMPILE_ON_ERROR=true npm start

# 使用更快的刷新
FAST_REFRESH=true npm start
```

#### 2. 构建时间长

```bash
# 分析构建性能
npm run build -- --profile

# 使用并行构建
npm run build -- --max-old-space-size=4096
```

### 获取帮助

1. **查看日志**: 检查控制台输出和错误信息
2. **搜索文档**: 查看项目 `docs/` 目录下的相关文档
3. **检查 Issues**: 在项目 GitHub 仓库中搜索相关问题
4. **团队支持**: 联系项目维护者或团队成员

### 有用的资源

- [Node.js 官方文档](https://nodejs.org/docs/)
- [React 官方文档](https://react.dev/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [VS Code 用户指南](https://code.visualstudio.com/docs)
- [Git 官方文档](https://git-scm.com/doc)

## 📚 下一步

环境设置完成后，建议：

1. 阅读 [代码质量指南](./CODE_QUALITY.md)
2. 查看 [项目架构文档](./ARCHITECTURE.md)
3. 了解 [贡献指南](../CONTRIBUTING.md)
4. 开始您的第一个功能开发！

---

**注意**: 如果遇到本文档未涵盖的问题，请及时更新此文档以帮助其他开发者。