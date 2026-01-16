interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'j / ↓', desc: '向下移动选择' },
    { key: 'k / ↑', desc: '向上移动选择' },
    { key: 'h / ←', desc: '切换到上一个 Branch' },
    { key: 'l / →', desc: '切换到下一个 Branch' },
    { key: 'Enter', desc: '打开选中的链接' },
    { key: '/', desc: '聚焦搜索框' },
    { key: 'Esc', desc: '退出搜索 / 关闭帮助' },
    { key: '?', desc: '显示帮助' },
    { key: 'A', desc: '添加新链接' },
    { key: 'S', desc: '打开设置' },
    { key: 'T', desc: '查看统计' },
  ];

  const commands = [
    { cmd: 'help', desc: '显示帮助信息' },
    { cmd: 'ls', desc: '列出所有 Branches' },
    { cmd: 'go <n>', desc: '跳转到第 n 个链接' },
    { cmd: 'g <query>', desc: '使用 Google 搜索' },
  ];

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="terminal-card max-w-lg w-full mx-4 p-6 border-[var(--cherry-red)] animate-fade-in-up flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div>
            <h2 className="font-pixel text-2xl text-[var(--cherry-red)] glow-red mb-2">
              🎮 欢迎来到 Cherry!
            </h2>
            <p className="text-sm text-[var(--cherry-muted)]">
              你的复古终端风格链接管理器
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--cherry-muted)] hover:text-[var(--cherry-red)] transition-colors"
          >
            [ESC]
          </button>
        </div>

        {/* 内容区域 - 可滚动 */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* 键盘快捷键 */}
          <div>
            <h3 className="font-code text-sm text-[var(--cherry-amber)] mb-3">
              ⌨️ 键盘快捷键 (Vim 模式)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {shortcuts.map(({ key, desc }) => (
                <div key={key} className="flex flex-col p-2 bg-[var(--cherry-bg)] rounded">
                  <kbd className="px-2 py-1 text-xs font-code bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)] text-center mb-1">
                    {key}
                  </kbd>
                  <span className="text-xs text-[var(--cherry-muted)] text-center">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 命令列表 */}
          <div>
            <h3 className="font-code text-sm text-[var(--cherry-amber)] mb-3">
              💻 终端命令
            </h3>
            <div className="space-y-2">
              {commands.map(({ cmd, desc }) => (
                <div key={cmd} className="flex justify-between text-sm font-code p-2 bg-[var(--cherry-bg)] rounded">
                  <code className="text-[var(--cherry-green)]">{cmd}</code>
                  <span className="text-[var(--cherry-muted)]">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="pt-4 border-t border-[var(--cherry-green)]/30 flex-shrink-0">
          <p className="text-sm text-[var(--cherry-muted)] text-center mb-4">
            按 <kbd className="text-[var(--cherry-green)]">ESC</kbd> 或点击外部关闭
          </p>
          <button
            onClick={onClose}
            className="w-full button-retro py-3 px-6 bg-[var(--cherry-red)] text-white font-code text-sm hover:bg-[var(--cherry-red)]/80 transition-all"
          >
            开始使用 🚀
          </button>
        </div>
      </div>
    </div>
  );
}