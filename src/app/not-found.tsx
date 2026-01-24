/**
 * 🍒 Cherry - 404 页面 (Not Found)
 *
 * Next.js App Router 的自定义 404 错误页面。
 * 当用户访问不存在的路由时显示此页面。
 *
 * @file src/app/not-found.tsx
 *
 * @description
 * - 这是一个 Server Component
 * - 可以通过 notFound() 函数手动触发
 * - 使用终端风格的 UI 保持设计一致性
 */

import Link from 'next/link';

/**
 * 404 Not Found 页面组件
 *
 * @description
 * 显示终端风格的 404 错误信息，并提供返回首页的链接。
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1b26] p-4 text-[#a9b1d6] font-mono">
      <div className="w-full max-w-md space-y-6">
        <div className="border border-[#414868] bg-[#16161e] p-6 shadow-2xl relative overflow-hidden">
            {/* 扫描线效果 */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
            
          {/* macOS 风格窗口标题栏 */}
          <div className="flex items-center gap-2 mb-4 border-b border-[#414868] pb-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-xs text-[#565f89]">system_error.log</span>
          </div>

          <div className="space-y-4 font-mono text-sm sm:text-base relative z-20">
            {/* 404 错误代码 */}
            <p className="text-[#f7768e] font-bold text-xl">
              &gt; ERROR 404: RESOURCE_NOT_FOUND
            </p>
            {/* 错误说明 */}
            <p>
              The requested URL was not found on this server. The link you followed may be broken, or the page may have been removed.
            </p>
            {/* 常见原因列表 */}
            <div className="pl-4 border-l-2 border-[#414868] space-y-1 text-[#7aa2f7]">
              <p>Common causes:</p>
              <p>- Typo in URL</p>
              <p>- Outdated bookmark</p>
              <p>- Moved content</p>
            </div>
            
            {/* 返回首页按钮 */}
            <div className="pt-4">
               <p className="mb-2 text-[#9ece6a]">&gt; Recommended action:</p>
               <Link 
                href="/"
                className="inline-block bg-[#7aa2f7] text-[#1a1b26] px-4 py-2 font-bold hover:bg-[#2ac3de] transition-colors"
              >
                RETURN_TO_HOME
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

