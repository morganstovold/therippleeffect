CREATE TYPE "public"."event_status" AS ENUM('upcoming', 'past');--> statement-breakpoint
CREATE TYPE "public"."post_category" AS ENUM('Foundation Updates', 'Community Stories', 'Event Recaps', 'Scholarship');--> statement-breakpoint
CREATE TYPE "public"."sponsor_tier" AS ENUM('platinum', 'gold', 'silver', 'bronze', 'hole');--> statement-breakpoint
CREATE TABLE "board_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"image_key" text,
	"image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"number" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"eyebrow" text DEFAULT '' NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"date" text DEFAULT '' NOT NULL,
	"date_iso" text DEFAULT '' NOT NULL,
	"month" text DEFAULT '' NOT NULL,
	"day" text DEFAULT '' NOT NULL,
	"year" text DEFAULT '' NOT NULL,
	"venue" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"format" text DEFAULT '' NOT NULL,
	"pricing_individual" text DEFAULT '' NOT NULL,
	"pricing_foursome" text DEFAULT '' NOT NULL,
	"image_key" text,
	"image_url" text,
	"image_alt" text DEFAULT '' NOT NULL,
	"registration_url" text DEFAULT '' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"status" "event_status" DEFAULT 'upcoming' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"full_description" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "impact_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"label" text NOT NULL,
	"sublabel" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"category" "post_category" DEFAULT 'Foundation Updates' NOT NULL,
	"published_at" text NOT NULL,
	"image_key" text,
	"image_url" text,
	"image_alt" text DEFAULT '' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sponsorships" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"company" text NOT NULL,
	"tier" "sponsor_tier" NOT NULL,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"paid" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_features" ADD CONSTRAINT "event_features_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;