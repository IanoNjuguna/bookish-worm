import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

/**
 * `libsodium-wrappers-sumo` (a transitive dependency of the UTXOS wallet SDK) publishes an
 * ESM build that imports `./libsodium-sumo.mjs` as if it sat next to it, but the file is
 * shipped inside the `libsodium-sumo` package. Rollup cannot resolve that, so the build
 * fails on a dependency we never call directly. Pointing the bare specifier at the CJS
 * build sidesteps the broken relative import; Vite's commonjs plugin handles the rest.
 */
const sodiumCjs = fileURLToPath(
  new URL('./node_modules/libsodium-wrappers-sumo/dist/modules-sumo/libsodium-wrappers.js', import.meta.url),
);

/**
 * The UTXOS wallet SDK is Mesh underneath, and Mesh's CST package calls `pbkdf2Sync` and
 * friends straight from node's `crypto`. Without polyfills Vite replaces the module with
 * an empty stub and the build fails. Only the globals the SDK actually touches are
 * enabled, and the SDK itself is a dynamic import, so the cost lands on the sign-in
 * chunk rather than the first paint.
 */

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({ include: ['crypto', 'buffer', 'stream', 'util', 'process'], globals: { Buffer: true, process: true } }),
  ],
  resolve: {
    alias: {
      'libsodium-wrappers-sumo': sodiumCjs,
    },
  },
  server: { host: '127.0.0.1', port: 5175, strictPort: true },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // The wallet chunk is Mesh at ~15 MB raw; it is lazy, so the warning is noise.
    chunkSizeWarningLimit: 16_000,
    rollupOptions: {
      output: {
        // The wallet SDK is only needed when someone signs in; keep it out of the first
        // load so the deck opens on a phone without 300 kB of Mesh.
        manualChunks: (id: string) => {
          if (id.includes('@utxos/sdk') || id.includes('@meshsdk/') || id.includes('libsodium')) {
            return 'wallet';
          }
          return undefined;
        },
      },
    },
  },
});
