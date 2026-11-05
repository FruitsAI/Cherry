/**
 * 🍒 Cherry — dithercn 包装层
 *
 * 本文件只放 Cherry 自己的组合，不复制 dithercn 示例源码：
 * - HeroGlow：全站唯一的 WebGL shader（dither-glow），慢速、离屏暂停、
 *   reduced motion 下由引擎自动静止；
 * - PageDither：整页底层静态点阵（CSS fillStyle，无 JS 逐帧开销）；
 * - CherryMeter：统计弹窗的抖动占比条（fillStyle + 语义 progressbar）。
 */
"use client";

import { DitherGlow } from "./dither-glow";
import { fillStyle } from "@/lib/dither";
import type { DitherColor } from "@/lib/dither";

/** Hero 后的红色抖动光晕：唯一 shader，慢速漂移。 */
export function HeroGlow({ className = "" }: { className?: string }) {
  return (
    <DitherGlow
      position="top"
      radius={0.5}
      intensity={0.35}
      palette={["--dither-paper", "red"]}
      speed={0.25}
      stillTime={6}
      className={className}
    />
  );
}

/** 整页底层静态抖动点阵（密度由 fillStyle 的 dotted 固定覆盖 + 外层 opacity 控制）。 */
export function PageDither({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={fillStyle("dotted", { color: "green" })}
    />
  );
}

/** 抖动占比条：轨道为稀疏点阵，填充为向右渐淡的抖动渐变。 */
export function CherryMeter({
  value,
  label,
  valueText,
  color = "green",
}: {
  value: number;
  label: string;
  valueText?: string;
  color?: DitherColor;
}) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative h-3 overflow-hidden rounded-sm"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={fillStyle("dotted", { color: "grey" })}
      />
      <div
        className="absolute inset-y-0 left-0 transition-[width] duration-500 motion-reduce:transition-none"
        style={{
          width: `${percent}%`,
          ...fillStyle("gradient", { color, edge: "right", length: 48, to: 0.25 }),
        }}
      />
      {valueText ? <span className="sr-only">{valueText}</span> : null}
    </div>
  );
}
