# My Recovery Buddy

My Recovery Buddy is a Vite + React app that provides recovery tools, meeting resources, journaling, and synced profile data.

## Development
- Install dependencies: `npm install`
- Run locally: `npm run dev`
- Build for production: `npm run build`

## Deployment notes
The app expects Vercel-provided services (Postgres via Prisma, KV, Blob, and Edge Config) plus the required environment variables. API routes under `/api` handle state sync, uploads, and session analytics.
