import type { Branch, NavigationState } from '../types';
import { BranchSection } from './BranchSection';

interface ContentGridProps {
  branches: Branch[];
  navigationState: NavigationState;
  onCommitClick: (branchIndex: number, commitIndex: number) => void;
}

export function ContentGrid({
  branches,
  navigationState,
  onCommitClick,
}: ContentGridProps) {
  return (
    <main className="container mx-auto px-4 pb-8">
      {branches.map((branch, branchIndex) => (
        <BranchSection
          key={branch.name}
          branch={branch}
          branchIndex={branchIndex}
          selectedCommitIndex={navigationState.currentCommitIndex}
          isCurrentBranch={navigationState.currentBranchIndex === branchIndex}
          onCommitClick={onCommitClick}
        />
      ))}

      {/* 底部信息 */}
      <footer className="mt-12 pt-4 border-t border-[var(--cherry-green)]/20 text-center">
        <p className="text-xs text-[var(--cherry-muted)] font-code">
          <span className="text-[var(--cherry-green)]">🍒</span> Project Cherry v0.1.0
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

