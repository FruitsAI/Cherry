import { useState, useEffect } from 'react';
import type { Branch } from '../types';
import { CommitCard } from './CommitCard';

interface BranchSectionProps {
  id?: string;
  branch: Branch;
  branchIndex: number;
  selectedCommitIndex: number;
  isCurrentBranch: boolean;
  onCommitClick: (branchIndex: number, commitIndex: number) => void;
  searchQuery?: string;
  selectedTags?: Set<string>;
  onTagClick?: (tag: string) => void;
  onToggleFavorite?: (hash: string) => void;
}

const ITEMS_PER_PAGE = 8;

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
}: BranchSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change (search or tags) or branch content changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTags, branch.commits.length]);

  const totalPages = Math.ceil(branch.commits.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCommits = branch.commits.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
        <span className="text-2xl">{branch.icon}</span>
        <h2 className="font-code text-lg">
          <span className="text-[var(--cherry-muted)]">git checkout</span>{' '}
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
        <span className="text-xs text-[var(--cherry-muted)] ml-auto">
          {branch.commits.length} commit{branch.commits.length !== 1 ? 's' : ''}
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
          >
            [&lt; PREV]
          </button>
          
          <span className="font-code text-sm text-[var(--cherry-text)]">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`font-code text-sm px-3 py-1 rounded transition-colors ${
              currentPage === totalPages
                ? 'text-[var(--cherry-muted)] cursor-not-allowed'
                : 'text-[var(--cherry-green)] hover:bg-[var(--cherry-green)]/10'
            }`}
          >
            [NEXT &gt;]
          </button>
        </div>
      )}
    </section>
  );
}

