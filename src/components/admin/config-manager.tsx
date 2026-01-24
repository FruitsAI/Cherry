/**
 * 🍒 Cherry Admin - 配置管理组件
 *
 * 管理后台的系统配置面板。
 * 提供数据库导出/导入功能。
 *
 * @file src/components/admin/config-manager.tsx
 *
 * @description
 * 功能：
 * - 导出数据库：将当前数据导出为 JSON 文件
 * - 导入/恢复：从 JSON 文件恢复数据（会覆盖现有数据）
 *
 * 警告：导入操作会清空并重建所有数据！
 */
"use client";

import { useState } from "react";
import { importConfig } from "../../app/actions";
import { useRouter } from "next/navigation";
import { RiSettings3Line, RiDownloadLine, RiUploadLine } from "@remixicon/react";

/** ConfigManager 组件 Props */
interface ConfigManagerProps {
  /** 管理后台完整数据 */
  data: any;
}

/**
 * 配置管理组件
 *
 * @description
 * 渲染导出/导入按钮和状态消息。
 */
export function ConfigManager({ data }: ConfigManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleExport = () => {
    // ... existing export logic ...
    try {
      // Reconstruct the export format expected by legacy/import
      // data from admin page is { branches: [], commits: [] }
      // We need to map it to { theme: '...', data: { site_config: ..., branches: [...] } }
      // But wait, the AdminPage data (getAdminData) returns flat { branches, commits }.
      // The importConfig expects { data: { branches: [ { ..., commits: [] } ], site_config } }
      
      // We need to reconstruct the nested structure for export to be compatible with import.
      const nestedBranches = data.branches.map((b: any) => ({
        ...b,
        commits: data.commits.filter((c: any) => c.branchId === b.id)
      }));

      const config = {
        theme: localStorage.getItem('cherry-theme') || 'dark', // Best effort
        data: {
            ...data,
            branches: nestedBranches
        }, 
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cherry-server-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Export successful' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Export failed:', err);
      setMessage({ type: 'error', text: 'Export failed' });
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsLoading(true);
      setMessage(null);

      try {
        const text = await file.text();
        const config = JSON.parse(text);

        const result = await importConfig(config);
        
        if (result.success) {
           setMessage({ type: 'success', text: 'Import successful. Reloading...' });
           router.refresh();
           setTimeout(() => {
             window.location.reload();
           }, 1500);
        }
      } catch (err) {
        console.error('Import failed:', err);
        setMessage({ type: 'error', text: 'Import failed: ' + (err as Error).message });
        setIsLoading(false);
      }
    };

    input.click();
  };

  return (
    <div className="terminal-card border-[var(--cherry-green)]/30 p-6">
       <h3 className="font-pixel text-lg text-[var(--cherry-green)] mb-4 flex items-center gap-2">
         <RiSettings3Line className="text-xl" />
         SYSTEM CONFIGURATION
       </h3>
       
       <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="flex-1 button-retro px-4 py-3 bg-[var(--cherry-green)]/10 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] font-code text-sm flex items-center justify-center gap-2 hover:bg-[var(--cherry-green)]/20 transition-all"
          >
            <RiDownloadLine className="w-5 h-5" /> 
            EXPORT DATABASE
          </button>
          
          <button
             onClick={handleImport}
             disabled={isLoading}
             className="flex-1 button-retro px-4 py-3 bg-[var(--cherry-red)]/10 border border-[var(--cherry-red)]/30 rounded text-[var(--cherry-red)] font-code text-sm flex items-center justify-center gap-2 hover:bg-[var(--cherry-red)]/20 transition-all"
          >
            {isLoading ? (
                <span className="animate-pulse">PROCESS...</span>
            ) : (
                <>
                 <RiUploadLine className="w-5 h-5" /> 
                 IMPORT / RESTORE
                </>
            )}
          </button>
       </div>

       {message && (
        <div className={`mt-4 p-3 rounded text-sm font-code text-center ${
            message.type === 'success' 
            ? 'bg-[var(--cherry-green)]/10 text-[var(--cherry-green)] border border-[var(--cherry-green)]/20' 
            : 'bg-[var(--cherry-red)]/10 text-[var(--cherry-red)] border border-[var(--cherry-red)]/20'
        }`}>
            {message.type === 'success' ? '✅ ' : '❌ '} {message.text}
        </div>
       )}
       
       <p className="mt-4 text-xs text-[var(--cherry-muted)] font-code text-center">
         Warning: Import will overwrite all existing data (branches & links). Export contains full database backup.
       </p>
    </div>
  );
}
