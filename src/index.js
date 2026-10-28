/**
 * The site is static; this Worker exists for one redirect (/signup).
 *
 * Everything else falls through to the assets binding, so index.html, the 404
 * page and the images are still served from the edge without this script doing
 * any work.
 */

const SIGNUP_URL = 'https://app.fapost.in/signup';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // The managed cloud lives on its own host; /signup here is only a shortcut to it.
    if (url.pathname === '/signup') {
      return Response.redirect(SIGNUP_URL, 302);
    }

    return env.ASSETS.fetch(request);
  },
};
