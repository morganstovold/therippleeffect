import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    // For local dev: LOCAL_DATABASE_URL (Docker Postgres)
    // For remote migrations: DATABASE_URL (Neon direct/non-pooled connection)
    url: process.env.LOCAL_DATABASE_URL ?? process.env.DATABASE_URL!,
  },
});
