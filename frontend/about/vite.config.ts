import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    nodePolyfills()
  ],
  build: {
    //export prod assets into the go module
    outDir: path.resolve(__dirname, '../../backend/internal/domains/about/dist'),
    emptyOutDir: true,

    // split the massive file
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // if code is from node modules, separate it
          if (id.includes('node_modules')) {
            // group cardano/crypto things into a distinct bundle
            if (id.includes('cardano') || id.includes('lucid') || id.includes('sodium')) {
              return 'cardano';
            }
            // put other standard UI packages here
            return 'vendor';
          }
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
});
