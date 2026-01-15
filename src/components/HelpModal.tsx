interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
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
  ];

  const commands = [
    { cmd: 'help', desc: '显示帮助信息' },
    { cmd: 'ls', desc: '列出所有 Branches' },
    { cmd: 'go <n>', desc: '跳转到第 n 个链接' },
    { cmd: 'g <query>', desc: '使用 Google 搜索' },
    { cmd: 'clear', desc: '清除命令历史' },
  ];

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="terminal-card max-w-lg w-full mx-4 p-6 border-[var(--cherry-red)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-pixel text-2xl text-[var(--cherry-red)] glow-red">
            📖 HELP
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--cherry-muted)] hover:text-[var(--cherry-red)] transition-colors"
          >
            [ESC]
          </button>
        </div>

        {/* 键盘快捷键 */}
        <div className="mb-6">
          <h3 className="font-code text-sm text-[var(--cherry-amber)] mb-3">
            ⌨️ Keyboard Shortcuts (Vim Mode)
          </h3>
          <div className="space-y-2">
            {shortcuts.map(({ key, desc }) => (
              <div key={key} className="flex justify-between text-sm font-code">
                <kbd className="px-2 py-0.5 bg-[var(--cherry-bg)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">
                  {key}
                </kbd>
                <span className="text-[var(--cherry-muted)]">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 命令列表 */}
        <div>
          <h3 className="font-code text-sm text-[var(--cherry-amber)] mb-3">
            💻 Terminal Commands
          </h3>
          <div className="space-y-2">
            {commands.map(({ cmd, desc }) => (
              <div key={cmd} className="flex justify-between text-sm font-code">
                <code className="text-[var(--cherry-green)]">{cmd}</code>
                <span className="text-[var(--cherry-muted)]">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-6 pt-4 border-t border-[var(--cherry-green)]/30 text-center">
          <p className="text-xs text-[var(--cherry-muted)]">
            Press <kbd className="text-[var(--cherry-green)]">ESC</kbd> or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
}

