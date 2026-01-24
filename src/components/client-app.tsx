/**
 * 🍒 Cherry - 客户端主应用组件
 *
 * 应用的核心客户端组件，整合所有功能模块并管理全局状态。
 * 负责处理用户交互、键盘导航、主题切换、搜索过滤等核心功能。
 *
 * @file src/components/client-app.tsx
 *
 * @description
 * 主要职责：
 * - 状态管理：导航状态、搜索状态、视图切换、收藏列表
 * - UI 模态框：帮助弹窗、快捷键指南、统计信息
 * - 键盘导航：方向键、Enter、Esc 等快捷操作
 * - 主题持久化：深色/浅色模式切换与 localStorage 同步
 * - URL 同步：搜索查询参数与 URL 双向绑定（防抖）
 * - 国际化：i18n 多语言支持
 *
 * 组件结构：
 * - Header: 顶部导航栏
 * - HomeView / BranchView: 主内容区域
 * - Dock: 底部分支快捷切换栏
 * - Footer: 页脚版本信息
 * - 模态框组件（延迟加载）
 */
"use client";

import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Header } from './layout/header';
import { Dock } from './layout/dock';
import { Footer } from './layout/footer';
import { useKeyboardNavigation, useCommands, useStatistics } from '../hooks';
import type { CherryData, NavigationState } from '../types';
import '../i18n'; // 初始化客户端 i18n
import { syncLanguageFromStorage } from '../i18n';
import { HomeView } from './views/home-view';
import { BranchView } from './views/branch-view';

// ═══════════════════════════════════════════════════════════════════════════════
// 延迟加载的模态框组件
// 使用 React.lazy 实现代码分割，减少初始包体积
// ═══════════════════════════════════════════════════════════════════════════════
const HelpModal = lazy(() => import('./features/modals/help-modal').then(m => ({ default: m.HelpModal })));
const KeyboardShortcutsModal = lazy(() => import('./features/modals/keyboard-shortcuts-modal').then(m => ({ default: m.KeyboardShortcutsModal })));
const StatisticsModal = lazy(() => import('./features/modals/statistics-modal').then(m => ({ default: m.StatisticsModal })));

/**
 * 模态框加载占位符
 *
 * 在模态框代码加载时显示的临时 UI
 */
function ModalFallback() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="terminal-card p-6 border-[var(--cherry-red)]">
        <p className="text-[var(--cherry-muted)] font-code">加载中...</p>
      </div>
    </div>
  );
}

/** ClientApp 组件 Props */
interface ClientAppProps {
  /** 服务端获取的初始数据 */
  initialData: CherryData;
}

/**
 * 客户端主应用组件
 *
 * @param props.initialData - 从服务端传入的初始数据
 *
 * @description
 * 这是一个客户端组件 ('use client')，接收服务端预渲染的数据，
 * 并在客户端处理所有交互逻辑。使用多个自定义 Hook 管理复杂状态。
 */
export function ClientApp({ initialData }: ClientAppProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { i18n } = useTranslation();
  
  // 数据 - Sync with server data
  const [data, setData] = useState<CherryData>(initialData);
  
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Handle Favorites Hydration
  useEffect(() => {
    const savedFavorites = localStorage.getItem('cherry-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // 导航状态
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentBranchIndex: 0,
    currentCommitIndex: 0,
  });

  // UI 状态
  const [isCommandInputActive, setIsCommandInputActive] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);
  
  // Search State - Initialize from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // View 状态：'home' 或 branch index
  const [currentView, setCurrentView] = useState<'home' | number>('home');
  const ITEMS_PER_PAGE = 8;

  // Sync Search with URL (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) {
            params.set('q', searchQuery);
        } else {
            params.delete('q');
        }
        const currentString = searchParams.toString();
        const newString = params.toString();
        
        if (currentString !== newString) {
          router.replace(`/?${newString}`, { scroll: false });
        }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  // Theme persistence state
  const [isMounted, setIsMounted] = useState(false);



  // Initialize state from localStorage after mount
  useEffect(() => {
    setIsMounted(true);
    // Theme - Default to dark if not set
    const savedTheme = localStorage.getItem('cherry-theme') || 'dark';
    setTheme(savedTheme as 'dark' | 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 语言 - 客户端挂载后从 localStorage 同步语言设置
    syncLanguageFromStorage();

    // Visited - 首次访问显示快捷键弹窗
    if (!localStorage.getItem('cherry-visited')) {
      localStorage.setItem('cherry-visited', 'true');
      setIsKeyboardShortcutsOpen(true);
    } else {
        setIsKeyboardShortcutsOpen(false);
    }
  }, []);

  // Handler for theme change - Updates State AND LocalStorage immediately
  const handleThemeChange = useCallback((newTheme: 'dark' | 'light') => {
      setTheme(newTheme);
      localStorage.setItem('cherry-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, []);

  // 关闭快捷键引导
  const handleCloseKeyboardShortcuts = useCallback(() => {
    setIsKeyboardShortcutsOpen(false);
  }, []);

  // 当前 Branch
  const currentBranch = data.branches[navigationState.currentBranchIndex] || null;

  // 更新数据以包含收藏状态
  const dataWithFavorites = {
    ...data,
    branches: data.branches.map((branch) => ({
      ...branch,
      commits: branch.commits.map((commit) => ({
        ...commit,
        ...commit,
        isFavorite: favorites.has(commit.hash),
      })),
    })),
  };

  // 切换收藏状态
  const handleToggleFavorite = useCallback((hash: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(hash)) {
        newSet.delete(hash);
      } else {
        newSet.add(hash);
      }
      // 保存到 localStorage
      localStorage.setItem('cherry-favorites', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  }, []);

  // 是否有弹窗打开
  const isModalOpen = isHelpOpen || isKeyboardShortcutsOpen || isStatisticsOpen;

  // 统计功能
  const { statistics, recordVisit, recordCommand } = useStatistics(data.branches);

  // 打开当前选中的链接
  const handleOpenLink = useCallback(() => {
    if (currentBranch) {
      const commit = currentBranch.commits[navigationState.currentCommitIndex];
      if (commit) {
        // 记录访问
        recordVisit(commit.hash, commit.message, commit.url, currentBranch.name);
        window.open(commit.url, '_blank', 'noopener,noreferrer');
      }
    }
  }, [currentBranch, navigationState.currentCommitIndex, recordVisit]);

  // 聚焦搜索框
  const handleFocusSearch = useCallback(() => {
    setIsCommandInputActive(true);
  }, []);

  // 显示帮助
  const handleShowHelp = useCallback(() => {
    setIsHelpOpen(true);
  }, []);

  // 显示统计弹窗
  const handleShowStatistics = useCallback(() => {
    setIsStatisticsOpen(true);
  }, []);

  // 关闭统计弹窗
  const handleCloseStatistics = useCallback(() => {
    setIsStatisticsOpen(false);
  }, []);

  // 处理标签点击（过滤）
  const handleTagClick = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
    setCurrentPage(1);
  }, []);

  // 清除标签过滤
  const handleClearTags = useCallback(() => {
    setSelectedTags(new Set());
    setCurrentPage(1);
  }, []);

  // 命令执行
  const { executeCommand } = useCommands({
    branches: dataWithFavorites.branches,
    setNavigationState,
    onShowHelp: handleShowHelp,
  });

  // 处理命令输入
  const handleCommand = useCallback(
    (input: string) => {
      // 更新搜索查询（用于高亮）
      setSearchQuery(input);
      setCurrentPage(1);
      const result = executeCommand(input);
      
      // 处理 ls 命令触发下拉
      if (result.type === 'ls') {
        setIsHeaderDropdownOpen(true);
      }

      console.log(`[Cherry] ${result.type}: ${result.output.join('\n')}`);
      
      // 记录命令使用（只记录有效的命令）
      if (result.type !== 'unknown' && input.trim()) {
        const commandParts = input.trim().split(' ')[0];
        recordCommand(commandParts);
      }
    },
    [executeCommand, recordCommand]
  );

  // 处理点击链接
  const handleCommitClick = useCallback(
    (branchIndex: number, commitIndex: number) => {
      setNavigationState({
        currentBranchIndex: branchIndex,
        currentCommitIndex: commitIndex,
      });
      
      // 记录访问
      const branch = data.branches[branchIndex];
      // Note: commitIndex passed here might be global index if from map?
      // Check BranchSection.tsx: it passes startIndex + index. Correct.
      if (branch && branch.commits[commitIndex]) {
        const commit = branch.commits[commitIndex];
        recordVisit(commit.hash, commit.message, commit.url, branch.name);
      }
    },
    [data.branches, recordVisit]
  );

  // ESC 关闭弹窗并清除搜索
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsHelpOpen(false);
        setIsKeyboardShortcutsOpen(false);
        setIsStatisticsOpen(false);
        setIsCommandInputActive(false);
        setSearchQuery('');
        setCurrentPage(1);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // 处理 Dock 点击
  const handleDockClick = useCallback((index: number) => {
    // 如果有标签筛选，先清除
    if (selectedTags.size > 0) {
      handleClearTags();
    }
    
    // 切换到对应 Branch 视图
    setCurrentView(index);

    // 更新导航状态
    setNavigationState(prev => ({
      ...prev,
      currentBranchIndex: index,
      currentCommitIndex: 0,
    }));
    
    // 重置页码
    setCurrentPage(1);
  }, [selectedTags.size, handleClearTags]);

  // 回到主页
  const handleGoHome = useCallback(() => {
    setCurrentView('home');
  }, []);

  // 切换分支处理
  const handlePrevBranch = useCallback((selectLast = false) => {
    const prevIndex = navigationState.currentBranchIndex - 1;
    if (prevIndex >= 0) {
      if (selectLast) {
        // 选中上一个分支的最后一个 Commit
        const prevBranch = dataWithFavorites.branches[prevIndex];
        const lastCommitIndex = Math.max(0, prevBranch.commits.length - 1);
        
        if (selectedTags.size > 0) handleClearTags();
        setCurrentView(prevIndex);
        setNavigationState({
          currentBranchIndex: prevIndex,
          currentCommitIndex: lastCommitIndex,
        });
        setCurrentPage(Math.floor(lastCommitIndex / ITEMS_PER_PAGE) + 1);
      } else {
        handleDockClick(prevIndex);
      }
    }
  }, [navigationState.currentBranchIndex, handleDockClick, dataWithFavorites.branches, selectedTags.size, handleClearTags]);

  const handleNextBranch = useCallback(() => {
    const nextIndex = navigationState.currentBranchIndex + 1;
    if (nextIndex < dataWithFavorites.branches.length) {
      handleDockClick(nextIndex);
    }
  }, [navigationState.currentBranchIndex, dataWithFavorites.branches.length, handleDockClick]);

  // 键盘导航
  useKeyboardNavigation({
    branches: dataWithFavorites.branches,
    navigationState,
    setNavigationState,
    isCommandInputActive,
    isModalOpen,
    onOpenLink: handleOpenLink,
    onFocusSearch: handleFocusSearch,
    onShowHelp: handleShowHelp,
    onShowStatistics: handleShowStatistics,
    onGoHome: handleGoHome,
    onPageChange: setCurrentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    onPrevBranch: handlePrevBranch,
    onNextBranch: handleNextBranch,
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--cherry-bg)] text-[var(--cherry-text)]">
      {/* Header 固定在顶部 */}
      <Header
        config={data.site_config}
        currentBranch={currentBranch}
        theme={theme}
        onThemeChange={handleThemeChange}
        onLogoClick={handleGoHome}
        branches={dataWithFavorites.branches}
        onBranchChange={handleDockClick}
        isDropdownOpen={isHeaderDropdownOpen}
        onToggleDropdown={setIsHeaderDropdownOpen}
      />

      {/* 主内容区域 - 弹性伸缩 + 内部滚动 */}
      <main className="flex-1 overflow-y-auto relative no-scrollbar pb-24">
        {currentView === 'home' ? (
          <HomeView
            slogan={data.site_config.slogan}
            shortcuts={data.site_config.shortcuts}
            branches={dataWithFavorites.branches}
            isCommandInputActive={isCommandInputActive}
            onCommand={handleCommand}
            onFocusSearch={() => setIsCommandInputActive(true)}
            onBlurSearch={() => setIsCommandInputActive(false)}
          />
        ) : (
          <BranchView
            branches={dataWithFavorites.branches}
            navigationState={navigationState}
            onCommitClick={handleCommitClick}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
            onClearTags={handleClearTags}
            onToggleFavorite={handleToggleFavorite}
            activeBranchIndex={typeof currentView === 'number' ? currentView : undefined}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      {/* 底部固定区域 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        {/* Dock 悬浮在底部 */}
        <div className="pointer-events-auto pb-6">
           <Dock
            branches={dataWithFavorites.branches}
            currentBranchIndex={typeof currentView === 'number' ? currentView : -1}
            onBranchClick={handleDockClick}
            onHomeClick={handleGoHome}
            isHome={currentView === 'home'}
          />
        </div>
        
        {/* Footer 固定在最底部背景 */}
        <div className="pointer-events-auto bg-[var(--cherry-bg)]">
          <Footer version={data.site_config.version} />
        </div>
      </div>

      {/* 弹窗组件 */}
      <Suspense fallback={<ModalFallback />}>
        {isHelpOpen && <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />}
      </Suspense>

      <Suspense fallback={<ModalFallback />}>
        {isKeyboardShortcutsOpen && (
          <KeyboardShortcutsModal
            isOpen={isKeyboardShortcutsOpen}
            onClose={handleCloseKeyboardShortcuts}
          />
        )}
      </Suspense>

      <Suspense fallback={<ModalFallback />}>
        {isStatisticsOpen && (
          <StatisticsModal
            isOpen={isStatisticsOpen}
            onClose={handleCloseStatistics}
            statistics={statistics}
          />
        )}
      </Suspense>
    </div>
  );
}

