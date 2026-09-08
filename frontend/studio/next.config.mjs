import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    "jose"
  ],
  turbopack: {
    resolveAlias: {
      './libsodium-sumo.mjs': './node_modules/libsodium-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs',
    }
  },
  experimental: {},
  async rewrites() {
    let rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bookish-worm-production.up.railway.app';
    if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = `https://${rawUrl}`;
    }
    const targetUrl = rawUrl.replace(/\/$/, '');

    return [
      {
        source: '/api-backend/:path*',
        destination: `${targetUrl}/:path*`,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    config.output.webassemblyModuleFilename = isServer
      ? '../static/wasm/[modulehash].wasm'
      : 'static/wasm/[modulehash].wasm';

    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      './libsodium-sumo.mjs': path.join(process.cwd(), 'node_modules/libsodium-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs'),
    };

    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /next-intl/ },
      { message: /PackFileCacheStrategy/ }
    ];

    config.infrastructureLogging = {
      ...(config.infrastructureLogging || {}),
      level: 'error',
    };

    return config;
  },
}

export default withNextIntl(nextConfig);
