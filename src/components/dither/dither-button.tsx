/**
 * DitherButton — v2 统一按钮
 *
 * 语言来自 ditherui 的 Dither Button：方角、硬边、按下时
 * 沉入偏移阴影；悬停时抖动填充从下方生长（CSS 过渡，
 * 无 JS 跟踪指针，避免 mousemove 重渲染）。
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { DitherBackground } from './dither-background';

interface DitherButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** 主按钮：绿底黑字；默认：透明底绿字绿边。 */
  variant?: 'primary' | 'default';
}

export function DitherButton({
  children,
  variant = 'default',
  className = '',
  ...props
}: DitherButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <button
      {...props}
      className={`dither-button group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden border px-4 py-2 font-code text-sm tracking-wide transition-all duration-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
        isPrimary
          ? 'border-[var(--cherry-green)] bg-[var(--cherry-green)] text-black shadow-[4px_4px_0_rgba(0,0,0,0.6)]'
          : 'border-[var(--cherry-green)] bg-transparent text-[var(--cherry-green)] shadow-[4px_4px_0_rgba(0,0,0,0.4)]'
      } ${className}`}
    >
      <span className="absolute inset-x-0 bottom-0 h-0 transition-all duration-200 group-hover:h-full">
        <DitherBackground
          density={isPrimary ? 0.12 : 0.22}
          color={isPrimary ? 'var(--cherry-bg)' : 'var(--cherry-green)'}
          className="h-full w-full opacity-60"
        />
      </span>
      <span className="relative">{children}</span>
    </button>
  );
}
