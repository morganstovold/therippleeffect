// @ts-check

import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
  }),

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
    },
    server: {
      watch: {
        ignored: [
          '**/.alchemy/**',
          '**/node_modules/**',
          '**/dist/**',
        ],
      },
    },
  },
});