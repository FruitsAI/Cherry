/**
 * 🍒 Cherry - Admin 加载组件
 *
 * 管理后台的流式加载 UI。
 * 在后台页面数据加载时显示终端风格的进度条。
 *
 * @file src/app/admin/loading.tsx
 *
 * @description
 * 使用 Cyberpunk 风格的终端卡片显示加载状态，
 * 包含扫描线效果和进度条动画。
 */

/**
 * Admin 加载组件
 *
 * @description
 * 显示模拟的系统初始化界面，
 * 包含 macOS 风格窗口控制按钮和动态进度条。
 */
export default function AdminLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-[var(--cherry-bg)]">
      <div className="terminal-card bg-[var(--cherry-bg-secondary)] p-8 border border-[var(--cherry-muted)]/50 shadow-2xl relative overflow-hidden">
        {/* 扫描线效果 */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_2px,3px_100%]"></div>
        
        <div className="flex flex-col items-center gap-6 relative z-20">
          <div className="flex gap-2 mb-2 w-full justify-start">
            <div className="h-3 w-3 rounded-full bg-[var(--cherry-red)]" />
            <div className="h-3 w-3 rounded-full bg-[var(--cherry-amber)]" />
            <div className="h-3 w-3 rounded-full bg-[var(--cherry-green)]" />
          </div>
          
          <div className="font-mono text-[var(--cherry-green)] text-lg typing-effect">
            &gt; SYSTEM_INITIALIZING...
          </div>
          
          <div className="w-64 h-2 bg-[var(--cherry-bg)] rounded-full overflow-hidden border border-[var(--cherry-muted)]/50">
            <div className="h-full bg-[var(--cherry-green)] animate-progress-bar"></div>
          </div>
          
          <div className="font-mono text-xs text-[var(--cherry-muted)]">
            verifying_integrity...
          </div>
        </div>
      </div>
    </div>
  );
}
