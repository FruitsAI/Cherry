/**
 * 🍒 Cherry - 全局加载组件 (Loading)
 *
 * Next.js App Router 的流式加载 UI。
 * 当页面正在加载时显示此组件。
 *
 * @file src/app/loading.tsx
 *
 * @description
 * - 自动用于该路由段的 Suspense fallback
 * - 支持即时加载状态（Instant Loading States）
 * - 使用双重旋转动画模拟终端风格的加载效果
 */

/**
 * 全局加载组件
 *
 * @description
 * 显示双重旋转的加载动画和脉冲文字，
 * 模拟终端启动序列的视觉效果。
 */
export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--cherry-bg)]">
      <div className="flex flex-col items-center gap-4">
        {/* 双重旋转加载动画 */}
        <div className="relative h-16 w-16">
          {/* 外圈：顺时针旋转，绿色 */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-[var(--cherry-green)]/30 border-t-[var(--cherry-green)]"></div>
          {/* 内圈：逆时针旋转，红色 */}
          <div className="absolute inset-2 animate-spin-reverse rounded-full border-4 border-[var(--cherry-red)]/30 border-b-[var(--cherry-red)]"></div>
        </div>
        {/* 脉冲加载文字 */}
        <div className="font-code text-sm text-[var(--cherry-green)] animate-pulse">
          LOADING...
        </div>
      </div>
    </div>
  );
}

