import { defineMiddleware } from "astro:middleware";
import { createAuth } from "./auth";

// ─────────────────────────────────────────────────────────────────────────────
// Auth middleware
//
// Protects all /admin/* routes except /admin/login and the Better Auth
// API routes (/api/auth/*).
//
// On every protected request:
//   1. Get the Hyperdrive connection string from env
//   2. Create a Better Auth instance with the live DB connection
//   3. Validate the session cookie
//   4. Attach the user to Astro.locals for downstream use
//   5. Redirect to /admin/login if unauthenticated
// ─────────────────────────────────────────────────────────────────────────────

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Pass through: Better Auth API handles its own routes
  if (pathname.startsWith("/api/auth")) return next();

  // Pass through: public pages
  if (!pathname.startsWith("/admin")) return next();

  // Pass through: login page itself (avoid redirect loop)
  if (pathname === "/admin/login" || pathname === "/admin/login/") return next();

  // Get connection string — Hyperdrive in production, DATABASE_URL in dev
  const runtime = (context.locals as { runtime?: { env?: { HYPERDRIVE?: { connectionString: string }; DATABASE_URL?: string } } }).runtime;
  const connectionString =
    runtime?.env?.HYPERDRIVE?.connectionString ??
    runtime?.env?.DATABASE_URL ??
    (process.env.LOCAL_DATABASE_URL ?? "");

  if (!connectionString) {
    console.error("[middleware] No database connection string available");
    return context.redirect("/admin/login");
  }

  const auth = createAuth(connectionString);

  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (!session?.user) {
    return context.redirect("/admin/login");
  }

  // Attach user to locals for use in admin pages
  context.locals.user = session.user;

  return next();
});
