import "dotenv/config";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

const iconSizes = [72, 192, 512];

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.PORT),
    host: "0.0.0.0",
  },
  define: {
    "process.env.HASS_URL": JSON.stringify(process.env.HASS_URL),
    "process.env.SIDEKICK_URL": JSON.stringify(process.env.SIDEKICK_URL),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  plugins: [
    tsconfigPaths(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      includeAssets: iconSizes.map((size) => `icons/${size}.png`),
      manifest: {
        name: "home-control",
        short_name: "home-control",
        description: "home-control",
        theme_color: "#24324b",
        icons: [
          ...iconSizes.map((size) => ({
            src: `icons/x${size}.png`,
            sizes: `${size}x${size}`,
            type: "image/png",
            purpose: "maskable",
          })),
          {
            src: `icons/x192.png`,
            sizes: `192x192`,
            type: "image/png",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
});
