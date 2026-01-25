/**
 * 🍒 Cherry - 图标显示组件
 *
 * 通用的图标渲染组件，支持图片和 Emoji 两种形式。
 * 自动检测图标类型并使用适当的渲染方式。
 *
 * @file src/components/ui/icon-display.tsx
 *
 * @description
 * 判断逻辑：
 * - 包含 '/' 或以 'http' 开头 → 作为图片渲染
 * - 否则 → 作为 Emoji 文本渲染
 */

import Image from 'next/image';
import { getAssetPath } from '@/lib/paths';

/** IconDisplay 组件 Props */
interface IconDisplayProps {
  /** 图标路径或 Emoji 字符 */
  icon: string;
  /** 应用于容器的 className */
  className?: string;
  /** 仅应用于图片的 className */
  imageClassName?: string;
}

/**
 * 图标显示组件
 *
 * @param props.icon - 图片路径（如 "pixels/home.svg"）或 Emoji 字符
 */
export function IconDisplay({ icon, className = '', imageClassName = 'w-6 h-6' }: IconDisplayProps) {
  const isImage = icon.includes('/') || icon.startsWith('http');

  if (isImage) {
    // 处理路径：添加 basePath 前缀（用于静态部署）
    const src = icon.startsWith('http') 
      ? icon 
      : getAssetPath(icon.startsWith('/') ? icon : `/${icon}`);
    
    return (
      <Image
        src={src}
        alt=""
        width={24}
        height={24}
        className={`object-contain ${imageClassName} ${className}`}
      />
    );
  }

  return <span className={className}>{icon}</span>;
}

