// The Cloudflare adapter is injected by Alchemy's `Cloudflare.Website.Astro`.
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  // Pages build to about.html (not about/index.html) so Cloudflare serves /about without a redirect to /about/.
  build: { format: "file" },
  trailingSlash: "never",
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
