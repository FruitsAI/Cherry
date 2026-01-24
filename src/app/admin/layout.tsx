/**
 * 🍒 Cherry - Admin 后台布局
 *
 * 管理后台的共享布局组件，包含侧边栏导航和主内容区域。
 * 实现了权限验证，只允许 admin 角色访问。
 *
 * @file src/app/admin/layout.tsx
 *
 * @description
 * 功能：
 * - 身份验证检查（未登录重定向到 /login）
 * - 角色权限检查（非 admin 重定向到首页）
 * - 渲染 AdminHeader 和 AdminSidebar
 * - Cyberpunk 风格的背景效果
 */

import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import pkg from "../../../package.json";

/** Admin 后台 SEO 元数据 */
export const metadata: Metadata = {
  title: "Cherry Admin // CONTROL_PANEL",
  description: "Cherry System Administration Console",
};

/**
 * Admin 布局组件 (Async Server Component)
 *
 * @description
 * 在服务端执行身份验证和权限检查，
 * 确保只有已登录的管理员可以访问后台页面。
 *
 * @param props.children - 子路由页面内容
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 获取当前会话
  const session = await auth();

  // 未登录：重定向到登录页
  if (!session?.user) {
    redirect("/login");
  }

  // 权限检查：非管理员重定向到首页（双重保险，middleware 也会检查）
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[var(--cherry-bg)] bg-grid-simple text-[var(--cherry-text)] font-sans selection:bg-[var(--cherry-red)] selection:text-white overflow-hidden flex flex-col">
      <div className="bg-noise"></div>
      
      <div className="z-10 relative flex flex-col h-screen">
        <AdminHeader version={pkg.version} />
        
        <div className="flex flex-1 overflow-hidden p-4 gap-4">
          <aside className="w-64 pt-2 pb-6 px-1 flex-shrink-0">
             <div className="h-full cyber-card pixel-corners-sm p-4 backdrop-blur-md bg-[var(--cherry-bg-secondary)]/80 border-[var(--cherry-muted)]/30">
                <AdminSidebar />
             </div>
          </aside>
          
          <main className="flex-1 !overflow-y-auto cyber-card pixel-corners bg-[var(--cherry-bg-secondary)]/60 border-[var(--cherry-green)]/20 relative">
            {/* Inner frame decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--cherry-green)] to-transparent opacity-20"></div>
            
            <div className="p-8 pb-20">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
