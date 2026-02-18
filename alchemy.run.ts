import alchemy from "alchemy";
import { Astro } from "alchemy/cloudflare";
import { CloudflareStateStore, SQLiteStateStore } from "alchemy/state";
import { GitHubComment } from "alchemy/github";

const app = await alchemy("therippleeffect", {
    stateStore: (scope) =>
		scope.local ? new SQLiteStateStore(scope) : new CloudflareStateStore(scope, {
            scriptName: "therippleeffect",
        }),
});

export const worker = await Astro("website", {
  domains: ["therippleeffect.stovold.dev"],
});

if (process.env.PULL_REQUEST) {
  await GitHubComment("preview-comment", {
    owner: "morganstovold",
    repository: "therippleeffect",
    issueNumber: Number(process.env.PULL_REQUEST),
    body: `## 🚀 Preview Deployed

Your changes have been deployed to a preview environment:

**🌐 Website:** ${worker.url}

Built from commit ${process.env.GITHUB_SHA?.slice(0, 7)}

+---
<sub>🤖 This comment updates automatically with each push.</sub>`,
  });
}

await app.finalize();
