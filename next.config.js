/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,//appDir: true, 会将 pages 目录作为根目录
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    }); // 针对 SVG 的处理规则

    return config;
  }
};

module.exports = nextConfig;
