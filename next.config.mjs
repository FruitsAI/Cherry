/** @type {import('next').NextConfig} */

// 检查是否为静态模式
const isStaticMode = process.env.STATIC_MODE === 'true';

// 静态部署的 basePath（如 GitHub Pages 子目录 /Cherry）
// 通过 NEXT_PUBLIC_BASE_PATH 设置，客户端和服务端都可访问
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // 静态模式下启用静态导出
  ...(isStaticMode && {
    output: 'export',
    // 静态导出时图片需要 unoptimized
    images: {
      unoptimized: true,
    },
    // 启用尾部斜杠以兼容 GitHub Pages
    trailingSlash: true,
    // 设置 basePath 和 assetPrefix（用于 GitHub Pages 子目录部署）
    basePath: basePath,
    assetPrefix: basePath,
  }),

  // 动态模式下的图片配置
  ...(!isStaticMode && {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
        },
      ],
    },
  }),
};

export default nextConfig;

