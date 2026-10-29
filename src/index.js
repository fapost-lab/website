/**
 * The site is static; this Worker exists for one redirect (/signup) and to hand
 * /blog to the blog's own Worker.
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

    // The blog is a separate site (fapost-lab/blog) built under /blog, so the request
    // goes over unchanged. /blogger and the like are not the blog.
    if (url.pathname === '/blog' || url.pathname.startsWith('/blog/')) {
      return env.BLOG.fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
};
