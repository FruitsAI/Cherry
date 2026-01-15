import { useState, useCallback, useEffect } from 'react';
import { Header, Hero, CommandInput, ContentGrid, HelpModal } from './components';
import { useKeyboardNavigation, useCommands } from './hooks';
import type { CherryData, NavigationState } from './types';
import cherryData from './data/data.json';

function App() {
  // 数据
  const data = cherryData as CherryData;

  // 导航状态
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentBranchIndex: 0,
    currentCommitIndex: 0,
  });

  // UI 状态
  const [isCommandInputActive, setIsCommandInputActive] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // 当前 Branch
  const currentBranch = data.branches[navigationState.currentBranchIndex] || null;

  // 打开当前选中的链接
  const handleOpenLink = useCallback(() => {
    if (currentBranch) {
      const commit = currentBranch.commits[navigationState.currentCommitIndex];
      if (commit) {
        window.open(commit.url, '_blank', 'noopener,noreferrer');
      }
    }
  }, [currentBranch, navigationState.currentCommitIndex]);

  // 聚焦搜索框
  const handleFocusSearch = useCallback(() => {
    setIsCommandInputActive(true);
  }, []);

  // 显示帮助
  const handleShowHelp = useCallback(() => {
    setIsHelpOpen(true);
  }, []);

  // 键盘导航
  useKeyboardNavigation({
    branches: data.branches,
    navigationState,
    setNavigationState,
    isCommandInputActive,
    onOpenLink: handleOpenLink,
    onFocusSearch: handleFocusSearch,
    onShowHelp: handleShowHelp,
  });

  // 命令执行
  const { executeCommand } = useCommands({
    branches: data.branches,
    setNavigationState,
    onShowHelp: handleShowHelp,
  });

  // 处理命令输入
  const handleCommand = useCallback(
    (input: string) => {
      const result = executeCommand(input);
      console.log(`[Cherry] ${result.type}: ${result.output.join('\n')}`);
    },
    [executeCommand]
  );

  // 处理点击链接
  const handleCommitClick = useCallback(
    (branchIndex: number, commitIndex: number) => {
      setNavigationState({
        currentBranchIndex: branchIndex,
        currentCommitIndex: commitIndex,
      });
    },
    []
  );

  // ESC 关闭帮助
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsHelpOpen(false);
        setIsCommandInputActive(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header 状态栏 */}
      <Header config={data.site_config} currentBranch={currentBranch} />

      {/* Hero 区域 */}
      <Hero slogan={data.site_config.slogan} />

      {/* 命令行搜索 */}
      <CommandInput
        onCommand={handleCommand}
        isActive={isCommandInputActive}
        onFocus={() => setIsCommandInputActive(true)}
        onBlur={() => setIsCommandInputActive(false)}
      />

      {/* 主内容网格 */}
      <ContentGrid
        branches={data.branches}
        navigationState={navigationState}
        onCommitClick={handleCommitClick}
      />

      {/* 帮助模态框 */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;
