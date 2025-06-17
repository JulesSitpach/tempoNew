import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: ["hungry-jepsen2-qghmh.view-3.tempo-dev.app"],
    proxy: {
      // WebSocket proxy
      "/ws": {
        target: "ws://localhost:3000",
        ws: true,
        changeOrigin: true,
      },
      // OpenRouter API proxy
      "/openrouter-api": {
        target: "https://openrouter.ai",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/openrouter-api/, ""),
        headers: {
          Accept: "application/json",
        },
      },
      // Federal Register API proxy
      "/federal-api": {
        target: "https://www.federalregister.gov",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/federal-api/, ""),
        headers: {
          "User-Agent": "SMB-Tariff-Management-Suite",
          Accept: "application/json",
        },
      },
      // UN Comtrade API proxy
      "/comtrade-api": {
        target: "https://comtradeapi.un.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/comtrade-api/, ""),
      },
      // Shippo API proxy
      "/shippo-api": {
        target: "https://api.goshippo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shippo-api/, ""),
      },
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
