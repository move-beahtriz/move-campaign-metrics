// middleware.js
// Password-protects every page in this project using HTTP Basic Auth.
// Credentials come from Vercel environment variables, never from the repo.
// Keep this file at the repo root, next to index.html.

export const config = {
  matcher: '/((?!favicon.ico).*)',
};

export default function middleware(request) {
  const header = request.headers.get('authorization') || '';

  if (header.startsWith('Basic ')) {
    let decoded = '';
    try {
      decoded = atob(header.slice(6));
    } catch (e) {
      decoded = '';
    }

    const i = decoded.indexOf(':');
    const user = decoded.slice(0, i);
    const pass = decoded.slice(i + 1);

    if (
      process.env.DASH_USER &&
      process.env.DASH_PASS &&
      user === process.env.DASH_USER &&
      pass === process.env.DASH_PASS
    ) {
      return; // correct login: serve the page
    }
  }

  // Missing/wrong login, or env vars not set: lock everyone out.
  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Dashboard", charset="UTF-8"' },
  });
}
