# Recovery Buddy App

If you see the error:

> Codex does not currently support updating PRs that are updated outside of Codex. For now, please create a new PR.

follow these steps to rerun checks successfully:

1. Pull the latest `work` branch (or your feature branch) locally so you have the newest commit.
2. Create a **new** pull request from that branch instead of reopening or editing the previous one.
3. Let Vercel and CI run on the new PR; rate-limit or stale-PR conflicts will clear with the fresh PR.

This keeps Vercel deployments and other checks clean when prior PRs were modified outside Codex.
