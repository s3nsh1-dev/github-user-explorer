import { GitHubError, NotFoundError, RateLimitError } from "./githubErrors";

/**
 * The single place the app reads a GitHub credential and the single place it
 * talks to the GitHub API.
 *
 * Every hook used to hand-roll `fetch` + `if (!res.ok) throw new Error(...)`.
 * That pattern cannot tell a 404 from a rate limit, and it misses GraphQL
 * failures entirely — GraphQL answers with HTTP 200 and `{ data: null,
 * errors: [...] }`, so `res.ok` is true and the caller crashes downstream on a
 * null field.
 *
 * Keeping the token read here and only here is deliberate: swapping the client
 * over to a backend proxy (P34) then becomes a change to this file alone.
 */
const TOKEN = import.meta.env.VITE_GITHUB_AUTHENTICATION_TOKEN;

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

/**
 * Omitting `Authorization` entirely when there is no token degrades to
 * unauthenticated REST (60 requests/hour) instead of sending the string
 * `Bearer undefined`, which GitHub rejects outright.
 */
const authHeaders = (): HeadersInit => ({
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
});

function assertOk(res: Response): void {
  if (res.ok) return;

  if (
    (res.status === 403 || res.status === 429) &&
    res.headers.get("x-ratelimit-remaining") === "0"
  ) {
    throw new RateLimitError(
      new Date(Number(res.headers.get("x-ratelimit-reset") ?? 0) * 1000)
    );
  }

  if (res.status === 404) throw new NotFoundError();

  throw new GitHubError(`GitHub API error ${res.status}`, res.status);
}

export async function githubFetch<T>(url: string | URL): Promise<T> {
  const res = await fetch(url, { headers: authHeaders() });
  assertOk(res);
  return res.json() as Promise<T>;
}

export async function githubGraphQL<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  assertOk(res);

  const json = (await res.json()) as {
    data: T | null;
    errors?: Array<{ message: string }>;
  };

  // GraphQL reports failure in the body at HTTP 200 — this is the crash path.
  if (json.errors?.length) {
    const message = json.errors[0].message;
    if (/could not resolve to a/i.test(message)) throw new NotFoundError();
    throw new GitHubError(message);
  }
  if (json.data === null || json.data === undefined) {
    throw new GitHubError("Empty GraphQL response");
  }

  // Returns `data`, not the envelope — callers never see `{ data, errors }`.
  return json.data;
}
