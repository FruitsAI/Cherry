"use client";

import { useState, useEffect } from 'react';
import type { SiteConfig, Branch } from '../../types';
import { ThemeToggle } from '../ui/ThemeToggle';
import { IconDisplay } from '../ui/IconDisplay';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  config: SiteConfig;
  currentBranch: Branch | null;
  theme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
  onLogoClick?: () => void;
  branches?: Branch[];
  onBranchChange?: (index: number) => void;
  isDropdownOpen?: boolean;
  onToggleDropdown?: (isOpen: boolean) => void;
}

export function Header({ 
  config, 
  currentBranch, 
  theme = 'dark', 
  onThemeChange, 
  onLogoClick, 
  branches, 
  onBranchChange,
  isDropdownOpen = false,
  onToggleDropdown
}: HeaderProps) {
  const { t, i18n } = useTranslation();
  
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Initial set
    setCurrentTime(new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }));

    // Update every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array means this runs once on mount

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--cherry-bg)] border-b border-[var(--cherry-green)]/30">
      {/* Backdrop for closing dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => onToggleDropdown?.(false)}
        />
      )}
      
      <div className="container mx-auto px-4 py-2 flex justify-between items-center font-code text-sm relative z-50">
        {/* 左侧: 用户路径 */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onLogoClick}
          title={t('dock.home')}
          suppressHydrationWarning
        >
          <span className="text-[var(--cherry-green)] glow-green">
            {config.user_name}@cherry
          </span>
          <span className="text-[var(--cherry-muted)]">:</span>
          <span className="text-[var(--cherry-amber)]">~$</span>
          <span className="cursor-blink text-[var(--cherry-green)]">_</span>
        </div>

        {/* 右侧: 分支信息和状态 */}
        <div className="flex items-center gap-4 text-[var(--cherry-muted)]">
          {/* Branch Dropdown */}
          <div className="relative">
            <div 
              className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded transition-colors ${
                isDropdownOpen ? 'bg-[var(--cherry-green)]/10' : 'hover:bg-[var(--cherry-green)]/5'
              }`}
              onClick={() => branches && branches.length > 0 && onToggleDropdown?.(!isDropdownOpen)}
              title={t('header.switcher_tooltip') || "Switch Branch (ls)"}
              suppressHydrationWarning
            >
              <span className="text-[var(--cherry-red)]">{t('header.branch')}:</span>
              <span className="text-[var(--cherry-text)]">
                {currentBranch ? currentBranch.name : 'main'}
              </span>
              {branches && branches.length > 0 && (
                <IconDisplay icon="pixels/caret-down.svg" className="ml-1 opacity-70" imageClassName="w-3 h-3" />
              )}
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && branches && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded-lg shadow-xl py-1 z-50 overflow-hidden">
                {branches.map((branch, index) => (
                  <button
                    key={branch.name}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--cherry-green)]/10 text-[var(--cherry-text)] font-code text-sm flex items-center gap-2 transition-colors"
                    onClick={() => {
                      onBranchChange?.(index);
                      onToggleDropdown?.(false);
                    }}
                  >
                    <IconDisplay icon={branch.icon} className="text-base" imageClassName="w-5 h-5" />
                    <span>{branch.name}</span>
                    {currentBranch?.name === branch.name && (
                       <span className="ml-auto text-[var(--cherry-green)] text-xs">●</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="hidden sm:inline">|</span>
          <span className="hidden md:inline text-[var(--cherry-amber)]" suppressHydrationWarning>
            {currentTime}
          </span>
          <span className="hidden sm:inline">|</span>
          {/* 语言切换 */}
          <button
            onClick={() => i18n.changeLanguage(i18n.language.startsWith('zh') ? 'en' : 'zh')}
            className="hidden sm:block p-1 rounded cursor-pointer text-[var(--cherry-green)] hover:text-[var(--cherry-amber)] hover:scale-110 active:scale-95 transition-all duration-300"
            title={i18n.language.startsWith('zh') ? 'Switch to English' : '切换到中文'}
            suppressHydrationWarning
          >
            <IconDisplay 
              icon="pixels/language.svg" 
              className="text-xl"
              imageClassName="w-6 h-6"
            />
          </button>

          {/* 主题切换 */}
          {onThemeChange && (
            <>
              <span className="hidden sm:inline">|</span>
              <div className="hidden sm:block">
                <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

