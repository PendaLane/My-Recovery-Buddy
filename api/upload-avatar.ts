import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({ error: 'Blob storage unavailable: BLOB_READ_WRITE_TOKEN not configured' });
  }

  const dataUrl = req.body?.dataUrl as string;
  if (!dataUrl || !dataUrl.startsWith('data:image')) {
    return res.status(400).json({ error: 'dataUrl required' });
  }

  const [meta, base64] = dataUrl.split(',');
  const match = /data:(.*);base64/.exec(meta);
  const mime = match?.[1] || 'image/png';
  const buffer = Buffer.from(base64, 'base64');
  const ext = mime.split('/')[1] || 'png';

  try {
    const blob = await put(`avatars/${Date.now()}.${ext}`, buffer, {
      contentType: mime,
      access: 'public',
    });
    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('Blob upload failed', err);
    return res.status(500).json({ error: 'Unable to upload avatar' });
  }
}
