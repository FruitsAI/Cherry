import type { SiteConfig, Branch } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  config: SiteConfig;
  currentBranch: Branch | null;
  onAdd?: () => void;
  onSettings?: () => void;
  onStatistics?: () => void;
  theme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

export function Header({ config, currentBranch, onAdd, onSettings, onStatistics, theme = 'dark', onThemeChange }: HeaderProps) {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--cherry-bg)] border-b border-[var(--cherry-green)]/30">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center font-code text-sm">
        {/* 左侧: 用户路径 */}
        <div className="flex items-center gap-2">
          <span className="text-[var(--cherry-green)] glow-green">
            {config.user_name}@cherry
          </span>
          <span className="text-[var(--cherry-muted)]">:</span>
          <span className="text-[var(--cherry-amber)]">~$</span>
          <span className="cursor-blink text-[var(--cherry-green)]">_</span>
        </div>

        {/* 右侧: 分支信息和状态 */}
        <div className="flex items-center gap-4 text-[var(--cherry-muted)]">
          {/* 主题切换 */}
          {onThemeChange && (
            <div className="hidden sm:block">
              <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
            </div>
          )}
          {/* 设置按钮 */}
          {onSettings && (
            <button
              onClick={onSettings}
              className="button-retro p-2 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] hover:border-[var(--cherry-green)] transition-all"
              title="设置 (按 S 键)"
            >
              ⚙️
            </button>
          )}
          {/* Add 按钮 */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="button-retro px-3 py-1 bg-[var(--cherry-green)]/10 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] text-xs"
              title="添加新链接 (按 A 键)"
            >
              ➕ Add
            </button>
          )}
          {/* 统计按钮 */}
          {onStatistics && (
            <button
              onClick={onStatistics}
              className="button-retro px-3 py-1 bg-[var(--cherry-amber)]/10 border border-[var(--cherry-amber)]/30 rounded text-[var(--cherry-amber)] text-xs"
              title="查看统计 (按 T 键)"
            >
              📊 Stats
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[var(--cherry-red)]">branch:</span>
            <span className="text-[var(--cherry-text)]">
              {currentBranch ? currentBranch.name : 'main'}
            </span>
          </div>
          <span className="hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[var(--cherry-green)]">●</span>
            <span>uptime: 100%</span>
          </div>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline text-[var(--cherry-amber)]">
            {currentTime}
          </span>
        </div>
      </div>
    </header>
  );
}

