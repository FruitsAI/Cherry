import { useState } from 'react';
import type { CherryData } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CherryData;
  onAdd?: () => void;
  onStatistics?: () => void;
}

export function SettingsModal({ isOpen, onClose, data, onAdd, onStatistics }: SettingsModalProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 导出配置
  const handleExport = () => {
    try {
      const config = {
        theme: localStorage.getItem('cherry-theme') || 'dark',
        data: data,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cherry-config-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: '配置已导出！' });
    } catch (err) {
      console.error('Export failed:', err);
      setMessage({ type: 'error', text: '导出失败，请重试' });
    }
  };

  // 导入配置
  const handleImport = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();
          const config = JSON.parse(text);

          // 验证配置格式
          if (!config.data || !config.data.site_config || !config.data.branches) {
            throw new Error('无效的配置文件格式');
          }

          // 保存主题
          if (config.theme) {
            localStorage.setItem('cherry-theme', config.theme);
            // 触发主题更新
            window.location.reload();
          }

          setMessage({ type: 'success', text: '配置已导入！页面将重新加载...' });
          
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (err) {
          console.error('Import failed:', err);
          setMessage({ type: 'error', text: '导入失败：无效的配置文件' });
        }
      };

      input.click();
    } catch (err) {
      console.error('Import failed:', err);
      setMessage({ type: 'error', text: '导入失败，请重试' });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="terminal-card max-w-lg w-full mx-4 p-6 border-[var(--cherry-red)] flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h2 className="font-pixel text-2xl text-[var(--cherry-red)] glow-red">
            ⚙️ SETTINGS
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--cherry-muted)] hover:text-[var(--cherry-red)] transition-colors"
          >
            [ESC]
          </button>
        </div>

        {/* 设置选项 - 可滚动 */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {/* 当前主题 */}
          <div className="p-4 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded">
            <h3 className="font-code text-sm text-[var(--cherry-amber)] mb-2">
              当前主题
            </h3>
            <p className="text-[var(--cherry-text)] font-code">
              {localStorage.getItem('cherry-theme') === 'light' ? '☀️ 亮色主题' : '🌙 暗色主题'}
            </p>
          </div>

          {/* 链接统计 */}
          <div className="p-4 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded">
            <h3 className="font-code text-sm text-[var(--cherry-amber)] mb-2">
              链接统计
            </h3>
            <p className="text-[var(--cherry-text)] font-code">
              {data.branches.length} 个分支，共 {data.branches.reduce((acc, b) => acc + b.commits.length, 0)} 个链接
            </p>
          </div>

          {/* 快捷操作 */}
          { (onAdd || onStatistics) && (
            <div className="p-4 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded">
               <h3 className="font-code text-sm text-[var(--cherry-amber)] mb-2">
                快捷操作
              </h3>
              <div className="flex gap-3">
                 {onAdd && (
                  <button
                    onClick={() => {
                      onClose();
                      onAdd();
                    }}
                    className="flex-1 button-retro px-3 py-2 bg-[var(--cherry-green)]/10 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] font-code text-sm flex items-center justify-center gap-2"
                  >
                    <span>➕</span> 添加新链接
                  </button>
                )}
                {onStatistics && (
                  <button
                    onClick={() => {
                       onClose();
                       onStatistics();
                    }}
                    className="flex-1 button-retro px-3 py-2 bg-[var(--cherry-amber)]/10 border border-[var(--cherry-amber)]/30 rounded text-[var(--cherry-amber)] font-code text-sm flex items-center justify-center gap-2"
                  >
                    <span>📊</span> 查看统计
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 消息提示 */}
          {message && (
            <div
              className={`px-3 py-2 rounded text-sm font-code ${
                message.type === 'success'
                  ? 'bg-[var(--cherry-green)]/10 text-[var(--cherry-green)] border border-[var(--cherry-green)]/30'
                  : 'bg-[var(--cherry-red)]/10 text-[var(--cherry-red)] border border-[var(--cherry-red)]/30'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* 配置管理 */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleExport}
              className="button-retro px-4 py-2 bg-[var(--cherry-green)]/10 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] font-code text-sm"
            >
              📤 导出配置
            </button>
            <button
              onClick={handleImport}
              className="button-retro px-4 py-2 bg-[var(--cherry-green)]/10 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] font-code text-sm"
            >
              📥 导入配置
            </button>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-6 pt-4 border-t border-[var(--cherry-green)]/30 flex-shrink-0">
          <p className="text-xs text-[var(--cherry-muted)] font-code">
            💡 提示：导出配置会保存当前主题和所有链接数据。导入配置将覆盖当前设置。
          </p>
        </div>
      </div>
    </div>
  );
}