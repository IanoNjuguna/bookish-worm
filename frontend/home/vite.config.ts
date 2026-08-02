import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// When building on Vercel, output to standard 'dist'; otherwise output to Go backend domain
const outDir = process.env.VERCEL
  ? path.resolve(__dirname, 'dist')
  : path.resolve(__dirname, '../../backend/internal/domains/home/dist');

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/app": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/app/, ""),
      },
      "/_next": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    nodePolyfills()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir,
    emptyOutDir: true,

    // split the massive file
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('cardano') || id.includes('lucid') || id.includes('sodium')) {
              return 'cardano';
            }
            return 'vendor';
          }
        }
      }
    },
  }
});
