import { ContentGrid } from '../features/branch/ContentGrid';
import { CherryData, NavigationState } from '../../types';

interface BranchViewProps {
  branches: CherryData['branches'];
  navigationState: NavigationState;
  onCommitClick: (branchIndex: number, commitIndex: number) => void;
  searchQuery: string;
  selectedTags: Set<string>;
  onTagClick: (tag: string) => void;
  onClearTags: () => void;
  onToggleFavorite: (hash: string) => void;
  activeBranchIndex?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

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
