import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
// biome-ignore lint/performance/noNamespaceImport: n/a
import * as schema from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Database client factory
//
// In production/preview: env.HYPERDRIVE.connectionString routes through
// Cloudflare's edge connection pooling for minimum latency.
//
// In local dev: Wrangler routes HYPERDRIVE calls to docker-compose Postgres
// via the dev.origin configured in alchemy.run.ts.
//
// The Neon HTTP driver works everywhere — it uses fetch() internally, which
// is available natively in Cloudflare Workers without Node.js compat.
// ─────────────────────────────────────────────────────────────────────────────

export type Db = ReturnType<typeof getDb>;

export function getDb(connectionString: string) {
  const sql = neon(connectionString);
  return drizzle(sql, { schema, logger: false });
}
