/**
 * 🍒 Cherry - 首页视图组件
 *
 * 应用的主页视图，显示 Hero 区域、命令输入框和快捷链接。
 * 是用户首次访问时看到的界面。
 *
 * @file src/components/views/home-view.tsx
 *
 * @description
 * 布局结构（Flexbox 垂直居中）：
 * - Spacer (弹性)
 * - Hero + CommandInput (固定)
 * - Spacer (弹性)
 * - QuickLinks (固定)
 * - Spacer (弹性)
 */

import { Hero } from '../features/home/hero';
import { CommandInput } from '../features/search/command-input';
import { QuickLinks } from '../features/home/quick-links';
import { CherryData } from '../../types';

/** HomeView 组件 Props */
interface HomeViewProps {
  /** 站点标语（显示在 Hero 区域） */
  slogan: string;
  /** 快捷链接配置 */
  shortcuts: CherryData['site_config']['shortcuts'];
  /** 分支数据（用于命令输入自动补全） */
  branches: CherryData['branches'];
  /** 命令输入框是否处于激活状态 */
  isCommandInputActive: boolean;
  /** 命令执行回调 */
  onCommand: (input: string) => void;
  /** 搜索框获得焦点回调 */
  onFocusSearch: () => void;
  /** 搜索框失去焦点回调 */
  onBlurSearch: () => void;
}

/**
 * 首页视图组件
 *
 * @description
 * 渲染首页的三栏布局：
 * 1. Hero 区域（Logo + 标语）
 * 2. 命令输入框（支持搜索和命令）
 * 3. 快捷链接网格
 */
export function HomeView({
  slogan,
  shortcuts,
  branches,
  isCommandInputActive,
  onCommand,
  onFocusSearch,
  onBlurSearch,
}: HomeViewProps) {
  return (
    <div className="min-h-full md:h-full flex flex-col items-center py-8 md:pt-12 md:pb-24 md:overflow-hidden">
      {/* Spacer 1 */}
      <div className="flex-1 min-h-[10px] md:min-h-[20px]" />

      <div className="flex-shrink-0 w-full max-w-2xl px-4 flex flex-col items-center">
        {/* Home View: Hero + Search */}
        <Hero slogan={slogan} />
        <div className="w-full mt-4">
          <CommandInput
            onCommand={onCommand}
            isActive={isCommandInputActive}
            onFocus={onFocusSearch}
            onBlur={onBlurSearch}
            branches={branches}
          />
        </div>
      </div>

      {/* Spacer 2 */}
      <div className="flex-1 min-h-[10px] md:min-h-[20px]" />

      {/* Shortcuts */}
      <div className="flex-shrink-0">
        <QuickLinks shortcuts={shortcuts} />
      </div>

      {/* Spacer 3 */}
      <div className="flex-1 min-h-[10px] md:min-h-[20px]" />
    </div>
  );
}
