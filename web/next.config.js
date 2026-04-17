/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'AI Warlord God Platform',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Control 100+ AI subagents, Crypto Trading, Zero-Code API Factory, GitHub Takeover, VPS Army - ALL IN ONE',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
    NEXT_PUBLIC_GMGN_API_KEY: process.env.NEXT_PUBLIC_GMGN_API_KEY || '',
    NEXT_PUBLIC_BROWSER_USE_API_KEY: process.env.NEXT_PUBLIC_BROWSER_USE_API_KEY || 'bu_DuOM35v8PdWmjbGak4NXrhUOj9zeL80hLsP_Ms8qyQs',
    NEXT_PUBLIC_FIRECRAWL_API_KEY: process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY || 'fc-48d2ae4e639747a28e872875e5168f6d',
    NEXT_PUBLIC_GITHUB_TOKEN: process.env.NEXT_PUBLIC_GITHUB_TOKEN || '',
    NEXT_PUBLIC_BYBIT_API_KEY: process.env.NEXT_PUBLIC_BYBIT_API_KEY || '',
    NEXT_PUBLIC_CLAW_PUMP_AGENT_ID: process.env.NEXT_PUBLIC_CLAW_PUMP_AGENT_ID || '2149bff0-143c-4321-b9a1-614087c9fcc1',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        source: '/ws/:path*',
        destination: 'http://localhost:3001/ws/:path*',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig