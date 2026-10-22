/**
 * Tailwind is pointed at its config explicitly. Without the path, the dev server and the
 * standalone CLI can disagree about which config they loaded, and the symptom is
 * maddening: `tailwindcss -i src/index.css` compiles, while Vite answers 500 with
 * "The `bg-canvas` class does not exist".
 */
export default {
  plugins: {
    tailwindcss: { config: './tailwind.config.ts' },
    autoprefixer: {},
  },
};
