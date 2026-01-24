/**
 * 🍒 Cherry - Admin 仪表盘页面
 *
 * 管理后台的主页面 (Dashboard)，显示系统状态和数据统计。
 * 包含链接管理和配置管理两个核心功能模块。
 *
 * @file src/app/admin/page.tsx
 *
 * @description
 * 模块：
 * - AdminStats: 统计卡片（总链接数、总访问量、分支数）
 * - AdminLinkManager: 链接 CRUD 管理
 * - AdminConfigSection: 站点配置管理
 */

import { Suspense } from 'react';
import { getAdminData } from "../actions";
import { AdminHeader } from "../../components/admin/admin-header";
import { LinkManager } from "../../components/admin/link-manager";
import { ConfigManager } from "../../components/admin/config-manager";
import { RiLinksLine, RiEyeLine, RiGitBranchLine } from "@remixicon/react";

/**
 * 统计卡片组件 (Async Server Component)
 *
 * @param props.data - 管理后台数据（分支和提交）
 * @description
 * 显示三个统计卡片：
 * - 总链接数 (TOTAL_LINKS)
 * - 总访问量 (TOTAL_VISITS)
 * - 总分支数 (TOTAL_BRANCHES)
 * 每个卡片包含模拟的迷你图表 (Sparkline)
 */
async function AdminStats({ data }: { data: any }) {
  const totalLinks = data.commits.length;
  const totalVisits = data.commits.reduce((sum: number, c: any) => sum + (c.visitCount || 0), 0);
  const mostActiveBranch = data.branches.length > 0 ? data.branches[0].name : 'N/A';

  // --- Mock Sparkline Data (CSS based visualization) ---
  // In a real app, this would come from historical data
  const renderSparkline = (color: string) => (
    <div className="h-8 flex items-end gap-[2px] opacity-70 mt-2">
      {[40, 60, 45, 70, 50, 80, 65, 90, 75, 100].map((h, i) => (
        <div 
          key={i} 
          className={`w-1 rounded-sm ${color}`} 
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stat Card 1: Links */}
      <div className="bg-[var(--card-bg)] border border-[var(--cherry-green)]/30 p-5 rounded relative overflow-hidden group hover:border-[var(--cherry-green)] transition-colors">
         <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <RiLinksLine className="text-6xl text-[var(--cherry-green)] w-16 h-16" />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1 text-[var(--cherry-green)] text-xs font-pixel tracking-wider">
               <span className="w-2 h-2 bg-[var(--cherry-green)] inline-block animate-pulse"></span>
               TOTAL_LINKS
            </div>
            <div className="font-pixel text-4xl text-[var(--cherry-text)] text-glow-green">{totalLinks}</div>
            {renderSparkline('bg-[var(--cherry-green)]')}
         </div>
      </div>
      
      {/* Stat Card 2: Visits */}
      <div className="bg-[var(--card-bg)] border border-[var(--cherry-red)]/30 p-5 rounded relative overflow-hidden group hover:border-[var(--cherry-red)] transition-colors">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <RiEyeLine className="text-6xl text-[var(--cherry-red)] w-16 h-16" />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1 text-[var(--cherry-red)] text-xs font-pixel tracking-wider">
               <span className="w-2 h-2 bg-[var(--cherry-red)] inline-block animate-pulse"></span>
               TOTAL_VISITS
            </div>
            <div className="font-pixel text-4xl text-[var(--cherry-text)] text-glow-red">{totalVisits}</div>
            {renderSparkline('bg-[var(--cherry-red)]')}
         </div>
      </div>

      {/* Stat Card 3: Total Branches */}
      <div className="bg-[var(--card-bg)] border border-[var(--cherry-amber)]/30 p-5 rounded relative overflow-hidden group hover:border-[var(--cherry-amber)] transition-colors">
         <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <RiGitBranchLine className="text-6xl text-[var(--cherry-amber)] w-16 h-16" />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1 text-[var(--cherry-amber)] text-xs font-pixel tracking-wider">
               <span className="w-2 h-2 bg-[var(--cherry-amber)] inline-block animate-pulse"></span>
               TOTAL_BRANCHES
            </div>
            <div className="font-pixel text-4xl text-[var(--cherry-text)] text-glow-amber">{data.branches.length}</div>
            {renderSparkline('bg-[var(--cherry-amber)]')}
         </div>
      </div>
    </div>
  );
}

function AdminLinkManager({ data }: { data: any }) {
  return <LinkManager initialBranches={data.branches} initialCommits={data.commits} />;
}

function AdminConfigSection({ data }: { data: any }) {
  return <ConfigManager data={data} />;
}

export default async function AdminPage() {
  const data = await getAdminData();

  return (
    <div className="space-y-8">
      {/* System Status Log Panel */}
      <div className="terminal-card border-[var(--cherry-green)] glow-green p-0 overflow-hidden flex flex-col md:flex-row">
        <div className="p-6 flex-1 bg-[var(--cherry-bg-secondary)]/50">
           <h2 className="font-pixel text-2xl text-[var(--cherry-green)] mb-2 flex items-center gap-2">
             <span className="animate-blink">_</span> SYSTEM_STATUS: OPERATIONAL
           </h2>
           <p className="font-code text-[var(--cherry-text)] text-sm opacity-80 max-w-xl">
             Welcome back, Administrator. Core systems are running at optimal efficiency. Security protocols active.
           </p>
        </div>
        
        {/* Mock System Log Stream */}
        <div className="bg-[var(--cherry-bg-secondary)]/80 p-4 w-full md:w-1/3 border-t md:border-t-0 md:border-l border-[var(--cherry-green)]/30 font-code text-[10px] text-[var(--cherry-green)] opacity-70 overflow-hidden h-32 md:h-auto">
           <div className="space-y-1">
              <div>[00:00:01] boot_sequence_init... OK</div>
              <div>[00:00:02] verify_integrity... OK</div>
              <div>[00:00:02] loading_assets_v2... DONE</div>
              <div>[00:00:03] connect_db_pool... ESTABLISHED</div>
              <div className="animate-pulse">[NOW] system_idle // waiting_for_input</div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <AdminStats data={data} />

      {/* Main Content Area - Split View */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Link Manager (2/3 width) */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--cherry-red)]/30 pb-2 mb-4">
             <h3 className="font-pixel text-xl text-[var(--cherry-text)] flex items-center gap-2">
               <span className="w-2 h-2 bg-[var(--cherry-red)]"></span>
               DATABASE_ENTRIES
             </h3>
             <div className="text-[10px] font-code text-[var(--cherry-red)]">READ_WRITE_ACCESS</div>
          </div>
          
          <AdminLinkManager data={data} />
        </div>

        {/* Right Column: Config (1/3 width) */}
        <div className="space-y-4">
           <div className="flex items-center justify-between border-b border-[var(--cherry-amber)]/30 pb-2 mb-4">
             <h3 className="font-pixel text-xl text-[var(--cherry-text)] flex items-center gap-2">
               <span className="w-2 h-2 bg-[var(--cherry-amber)]"></span>
               SYS_CONFIG
             </h3>
             <div className="text-[10px] font-code text-[var(--cherry-amber)]">RESTRICTED</div>
          </div>
          
          <AdminConfigSection data={data} />
        </div>

      </div>
    </div>
  );
}
