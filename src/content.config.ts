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
      // Leave venue, address, city, or format out until they're known; the page shows "To be announced".
      venue: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      format: z.string().optional(),
      pricing: z.array(z.object({ amount: z.string(), label: z.string() })).default([]),
      image: photo(image),
      imageAlt: z.string(),
      registrationUrl: z.url(),
      registrationLabel: z.string().default("Register Now"),
      /** Show "Sponsorship Inquiries" buttons on this event. */
      sponsorships: z.boolean().default(false),
      featured: z.boolean().default(false),
      relatedPost: reference("news").optional(),
      highlights: z.array(z.object({ title: z.string(), description: z.string() })).default([]),
      // Filled in after the event. Shown on the event page once its date has passed.
      recap: z.string().optional(),
      results: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      photos: z.array(z.object({ src: photo(image), alt: z.string(), caption: z.string().optional() })).default([]),
    }),
});

const programs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/programs" }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    order: z.number(),
    /** One sentence for the program cards on the home page. */
    summary: z.string(),
    highlights: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    /** Key facts shown in the side panel, e.g. ages or deadlines. A `url` makes the value a link. */
    details: z.array(z.object({ label: z.string(), value: z.string(), url: z.string().optional() })).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
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
    /** Dollar amount of each scholarship, used for the "awarded in scholarships" total. */
    amountEach: z.number().nonnegative().optional(),
    /** A note to that year's recipients, shown on What We Do. */
    message: z.string().optional(),
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

export const collections = { events, programs, news, board, impact, scholarships, sponsors };
