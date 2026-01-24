/**
 * 🍒 Cherry - 页脚组件
 *
 * 应用底部固定的页脚，显示版本号、标语和 GitHub 链接。
 *
 * @file src/components/layout/footer.tsx
 *
 * @description
 * 显示内容：
 * - 应用版本号
 * - 标语 (slogan)
 * - GitHub 仓库链接
 */
"use client";

import { useTranslation } from 'react-i18next';

/** Footer 组件 Props */
interface FooterProps {
  /** 版本号字符串 */
  version?: string;
}

/**
 * 页脚组件
 *
 * @param props.version - 应用版本号
 */
export function Footer({ version = '{version}' }: FooterProps) {
  const { t } = useTranslation();

  return (
    <footer className="py-1 border-t border-[var(--cherry-green)]/20 text-center bg-[var(--cherry-bg-secondary)]/50 backdrop-blur-sm">
      <p className="text-xs text-[var(--cherry-muted)] font-code">
        <span className="text-[var(--cherry-green)]">🍒</span> <span suppressHydrationWarning>{t('footer.version', { version: version.replace('v', '') })}</span>
        {' '}|{' '}
        <span className="text-[var(--cherry-amber)]" suppressHydrationWarning>{t('app.slogan')}</span>
        {' '}|{' '}
        <a
          href="https://github.com/FruitsAI/Cherry"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--cherry-red)]"
        >
          {t('header.fork')}
        </a>
      </p>
    </footer>
  );
}
