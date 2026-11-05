/**
 * DitherCard — v2 统一卡片
 *
 * 替代散落在各处的 terminal-card 直写样式：硬边框 + 偏移阴影
 * + 悬停时淡入的抖动填充。保留原有 className/style 透传，
 * 让 CommitCard 等调用方可以无痛迁移。
 */
import type { CSSProperties, ReactNode } from 'react';
import { DitherBackground } from './dither-background';

interface DitherCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 悬停抖动密度，默认 0.18：够显眼、不抢正文。 */
  hoverDensity?: number;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function DitherCard({
  children,
  className = '',
  style,
  hoverDensity = 0.18,
  onClick,
  role,
  tabIndex,
  onKeyDown,
}: DitherCardProps) {
  return (
    <div
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      style={style}
      className={`dither-card group relative overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-[10px] ${className}`}
    >
      <div className="dither-card-fill absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <DitherBackground density={hoverDensity} className="h-full w-full" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
