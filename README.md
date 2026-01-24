<div align="center">
  <img src="public/cherry.svg" width="160" alt="Cherry Logo" />
  <h1>Cherry</h1>
  
  <p>
    <strong>Cherry-pick the web.</strong>
  </p>
  
  <p>一个专属于程序员的现代复古终端风格起始页。</p>
  <p>Next.js 15 Full-Stack Remake</p>

  <p>
    <a href="./LICENSE">
      <img src="https://img.shields.io/github/license/FruitsAI/Cherry?style=flat-square&color=2ecc71" alt="License" />
    </a>
    <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Framework-Next.js_15-black?style=flat-square&logo=next.js" alt="Next.js" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript&color=3178c6" alt="TypeScript" />
    </a>
    <a href="https://orm.drizzle.team/">
      <img src="https://img.shields.io/badge/ORM-Drizzle-yellow?style=flat-square&logo=drizzle&color=C5F74F" alt="Drizzle" />
    </a>
    <a href="https://postgresql.org/">
      <img src="https://img.shields.io/badge/DB-PostgreSQL-blue?style=flat-square&logo=postgresql" alt="PostgreSQL" />
    </a>
  </p>

  <p>
    <a href="./README.en.md">English</a> | <span>简体中文</span>
  </p>
</div>

---

## ✨ 特性

### 🚀 核心体验

- **CRT 复古终端视效**: 扫描线、辉光、屏幕闪烁，重现 80 年代终端质感
- **Vim 风格全键盘流**: `j/k` 选择，`h/l` 分类，`/` 搜索，双手不离键盘
- **Git 工作流隐喻**: 分类即 **Branches**，书签即 **Commits**，版本控制你的收藏
- **响应式设计**: 从 4K 大屏到移动端完美适配 Pixel Art 风格

### 🛠️ 全栈重构 (2.0)

- **Admin 后台管理**:
  - 可视化管理 Categories (Branches) 和 Links (Commits)
  - 拖拽排序 (Drag & Drop)
  - 站点配置管理 (Slogan, Shortcuts)
- **多方式登录鉴权**:
  - 支持 **Gitub / Google OAuth** 一键登录
  - 账号密码登录 (Credentials)
  - 基于角色的权限控制 (RBAC)
- **高性能服务端搜索**:
  - URL 同步的实时搜索过滤
  - Server-side Search，海量数据无压力
- **现代化技术栈**:
  - **Next.js 15 App Router**: React Server Components (RSC) 用作极致首屏性能
  - **Drizzle ORM & Postgres**: 类型安全的数据库操作
  - **Tailwind CSS 4**: 下一代原子化 CSS 引擎

## 🚀 快速开始

### 环境依赖

- Node.js 18+
- PostgreSQL 数据库

### 安装与运行

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入 POSTGRES_URL, AUTH_SECRET 等

# 3. 数据库迁移
npm run db:push

# 4. 填充初始数据 (可选)
npm run seed

# 5. 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。

## ⌨️ 键盘快捷键

| 快捷键    | 功能                |
| --------- | ------------------- |
| `j` / `↓` | 向下移动选择        |
| `k` / `↑` | 向上移动选择        |
| `h` / `←` | 切换到上一个 Branch |
| `l` / `→` | 切换到下一个 Branch |
| `Enter`   | 打开选中的链接      |
| `/`       | 聚焦搜索框          |
| `Esc`     | 退出搜索 / 关闭帮助 |
| `?`       | 显示帮助            |
| `CMD+K`   | 快速命令            |

## 📁 项目结构 (Next.js App Router)

```
.
├── src/
│   ├── app/                # App Router 路由
│   │   ├── admin/          # 后台管理页面 (CRUD)
│   │   ├── api/            # API Routes (Auth, etc)
│   │   ├── login/          # 登录页
│   │   ├── actions.ts      # Server Actions (业务逻辑)
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 前台首页 (SSR)
│   ├── components/         # React 组件
│   │   ├── admin/          # 后台专用组件
│   │   ├── ui/             # 通用 UI 组件
│   │   └── ...
│   ├── db/                 # 数据库层
│   │   ├── schema.ts       # Drizzle Schema 定义
│   │   └── index.ts        # DB 连接实例
│   ├── auth.ts             # NextAuth 配置
│   └── middleware.ts       # 路由保护中间件
└── public/                 # 静态资源 (Icons, Sounds)
```

## 📝 技术栈详情

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: PostgreSQL (via [Vercel Postgres](https://vercel.com/postgres) or local)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [NextAuth.js v5](https://authjs.dev/) (Beta)
- **Deployment**: Vercel / GitHub Pages

## 🚢 部署方式

Cherry 支持两种部署模式，满足不同场景需求：

### 方式一：Vercel 全栈部署 (推荐)

全功能动态部署，支持 Admin 后台管理和 OAuth 登录。

1. **Fork 仓库** 到你的 GitHub 账户
2. **在 Vercel 中导入项目**:
   - 进入 [Vercel Dashboard](https://vercel.com/new)
   - 选择你 Fork 的仓库
3. **添加 Postgres 数据库**:
   - Vercel Dashboard → Storage → Create Database → Postgres
   - 数据库会自动关联环境变量
4. **配置环境变量**:
   ```bash
   AUTH_SECRET=xxx        # 运行 `openssl rand -base64 32` 生成
   # OAuth 配置 (可选)
   AUTH_GITHUB_ID=xxx
   AUTH_GITHUB_SECRET=xxx
   AUTH_GOOGLE_ID=xxx
   AUTH_GOOGLE_SECRET=xxx
   ```
5. **初始化数据库**:
   ```bash
   npm run db:push        # 推送 Schema
   npm run seed           # 填充初始数据
   ```
6. **部署完成**，访问自动生成的 `.vercel.app` 域名

### 方式二：GitHub Pages 静态部署

纯静态页面部署，无需数据库，适合个人展示站点。

> [!NOTE]
> 静态模式下不支持 Admin 后台管理和 OAuth 登录，数据从 `src/data/data.json` 读取。

1. **Fork 仓库** 到你的 GitHub 账户
2. **启用 GitHub Pages**:
   - Settings → Pages → Source → 选择 **GitHub Actions**
3. **修改数据**:
   - 编辑 `src/data/data.json` 配置你的链接和分类
4. **推送代码**:
   - 推送到 `main` 分支，Actions 会自动构建和部署
5. **访问**:
   - `https://<username>.github.io/<repo-name>`

#### 静态模式原理

通过设置环境变量 `STATIC_MODE=true`，Next.js 会:

- 启用 `output: 'export'` 生成纯静态 HTML
- 从 `src/data/data.json` 读取数据而非数据库
- 禁用需要服务端的功能 (Admin, OAuth)

手动构建静态版本:

```bash
npm run build:static   # 等同于 STATIC_MODE=true npm run build
```

## 📄 License

MIT

## 📮 贡献与反馈

欢迎提交 Issue 或 Pull Request 来改进 Cherry！
GitHub: [FruitsAI/Cherry](https://github.com/FruitsAI/Cherry)
