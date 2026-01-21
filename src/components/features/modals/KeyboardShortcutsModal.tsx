"use client";

import { useTranslation } from 'react-i18next';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'j / ↓', desc: t('modal.help.keys.down') },
    { key: 'k / ↑', desc: t('modal.help.keys.up') },
    { key: 'h / ←', desc: t('modal.help.keys.prev_branch') },
    { key: 'l / →', desc: t('modal.help.keys.next_branch') },
    { key: 'Enter', desc: t('modal.help.keys.open_link') },
    { key: '/', desc: t('modal.help.keys.focus_search') },
    { key: 'Esc', desc: t('modal.help.keys.close') },
    { key: '?', desc: t('modal.help.keys.help') },


    { key: 'T', desc: t('modal.help.keys.stats') },
  ];

  const commands = [
    { cmd: 'help', desc: t('modal.help.command_desc.help') },
    { cmd: 'ls', desc: t('modal.help.command_desc.ls') },
    { cmd: 'go <n>', desc: t('modal.help.command_desc.go') },
    { cmd: 'g <query>', desc: t('modal.help.command_desc.google') },
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
              {t('modal.welcome.title')}
            </h2>
            <p className="text-sm text-[var(--cherry-muted)]">
              {t('modal.welcome.subtitle')}
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
              ⌨️ {t('modal.shortcuts.title')} (Vim)
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
              💻 {t('modal.help.commands')}
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
            {t('modal.statistics.tip_close', { defaultValue: 'Press ESC or click outside to close' })}
          </p>
          <button
            onClick={onClose}
            className="w-full button-retro py-3 px-6 bg-[var(--cherry-red)] text-white font-code text-sm hover:bg-[var(--cherry-red)]/80 transition-all"
          >
            {t('modal.welcome.start')}
          </button>
        </div>
      </div>
    </div>
  );
}