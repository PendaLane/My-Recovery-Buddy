# Vercel storage plan for My Recovery Buddy

This app is moving away from browser-only storage and WordPress pages. To keep data fully in Vercel while supporting future growth, combine Vercel-hosted services as follows:

## Primary database
- **Vercel Postgres (via Neon/Supabase/Turso/Prisma Postgres)**: store structured data such as accounts, profiles, emergency contacts, recovery stats, meeting logs, journal entries, step work, phone book contacts, notifications, and membership/join records. Postgres supports relational queries, constraints, and migrations for long-term maintenance.

## Session and cache
- **Vercel KV (Upstash Redis)**: maintain short-lived session tokens, view preferences, and cached AI/prompts or location lookups. KV provides fast reads/writes and can reduce load on Postgres for frequently accessed but low-criticality values.

## Media and uploads
- **Vercel Blob**: host profile photos or exported artifacts (e.g., PDF/CSV meeting logs). Blob storage keeps binary assets outside Postgres while serving them efficiently via Vercel.

## Configuration
- **Edge Config**: store non-secret feature flags or rollout toggles (e.g., enabling AI tools, maintenance banners) that need instant global reads without a deployment.

## Implementation notes
- Use an ORM such as Prisma with the Vercel Postgres driver to manage schemas and migrations. Keep secrets (database URLs, Redis URLs, Blob tokens) in Vercel Environment Variables.
- Add API routes or serverless functions that wrap Postgres/KV/Blob operations behind app-level types so the React client never talks directly to storage services.
- For uploads, generate signed upload URLs from an API route and reference the returned Blob URL in Postgres.
- Enforce per-user scoping in every query and validate inputs server-side to avoid relying solely on client checks.
- Provide background jobs or cron endpoints (if needed) to purge stale sessions in KV and clean up orphaned Blob assets.

## Why this mix
- Postgres handles the durable, relational data the app depends on.
- KV keeps the UI responsive by caching and simplifying session management without overloading the primary DB.
- Blob prevents large files from bloating database storage and serves media efficiently.
- Edge Config lets you adjust behavior safely (e.g., toggling AI availability) without redeploying.
