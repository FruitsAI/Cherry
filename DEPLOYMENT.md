# 部署检查清单 (Deployment Checklist) v2.0.0

## 1. 环境变量配置 (Environment Variables)

确保在部署平台 (Vercel) 或本地 `.env` 文件中配置以下变量：

- `POSTGRES_URL`: 完整数据库连接字符串 (Vercel Postgres)
- `POSTGRES_PRISMA_URL`: (可选) 如果涉及连接池
- `POSTGRES_URL_NON_POOLING`: (可选) 直接连接字符串
- `NEXTAUTH_SECRET`: 用于加密会话的随机字符串 (生产环境必须设置)
  - 生成命令: `openssl rand -base64 32`
- `NEXTAUTH_URL`: 生产环境部署 URL (例如 `https://your-project.vercel.app`)

## 2. 数据库准备 (Database)

### 首次部署

1. **创建数据库**: 在 Vercel Dashboard 中添加 Storage -> Postgres。
2. **推送 Schema**:
   ```bash
   npx drizzle-kit push
   ```
3. **初始化数据 (Seed)**:
   ```bash
   npx tsx scripts/seed.ts
   ```
   > **注意**: 此脚本会创建默认管理员账号并哈希密码。

### 数据库迁移

- 如果修改了 `schema.ts`，需运行 `npx drizzle-kit push` 同步变更。

## 3. 构建与部署 (Build & Deploy)

1. **安装依赖**:
   ```bash
   npm install
   ```
2. **构建检查**:
   ```bash
   npm run build
   ```

   - 确保无 TypeScript 错误
   - 确保无 ESLint 错误
   - 确保 Server Components 构建成功
3. **部署**:
   - 推送代码至 GitHub (Vercel 会自动触发构建)。

## 4. 验证清单 (Verification)

- [ ] **首页加载**: 访问 `/`，确认数据从数据库正常加载（非骨架屏或空状态）。
- [ ] **登录功能**: 访问 `/login`，使用种子账号 `willxue` / `password123` 登录。
- [ ] **管理后台**: 登录后跳转至 `/admin`，确认仪表盘数据显示正常。
- [ ] **CRUD 测试**:
  - [ ] 新增一个其实链接，确认首页即时可见。
  - [ ] 编辑该链接，确认首页内容更新。
  - [ ] 删除该链接，确认首页该链接消失。
- [ ] **持久化测试**: 刷新页面，确认登录状态保持 (Session)。
- [ ] **安全测试**: 在未登录状态下访问 `/admin`，确认重定向回 `/login`。

## 5. 常规维护

- **日志监控**: 查看 Vercel Logs 监控 Server Actions 的执行情况。
- **备份**: 定期备份 Postgres 数据。
