/**
 * 🍒 Cherry - 内容网格组件
 *
 * 分支视图的主内容区域，包含标签筛选器和分支卡片列表。
 * 使用 useMemo 优化标签收集和分支过滤的性能。
 *
 * @file src/components/features/branch/content-grid.tsx
 *
 * @description
 * 功能：
 * - 标签筛选器（单行收起，悬停展开）
 * - 按标签过滤链接
 * - 显示筛选后的分支和链接卡片
 * - 无结果时的空状态提示
 */
"use client";

import { useMemo } from 'react';
import type { Branch, NavigationState } from '../../../types';
import { BranchSection } from './branch-section';
import { useTranslation } from 'react-i18next';

/** ContentGrid 组件 Props */
interface ContentGridProps {
  /** 所有分支数据 */
  branches: Branch[];
  /** 当前导航状态 */
  navigationState: NavigationState;
  /** 链接点击回调 */
  onCommitClick: (branchIndex: number, commitIndex: number) => void;
  /** 搜索关键词（用于高亮） */
  searchQuery?: string;
  /** 当前选中的标签集合 */
  selectedTags?: Set<string>;
  /** 标签点击回调 */
  onTagClick?: (tag: string) => void;
  /** 清除标签筛选回调 */
  onClearTags?: () => void;
  /** 收藏切换回调 */
  onToggleFavorite?: (hash: string) => void;
  /** 当前激活的分支索引 */
  activeBranchIndex?: number;
  /** 当前页码 */
  currentPage?: number;
  /** 页码变更回调 */
  onPageChange?: (page: number) => void;
}

/**
 * 内容网格组件
 *
 * @description
 * 使用单次遍历收集所有标签并过滤分支，
 * 优化渲染性能。
 */
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

  // Combine expensive calculations into one pass (Rule 7.6)
  const { allTags, filteredBranches } = useMemo(() => {
    const tagsSet = new Set<string>();
    const processedBranches: (Branch & { originalIndex: number })[] = [];

    // Single pass through branches
    branches.forEach((branch, index) => {
      // 1. Collect tags from all commits (for the filter UI)
      branch.commits.forEach(commit => {
        commit.tags.forEach(tag => tagsSet.add(tag));
      });

      // 2. Filter commits based on selected tags
      const filteredCommits = selectedTags.size === 0
        ? branch.commits
        : branch.commits.filter(commit => 
            commit.tags.some(tag => selectedTags.has(tag))
          );

      // 3. Add to result if has commits matches filter AND matches active branch index
      if (filteredCommits.length > 0) {
        if (activeBranchIndex === undefined || index === activeBranchIndex) {
          processedBranches.push({
            ...branch,
            originalIndex: index,
            commits: filteredCommits
          });
        }
      }
    });

    return {
      allTags: Array.from(tagsSet).sort(),
      filteredBranches: processedBranches
    };
  }, [branches, selectedTags, activeBranchIndex]);

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

