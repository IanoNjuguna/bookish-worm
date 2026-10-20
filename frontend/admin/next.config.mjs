/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Standalone emits .next/standalone/server.js with only the modules it needs.
   * deploy/hosts/deploy.sh runs that file with plain `node`, because the box has
   * no `next` CLI and no source tree — only a release directory.
   */
  output: 'standalone',
};

export default nextConfig;
