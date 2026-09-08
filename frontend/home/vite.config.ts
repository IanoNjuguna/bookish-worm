import { defineConfig, build, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const outDir = path.resolve(__dirname, 'dist');

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

interface RenderResult {
  html: string;
  helmet: {
    title?: { toString: () => string };
    meta?: { toString: () => string };
    link?: { toString: () => string };
  } | null;
}

// SSR-based prerender plugin. We render each route with React's renderToString
// instead of a headless browser, so the build works on Vercel where Chrome
// system libraries are not available.
function dobaPrerenderPlugin(): Plugin {
  return {
    name: "doba:prerender",
    apply: "build",
    enforce: "post",
    async closeBundle() {
      const ssrOutDir = path.resolve(__dirname, ".ssr");

      try {
        // Build a tiny SSR bundle for the render entry point.
        await build({
          configFile: false,
          root: __dirname,
          logLevel: "warn",
          plugins: [react()],
          resolve: {
            alias: {
              "@": path.resolve(__dirname, "./src"),
            },
          },
          build: {
            ssr: path.resolve(__dirname, "./src/entry-server.tsx"),
            outDir: ssrOutDir,
            emptyOutDir: true,
            rollupOptions: {
              output: {
                entryFileNames: "entry-server.js",
                format: "esm",
              },
            },
          },
        });

        const serverPath = path.resolve(ssrOutDir, "entry-server.js");
        const { render } = await import(serverPath) as { render: (path: string) => RenderResult };

        const template = fs.readFileSync(path.resolve(outDir, "index.html"), "utf-8");

        for (const route of prerenderRoutes) {
          const { html: body, helmet } = render(route);

          const helmetTitle = helmet?.title?.toString() ?? "";
          const helmetMeta = helmet?.meta?.toString() ?? "";
          const helmetLink = helmet?.link?.toString() ?? "";

          let html = template;
          html = html.replace(/<title>.*?<\/title>/s, helmetTitle);
          html = html.replace(/<\/head>/, `${helmetMeta}${helmetLink}</head>`);
          html = html.replace(/<div id="root"><\/div>/, `<div id="root">${body}</div>`);

          const outputPath = path.join(outDir, route, "index.html");
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, html);
        }
      } catch (err) {
        console.error("[doba:prerender] failed:", err);
        throw err;
      } finally {
        // Clean up the temporary SSR bundle; it is not needed at runtime.
        fs.rmSync(ssrOutDir, { recursive: true, force: true });
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
