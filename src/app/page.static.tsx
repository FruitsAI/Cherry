/**
 * 🍒 Cherry - 首页（静态模式）
 *
 * 用于静态导出 (next export) 的首页组件。
 * 与 page.tsx 类似，但不使用 searchParams。
 *
 * @file src/app/page.static.tsx
 *
 * @description
 * 静态模式特点：
 * - 使用 force-static 指令
 * - 数据来源于 data.json
 * - 搜索在客户端实现
 */

import { Suspense } from 'react';
import { ClientApp } from '../components/client-app';
import { getInitialDataFromSource } from '../lib/data-source';
import { CherryData } from '../types';

/** 加载占位组件 */
function SearchFallback() {
    return (
        <div className="flex h-screen items-center justify-center bg-[var(--cherry-bg)] text-[var(--cherry-green)] font-mono">
            INITIALIZING SYSTEM...
        </div>
    );
}

// 静态导出配置
export const dynamic = 'force-static';

export default async function Home() {
  // 静态模式下不使用 searchParams（搜索在客户端实现）
  const data = await getInitialDataFromSource();
  return (
    <Suspense fallback={<SearchFallback />}>
        <ClientApp initialData={data as unknown as CherryData} />
    </Suspense>
  );
}
