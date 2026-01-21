"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconDisplay } from "../ui/IconDisplay";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "pixels/home.svg"
  },
  {
    title: "Categories",
    href: "/admin/branches",
    icon: "pixels/folder.svg"
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: "pixels/settings.svg"
  }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[var(--cherry-green)]/30 bg-black/20 backdrop-blur-sm hidden md:block min-h-[calc(100vh-64px)]">
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
              <IconDisplay 
                icon={item.icon} 
                className={`text-xl ${isActive ? "text-[var(--cherry-red)]" : "text-[var(--cherry-muted)] group-hover:text-[var(--cherry-green)]"}`} 
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
