// One-off stack that provisions everything CI needs: a scoped Cloudflare API token plus the GitHub
// Actions secrets and variables the deploy workflow reads. Re-run only to rotate the token or change values:
//   bun alchemy deploy --config stacks/github.ts --profile admin
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as GitHub from "alchemy/GitHub";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";

const repo = { owner: "morganstovold", repository: "therippleeffect" };
const DOMAIN = "therippleeffect.stovold.dev";

export default Alchemy.Stack(
  "therippleeffect-github",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), GitHub.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const { accountId } = yield* yield* Cloudflare.CloudflareEnvironment;
    const zoneId = yield* Cloudflare.Zone.resolveZoneId({ accountId, zone: undefined, hostname: DOMAIN }).pipe(
      Effect.orDie,
    );
    const account = `com.cloudflare.api.account.${accountId}` as const;

    // Only what alchemy.run.ts deploys: the Worker, its custom domain, the Turnstile widget,
    // the zone's image transformations setting, and the Cloudflare state store.
    const apiToken = yield* Cloudflare.ApiToken.AccountApiToken("CIToken", {
      accountId,
      policies: [
        {
          effect: "allow",
          permissionGroups: [
            "Workers Scripts Write",
            "Secrets Store Write",
            "Turnstile Sites Write",
            "Account Settings Read",
            "Workers Tail Read",
          ],
          resources: { [account]: "*" },
        },
        {
          effect: "allow",
          permissionGroups: ["Zone Read", "Zone Settings Write", "Workers Routes Write", "DNS Write"],
          resources: { [account]: { [`com.cloudflare.api.account.zone.${zoneId}`]: "*" } },
        },
      ],
    });

    const secrets = {
      CLOUDFLARE_API_TOKEN: apiToken.value,
      CLOUDFLARE_ACCOUNT_ID: Redacted.make(accountId),
      RESEND_API_KEY: yield* Config.Redacted("RESEND_API_KEY"),
    };
    for (const [name, value] of Object.entries(secrets)) {
      yield* GitHub.Secret(name, { ...repo, name, value });
    }

    for (const name of ["CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL"]) {
      yield* GitHub.Variable(name, { ...repo, name, value: yield* Config.String(name) });
    }
  }),
);
