import type { Branch, NavigationState } from '../types';
import { BranchSection } from './BranchSection';

interface ContentGridProps {
  branches: Branch[];
  navigationState: NavigationState;
  onCommitClick: (branchIndex: number, commitIndex: number) => void;
  searchQuery?: string;
  selectedTags?: Set<string>;
  onTagClick?: (tag: string) => void;
  onClearTags?: () => void;
  onToggleFavorite?: (hash: string) => void;
  version?: string;
}

export function ContentGrid({
  branches,
  navigationState,
  onCommitClick,
  searchQuery = '',
  selectedTags = new Set(),
  onTagClick,
  onClearTags,
  onToggleFavorite,
  version = 'v0.8.0',
}: ContentGridProps) {
  // 获取所有唯一的标签
  const allTags = Array.from(
    new Set(branches.flatMap((branch) => branch.commits.flatMap((commit) => commit.tags)))
  ).sort();

  // 过滤分支：只显示包含选中标签的链接
  const filteredBranches = branches.map((branch) => ({
    ...branch,
    commits: selectedTags.size === 0
      ? branch.commits
      : branch.commits.filter((commit) =>
          commit.tags.some((tag) => selectedTags.has(tag))
        ),
  })).filter((branch) => branch.commits.length > 0);

  return (
    <main className="container mx-auto px-4 pb-8">
      {/* 标签筛选器 */}
      {allTags.length > 0 && (
        <div className="mb-6 p-4 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-code text-sm text-[var(--cherry-amber)]">
              🏷️ 标签筛选
            </h3>
            {selectedTags.size > 0 && (
              <button
                onClick={onClearTags}
                className="text-xs text-[var(--cherry-red)] hover:text-[var(--cherry-red)]/80 transition-colors font-code"
              >
                清除筛选
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className={`tag-retro px-3 py-1 text-xs rounded transition-all ${
                  selectedTags.has(tag)
                    ? 'bg-[var(--cherry-red)] text-white'
                    : 'bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 text-[var(--cherry-green)]'
                }`}
              >
                {tag}
                {selectedTags.has(tag) && ' ✓'}
              </button>
            ))}
          </div>
          {selectedTags.size > 0 && (
            <p className="mt-3 text-xs text-[var(--cherry-muted)] font-code">
              已选择 {selectedTags.size} 个标签，显示 {filteredBranches.reduce((acc, b) => acc + b.commits.length, 0)} 个链接
            </p>
          )}
        </div>
      )}

      {/* 分支列表 */}
      {filteredBranches.map((branch, branchIndex) => (
        <BranchSection
          key={branch.name}
          branch={branch}
          branchIndex={branchIndex}
          selectedCommitIndex={navigationState.currentCommitIndex}
          isCurrentBranch={navigationState.currentBranchIndex === branchIndex}
          onCommitClick={onCommitClick}
          searchQuery={searchQuery}
          selectedTags={selectedTags}
          onTagClick={onTagClick}
          onToggleFavorite={onToggleFavorite}
        />
      ))}

      {/* 无结果提示 */}
      {filteredBranches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--cherry-muted)] font-code text-lg">
            没有找到匹配的链接
          </p>
          <button
            onClick={onClearTags}
            className="mt-4 px-4 py-2 bg-[var(--cherry-green)]/10 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] font-code text-sm hover:bg-[var(--cherry-green)]/20 transition-all"
          >
            清除筛选
          </button>
        </div>
      )}

      {/* 底部信息 */}
      <footer className="mt-12 pt-4 border-t border-[var(--cherry-green)]/20 text-center">
        <p className="text-xs text-[var(--cherry-muted)] font-code">
          <span className="text-[var(--cherry-green)]">🍒</span> Cherry {version}
          {' '}|{' '}
          <span className="text-[var(--cherry-amber)]">Cherry-pick the web</span>
          {' '}|{' '}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--cherry-red)]"
          >
            Fork on GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}

