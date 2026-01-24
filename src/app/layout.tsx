/**
 * 🍒 Cherry - 根布局组件
 *
 * Next.js App Router 的全局布局文件，所有页面都会继承此布局。
 * 负责加载全局样式、字体配置和主题初始化。
 *
 * @file src/app/layout.tsx
 */

import type { Metadata } from 'next';
import { VT323, Fira_Code } from 'next/font/google';
import './globals.css';

// ═══════════════════════════════════════════════════════════════════════════════
// 字体配置 - 使用 next/font 实现零布局偏移 (Zero Layout Shift)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * VT323 - 像素风格字体
 * 用于标题和像素艺术风格的 UI 元素
 */
const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',  // CSS 变量名，可在 Tailwind 中使用
  display: 'swap',           // 字体加载策略：先显示备用字体
});

/**
 * Fira Code - 等宽编程字体
 * 用于代码显示和终端风格的文本
 */
const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
});

// ═══════════════════════════════════════════════════════════════════════════════
// SEO 元数据配置
// ═══════════════════════════════════════════════════════════════════════════════

/** 全局 SEO 元数据 */
export const metadata: Metadata = {
  title: 'Cherry - Cherry-pick the web',
  description: 'A retro terminal-style browser startpage for developers',
  icons: {
    icon: '/pixels/cherry.svg',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 主题初始化脚本
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 内联主题初始化脚本
 *
 * 该脚本在 HTML 解析阶段同步执行，早于任何 React 渲染。
 * 这确保了主题在页面显示前就已应用，避免"闪白"(FOUC) 问题。
 *
 * 工作原理：
 * 1. 从 localStorage 读取用户主题偏好
 * 2. 在 <html> 元素上设置 data-theme 属性
 * 3. 深色模式额外添加 'dark' 类（供 Tailwind dark: 变体使用）
 */
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('cherry-theme');
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

// ═══════════════════════════════════════════════════════════════════════════════
// 根布局组件
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 根布局 (Root Layout)
 *
 * @description
 * Next.js 必需的顶层布局组件，包裹所有页面。
 * 负责渲染 <html> 和 <body> 标签。
 *
 * @param props.children - 子页面内容
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lang="zh-CN" 用于辅助技术和 SEO
    // suppressHydrationWarning 抑制主题脚本导致的客户端/服务端不匹配警告
    <html lang="zh-CN" className={`${vt323.variable} ${firaCode.variable}`} suppressHydrationWarning>
      <head>
        {/* 在任何内容渲染前应用主题，避免闪烁 */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased min-h-screen bg-[var(--cherry-bg)] text-[var(--cherry-text)]">
        {children}
      </body>
    </html>
  );
}

