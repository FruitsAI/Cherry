import type { Branch } from '../types';

interface DockProps {
  branches: Branch[];
  currentBranchIndex: number;
  onBranchClick: (index: number) => void;
}

export function Dock({ branches, currentBranchIndex, onBranchClick }: DockProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end gap-2 px-4 py-3 bg-[var(--cherry-bg-secondary)]/90 backdrop-blur-md border border-[var(--cherry-green)]/30 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02] hover:border-[var(--cherry-green)] hover:shadow-[0_0_20px_rgba(46,204,113,0.2)]">
        {branches.map((branch, index) => (
          <button
            key={branch.name}
            onClick={() => onBranchClick(index)}
            className={`group relative flex flex-col items-center justify-center p-3 min-w-[3rem] min-h-[3rem] rounded-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:mx-1 ${
              index === currentBranchIndex
                ? 'bg-[var(--cherry-green)]/10 text-[var(--cherry-red)] scale-110'
                : 'text-[var(--cherry-muted)] hover:text-[var(--cherry-text)] hover:bg-[var(--cherry-green)]/5'
            }`}
          >
            {/* Tooltip */}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-code bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50 backdrop-blur-sm">
              {branch.name}
            </span>
            
            <span className="text-2xl transform transition-transform duration-300 group-hover:scale-125 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              {branch.icon}
            </span>
            
            {/* Indicator for active */}
            {index === currentBranchIndex && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-[var(--cherry-red)] rounded-full shadow-[0_0_8px_var(--cherry-red)] animate-pulse" />
            )}
            
            {/* Reflection effect for active */}
            {index === currentBranchIndex && (
               <div className="absolute -bottom-4 left-0 right-0 h-4 bg-gradient-to-b from-[var(--cherry-red)]/20 to-transparent blur-sm transform scale-y-[-1] opacity-50 pointer-events-none w-full mask-image-b" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
