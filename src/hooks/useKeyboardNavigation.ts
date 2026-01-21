import { useEffect, useCallback } from 'react';
import type { Branch, NavigationState } from '../types';

interface UseKeyboardNavigationProps {
  branches: Branch[];
  navigationState: NavigationState;
  setNavigationState: React.Dispatch<React.SetStateAction<NavigationState>>;
  isCommandInputActive: boolean;
  isModalOpen: boolean;
  onOpenLink: () => void;
  onFocusSearch: () => void;
  onShowHelp: () => void;


  onShowStatistics?: () => void;
  onGoHome?: () => void;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  onPrevBranch?: (selectLast?: boolean) => void;
  onNextBranch?: () => void;
}

export function useKeyboardNavigation({
  branches,
  navigationState,
  setNavigationState,
  isCommandInputActive,
  isModalOpen,
  onOpenLink,
  onFocusSearch,
  onShowHelp,


  onShowStatistics,
  onGoHome,
  onPageChange,
  itemsPerPage = 8,
  onPrevBranch,
  onNextBranch,
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Check for active input element to prevent typing interference
      const activeElement = document.activeElement as HTMLElement;
      const isInputActive = 
        activeElement && 
        (activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.isContentEditable);

      // 如果命令输入框激活、弹窗打开，或焦点在输入元素上，不处理导航快捷键
      if (isCommandInputActive || isModalOpen || isInputActive) {
        return;
      }

      const { currentBranchIndex, currentCommitIndex } = navigationState;
      const currentBranch = branches[currentBranchIndex];

      switch (e.key) {
        // 向下移动 (j 或 ArrowDown) - Item Navigation with automatic Branch/Page switching
        case 'j':
        case 'ArrowDown':
          e.preventDefault();
          if (currentBranch) {
            const nextIndex = currentCommitIndex + 1;
            if (nextIndex < currentBranch.commits.length) {
              setNavigationState((prev) => ({
                ...prev,
                currentCommitIndex: nextIndex,
              }));
              if (onPageChange) {
                onPageChange(Math.floor(nextIndex / itemsPerPage) + 1);
              }
            } else if (onNextBranch) {
              // At end of branch -> Go to next branch
              onNextBranch();
            }
          }
          break;

        // 向上移动 (k 或 ArrowUp) - Item Navigation with automatic Branch/Page switching
        case 'k':
        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex = currentCommitIndex - 1;
          if (prevIndex >= 0) {
            setNavigationState((prev) => ({
              ...prev,
              currentCommitIndex: prevIndex,
            }));
            if (onPageChange) {
              onPageChange(Math.floor(prevIndex / itemsPerPage) + 1);
            }
          } else if (onPrevBranch) {
            // At start of branch -> Go to previous branch (select last item)
            onPrevBranch(true);
          }
          break;
        }

        // 切换到上一个 Branch (h 或 ArrowLeft)
        case 'h':
        case 'ArrowLeft':
          e.preventDefault();
          if (onPrevBranch) {
            onPrevBranch(false); // Switch to previous branch (start)
          }
          break;

        // 切换到下一个 Branch (l 或 ArrowRight)
        case 'l':
        case 'ArrowRight':
          e.preventDefault();
          if (onNextBranch) {
            onNextBranch();
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





        // 显示统计弹窗
        case 'T':
        case 't':
          if (onShowStatistics) {
            e.preventDefault();
            onShowStatistics();
          }
          break;

        // 回到首页
        case 'M':
        case 'm':
          if (onGoHome) {
            e.preventDefault();
            onGoHome();
          }
          break;
      }
    },
    [
      branches,
      navigationState,
      isCommandInputActive,
      isModalOpen,
      setNavigationState,
      onOpenLink,
      onFocusSearch,
      onShowHelp,


      onShowStatistics,
      onGoHome,
      onNextBranch,
      onPrevBranch,
      itemsPerPage,
      onPageChange,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

