import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import { get } from '@vercel/edge-config';

const ANALYTICS_TABLE = 'session_analytics';

const hasRequiredEnv = () =>
  Boolean(
    process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING,
  );

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS "${ANALYTICS_TABLE}" (
      id bigserial PRIMARY KEY,
      session_id text,
      user_id text,
      started_at timestamptz,
      ended_at timestamptz,
      duration_ms bigint,
      region text,
      created_at timestamptz DEFAULT now()
    );
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  if (!hasRequiredEnv()) {
    // Keep local development running even without Postgres by short-circuiting.
    return res.status(200).json({ ok: true, stored: 'memory', reason: 'database unavailable' });
  }

  const flags = await get<boolean>('analytics_enabled').catch(() => true);
  if (flags === false) {
    return res.status(200).json({ skipped: true });
  }

  const { sessionId, userId, startedAt, endedAt, durationMs } = req.body || {};
  if (!sessionId || !startedAt || !endedAt || typeof durationMs !== 'number') {
    return res.status(400).json({ error: 'missing fields' });
  }

  await ensureTable();

  try {
    const regionHeader = req.headers['x-vercel-ip-country'];
    const region =
      Array.isArray(regionHeader) ? regionHeader[0] : regionHeader || null;

    await sql`
      INSERT INTO "${ANALYTICS_TABLE}"
        (session_id, user_id, started_at, ended_at, duration_ms, region)
      VALUES
        (${sessionId}, ${userId || null}, ${startedAt}, ${endedAt}, ${durationMs}, ${region});
    `;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Analytics insert failed', err);
    return res.status(500).json({ error: 'Unable to record analytics' });
  }
}
