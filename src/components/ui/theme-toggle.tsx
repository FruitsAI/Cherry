/**
 * 🍒 Cherry - 主题切换组件
 *
 * 深色/浅色主题切换按钮。
 * 点击时切换主题并更新 DOM 属性。
 *
 * @file src/components/ui/theme-toggle.tsx
 *
 * @description
 * 工作原理：
 * 1. 通过 props 接收当前主题状态
 * 2. 点击时调用 onThemeChange 回调
 * 3. useEffect 监听主题变化并更新 DOM
 *
 * 注意：localStorage 持久化由 client-app.tsx 处理
 */
"use client";

import { useEffect } from 'react';
import { IconDisplay } from './icon-display';

/** 主题类型 */
type Theme = 'dark' | 'light';

/** ThemeToggle 组件 Props */
interface ThemeToggleProps {
  /** 当前主题 */
  theme: Theme;
  /** 主题变更回调 */
  onThemeChange: (theme: Theme) => void;
}

/**
 * 主题切换组件
 *
 * @description
 * 显示太阳/月亮图标，点击切换深色/浅色模式。
 */
export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  // 应用主题到 HTML 元素
  // 注意：localStorage 的保存已在 client-app.tsx 的 handleThemeChange 中完成
  // 这里只负责更新 DOM 属性
  useEffect(() => {
    const root = document.documentElement;
    // 统一设置 data-theme 属性，无论是 dark 还是 light
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleToggle = () => {
    onThemeChange(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleToggle}
      className="p-1 rounded cursor-pointer text-[var(--cherry-green)] hover:text-[var(--cherry-amber)] hover:scale-110 active:scale-95 hover:rotate-12 transition-all duration-300"
      title={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
      suppressHydrationWarning
    >
      <IconDisplay 
        icon={theme === 'dark' ? 'pixels/theme_dark.svg' : 'pixels/theme_light.svg'} 
        className="text-xl"
        imageClassName="w-6 h-6"
      />
    </button>
  );
}