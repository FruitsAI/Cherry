import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import type { Branch } from '../types';

interface CommandInputProps {
  onCommand: (command: string) => void;
  isActive: boolean;
  onFocus: () => void;
  onBlur: () => void;
  branches?: Branch[];
}

export function CommandInput({
  onCommand,
  isActive,
  onFocus,
  onBlur,
  branches = [],
}: CommandInputProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // 当激活时聚焦输入框
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // 生成搜索建议
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const query = input.toLowerCase().trim();
    
    // 命令建议
    const commands = ['help', 'ls', 'go', 'g', 'clear'];
    const commandSuggestions = commands.filter((cmd) => cmd.startsWith(query));

    // 链接建议
    const linkSuggestions: string[] = [];
    branches.forEach((branch) => {
      branch.commits.forEach((commit) => {
        if (commit.message.toLowerCase().includes(query)) {
          linkSuggestions.push(commit.message);
        }
        commit.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(query) && !linkSuggestions.includes(tag)) {
            linkSuggestions.push(tag);
          }
        });
      });
    });

    // 合并建议，优先显示命令
    const allSuggestions = [
      ...commandSuggestions.map((s) => `/${s}`),
      ...linkSuggestions.slice(0, 5),
    ];

    setSuggestions(allSuggestions);
    setSelectedIndex(-1);
  }, [input, branches]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        // 选择建议
        const selectedSuggestion = suggestions[selectedIndex];
        const isCommand = selectedSuggestion.startsWith('/');
        
        if (isCommand) {
          setInput(selectedSuggestion.slice(1));
        } else {
          setInput(selectedSuggestion);
        }
        setSuggestions([]);
        setSelectedIndex(-1);
      } else if (input.trim()) {
        onCommand(input.trim());
        setHistory((prev) => [...prev, input.trim()]);
        setInput('');
        setHistoryIndex(-1);
        setSuggestions([]);
        setSelectedIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setInput('');
      setSuggestions([]);
      setSelectedIndex(-1);
      onBlur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0 && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      } else if (history.length > 0) {
        const newIndex =
          historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
        setSuggestions([]);
        setSelectedIndex(-1);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0 && selectedIndex < suggestions.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      } else if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
          setSuggestions([]);
          setSelectedIndex(-1);
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
          setSuggestions([]);
          setSelectedIndex(-1);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        const nextIndex = (selectedIndex + 1) % suggestions.length;
        setSelectedIndex(nextIndex);
        const selectedSuggestion = suggestions[nextIndex];
        const isCommand = selectedSuggestion.startsWith('/');
        setInput(isCommand ? selectedSuggestion.slice(1) : selectedSuggestion);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const isCommand = suggestion.startsWith('/');
    setInput(isCommand ? suggestion.slice(1) : suggestion);
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 mb-8 relative">
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

      {/* 搜索建议 */}
      {suggestions.length > 0 && isActive && (
        <div className="terminal-card mt-2 p-2 border-[var(--cherry-green)]/30">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-3 py-2 font-code text-sm cursor-pointer transition-all ${
                index === selectedIndex
                  ? 'bg-[var(--cherry-red)] text-white'
                  : 'text-[var(--cherry-text)] hover:bg-[var(--cherry-bg-secondary)]'
              }`}
            >
              {suggestion.startsWith('/') ? (
                <span>
                  <span className="text-[var(--cherry-amber)]">/</span>
                  {suggestion.slice(1)}
                </span>
              ) : (
                suggestion
              )}
            </div>
          ))}
        </div>
      )}

      {/* 命令提示 */}
      <div className="mt-2 text-xs text-[var(--cherry-muted)] font-code text-center">
        <span className="text-[var(--cherry-amber)]">Commands:</span>{' '}
        <code className="text-[var(--cherry-green)]">help</code> |{' '}
        <code className="text-[var(--cherry-green)]">ls</code> |{' '}
        <code className="text-[var(--cherry-green)]">go &lt;n&gt;</code> |{' '}
        <code className="text-[var(--cherry-green)]">g &lt;query&gt;</code>
        {' '}|{' '}
        <span className="text-[var(--cherry-amber)]">Tips:</span>{' '}
        <code className="text-[var(--cherry-green)]">Tab</code> 选择建议
      </div>
    </div>
  );
}