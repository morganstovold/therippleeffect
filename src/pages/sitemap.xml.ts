import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { getPosts } from "../lib/content";

// Hand-written because @astrojs/sitemap skips pages rendered per request (home, programs, events).
const pages = [
  "/",
  "/about",
  "/programs",
  "/events",
  "/news",
  "/sponsors",
  "/gallery",
  "/impact",
  "/get-involved",
  "/contact",
];

export const GET: APIRoute = async ({ site, url }) => {
  const events = (await getCollection("events")).map((event) => `/events/${event.id}`);
  const posts = (await getPosts()).map((post) => `/news/${post.id}`);
  const urls = [...pages, ...events, ...posts].map((path) => `<url><loc>${new URL(path, site ?? url)}</loc></url>`);

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
