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
        {branch.commits.map((commit, commitIndex) => (
          <CommitCard
            key={commit.hash}
            commit={commit}
            index={commitIndex}
            isSelected={isCurrentBranch && selectedCommitIndex === commitIndex}
            onClick={() => onCommitClick(branchIndex, commitIndex)}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            onTagClick={onTagClick}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}

