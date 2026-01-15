import { useEffect, useCallback } from 'react';
import type { Branch, NavigationState } from '../types';

interface UseKeyboardNavigationProps {
  branches: Branch[];
  navigationState: NavigationState;
  setNavigationState: React.Dispatch<React.SetStateAction<NavigationState>>;
  isCommandInputActive: boolean;
  onOpenLink: () => void;
  onFocusSearch: () => void;
  onShowHelp: () => void;
}

export function useKeyboardNavigation({
  branches,
  navigationState,
  setNavigationState,
  isCommandInputActive,
  onOpenLink,
  onFocusSearch,
  onShowHelp,
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 如果命令输入框激活，不处理导航快捷键
      if (isCommandInputActive) {
        return;
      }

      const { currentBranchIndex, currentCommitIndex } = navigationState;
      const currentBranch = branches[currentBranchIndex];

      switch (e.key) {
        // 向下移动 (j 或 ArrowDown)
        case 'j':
        case 'ArrowDown':
          e.preventDefault();
          if (currentBranch && currentCommitIndex < currentBranch.commits.length - 1) {
            setNavigationState((prev) => ({
              ...prev,
              currentCommitIndex: prev.currentCommitIndex + 1,
            }));
          }
          break;

        // 向上移动 (k 或 ArrowUp)
        case 'k':
        case 'ArrowUp':
          e.preventDefault();
          if (currentCommitIndex > 0) {
            setNavigationState((prev) => ({
              ...prev,
              currentCommitIndex: prev.currentCommitIndex - 1,
            }));
          }
          break;

        // 切换到上一个 Branch (h 或 ArrowLeft)
        case 'h':
        case 'ArrowLeft':
          e.preventDefault();
          if (currentBranchIndex > 0) {
            setNavigationState({
              currentBranchIndex: currentBranchIndex - 1,
              currentCommitIndex: 0,
            });
          }
          break;

        // 切换到下一个 Branch (l 或 ArrowRight)
        case 'l':
        case 'ArrowRight':
          e.preventDefault();
          if (currentBranchIndex < branches.length - 1) {
            setNavigationState({
              currentBranchIndex: currentBranchIndex + 1,
              currentCommitIndex: 0,
            });
          }
          break;

        // 打开链接
        case 'Enter':
          e.preventDefault();
          onOpenLink();
          break;

        // 聚焦搜索框
        case '/':
          e.preventDefault();
          onFocusSearch();
          break;

        // 显示帮助
        case '?':
          e.preventDefault();
          onShowHelp();
          break;
      }
    },
    [
      branches,
      navigationState,
      isCommandInputActive,
      setNavigationState,
      onOpenLink,
      onFocusSearch,
      onShowHelp,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

