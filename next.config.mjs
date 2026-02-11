/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,

  images: {
    unoptimized: true, // required for static export
  },

  compiler: {
    styledComponents: true, // enables SSR-friendly styled-components
  },
  experimental: {
    workerThreads: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  transpilePackages: [
    'antd',
    '@ant-design',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-notification',
    'rc-tooltip',
    'rc-tree',
    'rc-table',
    '@rc-component/util',
  ],
};

export default nextConfig;
