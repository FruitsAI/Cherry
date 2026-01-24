/**
 * 🍒 Cherry - 分支区块组件
 *
 * 显示单个分支及其下所有链接卡片的区块。
 * 支持分页浏览链接列表。
 *
 * @file src/components/features/branch/branch-section.tsx
 *
 * @description
 * 功能：
 * - 分支标题（图标 + 名称 + 链接数）
 * - 链接卡片网格（响应式布局）
 * - 分页控件
 */
"use client";

import type { Branch } from '../../../types';
import { CommitCard } from '../../ui/commit-card';
import { IconDisplay } from '../../ui/icon-display';
import { useTranslation } from 'react-i18next';

/** BranchSection 组件 Props */
interface BranchSectionProps {
  /** DOM 元素 ID（用于滚动定位） */
  id?: string;
  /** 分支数据 */
  branch: Branch;
  /** 分支在数组中的索引 */
  branchIndex: number;
  /** 当前选中的链接索引 */
  selectedCommitIndex: number;
  /** 是否为当前激活的分支 */
  isCurrentBranch: boolean;
  /** 链接点击回调 */
  onCommitClick: (branchIndex: number, commitIndex: number) => void;
  /** 搜索关键词 */
  searchQuery?: string;
  /** 选中的标签集合 */
  selectedTags?: Set<string>;
  /** 标签点击回调 */
  onTagClick?: (tag: string) => void;
  /** 收藏切换回调 */
  onToggleFavorite?: (hash: string) => void;
  /** 当前页码 */
  currentPage?: number;
  /** 页码变更回调 */
  onPageChange?: (page: number) => void;
}

/** 每页显示的链接数 */
const ITEMS_PER_PAGE = 8;

/**
 * 分支区块组件
 *
 * @description
 * 渲染分支标题和分页的链接卡片网格。
 */
export function BranchSection({
  branch,
  branchIndex,
  selectedCommitIndex,
  isCurrentBranch,
  onCommitClick,
  searchQuery = '',
  selectedTags = new Set(),
  onTagClick,
  onToggleFavorite,
  id,
  currentPage = 1,
  onPageChange,
}: BranchSectionProps) {
  const { t } = useTranslation();
  // Removed internal page reset effect to allow parent control

  const totalPages = Math.ceil(branch.commits.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCommits = branch.commits.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    onPageChange?.(Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    onPageChange?.(Math.min(currentPage + 1, totalPages));
  };

  return (
    <section id={id} className="mb-8">
      {/* Branch 标题 */}
      <div
        className={`flex items-center gap-3 mb-4 pb-2 border-b ${
          isCurrentBranch
            ? 'border-[var(--cherry-red)]'
            : 'border-[var(--cherry-green)]/30'
        }`}
      >
        <IconDisplay icon={branch.icon} className="text-2xl" imageClassName="w-8 h-8" />
        <h2 className="font-code text-lg">
          <span className="text-[var(--cherry-muted)]" suppressHydrationWarning>{t('branch_section.git_checkout')}</span>{' '}
          <span
            className={`${
              isCurrentBranch
                ? 'text-[var(--cherry-red)] glow-red'
                : 'text-[var(--cherry-green)]'
            }`}
          >
            {branch.name}
          </span>
        </h2>
        <span className="text-xs text-[var(--cherry-muted)] ml-auto" suppressHydrationWarning>
          {t('branch_section.commits', { count: branch.commits.length })}
        </span>
      </div>

      {/* Commits 网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedCommits.map((commit, index) => (
          <CommitCard
            key={`${commit.hash}-${startIndex + index}`}
            commit={commit}
            // Passing the correct original index if handled by parent logic, 
            // BUT onCommitClick expects global index within branch array?
            // Yes, checking App.tsx: handleCommitClick(branchIndex, commitIndex).
            // So we must pass the actual index in the full array: startIndex + index
            index={startIndex + index} 
            isSelected={isCurrentBranch && selectedCommitIndex === (startIndex + index)}
            onClick={() => onCommitClick(branchIndex, startIndex + index)}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            onTagClick={onTagClick}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`font-code text-sm px-3 py-1 rounded transition-colors ${
              currentPage === 1
                ? 'text-[var(--cherry-muted)] cursor-not-allowed'
                : 'text-[var(--cherry-green)] hover:bg-[var(--cherry-green)]/10'
            }`}
            suppressHydrationWarning
          >
            {t('common.page_prev') || "[< PREV]"}
          </button>
          
          <span className="font-code text-sm text-[var(--cherry-text)]" suppressHydrationWarning>
            {t('common.page_info', { current: currentPage, total: totalPages })}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`font-code text-sm px-3 py-1 rounded transition-colors ${
              currentPage === totalPages
                ? 'text-[var(--cherry-muted)] cursor-not-allowed'
                : 'text-[var(--cherry-green)] hover:bg-[var(--cherry-green)]/10'
            }`}
            suppressHydrationWarning
          >
            {t('common.page_next') || "[NEXT >]"}
          </button>
        </div>
      )}
    </section>
  );
}

