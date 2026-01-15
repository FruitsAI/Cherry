import type { SiteConfig, Branch } from '../types';

interface HeaderProps {
  config: SiteConfig;
  currentBranch: Branch | null;
}

export function Header({ config, currentBranch }: HeaderProps) {
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

