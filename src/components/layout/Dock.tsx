/**
 * 🍒 Cherry - Dock 组件
 *
 * 底部悬浮的分支快捷切换栏，类似 macOS Dock 的交互体验。
 * 提供快速切换到不同分支或返回首页的功能。
 *
 * @file src/components/layout/dock.tsx
 *
 * @description
 * 特性：
 * - 毛玻璃背景效果
 * - 悬停放大动画（类似 macOS Dock）
 * - 活跃状态的脉冲指示器
 * - 底部反射效果
 * - Tooltip 显示分支名称
 */
"use client";

import type { Branch } from '../../types';
import { IconDisplay } from '../ui/icon-display';
import { useTranslation } from 'react-i18next';

/** Dock 组件 Props */
interface DockProps {
  /** 所有分支数据 */
  branches: Branch[];
  /** 当前激活的分支索引 */
  currentBranchIndex: number;
  /** 分支点击回调 */
  onBranchClick: (index: number) => void;
  /** 首页按钮点击回调 */
  onHomeClick?: () => void;
  /** 是否处于首页视图 */
  isHome?: boolean;
}

/**
 * Dock 组件
 *
 * @description
 * 渲染固定在屏幕底部的悬浮导航栏。
 * 包含首页按钮和所有分支的快捷图标。
 */
export function Dock({ branches, currentBranchIndex, onBranchClick, onHomeClick, isHome = false }: DockProps) {
  const { t } = useTranslation();
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end gap-2 px-4 py-3 bg-[var(--cherry-bg-secondary)]/90 backdrop-blur-md border border-[var(--cherry-green)]/30 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02] hover:border-[var(--cherry-green)] hover:shadow-[0_0_20px_rgba(46,204,113,0.2)]">
        {/* Home Button */}
        {onHomeClick && (
          <button
            onClick={onHomeClick}
            className={`group relative flex flex-col items-center justify-center p-3 min-w-[3rem] min-h-[3rem] rounded-xl cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:mx-1 ${
              isHome
                ? 'bg-[var(--cherry-green)]/10 text-[var(--cherry-red)] scale-110'
                : 'text-[var(--cherry-muted)] hover:text-[var(--cherry-text)] hover:bg-[var(--cherry-green)]/5'
            }`}
          >
           {/* Tooltip */}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-code bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50 backdrop-blur-sm" suppressHydrationWarning>
              {t('dock.home')}
            </span>
            
            <IconDisplay 
              icon="pixels/home.svg" 
              className="text-2xl transform transition-transform duration-300 group-hover:scale-125 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
              imageClassName="w-8 h-8"
            />
            
            {/* Indicator for active */}
            {isHome && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-[var(--cherry-red)] rounded-full shadow-[0_0_8px_var(--cherry-red)] animate-pulse" />
            )}
             
            {/* Reflection effect for active */}
            {isHome && (
               <div className="absolute -bottom-4 left-0 right-0 h-4 bg-gradient-to-b from-[var(--cherry-red)]/20 to-transparent blur-sm transform scale-y-[-1] opacity-50 pointer-events-none w-full mask-image-b" />
            )}
          </button>
        )}
        
        {/* Separator */}
        {onHomeClick && <div className="w-px h-8 bg-[var(--cherry-muted)]/20 mx-1" />}

        {branches.map((branch, index) => (
          <button
            key={branch.name}
            onClick={() => onBranchClick(index)}
            className={`group relative flex flex-col items-center justify-center p-3 min-w-[3rem] min-h-[3rem] rounded-xl cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:mx-1 ${
              index === currentBranchIndex && !isHome
                ? 'bg-[var(--cherry-green)]/10 text-[var(--cherry-red)] scale-110'
                : 'text-[var(--cherry-muted)] hover:text-[var(--cherry-text)] hover:bg-[var(--cherry-green)]/5'
            }`}
          >
            {/* Tooltip */}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-code bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50 backdrop-blur-sm" suppressHydrationWarning>
              {branch.name}
            </span>
            
            <IconDisplay 
              icon={branch.icon} 
              className="text-2xl transform transition-transform duration-300 group-hover:scale-125 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
              imageClassName="w-8 h-8"
            />
            
            {/* Indicator for active */}
            {index === currentBranchIndex && !isHome && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-[var(--cherry-red)] rounded-full shadow-[0_0_8px_var(--cherry-red)] animate-pulse" />
            )}
            
            {/* Reflection effect for active */}
            {index === currentBranchIndex && !isHome && (
               <div className="absolute -bottom-4 left-0 right-0 h-4 bg-gradient-to-b from-[var(--cherry-red)]/20 to-transparent blur-sm transform scale-y-[-1] opacity-50 pointer-events-none w-full mask-image-b" />
            )}
          </button>
        ))}

        {/* Settings Button */}

      </div>
    </div>
  );
}
