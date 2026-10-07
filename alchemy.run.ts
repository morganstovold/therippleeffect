import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as GitHub from "alchemy/GitHub";
import * as Output from "alchemy/Output";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";

const DOMAIN = "therippleeffect.stovold.dev";

// Cloudflare's published Turnstile test keys: always pass, work on any hostname.
const TEST_TURNSTILE = {
  sitekey: "1x00000000000000000000AA",
  secret: Redacted.make("1x0000000000000000000000000000000AA"),
};

const turnstileKeys = (stage: string) =>
  stage === "prod"
    ? Cloudflare.Turnstile.Widget("ContactForm", { domains: [DOMAIN], mode: "managed" })
    : Effect.succeed(TEST_TURNSTILE);

export const Website = Cloudflare.Website.Astro(
  "Website",
  Effect.gen(function* () {
    const stage = yield* Alchemy.Stage;
    const turnstile = yield* turnstileKeys(stage);
    const isProd = stage === "prod";

    return {
      // Matches the name Alchemy v1 gave the prod worker so `--adopt` takes it over.
      name: isProd ? "therippleeffect-website-prod" : undefined,
      domain: isProd ? DOMAIN : undefined,
      sessionKVBindingName: false,
      // Every page is prerendered to static HTML unless it opts out with `export const prerender = false`.
      astro: { output: "static", site: isProd ? `https://${DOMAIN}` : undefined },
      memo: {
        include: ["src/**", "public/**", "astro.config.ts", "package.json"],
      },
      env: {
        CONTACT_TO_EMAIL: Config.String("CONTACT_TO_EMAIL"),
        CONTACT_FROM_EMAIL: Config.String("CONTACT_FROM_EMAIL"),
        RESEND_API_KEY: Config.Redacted("RESEND_API_KEY"),
        TURNSTILE_SITE_KEY: turnstile.sitekey,
        TURNSTILE_SECRET_KEY: turnstile.secret,
      },
    };
  }),
);

export type WebsiteEnv = Cloudflare.InferEnv<typeof Website>;

export default Alchemy.Stack(
  "therippleeffect",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), GitHub.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const website = yield* Website;
    const github = yield* GitHub.GitHubEnv;

    if (github?.pr) {
      yield* GitHub.Comment("PreviewComment", {
        owner: github.owner,
        repository: github.repository,
        issueNumber: github.pr,
        body: Output.interpolate`
          ## Preview deployed

          **Website:** ${website.url}

          Built from commit \`${github.sha.slice(0, 7)}\`
        `,
      });
    }

    return { url: website.url };
  }),
);
