# My Recovery Buddy

My Recovery Buddy is a Vite + React app that keeps recovery tools, meeting resources, journaling, and cloud-synced profile data together in one place.

## Stack
- React 18 + TypeScript, Tailwind, Vite
- Vercel serverless APIs for state sync, analytics, and avatar uploads
- Vercel services: Prisma Postgres (primary data), Upstash KV (sessions/cache), Blob (media), Edge Config (feature flags)

## Local development
1. Install dependencies: `npm install`
2. Add a `.env.local` using the template below (values come from your Vercel project bindings).
3. Run the dev server: `npm run dev`
4. Build: `npm run build`

If you don't have the Vercel Postgres/KV/Blob/Edge Config env vars configured locally,
the serverless API routes fall back to in-memory storage and simple placeholders so the
app can still load in development. Data will reset on restart.

## Deployment
Deploy on Vercel with the Postgres, KV, Blob, and Edge Config resources attached. The API routes under `/api` depend on those bindings; no extra configuration is needed once the services are connected in the dashboard.

## Environment template
Copy `.env.example` to `.env.local` if you want to run locally:

```
POSTGRES_URL=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL_NON_POOLING=""
KV_REST_API_URL=""
KV_REST_API_TOKEN=""
BLOB_READ_WRITE_TOKEN=""
EDGE_CONFIG=""
```
# Recovery Buddy App

If you see the error:

> Codex does not currently support updating PRs that are updated outside of Codex. For now, please create a new PR.

follow these steps to rerun checks successfully:

1. Pull the latest `work` branch (or your feature branch) locally so you have the newest commit.
2. Create a **new** pull request from that branch instead of reopening or editing the previous one.
3. Let Vercel and CI run on the new PR; rate-limit or stale-PR conflicts will clear with the fresh PR.

This keeps Vercel deployments and other checks clean when prior PRs were modified outside Codex.
