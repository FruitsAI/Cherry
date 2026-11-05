/**
 * Cherry v2 — Dither 设计令牌
 *
 * 参考来源（未直接复制其源码）：
 * - dithercn.dev：Bayer / blue-noise 阈值矩阵、WebGL 与 SVG/CSS 两种
 *   渲染路径、按主题变量取色、离屏暂停与 reduced motion 的做法。
 * - ditherui.dev：Dither Button（悬停时抖动填充跟随指针生长）、
 *   Dither Avatar（棋盘格抖动格）的交互语言。
 * - dither-kit（tripwire.sh）：抖动填充图表、图例与可 scrub 的
 *   tooltip 思路，本项目先以 DitherMeter 落地最常用的一条。
 *
 * 本文件只做一件事：把“抖动”变成可预测、可测试的纯函数。
 * 渲染层（SVG/CSS）不做逐帧 WebGL，避免给起始页增加持续的
 * GPU/CPU 开销——起始页的第一职责是快，其次才是好看。
 */

/** 经典 4x4 Bayer 有序抖动矩阵，值域 0..15。 */
export const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

/** 抖动格尺寸（CSS px），与 dithercn 的 --dither-cell 概念对应。 */
export const DITHER_CELL = 4;

/**
 * 按密度返回 4x4 的开/关格子。
 * @param density 0..1，0 为全空、1 为全满；超出范围会被钳制。
 */
export function bayerCells(density: number): boolean[][] {
  const clamped = Math.min(1, Math.max(0, density));
  const threshold = clamped * 16;
  return BAYER_4.map((row) => row.map((value) => value < threshold));
}

/** 设计令牌：深/浅主题下的抖动墨色与纸色，复用现有 Cherry 变量。 */
export const DITHER_TOKENS = {
  /** 抖动点的颜色：默认用主题绿，卡片悬停等场景可传入其它变量。 */
  ink: 'var(--cherry-green)',
  /** 抖动层背后的纸色。 */
  paper: 'var(--cherry-bg)',
  cell: DITHER_CELL,
} as const;

export type DitherDensity = number;
