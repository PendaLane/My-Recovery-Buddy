import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import { kv } from '@vercel/kv';
import { get } from '@vercel/edge-config';

interface PersistedState {
  user: Record<string, unknown>;
  sobrietyDate: string | null;
  journals: unknown[];
  meetingLogs: unknown[];
  contacts: unknown[];
  streak: Record<string, unknown>;
  stepWorkList: unknown[];
  sessionStartedAt?: string | null;
}

const STATE_TABLE = 'user_state';
const CACHE_TTL_SECONDS = 1800;

// Simple in-memory fallback so local development works without Postgres/KV.
// This is not meant for production but keeps the app running when env vars
// are missing (e.g., in local Vite preview).
const memoryState = new Map<string, PersistedState>();

const hasRequiredEnv = () =>
  Boolean(
    process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING,
  );

const hasKvEnv = () => Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

async function ensureTables() {
  // No sql.identifier – use a simple quoted table name instead
  await sql`
    CREATE TABLE IF NOT EXISTS "${STATE_TABLE}" (
      session_id text PRIMARY KEY,
      data jsonb NOT NULL,
      updated_at timestamptz DEFAULT now()
    );
  `;
}

async function readEdgeFlags() {
  try {
    const maintenance = await get<boolean>('maintenance_mode');
    const analyticsEnabled = await get<boolean>('analytics_enabled');
    return { maintenanceMode: Boolean(maintenance), analyticsEnabled: analyticsEnabled !== false };
  } catch (err) {
    console.warn('Edge config unavailable', err);
    return { maintenanceMode: false, analyticsEnabled: true };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sessionId =
    (req.query.sessionId as string) || (req.body && (req.body.sessionId as string));
  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId required' });
  }

  // When database env vars are missing, fall back to in-memory storage so the
  // app still runs locally. This bypasses Postgres/KV entirely.
  if (!hasRequiredEnv()) {
    if (req.method === 'GET') {
      const flags = await readEdgeFlags();
      return res.status(200).json({ state: memoryState.get(sessionId) ?? null, flags });
    }

    if (req.method === 'POST') {
      const state = (req.body?.state as PersistedState) || null;
      if (!state) {
        return res.status(400).json({ error: 'state payload missing' });
      }
      memoryState.set(sessionId, state);
      return res.status(200).json({ ok: true, stored: 'memory' });
    }

    res.setHeader('Allow', 'GET,POST');
    return res.status(405).end('Method not allowed');
  }

  await ensureTables();

  if (req.method === 'GET') {
    try {
      // Try KV cache first
      if (hasKvEnv()) {
        const cacheKey = `state:${sessionId}`;
        const cached = await kv.get<string>(cacheKey).catch(() => null);
        if (cached) {
          const flags = await readEdgeFlags();
          return res
            .status(200)
            .json({ state: JSON.parse(cached) as PersistedState, flags });
        }
      }

      // Type here is { data: PersistedState }
      const { rows } = await sql<{ data: PersistedState }>`
        SELECT data
        FROM "${STATE_TABLE}"
        WHERE session_id = ${sessionId}
        LIMIT 1;
      `;

      if (!rows.length) {
        return res.status(200).json({ state: null, flags: await readEdgeFlags() });
      }

      const state = rows[0].data;

      if (hasKvEnv()) {
        await kv
          .set(`state:${sessionId}`, JSON.stringify(state), { ex: CACHE_TTL_SECONDS })
          .catch(() => undefined);
      }

      return res.status(200).json({ state, flags: await readEdgeFlags() });
    } catch (err) {
      console.error('State load failed', err);
      return res.status(500).json({ error: 'Unable to load state' });
    }
  }

  if (req.method === 'POST') {
    const state = (req.body?.state as PersistedState) || null;
    if (!state) {
      return res.status(400).json({ error: 'state payload missing' });
    }

    try {
      // JSON.stringify(state) so it’s a Primitive for the driver, then cast to jsonb
      await sql`
        INSERT INTO "${STATE_TABLE}" (session_id, data)
        VALUES (${sessionId}, ${JSON.stringify(state)}::jsonb)
        ON CONFLICT (session_id)
        DO UPDATE SET data = EXCLUDED.data, updated_at = now();
      `;

      if (hasKvEnv()) {
        await kv
          .set(`state:${sessionId}`, JSON.stringify(state), { ex: CACHE_TTL_SECONDS })
          .catch(() => undefined);
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('State save failed', err);
      return res.status(500).json({ error: 'Unable to save state' });
    }
  }

  res.setHeader('Allow', 'GET,POST');
  return res.status(405).end('Method not allowed');
}
