#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# 🍒 Cherry - 静态构建脚本
# ═══════════════════════════════════════════════════════════════════════════════
#
# 用途：
#   将 Cherry 构建为纯静态网站，用于 GitHub Pages 等静态托管平台的部署。
#
# 工作原理：
#   Next.js 的 `output: export` 模式要求所有页面都能在构建时静态生成。
#   但 Cherry 项目包含需要数据库的动态路由（如 /admin、/api）。
#   本脚本通过临时移除这些不兼容的目录和文件，确保静态构建成功。
#
# 执行流程：
#   1. 备份并移除不兼容静态导出的目录和文件
#   2. 替换数据源文件为静态版本（从 JSON 读取而非数据库）
#   3. 执行 `next build` 生成静态 HTML
#   4. 自动恢复所有被移除/替换的文件（通过 trap 确保即使构建失败也会恢复）
#
# 使用方法：
#   chmod +x scripts/build-static.sh
#   ./scripts/build-static.sh
#   # 或直接使用 npm 脚本
#   npm run build:static
#
# 输出目录：
#   ./out/  (可直接部署的静态文件)
#
# ═══════════════════════════════════════════════════════════════════════════════

# 遇到错误立即退出，确保构建失败时不会继续执行
set -e

echo "🍒 Cherry Static Build"
echo "======================"

# ─────────────────────────────────────────────────────────────────────────────
# 配置：需要临时排除的目录和文件
# ─────────────────────────────────────────────────────────────────────────────

# 需要临时排除的目录（这些目录依赖数据库或服务端功能，静态模式不兼容）
EXCLUDE_DIRS=(
  "src/app/api"            # API 路由（需要服务端）
  "src/app/admin"          # 后台管理页面（需要身份验证）
  "src/app/login"          # 登录页（需要 NextAuth）
  "src/components/admin"   # 后台专用组件
  "src/db"                 # 数据库连接层（Drizzle ORM）
  "scripts"                # 构建脚本本身（避免循环）
)

# 需要临时排除的文件
EXCLUDE_FILES=(
  "src/app/actions.ts"     # Server Actions
  "src/auth.ts"            # NextAuth 配置
  "src/middleware.ts"      # 路由中间件
  "drizzle.config.ts"      # Drizzle 配置
)

# ─────────────────────────────────────────────────────────────────────────────
# 配置：需要替换的文件（动态版本 -> 静态版本）
# ─────────────────────────────────────────────────────────────────────────────

# 数据源文件：将动态数据库查询替换为静态 JSON 读取
DATA_SOURCE_ORIGINAL="src/lib/data-source.ts"
DATA_SOURCE_STATIC="src/lib/data-source.static.ts"

# 首页组件：移除服务端搜索参数等动态功能
PAGE_ORIGINAL="src/app/page.tsx"
PAGE_STATIC="src/app/page.static.tsx"

# 备份目录（临时存放被移除的文件）
BACKUP_DIR=".static-build-backup"

# ─────────────────────────────────────────────────────────────────────────────
# cleanup 函数：恢复被移除/替换的目录和文件
# 使用 trap 注册，确保脚本退出时（无论成功或失败）都会执行
# ─────────────────────────────────────────────────────────────────────────────
cleanup() {
  echo ""
  echo "🔄 Restoring excluded items..."
  
  # 恢复 data-source.ts（将备份的原版本移回）
  if [ -f "$BACKUP_DIR/$DATA_SOURCE_ORIGINAL" ]; then
    mv "$BACKUP_DIR/$DATA_SOURCE_ORIGINAL" "$DATA_SOURCE_ORIGINAL"
    echo "   ✓ Restored: $DATA_SOURCE_ORIGINAL"
  fi
  
  # 恢复 page.tsx
  if [ -f "$BACKUP_DIR/$PAGE_ORIGINAL" ]; then
    mv "$BACKUP_DIR/$PAGE_ORIGINAL" "$PAGE_ORIGINAL"
    echo "   ✓ Restored: $PAGE_ORIGINAL"
  fi
  
  # 恢复目录
  for dir in "${EXCLUDE_DIRS[@]}"; do
    backup_path="$BACKUP_DIR/$dir"
    if [ -d "$backup_path" ]; then
      mkdir -p "$(dirname "$dir")"
      mv "$backup_path" "$dir"
      echo "   ✓ Restored dir: $dir"
    fi
  done
  
  # 恢复文件
  for file in "${EXCLUDE_FILES[@]}"; do
    backup_path="$BACKUP_DIR/$file"
    if [ -f "$backup_path" ]; then
      mkdir -p "$(dirname "$file")"
      mv "$backup_path" "$file"
      echo "   ✓ Restored file: $file"
    fi
  done
  
  # 删除备份目录（清理临时文件）
  if [ -d "$BACKUP_DIR" ]; then
    rm -rf "$BACKUP_DIR"
  fi
  echo "✅ Cleanup complete"
}

# 注册 EXIT 信号处理器：无论脚本如何退出都会执行 cleanup
trap cleanup EXIT

# ═══════════════════════════════════════════════════════════════════════════════
# 第一步：备份并移除不兼容的项目
# ═══════════════════════════════════════════════════════════════════════════════
echo ""
echo "📦 Preparing for static build..."
mkdir -p "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR/src/lib"
mkdir -p "$BACKUP_DIR/src/app"

# 替换 data-source.ts 为静态版本
# 静态版本直接从 JSON 读取数据，不依赖数据库连接
if [ -f "$DATA_SOURCE_ORIGINAL" ] && [ -f "$DATA_SOURCE_STATIC" ]; then
  mv "$DATA_SOURCE_ORIGINAL" "$BACKUP_DIR/$DATA_SOURCE_ORIGINAL"
  cp "$DATA_SOURCE_STATIC" "$DATA_SOURCE_ORIGINAL"
  echo "   ✓ Replaced: $DATA_SOURCE_ORIGINAL with static version"
fi

# 替换 page.tsx 为静态版本
# 静态版本移除了对 searchParams 的动态依赖
if [ -f "$PAGE_ORIGINAL" ] && [ -f "$PAGE_STATIC" ]; then
  mv "$PAGE_ORIGINAL" "$BACKUP_DIR/$PAGE_ORIGINAL"
  cp "$PAGE_STATIC" "$PAGE_ORIGINAL"
  echo "   ✓ Replaced: $PAGE_ORIGINAL with static version"
fi

# 排除目录：移动到备份位置
for dir in "${EXCLUDE_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    backup_path="$BACKUP_DIR/$dir"
    mkdir -p "$(dirname "$backup_path")"
    mv "$dir" "$backup_path"
    echo "   ✓ Excluded dir: $dir"
  fi
done

# 排除文件：移动到备份位置
for file in "${EXCLUDE_FILES[@]}"; do
  if [ -f "$file" ]; then
    backup_path="$BACKUP_DIR/$file"
    mkdir -p "$(dirname "$backup_path")"
    mv "$file" "$backup_path"
    echo "   ✓ Excluded file: $file"
  fi
done

# ═══════════════════════════════════════════════════════════════════════════════
# 第二步：执行静态构建
# ═══════════════════════════════════════════════════════════════════════════════
echo ""
echo "🔨 Building static site..."

# 设置 STATIC_MODE=true 触发 next.config.mjs 中的静态导出配置
# - output: 'export' - 生成纯静态 HTML
# - images.unoptimized: true - 禁用图片优化（静态模式必需）
# - trailingSlash: true - 添加尾部斜杠（GitHub Pages 兼容）
STATIC_MODE=true npm run build

# ═══════════════════════════════════════════════════════════════════════════════
# 第三步：构建成功信息
# ═══════════════════════════════════════════════════════════════════════════════
echo ""
echo "🎉 Static build completed!"
echo "   Output directory: ./out"
echo ""
echo "📋 Generated pages:"
ls -la out/ 2>/dev/null || echo "   (check ./out directory)"

# cleanup 函数会在脚本退出时自动执行（通过 trap 注册）

