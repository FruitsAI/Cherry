/**
 * 数据源抽象层
 * 
 * 根据环境变量 STATIC_MODE 决定数据来源：
 * - STATIC_MODE=true: 读取本地 JSON 文件（静态部署）
 * - STATIC_MODE=false/undefined: 读取数据库（动态部署）
 */

import { cache } from 'react';
import type { CherryData } from '@/types';

// 静态数据导入（构建时会被打包）
import staticData from '@/data/data.json';

/**
 * 检查是否为静态模式
 */
export function isStaticMode(): boolean {
  return process.env.STATIC_MODE === 'true';
}

/**
 * 获取初始数据 - 静态模式专用
 */
function getStaticData(): CherryData {
  return staticData as unknown as CherryData;
}

/**
 * 获取初始数据
 * 
 * 在静态模式下直接返回 JSON 数据
 * 在动态模式下从数据库获取数据
 */
export const getInitialDataFromSource = cache(async (
  searchParams?: { q?: string; branch?: string }
): Promise<CherryData> => {
  // 静态模式：始终返回 JSON 数据
  if (isStaticMode()) {
    return getStaticData();
  }

  // 动态模式：尝试从数据库获取
  // 注意：此代码路径在静态构建时会被构建工具优化掉
  // 因为 isStaticMode() 在构建时为常量 true
  const mod = await import('@/app/actions');
  return await mod.getInitialData(searchParams) as unknown as CherryData;
});

/**
 * 检查是否可以使用 Admin 功能
 * 静态模式下 Admin 功能不可用
 */
export function isAdminAvailable(): boolean {
  return !isStaticMode();
}
