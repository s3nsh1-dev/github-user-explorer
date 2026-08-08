/**
 * Every request URL the client builds, in one place.
 *
 * These no longer point at `api.github.com`. They point at this site's own
 * `/api/*`, which Netlify rewrites to the functions in `netlify/functions/` —
 * the only place the GitHub token exists. A browser cannot keep a secret, so
 * the credential moved rather than being better hidden.
 *
 * Three things follow from the origin change, and all three are wins:
 *   - **No CORS preflight.** `X-GitHub-Api-Version` is not a CORS-simple
 *     header, so every GitHub call used to cost an `OPTIONS` round trip first.
 *     Same-origin requests skip that entirely.
 *   - **`connect-src 'self'`** becomes a correct CSP directive.
 *   - **CDN caching**, which matters now that all visitors share one token and
 *     therefore one rate-limit pool.
 *
 * The rule this file has always existed to enforce still holds, and now holds
 * more strongly: **a URL is never assembled by template interpolation.**
 * `https://api.github.com/users/${username}` with username `x/../../orgs/github`
 * is normalised by the URL parser into `https://api.github.com/orgs/github` — a
 * different endpoint, still carrying the Authorization header.
 *
 * The proxy narrows that further: **every parameter travels in the query
 * string, none in a path segment.** `URLSearchParams` round-trips a value
 * exactly, whereas a path segment passes through both a router and a URL
 * parser, either of which may normalise `..` and `%2F`. There is no path left
 * to traverse. The server validates each value again with the same regexes
 * from `helper/validateLogin.ts` before it builds the upstream URL.
 *
 * ⚠️ Do not pre-encode a value before handing it to `searchParams.set` —
 * `URLSearchParams` encodes, and pre-encoding yields `%2520`.
 */

const API_ROOT = "/api";

/**
 * `URL` needs an absolute base; the origin is this site's own. Building a
 * `URL` rather than a string is what makes `searchParams.set` — and therefore
 * the encoding guarantee — available at every call site.
 */
const apiUrl = (
  endpoint: string,
  params: Record<string, string>
): URL => {
  const url = new URL(`${API_ROOT}/${endpoint}`, window.location.origin);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
};

/* ------------------------------------------------------------------ REST -- */

export const usersUrl = (login: string): URL => apiUrl("users", { login });

export const userReposUrl = (login: string, page: number, perPage = 8): URL =>
  apiUrl("user-repos", {
    login,
    page: String(page),
    per_page: String(perPage),
  });

export const repoUrl = (owner: string, name: string): URL =>
  apiUrl("repo", { owner, name });

export const searchUsersUrl = (q: string, page: number, perPage = 20): URL =>
  // `q` is not pre-encoded, which keeps GitHub's search qualifiers
  // (`location:india`, `followers:>100`) intact through to the upstream call.
  apiUrl("search-users", { q, page: String(page), per_page: String(perPage) });

/* --------------------------------------------------------------- GraphQL -- */
/*
 * These three are GraphQL upstream, but the client cannot tell and must not:
 * it sends a login to a named endpoint and receives the `data` object, already
 * unwrapped. The query documents live in `netlify/functions/_shared/queries.mts`
 * and are chosen server-side by which endpoint was called. A proxy that
 * accepted a `query` string from the browser would be the pre-P08 injection
 * again, with a live token behind it.
 */

export const ownerTypeUrl = (login: string): URL =>
  apiUrl("owner-type", { login });

export const contributionsUrl = (login: string): URL =>
  apiUrl("contributions", { login });

export const orgReposUrl = (login: string): URL =>
  apiUrl("org-repos", { login });
