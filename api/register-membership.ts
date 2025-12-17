import type { VercelRequest, VercelResponse } from '@vercel/node';

const baseUrl = process.env.WORDPRESS_BASE_URL;
const wpAppUser = process.env.WORDPRESS_APP_USER;
const wpAppPassword = process.env.WORDPRESS_APP_PASSWORD;
const pmproLevelId = process.env.PMPRO_LEVEL_ID || '1';

const missingEnv = !baseUrl || !wpAppUser || !wpAppPassword;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  if (missingEnv) {
    return res.status(500).send('WordPress credentials are not configured.');
  }

  const { displayName, email, password, state, emergencyName, emergencyPhone, emergencyRelation } = req.body || {};

  if (!email || !password || !displayName) {
    return res.status(400).send('displayName, email, and password are required');
  }

  try {
    const authHeader = Buffer.from(`${wpAppUser}:${wpAppPassword}`).toString('base64');
    const url = `${baseUrl.replace(/\/$/, '')}/wp-json/penda/v1/register-member`;

    const wpResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        displayName,
        email,
        password,
        state,
        emergencyName,
        emergencyPhone,
        emergencyRelation,
        levelId: pmproLevelId,
      }),
    });

    const text = await wpResponse.text();
    if (!wpResponse.ok) {
      return res.status(wpResponse.status).send(text || 'Failed to create membership');
    }

    return res.status(200).send(text || 'ok');
  } catch (err) {
    console.error('Failed to register membership', err);
    return res.status(500).send('Unable to register membership at this time');
  }
}
