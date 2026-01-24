/**
 * 数据源抽象层 - 静态模式版本
 * 
 * 此文件仅返回静态 JSON 数据，用于静态部署构建
 */

import { cache } from 'react';
import type { CherryData } from '@/types';

// 静态数据导入（构建时会被打包）
import staticData from '@/data/data.json';

/**
 * 检查是否为静态模式 - 始终返回 true
 */
export function isStaticMode(): boolean {
  return true;
}

/**
 * 获取初始数据 - 始终返回静态数据
 */
export const getInitialDataFromSource = cache(async (
  _searchParams?: { q?: string; branch?: string }
): Promise<CherryData> => {
  // 静态模式：始终返回 JSON 数据
  // 搜索功能需要在客户端实现
  return staticData as unknown as CherryData;
});

/**
 * 检查是否可以使用 Admin 功能 - 始终返回 false
 */
export function isAdminAvailable(): boolean {
  return false;
}
