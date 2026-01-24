/**
 * 🍒 Cherry - 首页 (Server Component)
 *
 * 应用的入口页面，使用 React Server Component 在服务端获取数据。
 * 支持通过 URL 查询参数进行搜索和分支过滤。
 *
 * @file src/app/page.tsx
 *
 * @example URL 参数
 * - `/?q=github` - 搜索包含 "github" 的链接
 * - `/?branch=1` - 只显示指定分支的链接
 */

import { Suspense } from 'react';
import { ClientApp } from '../components/client-app';
import { getInitialDataFromSource } from '../lib/data-source';
import { CherryData } from '../types';

/**
 * 搜索加载占位组件
 *
 * 在数据加载时显示的终端风格加载提示
 */
function SearchFallback() {
    return (
        <div className="flex h-screen items-center justify-center bg-[var(--cherry-bg)] text-[var(--cherry-green)] font-mono">
            INITIALIZING SYSTEM...
        </div>
    );
}

/**
 * 首页组件 (Async Server Component)
 *
 * @description
 * 这是一个异步服务端组件，在服务器上执行数据获取。
 * Next.js 15 中 searchParams 是异步的，需要 await 解析。
 *
 * @param props.searchParams - URL 查询参数 Promise
 * @param props.searchParams.q - 可选，搜索关键词
 * @param props.searchParams.branch - 可选，分支 ID 过滤
 */
export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; branch?: string }> }) {
  // Next.js 15: searchParams 现在是 Promise，需要 await
  const resolvedParams = await searchParams;

  // 从数据源获取初始数据（动态模式从数据库，静态模式从 JSON）
  const data = await getInitialDataFromSource(resolvedParams);

  return (
    // Suspense 边界：数据加载时显示 fallback
    <Suspense fallback={<SearchFallback />}>
        <ClientApp initialData={data as unknown as CherryData} />
    </Suspense>
  );
}

