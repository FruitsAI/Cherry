/**
 * 🍒 Cherry - 分支视图组件
 *
 * 显示特定分支的内容网格，支持搜索过滤、标签筛选和分页。
 * 用户点击 Dock 中的分支图标后进入此视图。
 *
 * @file src/components/views/branch-view.tsx
 *
 * @description
 * 功能：
 * - 显示分支下的所有链接卡片
 * - 支持关键词搜索高亮
 * - 支持标签筛选
 * - 支持收藏功能
 * - 键盘导航集成
 */

import { ContentGrid } from '../features/branch/content-grid';
import { CherryData, NavigationState } from '../../types';

/** BranchView 组件 Props */
interface BranchViewProps {
  /** 所有分支数据 */
  branches: CherryData['branches'];
  /** 当前导航状态 */
  navigationState: NavigationState;
  /** 链接卡片点击回调 */
  onCommitClick: (branchIndex: number, commitIndex: number) => void;
  /** 搜索查询关键词（用于高亮） */
  searchQuery: string;
  /** 当前选中的标签集合 */
  selectedTags: Set<string>;
  /** 标签点击回调（切换选中状态） */
  onTagClick: (tag: string) => void;
  /** 清除所有标签筛选 */
  onClearTags: () => void;
  /** 切换收藏状态回调 */
  onToggleFavorite: (hash: string) => void;
  /** 当前激活的分支索引 */
  activeBranchIndex?: number;
  /** 当前页码 */
  currentPage: number;
  /** 页码变更回调 */
  onPageChange: (page: number) => void;
}

/**
 * 分支视图组件
 *
 * @description
 * 包装 ContentGrid 组件，添加顶部边距以避免被 Header 遮挡。
 */
export function BranchView({
  branches,
  navigationState,
  onCommitClick,
  searchQuery,
  selectedTags,
  onTagClick,
  onClearTags,
  onToggleFavorite,
  activeBranchIndex,
  currentPage,
  onPageChange,
}: BranchViewProps) {
  return (
    <div className="pt-20"> 
      <ContentGrid
        branches={branches}
        navigationState={navigationState}
        onCommitClick={onCommitClick}
        searchQuery={searchQuery}
        selectedTags={selectedTags}
        onTagClick={onTagClick}
        onClearTags={onClearTags}
        onToggleFavorite={onToggleFavorite}
        activeBranchIndex={activeBranchIndex}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
