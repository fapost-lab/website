/**
 * The site is static; this Worker exists for two redirects (/signup, /solutions) and
 * to hand /blog to the blog's own Worker.
 *
 * Everything else falls through to the assets binding, so index.html, the 404
 * page and the images are still served from the edge without this script doing
 * any work.
 */

const SIGNUP_URL = 'https://app.fapost.in/signup';

// Core links here from its admin Solutions page, so the address stays stable in every
// installed copy while the directory itself can move: change only this target.
const SOLUTIONS_URL = 'https://docs.fapost.in/self-hosting/solutions-directory';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // The managed cloud lives on its own host; /signup here is only a shortcut to it.
    if (url.pathname === '/signup') {
      return Response.redirect(SIGNUP_URL, 302);
    }

    if (url.pathname === '/solutions') {
      return Response.redirect(SOLUTIONS_URL, 302);
    }

    // The blog is a separate site (fapost-lab/blog) built under /blog, so the request
    // goes over unchanged. /blogger and the like are not the blog.
    if (url.pathname === '/blog' || url.pathname.startsWith('/blog/')) {
      return env.BLOG.fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
};
