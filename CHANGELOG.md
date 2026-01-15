# 更新日志 (CHANGELOG)

本文档记录 Project Cherry 的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 计划中
- Add 功能（快速添加链接）
- 打字机动画效果
- Hover 交互效果增强
- 搜索结果高亮
- 主题切换功能
- 数据持久化支持

---

## [0.1.0] - 2026-01-15

### 新增 (Added)

#### 核心功能
- **项目初始化**
  - 搭建 Vite + React 19 + TypeScript 开发环境
  - 配置 Tailwind CSS 4 样式系统
  - 引入 VT323 像素字体和 Fira Code 等宽字体

- **CRT 显示器效果**
  - 实现扫描线效果
  - 实现屏幕辉光效果
  - 实现屏幕闪烁动画
  - 复古终端视觉体验

- **Git 工作流隐喻 UI**
  - Header 状态栏（显示用户路径、当前分支、运行时间、当前时间）
  - Hero 区域（Slogan 展示）
  - Branch 分类区块（带图标和 commit 数量）
  - Commit 卡片（带伪 hash、标签、hover 效果）
  - 选中状态高亮显示

- **Vim 风格键盘导航**
  - `j` / `↓`: 向下移动选择
  - `k` / `↑`: 向上移动选择
  - `h` / `←`: 切换到上一个 Branch
  - `l` / `→`: 切换到下一个 Branch
  - `Enter`: 打开选中链接
  - `/`: 聚焦搜索框
  - `Esc`: 退出搜索 / 关闭帮助
  - `?`: 显示帮助弹窗

- **命令行搜索系统**
  - `help`: 显示帮助信息
  - `ls`: 列出所有 Branches
  - `go <n>`: 跳转到第 n 个链接
  - `g <query>` / `google <query>`: Google 搜索
  - `clear`: 清除命令历史
  - 模糊搜索（在链接标题和标签中搜索）

- **数据配置系统**
  - 使用 `data.json` 存储所有链接和配置
  - 支持自定义站点配置（用户名、主题、口号）
  - 支持自定义 Branch 和 Commit 数据

- **响应式布局**
  - 适配桌面端和移动端
  - 自适应网格布局
  - 移动端优化显示

#### 开发工具
- TypeScript 严格模式配置
- ESLint 代码检查配置
- 生产构建配置
- GitHub Pages 部署配置
- Vercel 部署配置

#### 文档
- README.md（项目说明和快速开始）
- TODO.md（开发计划和功能追踪）
- IFLOW.md（项目技术文档）
- 需求文档.md（详细设计规范）

### 修复 (Fixed)

- 修复 TypeScript 类型导入问题（使用 `import type` 语法）
- 修复 CommandResult 接口定义不一致问题
- 修复开发服务器端口冲突问题

### 技术细节

- 使用 React Hooks 进行状态管理
- 使用自定义 Hooks 封装键盘导航和命令处理逻辑
- 组件化设计，代码结构清晰
- 类型安全的 TypeScript 实现

---

## 版本说明

### 版本号格式

- **主版本号**: 重大功能更新或架构变更
- **次版本号**: 新增功能
- **修订号**: Bug 修复或小改进

### 变更类型

- **新增 (Added)**: 新功能
- **变更 (Changed)**: 现有功能的变更
- **弃用 (Deprecated)**: 即将移除的功能
- **移除 (Removed)**: 已移除的功能
- **修复 (Fixed)**: Bug 修复
- **安全 (Security)**: 安全性修复

---

[未发布]: https://github.com/FruitsAI/Cherry/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/FruitsAI/Cherry/releases/tag/v0.1.0