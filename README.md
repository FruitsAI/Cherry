# 🍒 Project Cherry

> **Cherry-pick the web.**

一个专属于程序员的复古终端风格浏览器起始页。

## ✨ 特性

- **CRT 显示器效果**: 扫描线、辉光、闪烁等复古终端特效
- **Vim 风格键盘导航**: `j/k` 上下移动，`h/l` 切换分支，`Enter` 打开链接
- **命令行搜索**: 支持 `help`、`ls`、`go <n>`、`g <query>` 等伪命令
- **Git 工作流隐喻**: 分类称为 Branches，链接称为 Commits
- **像素艺术风格**: VT323 像素字体 + Fira Code 等宽字体
- **响应式布局**: 适配桌面端和移动端

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

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

## 💻 命令

| 命令        | 功能              |
| ----------- | ----------------- |
| `help`      | 显示帮助信息      |
| `ls`        | 列出所有 Branches |
| `go <n>`    | 跳转到第 n 个链接 |
| `g <query>` | 使用 Google 搜索  |
| `clear`     | 清除命令历史      |

## 📁 项目结构

```
app/
├── public/
│   └── cherry.svg          # 像素风 Cherry 图标
├── src/
│   ├── components/         # React 组件
│   │   ├── Header.tsx      # 状态栏
│   │   ├── Hero.tsx        # Hero 区域
│   │   ├── CommandInput.tsx # 命令行输入
│   │   ├── ContentGrid.tsx # 内容网格
│   │   ├── BranchSection.tsx # Branch 区块
│   │   ├── CommitCard.tsx  # Commit 卡片
│   │   └── HelpModal.tsx   # 帮助弹窗
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useKeyboardNavigation.ts
│   │   └── useCommands.ts
│   ├── types/              # TypeScript 类型
│   ├── data/
│   │   └── data.json       # 配置数据
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css           # 全局样式 + CRT 特效
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages 部署
└── vercel.json             # Vercel 部署配置
```

## 🎨 自定义

编辑 `src/data/data.json` 来添加你自己的链接:

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

## 🚀 部署

### GitHub Pages

1. 推送代码到 GitHub
2. 在仓库设置中启用 GitHub Pages
3. 选择 GitHub Actions 作为源
4. 推送到 main 分支自动部署

### Vercel

1. 导入 GitHub 仓库到 Vercel
2. 设置根目录为 `app`
3. 自动检测 Vite 框架并部署

## 📝 技术栈

- **框架**: React 19 + TypeScript
- **构建**: Vite 7
- **样式**: Tailwind CSS 4
- **字体**: VT323 + Fira Code

## 📄 License

MIT
