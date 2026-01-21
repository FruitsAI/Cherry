"use client";

import type { Branch, NavigationState } from '../../../types';
import { BranchSection } from './BranchSection';
import { useTranslation } from 'react-i18next';

interface ContentGridProps {
  branches: Branch[];
  navigationState: NavigationState;
  onCommitClick: (branchIndex: number, commitIndex: number) => void;
  searchQuery?: string;
  selectedTags?: Set<string>;
  onTagClick?: (tag: string) => void;
  onClearTags?: () => void;
  onToggleFavorite?: (hash: string) => void;
  activeBranchIndex?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
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
  activeBranchIndex,
  currentPage,
  onPageChange,
}: ContentGridProps) {
  const { t } = useTranslation();
  // 获取所有唯一的标签
  const allTags = Array.from(
    new Set(branches.flatMap((branch) => branch.commits.flatMap((commit) => commit.tags)))
  ).sort();

  // 过滤分支：只显示包含选中标签的链接
  // 如果指定了 activeBranchIndex，则只显示该分支
  const filteredBranches = branches
    .map((branch, index) => ({
      ...branch,
      originalIndex: index, // 保存原始索引以便正确匹配
      commits: selectedTags.size === 0
        ? branch.commits
        : branch.commits.filter((commit) =>
            commit.tags.some((tag) => selectedTags.has(tag))
          ),
    }))
    .filter((branch) => branch.commits.length > 0)
    .filter((branch) => activeBranchIndex === undefined || branch.originalIndex === activeBranchIndex);

  return (
    <main className="container mx-auto px-4 pb-8">
      {/* 标签筛选器 */}
      {allTags.length > 0 && (
        <div className="mb-6 p-4 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-code text-sm text-[var(--cherry-amber)]">
              🏷️ {t('common.tag_filter')}
            </h3>
            {selectedTags.size > 0 && (
              <button
                onClick={onClearTags}
                className="text-xs text-[var(--cherry-red)] hover:text-[var(--cherry-red)]/80 transition-colors font-code"
              >
                {t('common.clear_filter')}
              </button>
            )}
          </div>
          {/* Tags Container with Line Clamp Effect */}
          <div className="relative group">
            <div 
              className="flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: '2.25rem' }} // Force 1 line (approx 36px)
            >
              <style>{`
                .group:hover > div {
                  max-height: 20rem !important;
                }
              `}</style>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick?.(tag)}
                  className={`tag-retro px-3 py-1 text-xs rounded transition-all whitespace-nowrap ${
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
            {/* Ellipsis/More Indicator - Visible when collapsed, hidden when expanded */}
            {allTags.length > 8 && ( // Simple heuristic: show ... if many tags
             <div className="absolute right-0 top-0 bottom-0 px-2 flex items-center bg-gradient-to-l from-[var(--cherry-bg-secondary)] via-[var(--cherry-bg-secondary)] to-transparent text-[var(--cherry-muted)] text-xs font-code opacity-100 group-hover:opacity-0 transition-opacity pointer-events-none">
              ...
            </div>
            )}
          </div>
          
          {selectedTags.size > 0 && (
            <p className="mt-3 text-xs text-[var(--cherry-muted)] font-code">
              {t('common.selected_tags', { count: selectedTags.size, total: filteredBranches.reduce((acc, b) => acc + b.commits.length, 0) })}
            </p>
          )}
        </div>
      )}

      {/* 分支列表 */}
      {filteredBranches.map((branch) => (
        <BranchSection
          key={branch.name}
          id={`branch-${branch.originalIndex}`}
          branch={branch}
          branchIndex={branch.originalIndex}
          selectedCommitIndex={navigationState.currentCommitIndex}
          isCurrentBranch={navigationState.currentBranchIndex === branch.originalIndex}
          onCommitClick={onCommitClick}
          searchQuery={searchQuery}
          selectedTags={selectedTags}
          onTagClick={onTagClick}
          onToggleFavorite={onToggleFavorite}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      ))}

      {/* 无结果提示 */}
      {filteredBranches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--cherry-muted)] font-code text-lg">
            {t('common.no_results')}
          </p>
          <button
            onClick={onClearTags}
            className="mt-4 px-4 py-2 bg-[var(--cherry-green)]/10 border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] font-code text-sm hover:bg-[var(--cherry-green)]/20 transition-all"
          >
            {t('common.clear_filter')}
          </button>
        </div>
      )}

      {/* 底部信息 - Removed (Moved to Footer component) */}
    </main>
  );
}

