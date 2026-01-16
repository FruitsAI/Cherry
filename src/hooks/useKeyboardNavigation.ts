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
  onShowAdd?: () => void;
  onShowSettings?: () => void;
  onShowStatistics?: () => void;
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
  onShowAdd,
  onShowSettings,
  onShowStatistics,
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 如果命令输入框激活或弹窗打开，不处理导航快捷键
      if (isCommandInputActive || isModalOpen) {
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

        // 显示 Add 弹窗
        case 'A':
        case 'a':
          if (onShowAdd) {
            e.preventDefault();
            onShowAdd();
          }
          break;

        // 显示设置弹窗
        case 'S':
        case 's':
          if (onShowSettings) {
            e.preventDefault();
            onShowSettings();
          }
          break;

        // 显示统计弹窗
        case 'T':
        case 't':
          if (onShowStatistics) {
            e.preventDefault();
            onShowStatistics();
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
      onShowAdd,
      onShowSettings,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

