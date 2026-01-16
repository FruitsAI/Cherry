import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Header, Hero, CommandInput, ContentGrid } from './components';
import { useKeyboardNavigation, useCommands, useStatistics } from './hooks';
import type { CherryData, NavigationState } from './types';
import cherryData from './data/data.json';

// 延迟加载模态框组件
const HelpModal = lazy(() => import('./components/HelpModal').then(m => ({ default: m.HelpModal })));
const AddModal = lazy(() => import('./components/AddModal').then(m => ({ default: m.AddModal })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const KeyboardShortcutsModal = lazy(() => import('./components/KeyboardShortcutsModal').then(m => ({ default: m.KeyboardShortcutsModal })));
const StatisticsModal = lazy(() => import('./components/StatisticsModal').then(m => ({ default: m.StatisticsModal })));

// 加载占位符
function ModalFallback() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="terminal-card p-6 border-[var(--cherry-red)]">
        <p className="text-[var(--cherry-muted)] font-code">加载中...</p>
      </div>
    </div>
  );
}

function App() {
  // 数据
  const [data] = useState<CherryData>(cherryData as CherryData);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    // 从 localStorage 读取收藏列表
    const savedFavorites = localStorage.getItem('cherry-favorites');
    return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
  });

  // 导航状态
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentBranchIndex: 0,
    currentCommitIndex: 0,
  });

  // UI 状态
  const [isCommandInputActive, setIsCommandInputActive] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    // 从 localStorage 读取主题偏好
    const savedTheme = localStorage.getItem('cherry-theme');
    return (savedTheme === 'light' ? 'light' : 'dark');
  });
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // 检查是否首次访问
  useEffect(() => {
    const hasVisited = localStorage.getItem('cherry-visited');
    if (!hasVisited) {
      setIsKeyboardShortcutsOpen(true);
      localStorage.setItem('cherry-visited', 'true');
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
  const isModalOpen = isHelpOpen || isAddOpen || isSettingsOpen || isKeyboardShortcutsOpen || isStatisticsOpen;

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

  // 显示 Add 弹窗
  const handleShowAdd = useCallback(() => {
    setIsAddOpen(true);
  }, []);

  // 关闭 Add 弹窗
  const handleCloseAdd = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  // 显示设置弹窗
  const handleShowSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  // 关闭设置弹窗
  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
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
  }, []);

  // 清除标签过滤
  const handleClearTags = useCallback(() => {
    setSelectedTags(new Set());
  }, []);

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
    onShowAdd: handleShowAdd,
    onShowSettings: handleShowSettings,
    onShowStatistics: handleShowStatistics,
  });

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
      const result = executeCommand(input);
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
        setIsAddOpen(false);
        setIsSettingsOpen(false);
        setIsKeyboardShortcutsOpen(false);
        setIsStatisticsOpen(false);
        setIsCommandInputActive(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header 状态栏 */}
      <Header
        config={data.site_config}
        currentBranch={currentBranch}
        onAdd={handleShowAdd}
        onSettings={handleShowSettings}
        onStatistics={handleShowStatistics}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Hero 区域 */}
      <Hero slogan={data.site_config.slogan} />

      {/* 命令行搜索 */}
      <CommandInput
        onCommand={handleCommand}
        isActive={isCommandInputActive}
        onFocus={() => setIsCommandInputActive(true)}
        onBlur={() => setIsCommandInputActive(false)}
        branches={dataWithFavorites.branches}
      />

      {/* 主内容网格 */}
      <ContentGrid
        branches={dataWithFavorites.branches}
        navigationState={navigationState}
        onCommitClick={handleCommitClick}
        searchQuery={searchQuery}
        selectedTags={selectedTags}
        onTagClick={handleTagClick}
        onClearTags={handleClearTags}
        onToggleFavorite={handleToggleFavorite}
        version={data.site_config.version}
      />

      {/* 帮助模态框 */}
      <Suspense fallback={<ModalFallback />}>
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </Suspense>

      {/* 首次访问快捷键引导 */}
      <Suspense fallback={<ModalFallback />}>
        <KeyboardShortcutsModal
          isOpen={isKeyboardShortcutsOpen}
          onClose={handleCloseKeyboardShortcuts}
        />
      </Suspense>

      {/* Add 模态框 */}
      <Suspense fallback={<ModalFallback />}>
        <AddModal
          isOpen={isAddOpen}
          onClose={handleCloseAdd}
          branches={dataWithFavorites.branches.map((b) => ({ name: b.name, icon: b.icon }))}
        />
      </Suspense>

      {/* 设置模态框 */}
      <Suspense fallback={<ModalFallback />}>
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={handleCloseSettings}
          data={data}
        />
      </Suspense>

      {/* 统计模态框 */}
      <Suspense fallback={<ModalFallback />}>
        <StatisticsModal
          isOpen={isStatisticsOpen}
          onClose={handleCloseStatistics}
          statistics={statistics}
        />
      </Suspense>
    </div>
  );
}

export default App;
