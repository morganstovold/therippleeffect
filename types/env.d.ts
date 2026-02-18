import type { worker } from "../alchemy.run.ts";

export type CloudflareEnv = typeof worker.Env;

declare global {
  type Env = CloudflareEnv;
}

declare module "cloudflare:workers" {
  // biome-ignore lint: n/a
  namespace Cloudflare {
    export interface Env extends CloudflareEnv {}
  }
}
