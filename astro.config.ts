// The Cloudflare adapter is injected by Alchemy's `Cloudflare.Website.Astro`.
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter-family",
      weights: ["300 700"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Playfair Display",
      cssVariable: "--font-playfair-family",
      weights: ["400 900"],
      styles: ["normal", "italic"],
      fallbacks: ["serif"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
