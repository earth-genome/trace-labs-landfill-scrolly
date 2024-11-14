import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import dsv from "@rollup/plugin-dsv";
// https://vitejs.dev/config/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: "/landfill/",
  build: {
    outDir: "dist/landfill",  // Change this to output to landfill subdirectory
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          return `assets/[name].[hash].${ext}`;
        },
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js"
      },
    },
  },
  plugins: [react(), dsv()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
