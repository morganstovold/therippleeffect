import type { APIRoute } from "astro";
import { createAuth } from "../../../auth";

// ─────────────────────────────────────────────────────────────────────────────
// Better Auth catch-all handler
//
// Better Auth uses its own internal router — all /api/auth/* requests are
// forwarded here and handled by the auth instance. This includes:
//   POST /api/auth/sign-in/email          — login
//   POST /api/auth/sign-out               — logout
//   GET  /api/auth/session                — get current session
//   POST /api/auth/change-password        — update password
// ─────────────────────────────────────────────────────────────────────────────

export const ALL: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as { runtime?: { env?: { HYPERDRIVE?: { connectionString: string }; DATABASE_URL?: string } } }).runtime;
  const connectionString =
    runtime?.env?.HYPERDRIVE?.connectionString ??
    runtime?.env?.DATABASE_URL ??
    (process.env.LOCAL_DATABASE_URL ?? "");

  const auth = createAuth(connectionString);
  return auth.handler(request);
};
