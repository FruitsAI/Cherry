/**
 * 🍒 Cherry Admin - 侧边栏导航组件
 *
 * 管理后台左侧固定的导航菜单。
 * 提供 Dashboard、Branches、Settings 三个主要入口。
 *
 * @file src/components/admin/sidebar.tsx
 *
 * @description
 * 使用 usePathname 判断当前路由，
 * 为活跃的导航项添加高亮样式。
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconDisplay } from "../ui/icon-display";
import { RiHomeLine, RiGitBranchLine, RiSettings3Line, RiLockPasswordLine } from "@remixicon/react";

/**
 * 后台侧边栏组件
 *
 * @description
 * 渲染固定在左侧的导航菜单，
 * 响应式设计（移动端隐藏）。
 */
export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <RiHomeLine className="text-xl" />
    },
    {
      title: "Branches",
      href: "/admin/branches",
      icon: <RiGitBranchLine className="text-xl" />
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <RiSettings3Line className="text-xl" />
    },
    {
      title: "Password",
      href: "/admin/password",
      icon: <RiLockPasswordLine className="text-xl" />
    }
  ];

  return (
    <aside className="w-64 border-r border-[var(--cherry-green)]/30 bg-[var(--cherry-bg-secondary)]/50 backdrop-blur-sm hidden md:block min-h-[calc(100vh-64px)]">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded transition-all font-pixel text-lg ${
                isActive 
                  ? "bg-[var(--cherry-red)]/10 text-[var(--cherry-red)] border border-[var(--cherry-red)]/50 shadow-[0_0_10px_rgba(255,0,0,0.2)]" 
                  : "text-[var(--cherry-muted)] hover:text-[var(--cherry-green)] hover:bg-[var(--cherry-green)]/5"
              }`}
            >
              <div className={isActive ? "text-[var(--cherry-red)]" : "text-[var(--cherry-muted)] group-hover:text-[var(--cherry-green)]"}>
                {item.icon}
              </div>
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
