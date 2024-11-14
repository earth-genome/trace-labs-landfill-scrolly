import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import dsv from "@rollup/plugin-dsv";
// https://vitejs.dev/config/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({

  plugins: [react(), dsv()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
