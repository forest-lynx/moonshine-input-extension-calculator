import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import copy from "rollup-plugin-copy";

export default defineConfig({
  plugins: [
    {
      ...copy({
        targets: [
          {
            src: "public/**/*",
            dest: "../../../public/vendor/moonshine-input-extension-calculator",
          },
        ],
        hook: "writeBundle",
      }),
      apply: "build",
    },
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
