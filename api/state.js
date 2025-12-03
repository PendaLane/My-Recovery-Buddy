const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

const requireKv = () => {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    throw new Error('Vercel KV environment variables are not configured');
  }
};

const keyForUser = (userId) => `mrb:state:${userId}`;

const kvRequest = async (path, init = {}) => {
  const response = await fetch(`${KV_REST_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'KV request failed');
  }

  return response.json();
};

const getState = async (key) => {
  const result = await kvRequest(`/get/${encodeURIComponent(key)}`);
  return result.result ?? null;
};

const setState = async (key, value) => {
  await kvRequest(`/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    body: JSON.stringify({ value }),
  });
};

export default async function handler(req, res) {
  const userId = (req.query.userId || req.body?.userId || 'anonymous').toString();
  const storageKey = keyForUser(userId);

  try {
    requireKv();
  } catch (err) {
    res.status(503).json({ error: err.message });
    return;
  }

  try {
    if (req.method === 'GET') {
      const state = await getState(storageKey);
      res.status(200).json(state || null);
      return;
    }

    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      await setState(storageKey, body);
      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader('Allow', 'GET,PUT');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('State handler error', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
