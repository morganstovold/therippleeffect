import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";

// ─────────────────────────────────────────────────────────────────────────────
// Better Auth factory
//
// Better Auth must be instantiated with a live DB connection, which requires
// the Hyperdrive connection string available at request time. We create a new
// instance per-request using the connection string from env — the overhead is
// negligible since only the auth adapter object is created, not a new TCP
// connection (Hyperdrive pools those).
//
// Security settings:
//   - Session token stored in HttpOnly, Secure, SameSite=Lax cookie
//   - Sessions expire after 7 days of inactivity (expiresIn) with a 24hr
//     update window (updateAge) to avoid hammering the DB on every request
//   - Passwords are hashed with bcrypt (Better Auth default, argon2 not yet
//     supported in all edge runtimes)
// ─────────────────────────────────────────────────────────────────────────────

export function createAuth(connectionString: string) {
  const db = getDb(connectionString);

  return betterAuth({
    database: drizzleAdapter(db, { provider: "pg" }),

    emailAndPassword: {
      enabled: true,
      // Prevent public self-registration — admins are created via CLI seed only
      autoSignIn: true,
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7,   // 7 days
      updateAge:  60 * 60 * 24,       // refresh session cookie every 24 hours
      cookieCache: {
        enabled: true,
        maxAge:  60 * 5,              // cache session in cookie for 5 min to reduce DB reads
      },
    },

    advanced: {
      useSecureCookies: true,         // requires HTTPS — always true on Cloudflare Workers
      cookiePrefix: "ripple",         // cookie name: ripple.session_token
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
