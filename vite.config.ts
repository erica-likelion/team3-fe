// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  // .env 읽기 (여기서 process 안 씀)
  const env = loadEnv(mode, ".", ""); // <= OK

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
        manifest: {
          name: "Vite PWA Project",
          short_name: "Vite PWA Project",
          theme_color: "#ffffff",
          icons: [
            { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
    server: {
      port: 5174,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://3.34.244.253",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
