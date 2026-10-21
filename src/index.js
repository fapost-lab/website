/**
 * The site is static; this Worker exists for one endpoint.
 *
 * Everything except POST /api/subscribe falls through to the assets binding,
 * so index.html, the 404 page and the images are still served from the edge
 * without this script doing any work.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Signups per IP per window, so one script cannot fill the namespace. */
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 3600;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== '/api/subscribe') {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== 'POST') {
      return json({ error: 'Use POST.' }, 405);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'Expected JSON.' }, 400);
    }

    // Honeypot: a field hidden from people and irresistible to bots.
    if (payload.company) {
      return json({ ok: true });
    }

    const email = String(payload.email ?? '').trim().toLowerCase();

    if (!EMAIL.test(email) || email.length > 254) {
      return json({ error: 'That does not look like an email address.' }, 400);
    }

    const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
    const rateKey = `rate:${ip}`;
    const seen = Number((await env.SUBSCRIBERS.get(rateKey)) ?? 0);

    if (seen >= RATE_LIMIT) {
      return json({ error: 'Too many attempts. Try again later.' }, 429);
    }

    await env.SUBSCRIBERS.put(rateKey, String(seen + 1), {
      expirationTtl: RATE_WINDOW_SECONDS,
    });

    const key = `sub:${email}`;

    if (await env.SUBSCRIBERS.get(key)) {
      // Already on the list — say so plainly rather than pretending it is new.
      return json({ ok: true, already: true });
    }

    await env.SUBSCRIBERS.put(
      key,
      JSON.stringify({
        email,
        at: new Date().toISOString(),
        country: request.cf?.country ?? null,
        ref: String(payload.ref ?? '').slice(0, 120) || null,
      }),
    );

    return json({ ok: true });
  },
};
