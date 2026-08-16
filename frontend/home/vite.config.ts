import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// When building on Vercel, output to standard 'dist'; otherwise output to Go backend domain
const outDir = process.env.VERCEL
  ? path.resolve(__dirname, 'dist')
  : path.resolve(__dirname, '../../backend/internal/domains/home/dist');

// Routes to prerender for SEO
const prerenderRoutes = [
  "/",
  "/pre-drop",
  "/for-artists",
  "/how-it-works",
  "/about",
  "/research",
  "/docs",
  "/faq",
  "/support",
  "/media-kit",
  "/terms",
  "/privacy",
];

// Lightweight prerender plugin using @prerenderer directly. vite-plugin-prerender
// ships a broken ESM build, so we call the underlying renderer ourselves.
function dobaPrerenderPlugin(): import("vite").Plugin {
  return {
    name: "doba:prerender",
    apply: "build",
    enforce: "post",
    async closeBundle() {
      const [{ default: Prerenderer }, { default: PuppeteerRenderer }] = await Promise.all([
        import("@prerenderer/prerenderer"),
        import("@prerenderer/renderer-puppeteer"),
      ]);

      const prerenderer = new Prerenderer({
        staticDir: outDir,
        renderer: new PuppeteerRenderer({
          maxConcurrentRoutes: 4,
          skipThirdPartyRequests: true,
        }),
      });

      try {
        await prerenderer.initialize();
        const renderedRoutes = await prerenderer.renderRoutes(prerenderRoutes);
        for (const route of renderedRoutes) {
          const outputPath = path.join(outDir, route.route, "index.html");
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, route.html.trim());
        }
      } catch (err) {
        console.error("[doba:prerender] failed:", err);
        throw err;
      } finally {
        await prerenderer.destroy();
      }
    },
  };
}

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
    nodePolyfills(),
    dobaPrerenderPlugin(),
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
