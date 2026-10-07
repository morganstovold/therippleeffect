import type { APIRoute } from "astro";

// Generated so the sitemap URL follows the configured domain.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n${site ? `\nSitemap: ${new URL("/sitemap.xml", site)}\n` : ""}`);
