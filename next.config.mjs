/** @type {import('next').NextConfig} */

// 检查是否为静态模式
const isStaticMode = process.env.STATIC_MODE === 'true';

// GitHub Pages 子目录路径（例如 /Cherry）
// 通过环境变量 BASE_PATH 设置，默认为空（根路径部署）
const basePath = process.env.BASE_PATH || '';

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

