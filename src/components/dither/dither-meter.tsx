/**
 * DitherMeter — 抖动填充的进度/占比条
 *
 * dither-kit 式图表的最小落地：不用引入 recharts，
 * 统计弹窗和后台概览的“占比”先用这一条统一表达。
 * 带 role="progressbar"，数值变化时读屏可感知。
 */
import { DitherBackground } from './dither-background';

interface DitherMeterProps {
  /** 0..1 */
  value: number;
  label?: string;
  /** 右侧数值文本，如 "12"；不传则显示百分比。 */
  valueText?: string;
}

export function DitherMeter({ value, label, valueText }: DitherMeterProps) {
  const clamped = Math.min(1, Math.max(0, value));
  const percent = Math.round(clamped * 100);
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs font-code">
          <span className="truncate text-[var(--cherry-text)]">{label}</span>
          <span className="ml-2 text-[var(--cherry-green)]">{valueText ?? `${percent}%`}</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-3 overflow-hidden border border-[var(--cherry-green)]/30 bg-[var(--cherry-bg)]"
      >
        <div className="absolute inset-y-0 left-0" style={{ width: `${percent}%` }}>
          <DitherBackground density={0.5} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
