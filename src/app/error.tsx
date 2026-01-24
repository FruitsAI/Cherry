/**
 * 🍒 Cherry - 错误边界组件 (Error Boundary)
 *
 * Next.js App Router 的局部错误处理组件。
 * 当子页面发生运行时错误时，会渲染此组件替代崩溃的内容。
 *
 * @file src/app/error.tsx
 *
 * @description
 * - 必须是客户端组件 ('use client')
 * - 只捕获该路由段及其子段的错误
 * - 不捕获 layout.tsx 或 template.tsx 中的错误（需使用 global-error.tsx）
 * - 提供 reset 函数尝试恢复
 */
'use client';

import { useEffect } from 'react';

/**
 * 错误边界组件
 *
 * @param props.error - 捕获的错误对象
 * @param props.error.digest - 可选的错误摘要（用于服务端错误追踪）
 * @param props.reset - 重置函数，调用后尝试重新渲染出错的组件
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // 记录错误日志（在生产环境应发送到错误监控服务）
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    // 终端风格的错误显示界面
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1b26] p-4 text-[#a9b1d6] font-mono">
      <div className="w-full max-w-md space-y-6">
        <div className="border border-[#f7768e] bg-[#16161e] p-6 shadow-2xl relative overflow-hidden">
             {/* 扫描线效果：模拟 CRT 显示器 */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>

          {/* macOS 风格的窗口控制按钮 */}
          <div className="flex items-center gap-2 mb-4 border-b border-[#f7768e] pb-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-xs text-[#f7768e]">kernel_panic.dump</span>
          </div>

          <div className="space-y-4 font-mono text-sm sm:text-base relative z-20">
            {/* 错误标题 */}
            <p className="text-[#f7768e] font-bold text-xl">
              &gt; CRITICAL_ERROR: SYSTEM_FAILURE
            </p>
            {/* 错误说明 */}
            <p>
              An unexpected error has occurred. The system has automatically halted to prevent data corruption.
            </p>
            {/* 错误摘要（如果有） */}
            {error.digest && (
                <p className="text-xs text-[#565f89]">
                    Error Digest: {error.digest}
                </p>
            )}
            
            {/* 重试按钮 */}
            <div className="pt-4 flex gap-4">
              <button
                onClick={reset}
                className="bg-[#f7768e] text-[#1a1b26] px-4 py-2 font-bold hover:bg-[#ff9e64] transition-colors"
              >
                REBOOT_SYSTEM (RETRY)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

