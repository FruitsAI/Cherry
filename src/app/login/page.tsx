/**
 * 🍒 Cherry - 登录页面
 *
 * 系统访问终端 (System Access Terminal) 登录界面。
 * 支持用户名密码登录和 OAuth 第三方登录。
 *
 * @file src/app/login/page.tsx
 *
 * @description
 * 登录方式：
 * - Credentials: 用户名 + 密码
 * - OAuth: GitHub / Google
 *
 * 成功登录后重定向到 /admin 后台管理页面。
 */
"use client";

import { useActionState, useState } from "react";
// import { authenticate } from "@/app/lib/actions"; 
// For now, let's implement the form directly with server action calling signIn
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * 登录页面组件
 *
 * @description
 * 实现 Cyberpunk 终端风格的登录界面，包含：
 * - 用户名/密码表单
 * - OAuth 第三方登录按钮
 * - 错误状态显示
 * - 加载状态管理
 */
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  /**
   * 处理登录表单提交
   *
   * @param event - 表单提交事件
   * @description
   * 使用 NextAuth signIn 函数进行凭证验证，
   * 成功后跳转到 Admin 页面，失败显示错误信息。
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    // 提取表单数据
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      // 调用 NextAuth credentials 登录
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,  // 禁用自动重定向，手动处理
      });

      if (result?.error) {
        // 登录失败：显示终端风格的错误消息
        setError("ACCESS_DENIED: Invalid credentials.");
      } else {
        // 登录成功：跳转到管理后台
        router.push("/admin"); 
        router.refresh();  // 刷新服务端状态
      }
    } catch (e) {
      // 网络/系统错误
      setError("SYSTEM_FAILURE: Connection reset.");
    } finally {
      setIsPending(false);
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[var(--cherry-bg)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="bg-grid-perspective">
        <div className="grid-plane"></div>
      </div>
      <div className="bg-noise"></div>
      <div className="scanlines"></div>
      
      {/* Main Terminal Card */}
      <div className="cyber-card w-full max-w-md p-1 relative pixel-corners">
        {/* Terminal Header */}
        <div className="bg-[var(--cherry-bg-secondary)] border-b border-[var(--cherry-muted)] p-2 flex justify-between items-center select-none">
          <div className="flex gap-2 px-2">
            <div className="w-3 h-3 rounded-full bg-[var(--cherry-red)] shadow-[0_0_5px_var(--cherry-red)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--cherry-amber)] shadow-[0_0_5px_var(--cherry-amber)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--cherry-green)] shadow-[0_0_5px_var(--cherry-green)]"></div>
          </div>
          <div className="font-pixel text-[var(--cherry-muted)] text-sm tracking-widest">CHERRY_OS_v2.0</div>
        </div>

        <div className="p-8 space-y-8 bg-[var(--cherry-bg-secondary)]/90">
          {/* Logo / Title Area */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-pixel text-[var(--cherry-green)] text-glow-green glitch-text" data-text="SYSTEM ACCESS">
              SYSTEM ACCESS
            </h1>
            <p className="font-code text-xs text-[var(--cherry-muted)] animate-pulse">
              [ SECURE CONNECTION ESTABLISHED ]
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-code text-[var(--cherry-muted)] mb-1 group-focus-within:text-[var(--cherry-green)] transition-colors">
                  &gt; USER_ID
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  autoComplete="off"
                  className="input-cyber"
                  placeholder="enter_username..."
                />
              </div>
              
              <div className="group">
                <label className="block text-xs font-code text-[var(--cherry-muted)] mb-1 group-focus-within:text-[var(--cherry-green)] transition-colors">
                  &gt; ACCESS_KEY
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="input-cyber"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[var(--cherry-red)] text-sm border border-[var(--cherry-red)] bg-[var(--cherry-red)]/5 p-3 font-code animate-blink pixel-corners-sm">
                <span className="text-lg">⚠</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full btn-cyber btn-cyber-primary pixel-corners-sm"
            >
              {isPending ? (
                <span className="animate-pulse">AUTHENTICATING...</span>
              ) : (
                <span>INITIATE_SESSION</span>
              )}
            </button>
          </form>

          {/* Footer / Alt Login */}
          <div className="space-y-4 pt-4 border-t border-[var(--cherry-muted)]/30">
            <div className="text-center font-code text-[10px] text-[var(--cherry-muted)] uppercase tracking-wider">
              Alternative Protocols
            </div>
            
            <div className="grid grid-cols-2 gap-3 font-code text-sm">
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/admin" })}
                className="btn-cyber text-xs py-2 px-1 gap-2 border-[var(--cherry-muted)] text-[var(--cherry-muted)] hover:border-white hover:text-white"
              >
                GITHUB
              </button>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/admin" })}
                className="btn-cyber text-xs py-2 px-1 gap-2 border-[var(--cherry-muted)] text-[var(--cherry-muted)] hover:border-white hover:text-white"
              >
                GOOGLE
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative corner pieces */}
        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[var(--cherry-green)]"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[var(--cherry-green)]"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[var(--cherry-green)]"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[var(--cherry-green)]"></div>
      </div>

      <div className="absolute bottom-6 font-code text-[10px] text-[var(--cherry-muted)] opacity-50">
        CHERRY_SYSTEMS // SECURITY LEVEL 5
      </div>
    </main>
  );
}
