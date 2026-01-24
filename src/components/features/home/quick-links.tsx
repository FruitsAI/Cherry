/**
 * 🍒 Cherry - 快捷链接组件
 *
 * 首页底部的快捷入口网格，显示常用外部链接。
 * 数据来源于 site_config.shortcuts 配置。
 *
 * @file src/components/features/home/quick-links.tsx
 */

import type { Shortcut } from '../../../types';
import { IconDisplay } from '../../ui/icon-display';

/** QuickLinks 组件 Props */
interface QuickLinksProps {
  /** 快捷链接配置数组 */
  shortcuts?: Shortcut[];
}

/**
 * 快捷链接组件
 *
 * @description
 * 渲染水平居中的链接网格，
 * 每个链接包含图标和名称，点击在新标签页打开。
 */
export function QuickLinks({ shortcuts }: QuickLinksProps) {
  if (!shortcuts || shortcuts.length === 0) return null;

  return (
    <div className="mt-0 flex flex-wrap justify-center gap-4 md:gap-6 animate-fade-in-up animate-delay-300">
      {shortcuts.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 text-[var(--cherry-muted)] hover:text-[var(--cherry-text)] transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[var(--cherry-bg-secondary)] border border-[var(--cherry-green)]/20 rounded-xl group-hover:border-[var(--cherry-green)] group-hover:shadow-[0_0_15px_rgba(46,204,113,0.2)] transition-all">
            <IconDisplay 
              icon={link.icon} 
              className="text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-300"
              imageClassName="w-8 h-8"
            />
          </div>
          <span className="text-xs font-code opacity-70 group-hover:opacity-100 transition-opacity">
            {link.name}
          </span>
        </a>
      ))}
    </div>
  );
}
