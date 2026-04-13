import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────

export const eventStatusEnum = pgEnum("event_status", ["upcoming", "past"]);

export const postCategoryEnum = pgEnum("post_category", [
  "Foundation Updates",
  "Community Stories",
  "Event Recaps",
  "Scholarship",
]);

export const sponsorTierEnum = pgEnum("sponsor_tier", [
  "platinum",
  "gold",
  "silver",
  "bronze",
  "hole",
]);

// ─────────────────────────────────────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────────────────────────────────────

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  eyebrow: text("eyebrow").notNull().default(""),
  subtitle: text("subtitle").notNull().default(""),
  date: text("date").notNull().default(""),          // "Thursday, May 28, 2026"
  dateIso: text("date_iso").notNull().default(""),      // "2026-05-28" (sortable)
  month: text("month").notNull().default(""),
  day: text("day").notNull().default(""),
  year: text("year").notNull().default(""),
  venue: text("venue").notNull().default(""),
  address: text("address").notNull().default(""),
  location: text("location").notNull().default(""),
  format: text("format").notNull().default(""),
  pricingIndividual: text("pricing_individual").notNull().default(""),
  pricingFoursome: text("pricing_foursome").notNull().default(""),
  imageKey: text("image_key"),                           // R2 object key
  imageUrl: text("image_url"),                           // fallback/external URL
  imageAlt: text("image_alt").notNull().default(""),
  registrationUrl: text("registration_url").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  status: eventStatusEnum("status").notNull().default("upcoming"),
  description: text("description").notNull().default(""),
  fullDescription: text("full_description").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const eventFeatures = pgTable("event_features", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  number: text("number").notNull(),      // "01", "02", ...
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─────────────────────────────────────────────────────────────────────────────
// Posts
// ─────────────────────────────────────────────────────────────────────────────

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""),
  category: postCategoryEnum("category").notNull().default("Foundation Updates"),
  publishedAt: text("published_at").notNull(),    // ISO date "2025-11-15"
  imageKey: text("image_key"),                 // R2 object key
  imageUrl: text("image_url"),                 // fallback/external URL
  imageAlt: text("image_alt").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Board Members
// ─────────────────────────────────────────────────────────────────────────────

export const boardMembers = pgTable("board_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull().default(""),
  imageKey: text("image_key"),           // R2 object key (null = show initials)
  imageUrl: text("image_url"),           // fallback/external URL
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Impact Stats
// ─────────────────────────────────────────────────────────────────────────────

export const impactStats = pgTable("impact_stats", {
  id: serial("id").primaryKey(),
  value: text("value").notNull(),         // "30+", "1st", "First"
  label: text("label").notNull(),         // "Years of Service"
  sublabel: text("sublabel"),                // nullable
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─────────────────────────────────────────────────────────────────────────────
// Contact Submissions
// ─────────────────────────────────────────────────────────────────────────────

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Sponsorships
// ─────────────────────────────────────────────────────────────────────────────

export const sponsorships = pgTable("sponsorships", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  company: text("company").notNull(),
  tier: sponsorTierEnum("tier").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  paid: boolean("paid").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
