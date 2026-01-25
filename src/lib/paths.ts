/**
 * 🍒 Cherry - 路径工具函数
 *
 * 处理静态部署时的 basePath 前缀问题。
 * GitHub Pages 部署在子目录下需要添加前缀。
 *
 * @file src/lib/paths.ts
 */

/**
 * 获取 basePath 前缀
 * 
 * @description
 * 在静态模式下返回 BASE_PATH 环境变量值（如 "/Cherry"），
 * 否则返回空字符串。
 */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

/**
 * 获取带 basePath 前缀的资源路径
 *
 * @param path - 资源路径（如 "/pixels/cherry.svg"）
 * @returns 带 basePath 前缀的完整路径
 *
 * @example
 * // 静态模式下 (BASE_PATH="/Cherry")
 * getAssetPath("/pixels/cherry.svg") // => "/Cherry/pixels/cherry.svg"
 * 
 * // 动态模式下
 * getAssetPath("/pixels/cherry.svg") // => "/pixels/cherry.svg"
 */
export function getAssetPath(path: string): string {
  const basePath = getBasePath();
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
