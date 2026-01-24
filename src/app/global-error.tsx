/**
 * 🍒 Cherry - 全局错误边界 (Global Error Boundary)
 *
 * Next.js App Router 的根级错误处理组件。
 * 当 root layout 本身发生错误时，会渲染此组件。
 *
 * @file src/app/global-error.tsx
 *
 * @description
 * - 必须定义自己的 <html> 和 <body> 标签（因为 root layout 已崩溃）
 * - 用于处理无法被普通 error.tsx 捕获的严重错误
 * - 通常在生产环境中很少触发，但提供最后的安全网
 */
'use client';
 
import { useEffect } from 'react';
 
/**
 * 全局错误边界组件
 *
 * @param props.error - 捕获的错误对象
 * @param props.reset - 重置函数，尝试重新渲染整个应用
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
    // 记录致命错误日志
    useEffect(() => {
        console.error(error);
      }, [error]);

  return (
    // 必须自己提供 html 和 body，因为 root layout 已经失效
    <html>
      <body className="bg-[#1a1b26] text-[#a9b1d6] font-mono">
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* 严重错误样式：纯红色边框表示最高级别警告 */}
                <div className="border border-[#ff0000] bg-[#000000] p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 border-b border-[#ff0000] pb-2">
                    <span className="text-xs text-[#ff0000]">FATAL_EXCEPTION</span>
                </div>

                <div className="space-y-4 font-mono text-sm sm:text-base">
                    {/* 故障效果标题 */}
                    <p className="text-[#ff0000] font-bold text-xl glich-effect">
                    &gt; GLOBAL_SYSTEM_MELTDOWN
                    </p>
                    <p>
                    A critical error occurred in the root layout. The entire system structure has been compromised.
                    </p>
                    
                    {/* 紧急重启按钮 */}
                    <div className="pt-4">
                    <button
                        onClick={() => reset()}
                        className="bg-[#ff0000] text-black px-4 py-2 font-bold hover:bg-[#ff4444] transition-colors w-full"
                    >
                        EMERGENCY_RESTART
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </body>
    </html>
  );
}

