# 部署检查清单 (Deployment Checklist) v2.1.0

Cherry 支持两种部署模式：

| 特性       | Vercel 动态部署 | GitHub Pages 静态部署 |
| ---------- | :-------------: | :-------------------: |
| Admin 后台 |       ✅        |          ❌           |
| OAuth 登录 |       ✅        |          ❌           |
| 数据源     |   PostgreSQL    |       JSON 文件       |
| 无服务器   |       ❌        |          ✅           |
| 适用场景   |    生产环境     |       个人展示        |

---

## 🌐 方式一：Vercel 动态部署

### 1. 环境变量配置

在 [Vercel Dashboard](https://vercel.com/) 或本地 `.env` 中配置：

| 变量                 | 说明                                                | 必需 |
| -------------------- | --------------------------------------------------- | :--: |
| `POSTGRES_URL`       | 数据库连接字符串                                    |  ✅  |
| `AUTH_SECRET`        | NextAuth 加密密钥 (生成: `openssl rand -base64 32`) |  ✅  |
| `AUTH_GITHUB_ID`     | GitHub OAuth App ID                                 |  🔸  |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Secret                                 |  🔸  |
| `AUTH_GOOGLE_ID`     | Google OAuth Client ID                              |  🔸  |
| `AUTH_GOOGLE_SECRET` | Google OAuth Secret                                 |  🔸  |

> 🔸 OAuth 配置为可选，至少配置一种登录方式

### 2. 数据库准备

**首次部署**:

```bash
# 1. 在 Vercel 创建 Postgres 数据库 (Storage → Postgres)
# 2. 推送 Schema
npx drizzle-kit push
# 3. 填充初始数据
npx tsx scripts/seed.ts
```

**Schema 变更**:

```bash
npx drizzle-kit push   # 修改 schema.ts 后需同步
```

### 3. 构建与部署

```bash
npm install
npm run build          # 构建检查
# 推送到 GitHub，Vercel 自动触发部署
```

### 4. 验证清单

- [ ] 访问 `/` 确认首页数据正常加载
- [ ] 访问 `/login` 测试登录功能
- [ ] 访问 `/admin` 测试后台管理
- [ ] 创建/编辑/删除链接，验证数据持久化
- [ ] 未登录访问 `/admin` 应重定向到 `/login`

---

## 📦 方式二：GitHub Pages 静态部署

### 1. 启用 GitHub Actions

仓库 Settings → Pages → Source → 选择 **GitHub Actions**

### 2. 配置数据

编辑 `src/data/data.json`：

```json
{
  "config": {
    "siteName": "Cherry",
    "slogan": "Cherry pick the web."
  },
  "categories": [
    {
      "id": "1",
      "name": "Tools",
      "slug": "tools",
      "order": 0
    }
  ],
  "links": [
    {
      "id": "1",
      "title": "GitHub",
      "url": "https://github.com",
      "categoryId": "1",
      "order": 0
    }
  ]
}
```

### 3. 自动部署

推送到 `main` 分支，GitHub Actions 会自动：

1. 使用 `STATIC_MODE=true` 构建静态站点
2. 部署到 GitHub Pages

### 4. 手动构建测试

```bash
npm run build:static   # 本地测试静态构建
npx serve out          # 预览静态站点
```

### 5. (可选) 从数据库导出数据

如果已有 Vercel 部署数据，可导出为 JSON：

```bash
# 设置环境变量
export POSTGRES_URL=your_connection_string

# 导出数据
npm run export-data
# 输出: src/data/data.json
```

---

## 🔧 常规维护

- **日志监控**: Vercel Logs 查看 Server Actions 执行情况
- **数据备份**: 定期导出 Postgres 数据或提交 data.json 变更
- **版本更新**: 通过 Git Tag 管理版本发布
