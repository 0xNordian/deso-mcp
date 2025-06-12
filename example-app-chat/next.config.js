/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    DESO_NODE_URL: process.env.DESO_NODE_URL || 'https://node.deso.org',
  },
}

module.exports = nextConfig 