import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple Ticketmaster proxy to keep the API key server-side and enable caching.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server misconfiguration: missing TICKETMASTER_API_KEY' });
    return;
  }

  try {
    const upstream = new URL('https://app.ticketmaster.com/discovery/v2/events.json');

    // Allowlist of query params we forward
    const allowedParams = new Set([
      'size',
      'countryCode',
      'city',
      'startDateTime',
      'endDateTime',
      'classificationName',
      'keyword',
      'page',
      'sort'
    ]);

    // Copy allowed query parameters
    Object.entries(req.query).forEach(([key, value]) => {
      if (!allowedParams.has(key)) return;
      if (Array.isArray(value)) {
        value.forEach(v => upstream.searchParams.append(key, String(v)));
      } else if (value !== undefined) {
        upstream.searchParams.set(key, String(value));
      }
    });

    // Enforce sane upper bound for size
    const size = Number(upstream.searchParams.get('size') || '0');
    if (!Number.isFinite(size) || size <= 0 || size > 200) {
      upstream.searchParams.set('size', '200');
    }

    // Inject API key server-side
    upstream.searchParams.set('apikey', apiKey);

    const upstreamResponse = await fetch(upstream.toString(), {
      headers: { Accept: 'application/json' }
    });

    const text = await upstreamResponse.text();
    res.setHeader('Content-Type', 'application/json');
    // Cache for 5 minutes at the edge, allow 60s stale-while-revalidate
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.status(upstreamResponse.status).send(text);
  } catch (err) {
    res.status(502).json({ error: 'Upstream fetch failed' });
  }
}


