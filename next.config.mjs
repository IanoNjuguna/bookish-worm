import createNextIntlPlugin from 'next-intl/plugin';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ignoreBuildErrors was removed: TypeScript errors must be fixed before building.
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    "jose"
  ],
  // Turbopack configuration
  turbopack: {
    resolveAlias: {
      './libsodium-sumo.mjs': './node_modules/libsodium-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs',
    }
  },
  // Disable experimental features that might cause issues
  experimental: {
  },
  async rewrites() {
   // Fallback prevents the string from ever evaluating to "undefined/:path*"
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'bookish-worm-production.up.railway.app';
    return [
      {
        source: '/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // Enable WebAssembly support for Cardano libraries (e.g. Lucid)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Configure correct WASM output destination
    config.output.webassemblyModuleFilename = isServer
      ? '../static/wasm/[modulehash].wasm'
      : 'static/wasm/[modulehash].wasm';

    // Ignore markdown and other non-JS files in node_modules
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });

    // Handle jose and other ESM packages
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
    };

    // Fix libsodium-wrappers-sumo missing libsodium-sumo.mjs resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      './libsodium-sumo.mjs': path.join(process.cwd(), 'node_modules/libsodium-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs'),
    };

    // Suppress harmless next-intl dynamic import Webpack persistent cache warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /next-intl/ },
      { message: /PackFileCacheStrategy/ }
    ];

    // Silence Webpack infrastructure logging warnings (like PackFileCacheStrategy cache warnings)
    config.infrastructureLogging = {
      ...(config.infrastructureLogging || {}),
      level: 'error',
    };

    return config;
  },
}

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
