import type { WebsiteEnv } from "../alchemy.run.ts";

declare global {
  namespace Cloudflare {
    interface Env extends WebsiteEnv {}
  }
}
