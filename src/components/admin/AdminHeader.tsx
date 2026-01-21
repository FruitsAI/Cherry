"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { IconDisplay } from "../ui/IconDisplay";

export function AdminHeader({ version = "v0.0" }: { version?: string }) {
  return (
    <header className="border-b border-[var(--cherry-green)]/30 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <IconDisplay icon="pixels/cherry.svg" className="text-2xl" imageClassName="w-8 h-8" />
            <h1 className="font-pixel text-2xl text-[var(--cherry-red)] glow-red group-hover:scale-105 transition-transform">
              CHERRY ADMIN
            </h1>
          </Link>
          <span className="font-code text-xs text-[var(--cherry-muted)] px-2 py-1 border border-[var(--cherry-muted)] rounded">
            v{version}
          </span>
        </div>

        <div className="flex items-center gap-4 font-code text-sm">
          <div className="text-[var(--cherry-green)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--cherry-green)] animate-pulse" />
            System Online
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-3 py-1.5 border border-[var(--cherry-red)]/50 text-[var(--cherry-red)] rounded hover:bg-[var(--cherry-red)] hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
