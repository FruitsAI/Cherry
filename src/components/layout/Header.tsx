/**
 * 🍒 Cherry - 页头组件
 *
 * 应用顶部固定导航栏，显示用户路径、分支切换器、时间和主题切换。
 * 模拟终端命令行提示符的视觉风格。
 *
 * @file src/components/layout/header.tsx
 *
 * @description
 * 功能：
 * - 用户路径显示：user@cherry:~$
 * - 分支切换下拉菜单（ls 命令触发）
 * - 实时时间显示
 * - 语言切换（中/英）
 * - 主题切换（深色/浅色）
 */
"use client";

import { useTranslation } from 'react-i18next';
import type { SiteConfig, Branch } from '../../types';
import { ThemeToggle } from '../ui/theme-toggle';
import { IconDisplay } from '../ui/icon-display';
import { CurrentTime } from './current-time';

/** Header 组件 Props */
interface HeaderProps {
  /** 站点配置 */
  config: SiteConfig;
  /** 当前选中的分支 */
  currentBranch: Branch | null;
  /** 当前主题 */
  theme?: 'dark' | 'light';
  /** 主题变更回调 */
  onThemeChange?: (theme: 'dark' | 'light') => void;
  /** Logo 点击回调（返回首页） */
  onLogoClick?: () => void;
  /** 所有分支（用于下拉菜单） */
  branches?: Branch[];
  /** 分支切换回调 */
  onBranchChange?: (index: number) => void;
  /** 下拉菜单是否打开 */
  isDropdownOpen?: boolean;
  /** 切换下拉菜单状态 */
  onToggleDropdown?: (isOpen: boolean) => void;
}

/**
 * 页头组件
 *
 * @description
 * 固定在视口顶部的导航栏，包含用户路径和各种控制按钮。
 * 分支下拉菜单支持键盘导航和点击外部关闭。
 */
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

  // 处理语言切换
  // 使用函数来确保正确判断当前语言并切换
  const handleLanguageToggle = async () => {
    // 获取当前语言的基础代码（去掉地区后缀如 -CN）
    const currentLang = i18n.language?.split('-')[0] || 'zh';
    const targetLang = currentLang === 'zh' ? 'en' : 'zh';
    
    // 切换语言并等待完成
    await i18n.changeLanguage(targetLang);
    
    // 确保 localStorage 更新
    localStorage.setItem('cherry-language', targetLang);
  };

  // 获取当前语言用于显示
  const isCurrentChinese = (i18n.language?.split('-')[0] || 'zh') === 'zh';

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
              className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded transition-colors ${
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
                <IconDisplay icon="pixels/caret-down.svg" className="ml-px opacity-70" imageClassName="w-3 h-3" />
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
          <CurrentTime />
          <span className="hidden sm:inline">|</span>
          {/* 语言切换 */}
          <button
            onClick={handleLanguageToggle}
            className="hidden sm:block p-1 rounded cursor-pointer text-[var(--cherry-green)] hover:text-[var(--cherry-amber)] hover:scale-110 active:scale-95 transition-all duration-300"
            title={isCurrentChinese ? 'Switch to English' : '切换到中文'}
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

