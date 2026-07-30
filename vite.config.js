import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement (.env)
  const env = loadEnv(mode, process.cwd(), "");

  // Déploiement dans un sous-dossier cPanel
  const base = (env.VITE_BASE_URL || "/").replace(/\/?$/, "/");

  return {
    base,
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_LOGISTICS_PROXY_TARGET || "http://127.0.0.1:8000",
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});

