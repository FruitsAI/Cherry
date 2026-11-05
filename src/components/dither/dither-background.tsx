/**
 * DitherBackground — 静态 Bayer 抖动背景层
 *
 * 纯 SVG、无动画、无逐帧绘制：渲染一次后即为静态层，
 * 对首屏和滚动性能几乎零持续开销。装饰性内容，aria-hidden。
 */
import { useId } from 'react';
import { bayerCells, DITHER_CELL } from '../../lib/dither';

interface DitherBackgroundProps {
  /** 0..1，点密度越大越“实”。 */
  density?: number;
  /** 点的颜色，默认主题绿。 */
  color?: string;
  /** 额外 className，常用于定位（absolute inset-0 等）。 */
  className?: string;
}

export function DitherBackground({
  density = 0.3,
  color = 'var(--cherry-green)',
  className = '',
}: DitherBackgroundProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const cells = bayerCells(density);
  const size = DITHER_CELL * 4;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={`dither-${id}`} width={size} height={size} patternUnits="userSpaceOnUse">
          {cells.flatMap((row, y) =>
            row.map((on, x) =>
              on ? (
                <rect
                  key={`${x}-${y}`}
                  x={x * DITHER_CELL}
                  y={y * DITHER_CELL}
                  width={DITHER_CELL}
                  height={DITHER_CELL}
                  fill={color}
                />
              ) : null,
            ),
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#dither-${id})`} />
    </svg>
  );
}
