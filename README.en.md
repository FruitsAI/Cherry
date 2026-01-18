<div align="center">
  <img src="public/cherry.svg" width="160" alt="Cherry Logo" />
  <h1>Cherry</h1>
  
  <p>
    <strong>Cherry-pick the web.</strong>
  </p>
  
  <p>A retro terminal-style browser start page exclusively for programmers.</p>

  <p>
    <a href="./LICENSE">
      <img src="https://img.shields.io/github/license/FruitsAI/Cherry?style=flat-square&color=2ecc71" alt="License" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript&color=3178c6" alt="TypeScript" />
    </a>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/Framework-React-cyan?style=flat-square&logo=react&color=61dafb" alt="React" />
    </a>
    <a href="https://vitejs.dev/">
      <img src="https://img.shields.io/badge/Bundler-Vite-purple?style=flat-square&logo=vite&color=646cff" alt="Vite" />
    </a>
  </p>

  <p>
    <span>English</span> | <a href="./README.md">简体中文</a>
  </p>
</div>

---

## ✨ Features

### Core Features

- **CRT Monitor Effects**: Retro terminal effects like scanlines, glow, and flicker.
- **Vim-style Navigation**: `j/k` to move up/down, `h/l` to switch branches, `Enter` to open links.
- **Command Line Search**: Supports pseudo-commands like `help`, `ls`, `go <n>`, `g <query>`.
- **Git Workflow Metaphor**: Categories are called Branches, links are called Commits.
- **Pixel Art Style**: VT323 pixel font + Fira Code monospace font.
- **Responsive Layout**: Adapted for both desktop and mobile.

### Advanced Features

- **Statistics**: Visit statistics, top links, history, command usage.
- **Favorites**: Mark frequently used links for quick access.
- **Tag Filtering**: Filter by clicking tags, support multiple tags.
- **Search Suggestions**: Matches as you type, Tab to select.
- **Shortcut Guide**: Shows shortcut guide on first visit.

### Technical Improvements

- **PWA Support**: Service Worker, offline access, add to home screen.
- **Performance**: Code splitting, lazy loading images, build caching.
- **Deployment**: GitHub Actions auto-deploy, version management, build info.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⌨️ Keyboard Shortcuts

| Shortcut  | Function                 |
| :-------- | :----------------------- |
| `j` / `↓` | Move selection down      |
| `k` / `↑` | Move selection up        |
| `h` / `←` | Previous Branch          |
| `l` / `→` | Next Branch              |
| `Enter`   | Open selected link       |
| `/`       | Focus search box         |
| `Esc`     | Exit search / Close help |
| `?`       | Show help                |
| `A`       | Add new link             |
| `S`       | Open settings            |
| `T`       | View statistics          |

## 💻 Commands

| Command     | Function              |
| :---------- | :-------------------- |
| `help`      | Show help information |
| `ls`        | List all Branches     |
| `go <n>`    | Go to link number n   |
| `g <query>` | Search with Google    |
| `clear`     | Clear command history |

## 📁 Project Structure

```
app/
├── public/
│   ├── cherry.svg           # Pixel art Cherry icon
│   ├── pixels/              # System icons
│   ├── manifest.json        # PWA configuration
│   └── sw.js                # Service Worker
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Status bar
│   │   ├── Hero.tsx         # Hero section
│   │   ├── CommandInput.tsx # Command input
│   │   ├── ContentGrid.tsx  # Branch/Content grid
│   │   ├── BranchSection.tsx # Branch section
│   │   ├── CommitCard.tsx   # Commit card
│   │   ├── HelpModal.tsx    # Help modal
│   │   ├── AddModal.tsx     # Add link modal
│   │   ├── SettingsModal.tsx # Settings modal
│   │   ├── KeyboardShortcutsModal.tsx # Shortcut guide
│   │   ├── StatisticsModal.tsx # Statistics modal
│   │   └── ThemeToggle.tsx  # Theme toggle
│   ├── hooks/               # Custom Hooks
│   │   ├── useKeyboardNavigation.ts
│   │   ├── useCommands.ts
│   │   └── useStatistics.ts
│   ├── types/               # TypeScript types
│   ├── data/
│   │   └── data.json        # Configuration data
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css            # Global styles + CRT effects
├── .github/workflows/
│   └── deploy.yml           # GitHub Pages deployment
└── vercel.json              # Vercel deployment config
```

## 🎨 Customization

Edit `src/data/data.json` to add your own links:

```json
{
  "site_config": {
    "user_name": "YourName",
    "theme": "dark_matrix",
    "slogan": "Cherry-pick the web"
  },
  "branches": [
    {
      "name": "feature/work",
      "icon": "💼",
      "commits": [
        {
          "message": "GitHub",
          "hash": "a1b2c3d",
          "url": "https://github.com",
          "tags": ["code"]
        }
      ]
    }
  ]
}
```

## 🚀 Deployment

### GitHub Pages

1. Push code to GitHub.
2. Enable GitHub Pages in repository settings.
3. Select GitHub Actions as the source.
4. Push to `main` branch to auto-deploy.

### Vercel

1. Import GitHub repository to Vercel.
2. Set root directory to `app` (if applicable) or project root.
3. Auto-detect Vite framework and deploy.

## 📝 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 7
- **Styling**: Tailwind CSS 4
- **Fonts**: VT323 + Fira Code
- **PWA**: Service Worker + Manifest

## 📄 License

MIT

## 📖 Documentation

- [Development Plan (TODO)](./TODO.md)
- [Changelog](./CHANGELOG.md)
- [PRD](./PRD.md)

## 🤝 Contribution

Issues and Pull Requests are welcome!

## 📮 Contact

- GitHub: [FruitsAI/Cherry](https://github.com/FruitsAI/Cherry)
