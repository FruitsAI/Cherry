/**
 * 🍒 Cherry Hooks - 键盘导航 Hook
 *
 * 处理全局键盘快捷键导航。
 * 支持 Vim 风格按键（j/k/h/l）和方向键。
 *
 * @file src/hooks/use-keyboard-navigation.ts
 *
 * @description
 * 快捷键：
 * - j / ↓: 向下移动选中项
 * - k / ↑: 向上移动选中项
 * - h / ←: 切换到上一个分支
 * - l / →: 切换到下一个分支
 * - Enter: 打开当前链接
 * - /: 聚焦搜索框
 * - ?: 显示帮助
 * - t: 显示统计
 * - m: 回到首页
 *
 * 注意：使用 useLatest 保持事件处理器稳定，
 * 避免频繁重新绑定事件监听器。
 */

import { useEffect, useCallback, useRef } from 'react';
import type { Branch, NavigationState } from '../types';
import { useLatest } from './use-latest';

/** useKeyboardNavigation Hook 参数 */
interface UseKeyboardNavigationProps {
  /** 所有分支数据 */
  branches: Branch[];
  /** 当前导航状态 */
  navigationState: NavigationState;
  /** 设置导航状态 */
  setNavigationState: React.Dispatch<React.SetStateAction<NavigationState>>;
  /** 命令输入框是否激活 */
  isCommandInputActive: boolean;
  /** 弹窗是否打开 */
  isModalOpen: boolean;
  /** 打开链接回调 */
  onOpenLink: () => void;
  /** 聚焦搜索框回调 */
  onFocusSearch: () => void;
  /** 显示帮助回调 */
  onShowHelp: () => void;
  /** 显示统计回调 */
  onShowStatistics?: () => void;
  /** 回到首页回调 */
  onGoHome?: () => void;
  /** 页码变更回调 */
  onPageChange?: (page: number) => void;
  /** 每页条目数 */
  itemsPerPage?: number;
  /** 切换到上一个分支 */
  onPrevBranch?: (selectLast?: boolean) => void;
  /** 切换到下一个分支 */
  onNextBranch?: () => void;
}

/**
 * 键盘导航 Hook
 *
 * @description
 * 在 window 上监听 keydown 事件，
 * 根据按键执行相应的导航操作。
 */
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
  // Rule 8.1: Use useLatest to keep event handler stable
  // This prevents window.addEventListener from being torn down/re-added on every state change
  const stateRef = useLatest({
    branches,
    navigationState,
    isCommandInputActive,
    isModalOpen,
    itemsPerPage
  });

  const callbacksRef = useLatest({
    setNavigationState,
    onOpenLink,
    onFocusSearch,
    onShowHelp,
    onShowStatistics,
    onGoHome,
    onPageChange,
    onPrevBranch,
    onNextBranch
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const { 
        branches, 
        navigationState, 
        isCommandInputActive, 
        isModalOpen, 
        itemsPerPage 
      } = stateRef.current;
      
      const {
        setNavigationState,
        onOpenLink,
        onFocusSearch,
        onShowHelp,
        onShowStatistics,
        onGoHome,
        onPageChange,
        onPrevBranch,
        onNextBranch
      } = callbacksRef.current;

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
        // 向下移动 (j 或 ArrowDown)
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

        // 向上移动 (k 或 ArrowUp)
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
            onPrevBranch(false); 
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
    [stateRef, callbacksRef] // Stable dependencies
  );

  useEffect(() => {
    // This listener is now STABLE and will NOT be re-bound on every state change
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}


