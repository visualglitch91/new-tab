import { loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react";

export default function DefineConfig({ mode }) {
  const env = loadEnv(mode, process.cwd());
  const baseUrl = env.VITE_BASE_URL;

  return {
    base: env.VITE_BASE_URL || "/",
    server: {
      port: 6173,
      host: true,
      proxy: { "/api": "http://localhost:5700" },
    },
    plugins: [
      react(),

      createHtmlPlugin({
        minify: true,
        inject: { data: { baseUrl } },
      }),

      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg,woff2}"],
          globIgnores: ["latest.json"],
        },
        includeAssets: [
          "icons/180x180.png",
          "icons/32x32.png",
          "icons/16x16.png",
          "icons/safari-pinned-tab.svg",
          "icons/192x192.png",
          "icons/512x512.png",
          "icons/512x512-maskable.png",
        ],
        manifest: {
          name: "HomeControl",
          short_name: "HomeControl",
          description: "An app to control my home",
          scope: baseUrl,
          start_url: `${baseUrl}index.html`,
          theme_color: "#24324b",
          background_color: "#24324b",
          icons: [
            {
              src: "icons/192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "icons/512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "icons/512x512-maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
  };
}
