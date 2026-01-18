# 更新日志 (CHANGELOG)

本文档记录 Cherry 的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.2] - 2026-01-18

### 修复 (Fixed)

- **资源路径**
  - 修复所有组件（SettingsModal, Dock, ThemeToggle 等）中的硬编码绝对路径
  - 确保所有图标资源在非根目录部署（GitHub Pages）下正常加载

## [1.0.1] - 2026-01-18

### 修复 (Fixed)

- **GitHub Pages 部署**
  - 修复图标路径问题（从绝对路径改为相对路径）
  - 适配非根目录部署环境

## [1.0.0] - 2026-01-18

### 新增 (Added)

#### 国际化 (i18n)

- **多语言支持**
  - 完整支持中文 (zh) 和英文 (en)
  - 自动语言检测（浏览器设置/localStorage）
  - 语言切换功能（设置弹窗中切换）
  - 持久化语言偏好

- **翻译覆盖**
  - 所有 UI 文本（Header, Footer, Modals, etc.）
  - 帮助文档和快捷键说明
  - 统计信息和图表
  - 命令行提示和反馈

### 修复 (Fixed)

- **UI/UX**
  - 修复 AddModal 在小屏幕上的显示问题
  - 修复 Hero 区域快捷键提示未国际化的问题
- **Code Quality**
  - 修复 useEffect 中的 setState 警告
  - 修复 useCommands 中的 lexical declaration 错误
  - 规范化 types 定义

### 优化 (Optimized)

- **性能**
  - 优化 useStatistics 状态管理，减少不必要的重渲染
  - 移除无用的 React 导入

---

## [0.9.0] - 2026-01-17

### 新增 (Added)

- 基础国际化架构搭建
- 引入 i18next 相关依赖

## [0.8.0] - 2026-01-16

### 新增 (Added)

#### 自动化部署

- **GitHub Actions 优化**
  - 修复路径问题（移除错误的 working-directory 配置）
  - 优化构建缓存策略（自动缓存 npm 依赖）
  - 添加构建信息生成（版本、commit、时间戳）
  - 添加部署摘要（GitHub Actions Summary）
  - 改进错误处理和日志输出

- **部署前自动测试**
  - 添加类型检查（npm run type-check）
  - 添加 ESLint 检查（npm run lint）
  - 构建失败自动阻止部署
  - 详细的错误输出和诊断信息

- **版本管理**
  - 自动生成版本信息（build-info.json）
  - 版本号、commit hash、构建时间戳
  - Branch 信息、Run ID 和 Run Number
  - 部署后可查看构建详情

#### 构建优化

- **构建缓存策略**
  - 使用 GitHub Actions cache 缓存 npm 依赖
  - 加速后续构建时间
  - 减少网络请求和依赖下载

- **构建信息生成**
  - 自动生成 build-info.json 文件
  - 包含版本、commit、时间等元数据
  - 部署到 GitHub Pages 时包含在 dist 目录

### 变更 (Changed)

- GitHub Actions 配置文件更新
- package.json 添加 type-check 脚本
- 构建流程优化（测试 → 构建 → 部署）
- 错误处理改进

### 优化 (Optimized)

- 构建性能提升（缓存策略）
- 部署速度提升（优化步骤）
- 错误诊断改进（详细日志）
- 部署可见性提升（Summary）

### 技术细节

- 使用 actions/setup-node@v4 自动设置 Node.js
- 使用 actions/cache@v4 缓存 npm 依赖
- 使用 actions/configure-pages@v4 配置 Pages
- 使用 actions/upload-pages-artifact@v3 上传构建产物
- 使用 actions/deploy-pages@v4 部署到 GitHub Pages
- 使用 GitHub Actions Summary 显示部署信息

---

## [0.7.0] - 2026-01-16

### 新增 (Added)

#### 性能优化

- **代码分割**
  - 使用 React.lazy 延迟加载模态框组件
  - 使用 Suspense 包裹延迟加载组件
  - 创建 ModalFallback 加载占位符
  - 自动分割为独立 chunk（每个模态框 2-5 KB）
  - 优化初始加载性能

- **图片懒加载**
  - 为 Cherry 图标添加 loading="lazy" 属性
  - 浏览器原生懒加载支持
  - 减少初始页面加载时间

#### PWA 支持

- **Service Worker**
  - 创建 Service Worker 文件（sw.js）
  - 实现缓存策略（Cache First）
  - 自动缓存核心资源（HTML, CSS, JS, 图标）
  - 离线访问支持
  - 缓存版本管理（v0.6.0）
  - 旧缓存自动清理

- **PWA Manifest**
  - 创建 manifest.json 文件
  - 应用图标配置（192x192, 512x512）
  - 主题色配置（#ff6b6b）
  - 显示模式（standalone）
  - 应用快捷方式（添加链接、查看统计）
  - 应用类别和描述

- **PWA Meta Tags**
  - 添加 theme-color meta 标签
  - 添加 Apple Mobile Web App meta 标签
  - 添加 PWA manifest 链接
  - Service Worker 自动注册

### 变更 (Changed)

- App 组件更新导入方式（使用 React.lazy）
- App 组件添加 ModalFallback 组件
- Hero 组件更新图片加载方式
- index.html 添加 PWA meta 标签
- index.html 添加 Service Worker 注册脚本

### 优化 (Optimized)

- 初始加载性能优化（代码分割）
- 首屏加载时间减少（延迟加载模态框）
- 离线访问能力（Service Worker 缓存）
- 图片加载性能（懒加载）
- 缓存命中率提升（Cache First 策略）

### 技术细节

- 使用 React.lazy 实现组件级代码分割
- 使用 Suspense 实现加载状态管理
- 使用 Service Worker 实现离线访问
- 使用 Cache First 缓存策略
- 使用版本化缓存管理
- 使用浏览器原生懒加载 API

---

## [0.6.0] - 2026-01-16

### 新增 (Added)

#### 统计功能

- **访问统计**
  - 记录链接访问次数（每次点击或打开链接时记录）
  - 访问历史记录（保留最近 100 条）
  - 访问时间戳记录
  - localStorage 持久化

- **热门链接显示**
  - 显示前 10 个最常访问的链接
  - 按访问次数排序
  - 显示链接标题和访问次数
  - 从 branches 数据中自动填充链接信息

- **常用命令统计**
  - 记录每个命令的使用次数
  - 记录最后使用时间
  - 显示前 5 个最常用命令
  - 命令使用历史追踪

- **常用分类统计**
  - 记录每个 Branch 的访问次数
  - 显示前 5 个最常用分类
  - 分类图标和名称显示
  - 访问次数统计

- **统计展示组件**
  - StatisticsModal 组件（弹窗形式）
  - 四个统计区块：热门链接、访问历史、常用命令、常用分类
  - 响应式布局（双列网格）
  - 时间格式化（刚刚、X分钟前、X小时前、X天前）
  - ESC 键或点击外部关闭

#### 类型定义更新

- VisitHistory 接口（访问历史记录）
- CommandUsage 接口（命令使用统计）
- CategoryUsage 接口（分类使用统计）
- Statistics 接口（完整统计数据）
- Commit 接口新增 visitCount 和 lastVisited 字段

#### Hook 更新

- useStatistics hook（统计功能管理）
- recordVisit 函数（记录链接访问）
- recordCommand 函数（记录命令使用）
- clearStatistics 函数（清除统计数据）
- loadStatistics 函数（加载统计数据）

#### 组件更新

- Header 组件新增统计按钮（📊 Stats）
- App 组件新增统计弹窗状态管理
- HelpModal 组件新增 T 键说明
- KeyboardShortcutsModal 组件新增 T 键说明

#### 快捷键更新

- T 键：打开统计弹窗

### 变更 (Changed)

- useKeyboardNavigation hook 新增 onShowStatistics 参数
- Header 组件新增 onStatistics 属性
- App 组件新增 isStatisticsOpen 状态
- App 组件新增 handleShowStatistics 和 handleCloseStatistics 函数
- App 组件更新 handleOpenLink 函数以记录访问
- App 组件更新 handleCommitClick 函数以记录访问
- App 组件更新 handleCommand 函数以记录命令使用

### 优化 (Optimized)

- 统计数据加载性能优化（使用 Set 和 Map）
- localStorage 操作优化（批量读写）
- 热门链接查询优化（从 branches 数据中查找）
- 时间格式化性能优化

### 技术细节

- 使用 useState 管理统计数据
- 使用 useEffect 监听数据变化
- 使用 useCallback 优化事件处理函数
- 使用 localStorage 实现数据持久化
- 最大历史记录限制（100条）
- 最大热门链接显示（10个）

---

## [0.5.0] - 2026-01-16

### 新增 (Added)

#### 用户体验增强

- **标签过滤功能**
  - 点击标签可过滤显示匹配的链接
  - 支持多标签组合过滤
  - 标签选中状态显示（红色高亮）
  - 标签栏显示所有唯一标签
  - 显示过滤结果数量
  - 清除筛选功能

- **搜索建议功能**
  - 输入时显示匹配建议
  - 命令自动补全（help、ls、go、g、clear）
  - 链接标题和标签建议
  - Tab 键循环选择建议
  - 上下箭头选择建议
  - 点击建议填充输入框
  - 历史命令补全（上下箭头）

- **快捷键引导功能**
  - 首次访问显示快捷键引导弹窗
  - 美观的快捷键展示界面
  - 可通过 ESC 或点击外部关闭
  - localStorage 记录首次访问状态
  - 欢迎界面和开始使用按钮

- **收藏功能**
  - 每个链接卡片显示收藏按钮（星标）
  - 点击切换收藏状态
  - 收藏状态持久化（localStorage）
  - 收藏按钮视觉反馈（实心/空心星标）
  - 支持收藏夹快速访问（后续版本）

#### 类型定义更新

- Commit 接口新增 `isFavorite` 字段
- 新增 FavoriteItem 接口定义

### 变更 (Changed)

- CommitCard 组件新增收藏按钮
- BranchSection 组件支持收藏功能
- ContentGrid 组件支持收藏功能
- App 组件新增收藏状态管理
- CommandInput 组件支持搜索建议
- Header 组件保持不变

### 优化 (Optimized)

- 搜索建议性能优化（限制显示数量）
- 标签过滤性能优化（使用 Set 数据结构）
- 收藏状态管理优化（localStorage 批量操作）

### 技术细节

- 使用 useState 管理收藏状态
- 使用 useEffect 监听输入变化生成建议
- 使用 useCallback 优化事件处理函数
- 使用 localStorage 实现数据持久化

---

## [0.4.0] - 2026-01-15

### 新增 (Added)

#### 视觉增强

- **打字机动画**
  - Slogan 逐字显示效果
  - 光标闪烁效果

- **Hover 交互效果**
  - 像素抖动效果（pixel-shake 动画）
  - 反色效果（轻微色相偏移）
  - 辉光增强（多层渐变辉光）
  - 标签交互（放大、变色、辉光）

- **页面加载动画**
  - CRT 开机效果（垂直拉伸动画）
  - 渐显动画（fade-in-up）
  - 延迟动画（animate-delay-100 到 500）

- **像素风 Cherry 树**
  - 响应式尺寸（80px - 160px）
  - 浮动动画（上下浮动）
  - 脉冲辉光（呼吸效果）
  - 图标交互（旋转、放大、辉光）

- **按钮和输入框交互**
  - 按钮光影扫过效果
  - 输入框 focus 动画（辉光、抖动）

#### 功能增强

- **搜索高亮**
  - 搜索结果高亮显示（渐变色背景）
  - 匹配文本标记（标题和标签）
  - 脉冲动画效果

- **主题切换**
  - 暗色主题（默认，GitHub Dark Dimmed）
  - 亮色主题（白色背景，柔和配色）
  - localStorage 自动保存主题偏好
  - ThemeToggle 组件（点击切换）

- **数据持久化**
  - localStorage 缓存配置
  - 主题偏好保存和恢复
  - 跨会话保持

- **配置管理**
  - 导出配置（JSON 文件，包含主题和数据）
  - 导入配置（支持导入和验证）
  - 重置默认配置（清除 localStorage）
  - SettingsModal 组件

### 变更 (Changed)

- Header 组件新增 ThemeToggle 组件
- Header 组件新增设置按钮
- App 组件新增主题状态管理
- App 组件新增设置弹窗状态
- CommitCard 组件支持搜索高亮
- ContentGrid 组件支持标签过滤

### 优化 (Optimized)

- CSS 动画性能优化（使用 transform）
- 主题切换性能优化（使用 CSS 变量）
- localStorage 操作优化（减少读写次数）

---

## [0.3.0] - 2026-01-15

### 新增 (Added)

#### Add 功能

- **AddModal 组件**
  - URL 输入框
  - 标题输入框
  - Branch 选择下拉框
  - 标签输入框
  - 生成 JSON 按钮
  - 复制到剪贴板按钮

- **JSON 生成功能**
  - 自动生成随机 hash
  - 生成标准 JSON 格式
  - 支持自定义 Branch 和标签

- **快捷键支持**
  - `A` 键打开 Add 弹窗
  - 弹窗打开时禁用键盘导航

### 变更 (Changed)

- Header 组件新增 Add 按钮
- App 组件新增 Add 弹窗状态
- useKeyboardNavigation hook 新增 isModalOpen 参数
- useKeyboardNavigation hook 新增 onShowAdd 回调

### 修复 (Fixed)

- 修复键盘导航冲突问题（`/` 键在输入 URL 时触发搜索）
- 修复 Add 弹窗打开时键盘导航仍然生效的问题

---

## [0.2.0] - 2026-01-15

### 新增 (Added)

#### 打字机动画

- Hero 组件新增打字机效果
- Slogan 逐字显示
- 光标闪烁动画

### 变更 (Changed)

- Hero 组件重构
- App 组件更新 Hero 组件调用

### 优化 (Optimized)

- 打字机动画性能优化
- 使用 useEffect 管理动画状态

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
- PRD.md（详细设计规范）

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

[未发布]: https://github.com/FruitsAI/Cherry/compare/v0.8.0...HEAD
[0.8.0]: https://github.com/FruitsAI/Cherry/releases/tag/v0.8.0
[0.7.0]: https://github.com/FruitsAI/Cherry/releases/tag/v0.7.0
[0.6.0]: https://github.com/FruitsAI/Cherry/releases/tag/v0.6.0
[0.5.0]: https://github.com/FruitsAI/Cherry/releases/tag/v0.5.0
[0.4.0]: https://github.com/FruitsAI/Cherry/releases/tag/v0.4.0
[0.3.0]: https://github.com/FruitsAI/Cherry/releases/tag/v0.3.0
[0.2.0]: https://github.com/FruitsAI/Cherry/releases/tag/v0.2.0
[0.1.0]: https://github.com/FruitsAI/Cherry/releases/tag/v0.1.0
