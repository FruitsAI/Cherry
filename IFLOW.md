# Cherry 项目文档

## 项目概述

**Cherry** 是一个专属于程序员的复古终端风格浏览器起始页。它采用 CRT 显示器效果、Vim 风格键盘导航和 Git 工作流隐喻，为开发者提供一个极具极客感的 Web 导航体验。

**Slogan**: Cherry-pick the web

**项目类型**: React 19 + TypeScript + Vite 前端应用

## 技术栈

- **框架**: React 19.2.0
- **语言**: TypeScript 5.9.3
- **构建工具**: Vite 7.2.4
- **样式**: Tailwind CSS 4.1.18
- **字体**: VT323 (像素字体) + Fira Code (等宽字体)
- **部署**: GitHub Pages / Vercel

## 项目结构

```
Cherry/
├── public/                      # 静态资源
│   ├── cherry.svg              # 像素风 Cherry 图标
│   └── vite.svg                # Vite 图标
├── src/
│   ├── components/             # React 组件
│   │   ├── BranchSection.tsx   # Branch 分类区块
│   │   ├── CommandInput.tsx    # 命令行输入框
│   │   ├── CommitCard.tsx      # Commit 链接卡片
│   │   ├── ContentGrid.tsx     # 内容网格布局
│   │   ├── Header.tsx          # 状态栏
│   │   ├── HelpModal.tsx       # 帮助弹窗
│   │   ├── Hero.tsx            # Hero 区域
│   │   └── index.ts            # 组件导出
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useCommands.ts      # 命令处理逻辑
│   │   ├── useKeyboardNavigation.ts  # 键盘导航逻辑
│   │   └── index.ts            # Hooks 导出
│   ├── types/                  # TypeScript 类型定义
│   │   └── index.ts
│   ├── data/                   # 数据配置
│   │   └── data.json           # 链接和配置数据
│   ├── assets/                 # 资源文件
│   │   └── react.svg
│   ├── App.tsx                 # 主应用组件
│   ├── main.tsx                # 应用入口
│   └── index.css               # 全局样式 + CRT 特效
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages 部署配置
├── .gitignore
├── eslint.config.js            # ESLint 配置
├── index.html                  # HTML 入口
├── package.json                # 项目依赖和脚本
├── tsconfig.json               # TypeScript 配置
├── tsconfig.app.json           # 应用 TS 配置
├── tsconfig.node.json          # Node JS TS 配置
├── vercel.json                 # Vercel 部署配置
├── vite.config.ts              # Vite 配置
├── README.md                   # 项目说明
└── 需求文档.md                 # 详细开发文档

```

## 核心功能

### 1. CRT 显示器效果
- 扫描线效果
- 屏幕辉光和闪烁
- 复古终端视觉体验

### 2. Vim 风格键盘导航
- `j` / `↓`: 向下移动选择
- `k` / `↑`: 向上移动选择
- `h` / `←`: 切换到上一个 Branch
- `l` / `→`: 切换到下一个 Branch
- `Enter`: 打开选中的链接
- `/`: 聚焦搜索框
- `Esc`: 退出搜索 / 关闭帮助
- `?`: 显示帮助

### 3. 命令行搜索
- `help`: 显示帮助信息
- `ls`: 列出所有 Branches
- `go <n>`: 跳转到第 n 个链接
- `g <query>`: 使用 Google 搜索
- `clear`: 清除命令历史

### 4. Git 工作流隐喻
- 分类称为 **Branches**（如 `feature/work`、`hotfix/tools`）
- 链接称为 **Commits**（带有伪 hash 值）
- 状态栏显示当前 Branch 信息

## 数据配置

所有链接和配置存储在 `src/data/data.json` 中：

```json
{
  "site_config": {
    "user_name": "DevUser",
    "theme": "dark_matrix",
    "slogan": "Cherry-pick the web"
  },
  "branches": [
    {
      "name": "feature/work",
      "icon": "💼",
      "commits": [
        {
          "message": "GitHub Dashboard",
          "hash": "a1b2c3d",
          "url": "https://github.com",
          "tags": ["code", "daily"]
        }
      ]
    }
  ]
}
```

## 开发命令

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
开发服务器默认运行在 `http://localhost:5173`

### 构建生产版本
```bash
npm run build
```
构建输出到 `dist/` 目录

### 预览生产构建
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 部署

### GitHub Pages
1. 推送代码到 GitHub
2. 在仓库设置中启用 GitHub Pages
3. 选择 GitHub Actions 作为源
4. 推送到 main 分支自动部署

### Vercel
1. 导入 GitHub 仓库到 Vercel
2. 设置根目录为 `app`
3. 自动检测 Vite 框架并部署

## 开发约定

### 组件开发
- 使用函数式组件 + Hooks
- 组件文件使用 PascalCase 命名（如 `Header.tsx`）
- 所有组件在 `src/components/index.ts` 中统一导出

### 类型定义
- 所有类型定义在 `src/types/index.ts` 中
- 使用 TypeScript 严格模式
- 接口使用 PascalCase 命名

### 样式规范
- 使用 Tailwind CSS 进行样式开发
- CRT 特效在 `src/index.css` 中定义
- 像素字体使用 VT323，代码字体使用 Fira Code

### 自定义 Hooks
- 自定义 Hooks 放在 `src/hooks/` 目录
- Hook 命名以 `use` 开头（如 `useKeyboardNavigation`）
- 所有 Hooks 在 `src/hooks/index.ts` 中统一导出

### 代码风格
- 使用 ESLint 进行代码检查
- 遵循 React Hooks 规则
- 使用函数式编程范式

## 关键文件说明

### `src/App.tsx`
主应用组件，负责：
- 管理全局状态（导航状态、UI 状态）
- 集成键盘导航和命令处理
- 组织页面布局

### `src/hooks/useKeyboardNavigation.ts`
处理 Vim 风格键盘导航逻辑

### `src/hooks/useCommands.ts`
处理命令行输入和命令执行逻辑

### `src/data/data.json`
存储所有链接数据和站点配置

### `vite.config.ts`
Vite 构建配置，设置了 `base: './'` 以支持 GitHub Pages 部署

## 自定义和扩展

### 添加新链接
编辑 `src/data/data.json`，在 `branches` 数组中添加新的 commit：

```json
{
  "message": "新链接名称",
  "hash": "abc123",
  "url": "https://example.com",
  "tags": ["tag1", "tag2"]
}
```

### 添加新分类
在 `branches` 数组中添加新的 branch 对象：

```json
{
  "name": "新分类名称",
  "icon": "🎯",
  "commits": [...]
}
```

### 修改站点配置
编辑 `site_config` 对象：

```json
{
  "site_config": {
    "user_name": "你的名字",
    "theme": "dark_matrix",
    "slogan": "你的口号"
  }
}
```

## 注意事项

- 项目使用 Git 作为版本控制
- 所有链接数据存储在 JSON 文件中，无需后端
- 支持响应式布局，适配桌面和移动端
- 使用相对路径部署，兼容 GitHub Pages
- 键盘导航功能需要焦点在页面上才能生效

## 相关文档

- **需求文档**: `需求文档.md` - 详细的项目设计和开发规范
- **README**: `README.md` - 快速开始和功能介绍
- **Tailwind CSS**: https://tailwindcss.com/
- **Vite**: https://vite.dev/
- **React**: https://react.dev/