import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react";
import { config } from "../../config";

const baseUrl = "/";

export default defineConfig({
  base: baseUrl,
  define: {
    "process.env.HASS_URL": JSON.stringify(config.home_assistant.url),
  },
  build: {
    outDir: `${__dirname}/../../dist`,
  },
  server: {
    port: config.port,
    host: true,
    proxy: {
      "/api": {
        target: `http://${config.development_server_proxy}`,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, _, res) => {
            res.on("close", () => {
              if (!res.writableEnded) {
                proxyReq.destroy();
              }
            });
          });
        },
      },
      "/socket": {
        target: `ws://${config.development_server_proxy}`,
        ws: true,
      },
    },
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
});
