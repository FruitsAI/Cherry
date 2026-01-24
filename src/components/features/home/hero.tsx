/**
 * 🍒 Cherry - Hero 组件
 *
 * 首页的主视觉区域，包含 Logo、标题和打字机动画标语。
 * 中心化展示，给用户留下第一印象。
 *
 * @file src/components/features/home/hero.tsx
 *
 * @description
 * 特性：
 * - Cherry Logo（带辉光动画）
 * - 打字机效果的 Slogan
 * - 键盘快捷键提示
 */
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

/** Hero 组件 Props */
interface HeroProps {
  /** 标语文本 */
  slogan: string;
}

/**
 * Hero 组件
 *
 * @description
 * 使用 interval 定时器实现打字机效果，
 * 在组件挂载后逐字显示 slogan。
 */
export function Hero({ slogan }: HeroProps) {
  const { t } = useTranslation();
  const [displayText, setDisplayText] = useState('');
  const fullText = `> ${slogan}`;

  // 打字机效果
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <section className="text-center">
      {/* 像素风 Cherry 图标 */}
      <div className="mb-4 flex justify-center animate-fade-in-up">
        <div className="relative animate-float">
          <Image
            src="/pixels/cherry.svg"
            alt="Cherry"
            width={192}
            height={192}
            priority
            className="icon-retro w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 drop-shadow-[0_0_15px_rgba(255,0,85,0.6)]"
          />
          {/* 辉光效果 */}
          <div className="absolute inset-0 bg-[var(--cherry-red)] opacity-30 blur-2xl rounded-full animate-pulse" />
        </div>
      </div>

      {/* 标题 */}
      <div className="flex items-center justify-center gap-2 mb-2 animate-fade-in-up animate-delay-100">
         <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[var(--cherry-red)] glow-red text-balance">
          CHERRY
         </h1>
      </div>

      {/* 打字机 Slogan */}
      <div className="font-code text-lg sm:text-xl text-[var(--cherry-green)] glow-green animate-fade-in-up animate-delay-200 mb-4">
        <span>{displayText}</span>
        <span className="inline-block w-3 h-6 bg-[var(--cherry-green)] ml-1 animate-cursor-blink" />
      </div>

      {/* 帮助提示 */}
      <p 
        className="hidden sm:block mt-2 text-xs sm:text-sm text-[var(--cherry-muted)] font-code animate-fade-in-up animate-delay-300 px-4"
        suppressHydrationWarning
      >
        {t('hero.hints.press')} <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">/</kbd> {t('hero.hints.search')}
        {' '} | {' '}
        <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">j</kbd>
        <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">k</kbd> {t('hero.hints.navigate')}
        {' '} | {' '}
        <kbd className="px-2 py-1 bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/30 rounded text-[var(--cherry-green)]">?</kbd> {t('hero.hints.help')}
      </p>
    </section>
  );
}

