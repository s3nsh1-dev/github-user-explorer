/**
 * The security boundary. Every GitHub request the product makes goes through
 * this file, and it is the only place the token exists.
 *
 * Before this, the token was a `VITE_`-prefixed variable, which means Vite
 * inlined it into the JavaScript bundle it served to every visitor — four
 * copies of a live PAT in `dist/assets/index-*.js`. There is no client-side
 * fix for that: a browser cannot hold a secret. The credential has to move to
 * a process the visitor cannot read, and this is that process.
 *
 * Four rules hold the boundary. Each one is a way to rebuild the original bug
 * with a secret behind it, so none of them is negotiable:
 *
 *   1. **GraphQL documents live here, not on the client.** Callers send a
 *      login; the query text is chosen server-side from `queries.mts`. A proxy
 *      that forwards a client-supplied `query` string is the pre-P08 injection
 *      hole again, except now it runs authenticated.
 *   2. **Inputs are validated, then encoded anyway.** `isValidLogin` rejects
 *      `x/../../orgs/github` outright; `encodeURIComponent` means that even if
 *      the regex is ever loosened, the traversal cannot escape its path
 *      segment. See report/vulnerabilities/03.
 *   3. **The endpoints are an allow-list.** There is one function per GitHub
 *      call, and nothing accepts an upstream path from the caller. A generic
 *      `/api/gh/*` passthrough would be endpoint redirection with a live token.
 *   4. **Upstream error bodies are never forwarded.** GitHub's 403 body can
 *      describe the token; its 404 body names the resource. Everything maps to
 *      a fixed code from `ProxyError`. See report/vulnerabilities/09.
 *
 * The shared-token consequence, and why caching is not optional: before, every
 * visitor spent their own 60/hour. Now all traffic spends one 5,000/hour pool,
 * so a repeated profile view has to be answered by Netlify's CDN rather than
 * by GitHub. See report/vulnerabilities/07.
 */
import { env } from "./env.mts";
// The client's copy is the single source of truth for these rules — the same
// regexes guard the route boundary in the browser and the request here, and a
// second copy would be free to drift.
import { isValidLogin, isValidRepoName } from "../../../client/src/helper/validateLogin.ts";

const GITHUB_API_ROOT = "https://api.github.com";
const GRAPHQL_ENDPOINT = `${GITHUB_API_ROOT}/graphql`;

/**
 * Five minutes, on the CDN as well as the browser. `s-maxage` is what makes
 * the second visitor to a profile cost zero GitHub quota.
 */
const CACHE_CONTROL = "public, max-age=300, s-maxage=300";

/**
 * Forwarded verbatim so the client can still tell a rate limit apart from any
 * other 403. `assertOk` in client/src/helper/githubFetch.ts reads
 * `x-ratelimit-remaining` off the response to decide whether to construct a
 * `RateLimitError`, and the retry predicate in main.tsx then refuses to retry
 * it. A proxy that returns only a status and a body silently turns every rate
 * limit back into a retryable generic error — which is the amplification
 * vulnerabilities/07 describes.
 */
const RATE_LIMIT_HEADERS = [
  "x-ratelimit-limit",
  "x-ratelimit-remaining",
  "x-ratelimit-reset",
  "x-ratelimit-used",
  "x-ratelimit-resource",
];

const JSON_TYPE = "application/json; charset=utf-8";

/** The complete set of error codes a client can ever see from this proxy. */
export type ProxyError =
  | "bad_request"
  | "not_found"
  | "rate_limited"
  | "upstream_error"
  | "method_not_allowed";

function rateLimitHeaders(upstream: Response): Record<string, string> {
  const forwarded: Record<string, string> = {};
  for (const name of RATE_LIMIT_HEADERS) {
    const value = upstream.headers.get(name);
    if (value !== null) forwarded[name] = value;
  }
  return forwarded;
}

function ok(body: unknown, upstream: Response): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": JSON_TYPE,
      "Cache-Control": CACHE_CONTROL,
      ...rateLimitHeaders(upstream),
    },
  });
}

/**
 * A fixed code and a status — never upstream text. `no-store` because caching
 * a rate-limit or a transient 502 for five minutes would outlast the condition
 * that caused it.
 */
export function fail(
  error: ProxyError,
  status: number,
  upstream?: Response
): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: {
      "Content-Type": JSON_TYPE,
      "Cache-Control": "no-store",
      ...(upstream ? rateLimitHeaders(upstream) : {}),
    },
  });
}

/** Input the caller got wrong. Never reflects the offending value back. */
export const badRequest = (): Response => fail("bad_request", 400);

/**
 * The client distinguishes 404 and rate-limited from everything else, so those
 * two statuses have to survive the hop. Anything else collapses to 502: this
 * proxy failed to get an answer, and the reason is GitHub's business.
 */
function failFromUpstream(upstream: Response): Response {
  if (
    (upstream.status === 403 || upstream.status === 429) &&
    upstream.headers.get("x-ratelimit-remaining") === "0"
  ) {
    return fail("rate_limited", 403, upstream);
  }
  if (upstream.status === 404) return fail("not_found", 404, upstream);
  return fail("upstream_error", 502, upstream);
}

const restHeaders = (): Record<string, string> => ({
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  // No VITE_ prefix, and no way for this value to reach a browser.
  Authorization: `Bearer ${env.GITHUB_TOKEN}`,
});

/**
 * `path` is always built by the caller from validated, `encodeURIComponent`-ed
 * segments — it is never a string the client supplied.
 *
 * `redirect: "follow"` is load-bearing, not a default worth relying on
 * implicitly: `GET /repos/:owner/:name` 301s to `/repositories/:id` for
 * renamed repositories (`facebook/react` does this today). A proxy that
 * returned the 301 instead of following it would break the repo detail page
 * for exactly the repos most likely to be looked up.
 */
export async function proxyRest(
  path: string,
  search?: URLSearchParams
): Promise<Response> {
  const url = new URL(`${GITHUB_API_ROOT}${path}`);
  if (search) {
    for (const [key, value] of search) url.searchParams.set(key, value);
  }

  const upstream = await fetch(url, {
    headers: restHeaders(),
    redirect: "follow",
  });
  if (!upstream.ok) return failFromUpstream(upstream);

  return ok(await upstream.json(), upstream);
}

type GraphQLEnvelope = {
  data?: unknown;
  errors?: Array<{ message?: string; type?: string }>;
};

/**
 * `query` comes from `queries.mts`; `variables` is the only part callers
 * influence, and GraphQL variables cannot be parsed as query syntax.
 *
 * Returns `data` unwrapped, so the client's schemas describe the payload
 * rather than the `{ data, errors }` envelope — the same contract
 * `githubGraphQL` had when it lived in the browser.
 *
 * GraphQL reports failure at HTTP 200 with a populated `errors` array, so
 * `upstream.ok` proves nothing here. That was the original white-screen bug
 * (vulnerabilities/05); it is handled once, here, instead of in three hooks.
 */
export async function proxyGraphQL(
  query: string,
  variables: Record<string, unknown>
): Promise<Response> {
  const upstream = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { ...restHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!upstream.ok) return failFromUpstream(upstream);

  const envelope = (await upstream.json()) as GraphQLEnvelope;

  if (envelope.errors?.length) {
    const first = envelope.errors[0];
    const message = first.message ?? "";
    if (first.type === "NOT_FOUND" || /could not resolve to a/i.test(message)) {
      return fail("not_found", 404, upstream);
    }
    if (first.type === "RATE_LIMITED") {
      return fail("rate_limited", 403, upstream);
    }
    // The message itself is discarded on purpose — GraphQL errors can name
    // fields, scopes, and the authenticated identity.
    return fail("upstream_error", 502, upstream);
  }

  if (envelope.data === null || envelope.data === undefined) {
    return fail("upstream_error", 502, upstream);
  }

  return ok(envelope.data, upstream);
}

/* ----------------------------------------------------------- input reading */

/**
 * Every parameter arrives in the query string, never in a path segment. That
 * is a deliberate narrowing: `URLSearchParams` round-trips a value exactly,
 * whereas a path segment passes through Netlify's router and the URL parser,
 * both of which may normalise `..` and `%2F`. There is simply no path to
 * tamper with — see the S4 report.
 */
export function readLogin(req: Request, key = "login"): string | null {
  const value = new URL(req.url).searchParams.get(key);
  return isValidLogin(value ?? undefined) ? value : null;
}

export function readRepoName(req: Request, key = "name"): string | null {
  const value = new URL(req.url).searchParams.get(key);
  return isValidRepoName(value ?? undefined) ? value : null;
}

/** Clamped rather than rejected: a bad page number is a UI glitch, not an attack. */
export function readInt(
  req: Request,
  key: string,
  fallback: number,
  max: number
): number {
  const raw = new URL(req.url).searchParams.get(key);
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

/**
 * GitHub's search syntax is a language of its own (`location:india`,
 * `followers:>100`), so unlike a login there is no shape to validate against.
 * It is bounded instead, and it only ever travels as a `q` parameter — never
 * as part of a path.
 */
export function readSearchQuery(req: Request): string | null {
  const value = new URL(req.url).searchParams.get("q");
  if (value === null) return null;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed.length > 256) return null;
  return trimmed;
}

/* -------------------------------------------------------------- the wrapper */

type Handler = (req: Request) => Promise<Response>;

/**
 * Wraps every endpoint with the two things all seven share.
 *
 * **Read-only.** Only GET and HEAD are answered, so a POST carrying a `query`
 * field cannot be interpreted as anything — no handler reads a request body at
 * all, and this makes that structural instead of incidental.
 *
 * **Nothing escapes.** A thrown error — a DNS failure, a malformed upstream
 * body, a bug — becomes a bare 502. Netlify's default is to render the stack
 * trace into the HTTP response, which would publish file paths and, in the
 * worst case, whatever a message happened to interpolate.
 */
export function endpoint(handler: Handler): Handler {
  return async (req: Request): Promise<Response> => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return fail("method_not_allowed", 405);
    }
    try {
      return await handler(req);
    } catch {
      return fail("upstream_error", 502);
    }
  };
}
