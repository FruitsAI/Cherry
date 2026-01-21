import type { Commit } from '../../types';

interface CommitCardProps {
  commit: Commit;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  searchQuery?: string;
  selectedTags?: Set<string>;
  onTagClick?: (tag: string) => void;
  onToggleFavorite?: (hash: string) => void;
}

// 高亮文本的辅助函数
function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (regex.test(part)) {
      return (
        <span key={i} className="highlight-text">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function CommitCard({ commit, index, isSelected, onClick, searchQuery = '', selectedTags = new Set(), onTagClick, onToggleFavorite }: CommitCardProps) {
  const handleClick = () => {
    onClick();
    window.open(commit.url, '_blank', 'noopener,noreferrer');
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    onTagClick?.(tag);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(commit.hash);
  };

  return (
    <div
      onClick={handleClick}
      className={`terminal-card p-4 cursor-pointer group transition-all duration-200 animate-fade-in-up ${
        isSelected ? 'selected' : ''
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* 顶部: 索引、Hash 和收藏按钮 */}
      <div className="flex items-center justify-between mb-2 text-xs font-code">
        <div className="flex items-center gap-2">
          <span className="text-[var(--cherry-amber)]">#{index + 1}</span>
          <button
            onClick={handleToggleFavorite}
            className={`transition-all ${commit.isFavorite ? 'text-[var(--cherry-red)]' : 'text-[var(--cherry-muted)] hover:text-[var(--cherry-red)]'}`}
            title={commit.isFavorite ? '取消收藏' : '添加到收藏'}
          >
            {commit.isFavorite ? '★' : '☆'}
          </button>
        </div>
        <span className="text-[var(--cherry-muted)] font-mono">
          <span className="text-[var(--cherry-red)]">commit</span> {commit.hash}
        </span>
      </div>

      {/* 主体: 消息/标题 */}
      <div className="card-content">
        <h3 className="font-code text-base text-[var(--cherry-text)] group-hover:text-[var(--cherry-green)] transition-colors mb-2">
          {highlightText(commit.message, searchQuery)}
        </h3>
      </div>

      {/* 底部: URL 和标签 */}
      <div className="flex flex-wrap items-center gap-2">
        {commit.tags.map((tag) => (
          <button
            key={tag}
            onClick={(e) => handleTagClick(e, tag)}
            className={`tag-retro px-2 py-0.5 text-xs bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded transition-all ${
              selectedTags.has(tag)
                ? 'bg-[var(--cherry-red)] text-white border-[var(--cherry-red)]'
                : 'text-[var(--cherry-green)]'
            }`}
            title={selectedTags.has(tag) ? '取消筛选' : '按标签筛选'}
          >
            {highlightText(tag, searchQuery)}
            {selectedTags.has(tag) && ' ✓'}
          </button>
        ))}
      </div>

      {/* Hover 时显示完整 URL */}
      <div className="mt-2 text-xs text-[var(--cherry-muted)] truncate opacity-0 group-hover:opacity-100 transition-opacity">
        → {commit.url}
      </div>
    </div>
  );
}

