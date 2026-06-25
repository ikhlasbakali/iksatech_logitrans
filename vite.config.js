import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Déploiement dans un sous-dossier cPanel : VITE_BASE_URL=/mon-dossier/ npm run build
const base = (process.env.VITE_BASE_URL || "/").replace(/\/?$/, "/");

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_LOGISTICS_PROXY_TARGET || "http://localhost:8081",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

