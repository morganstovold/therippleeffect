import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection, reference, type SchemaContext } from "astro:content";

// An image is either a full URL (e.g. Unsplash) or a path to a file next to the content.
const photo = (image: SchemaContext["image"]) => z.union([z.url(), image()]);

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Used on buttons, e.g. "Golf Classic". Defaults to the title. */
      shortTitle: z.string().optional(),
      date: z.coerce.date(),
      tagline: z.string(),
      headline: z.string().default("About the Event"),
      summary: z.string(),
      venue: z.string(),
      address: z.string(),
      city: z.string(),
      format: z.string(),
      pricing: z.array(z.object({ amount: z.string(), label: z.string() })).default([]),
      image: photo(image),
      imageAlt: z.string(),
      registrationUrl: z.url(),
      featured: z.boolean().default(false),
      relatedPost: reference("news").optional(),
      highlights: z.array(z.object({ title: z.string(), description: z.string() })).default([]),
      // Filled in after the event. Shown on the event page once its date has passed.
      recap: z.string().optional(),
      results: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      photos: z.array(z.object({ src: photo(image), alt: z.string(), caption: z.string().optional() })).default([]),
    }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.enum(["Foundation Updates", "Community Stories", "Event Recaps", "Scholarship"]),
      excerpt: z.string(),
      image: photo(image),
      imageAlt: z.string(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const board = defineCollection({
  loader: file("./src/content/board.yaml"),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      name: z.string(),
      role: z.string(),
      bio: z.string(),
      photo: photo(image).optional(),
    }),
});

const impact = defineCollection({
  loader: file("./src/content/impact.yaml"),
  schema: z.object({
    order: z.number(),
    value: z.string(),
    label: z.string(),
    sublabel: z.string().optional(),
  }),
});

const scholarships = defineCollection({
  loader: file("./src/content/scholarships.yaml"),
  schema: z.object({
    deadline: z.coerce.date(),
    requirementsUrl: z.url(),
    applicationUrl: z.url(),
    /** How many scholarships were given that year. Counts only; recipients are kept confidential. */
    awarded: z.number().int().nonnegative().default(0),
  }),
});

const sponsors = defineCollection({
  loader: file("./src/content/sponsors.yaml"),
  schema: ({ image }) =>
    z.discriminatedUnion("type", [
      z.object({ type: z.literal("business"), name: z.string(), logo: image(), url: z.url().optional() }),
      z.object({ type: z.literal("family"), name: z.string(), note: z.string().optional(), url: z.url().optional() }),
    ]),
});

export const collections = { events, news, board, impact, scholarships, sponsors };
