import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * No wallet SDK, so no polyfills and no aliases.
 *
 * This config used to alias `libsodium-wrappers-sumo` at its CJS build and enable node
 * polyfills for `crypto`, `buffer`, `stream`, `util` and `process`, all of it to make the
 * UTXOS embedded-wallet SDK (Mesh underneath) build in a browser. That SDK is gone:
 * signing in is a browser extension now, and extensions need none of those globals. If
 * someone brings the polyfills back, they are re-adding a wallet SDK that wants node APIs
 * in the browser, which is the thing to think about first, not the config.
 */
export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5175, strictPort: true },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
