import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/main.css", "resources/js/app.js"],
      refresh: true,
    }),
  ],
  css: {
    devSourcemap: true,
  },
  build: {
    emptyOutDir: false,
    outDir: "public",
    rollupOptions: {
      output: {
        entryFileNames: `js/[name].js`,
        assetFileNames: "css/[name].css",
      },
    },
  },
});
