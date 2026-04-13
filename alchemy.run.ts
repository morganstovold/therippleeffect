import alchemy from "alchemy";
import { Astro, KVNamespace, R2Bucket, Hyperdrive } from "alchemy/cloudflare";
import { CloudflareStateStore, SQLiteStateStore } from "alchemy/state";
import { GitHubComment } from "alchemy/github";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const app = await alchemy("therippleeffect", {
  stateStore: (scope) =>
    scope.local
      ? new SQLiteStateStore(scope)
      : new CloudflareStateStore(scope, {
          scriptName: "therippleeffect",
        }),
});

const isLocal = !process.env.CI;
const isProd  = app.stage === "prod";

// ── Database URL ───────────────────────────────────────────────────────────
// Local:       Docker Postgres (LOCAL_DATABASE_URL in .env)
// Production:  Neon main branch URL (DATABASE_URL secret in GitHub)
const databaseUrl: string = isLocal
  ? (process.env.LOCAL_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/therippleeffect")
  : (process.env.DATABASE_URL ?? (() => { throw new Error("DATABASE_URL must be set in CI"); })());

// ── Migrations (CI only — prod + PR previews) ──────────────────────────────
// Always uses a direct (non-pooled) connection — pooled connections break drizzle migrate.
// Runs before Worker deployment so the schema is always current.
if (!isLocal) {
  console.log(`[alchemy] Running migrations for stage: ${app.stage ?? "prod"}`);
  const sql = neon(databaseUrl);
  const db  = drizzle(sql);
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
  console.log("[alchemy] Migrations complete");
}

// ── Hyperdrive ─────────────────────────────────────────────────────────────
// Routes edge Workers DB calls through Cloudflare connection pooling.
// In local dev, Wrangler routes to LOCAL_DATABASE_URL via dev.origin instead.
const hyperdrive = await Hyperdrive("hyperdrive", {
  name: isProd
    ? "therippleeffect-hyperdrive"
    : `therippleeffect-hyperdrive-${app.stage ?? "local"}`,
  origin: alchemy.secret(databaseUrl),
  dev: {
    origin: process.env.LOCAL_DATABASE_URL
      ?? "postgresql://postgres:postgres@localhost:5432/therippleeffect",
  },
});

// ── KV ─────────────────────────────────────────────────────────────────────
const kv = await KVNamespace("kv", {
  title: isProd
    ? "therippleeffect-kv"
    : `therippleeffect-kv-${app.stage ?? "local"}`,
});

// ── R2 ─────────────────────────────────────────────────────────────────────
// Single shared bucket — images are environment-agnostic.
const images = await R2Bucket("images", {
  name: "therippleeffect-images",
  adopt: true,
});

// ── Astro Worker ───────────────────────────────────────────────────────────
export const worker = await Astro("website", {
  adopt: isProd,
  domains: isProd
    ? [{ domainName: "therippleeffect.stovold.dev", adopt: true }]
    : [],
  bindings: {
    HYPERDRIVE:    hyperdrive,
    KV:            kv,
    IMAGES:        images,
    RESEND_API_KEY: alchemy.secret(process.env.RESEND_API_KEY ?? ""),
    DATABASE_URL:   alchemy.secret(databaseUrl),
    AUTH_SECRET:    alchemy.secret(process.env.AUTH_SECRET    ?? ""),
  },
});

// ── PR preview comment ─────────────────────────────────────────────────────
if (process.env.PULL_REQUEST) {
  await GitHubComment("preview-comment", {
    owner: "morganstovold",
    repository: "therippleeffect",
    issueNumber: Number(process.env.PULL_REQUEST),
    body: `## Preview Deployed

**Website:** ${worker.url}
Built from commit \`${process.env.GITHUB_SHA?.slice(0, 7)}\`

---
<sub>This comment updates automatically with each push.</sub>`,
  });
}

await app.finalize();
