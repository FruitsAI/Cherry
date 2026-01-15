import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';

interface CommandInputProps {
  onCommand: (command: string) => void;
  isActive: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

export function CommandInput({
  onCommand,
  isActive,
  onFocus,
  onBlur,
}: CommandInputProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // 当激活时聚焦输入框
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      onCommand(input.trim());
      setHistory((prev) => [...prev, input.trim()]);
      setInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'Escape') {
      setInput('');
      onBlur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 mb-8">
      <div
        className={`terminal-card p-4 ${
          isActive ? 'border-[var(--cherry-red)]' : ''
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 font-code">
          <span className="text-[var(--cherry-green)]">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="Type a command or search... (help for commands)"
            className="flex-1 bg-transparent border-none outline-none text-[var(--cherry-text)] placeholder-[var(--cherry-muted)] caret-[var(--cherry-green)]"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="cursor-blink text-[var(--cherry-green)]">█</span>
        </div>
      </div>

      {/* 命令提示 */}
      <div className="mt-2 text-xs text-[var(--cherry-muted)] font-code text-center">
        <span className="text-[var(--cherry-amber)]">Commands:</span>{' '}
        <code className="text-[var(--cherry-green)]">help</code> |{' '}
        <code className="text-[var(--cherry-green)]">ls</code> |{' '}
        <code className="text-[var(--cherry-green)]">go &lt;n&gt;</code> |{' '}
        <code className="text-[var(--cherry-green)]">g &lt;query&gt;</code>
      </div>
    </div>
  );
}

