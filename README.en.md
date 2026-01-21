<div align="center">
  <img src="public/cherry.svg" width="160" alt="Cherry Logo" />
  <h1>Cherry</h1>
  
  <p>
    <strong>Cherry-pick the web.</strong>
  </p>
  
  <p>A modern retro terminal-style start page for developers.</p>
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
    <span>English</span> | <a href="./README.md">简体中文</a>
  </p>
</div>

---

## ✨ Features

### 🚀 Core Experience

- **CRT Retro Visuals**: Scanlines, glow, and screen flicker effects recreating the 80s terminal vibe.
- **Vim-style Navigation**: `j/k` to move, `h/l` to switch branches, `/` to search. Keep your hands on the keyboard.
- **Git Metaphor**: Categories are **Branches**, bookmarks are **Commits**. Version control your web.
- **Responsive Design**: Pixel-perfect adaptation from 4K monitors to mobile screens.

### 🛠️ Full-Stack Remake (2.0)

- **Admin Dashboard**:
  - Visual management of Categories (Branches) and Links (Commits).
  - Draggable sorting interfaces.
  - Site configuration management (Slogan, Shortcuts).
- **Authentication**:
  - **GitHub / Google OAuth** support.
  - Credentials login.
  - Role-Based Access Control (RBAC).
- **Server-side Search**:
  - High-performance, URL-synchronized filtering.
  - Handles large datasets efficiently.
- **Modern Tech Stack**:
  - **Next.js 15 App Router**: React Server Components (RSC) for blazing fast initial load.
  - **Drizzle ORM & Postgres**: Type-safe database operations.
  - **Tailwind CSS 4**: Next-gen utility-first CSS engine.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL Database

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure Environment
cp .env.example .env
# Edit .env with your POSTGRES_URL, AUTH_SECRET, etc.

# 3. Database Migration
npm run db:push

# 4. Seed Initial Data (Optional)
npm run seed

# 5. Start Development Server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see it in action.

## ⌨️ Keyboard Shortcuts

| Shortcut  | Function            |
| :-------- | :------------------ |
| `j` / `↓` | Move selection down |
| `k` / `↑` | Move selection up   |
| `h` / `←` | Previous Branch     |
| `l` / `→` | Next Branch         |
| `Enter`   | Open selected link  |
| `/`       | Focus search box    |
| `Esc`     | Exit search / Close |
| `?`       | Show help           |
| `CMD+K`   | Fast commands       |

## 📁 Project Structure (App Router)

```
.
├── src/
│   ├── app/                # App Router Pages
│   │   ├── admin/          # Admin Dashboard (CRUD)
│   │   ├── api/            # API Routes (Auth, etc)
│   │   ├── login/          # Login Page
│   │   ├── actions.ts      # Server Actions (Business Logic)
│   │   ├── layout.tsx      # Root Layout
│   │   └── page.tsx        # Homepage (SSR)
│   ├── components/         # React Components
│   │   ├── admin/          # Admin-specific components
│   │   ├── ui/             # Shared UI components
│   │   └── ...
│   ├── db/                 # Database Layer
│   │   ├── schema.ts       # Drizzle Schemas
│   │   └── index.ts        # DB Connection
│   ├── auth.ts             # NextAuth Configuration
│   └── middleware.ts       # Route Protection Middleware
└── public/                 # Static Assets
```

## 📝 Tech Stack Details

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: PostgreSQL (via [Vercel Postgres](https://vercel.com/postgres) or local)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [NextAuth.js v5](https://authjs.dev/) (Beta)
- **Deployment**: Vercel / Docker

## 📄 License

MIT

## 📮 Contributing

Pull requests and issues are welcome!
GitHub: [FruitsAI/Cherry](https://github.com/FruitsAI/Cherry)
