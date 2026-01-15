import type { Commit } from '../types';

interface CommitCardProps {
  commit: Commit;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export function CommitCard({ commit, index, isSelected, onClick }: CommitCardProps) {
  const handleClick = () => {
    onClick();
    window.open(commit.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleClick}
      className={`terminal-card p-4 cursor-pointer group transition-all duration-200 ${
        isSelected ? 'selected' : ''
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* 顶部: 索引和 Hash */}
      <div className="flex items-center justify-between mb-2 text-xs font-code">
        <span className="text-[var(--cherry-amber)]">#{index + 1}</span>
        <span className="text-[var(--cherry-muted)] font-mono">
          <span className="text-[var(--cherry-red)]">commit</span> {commit.hash}
        </span>
      </div>

      {/* 主体: 消息/标题 */}
      <h3 className="font-code text-base text-[var(--cherry-text)] group-hover:text-[var(--cherry-green)] transition-colors mb-2">
        {commit.message}
      </h3>

      {/* 底部: URL 和标签 */}
      <div className="flex flex-wrap items-center gap-2">
        {commit.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Hover 时显示完整 URL */}
      <div className="mt-2 text-xs text-[var(--cherry-muted)] truncate opacity-0 group-hover:opacity-100 transition-opacity">
        → {commit.url}
      </div>
    </div>
  );
}

