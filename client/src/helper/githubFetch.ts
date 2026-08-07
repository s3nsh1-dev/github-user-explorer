import type { z } from "zod";
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

/**
 * The one place a GitHub payload becomes typed data.
 *
 * `schema` is optional so callers opt in, but every hook passes one: without it
 * this function ends in `json as T`, an assertion about a shape nobody checked.
 *
 * `.safeParse`, never `.parse` — a schema gap must degrade into a handled
 * error the UI can render, not an uncaught throw and a white screen. The issue
 * detail goes to the console in dev only; the thrown message stays generic so
 * nothing about GitHub's response shape reaches the page.
 */
function validate<T>(json: unknown, schema: z.ZodType<T>): T {
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    if (import.meta.env.DEV) {
      console.error("Schema mismatch:", parsed.error.issues);
    }
    throw new GitHubError("Unexpected response shape from GitHub");
  }
  return parsed.data;
}

export async function githubFetch<T>(
  url: string | URL,
  schema?: z.ZodType<T>
): Promise<T> {
  const res = await fetch(url, { headers: authHeaders() });
  assertOk(res);
  const json: unknown = await res.json();
  return schema ? validate(json, schema) : (json as T);
}

export async function githubGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  schema?: z.ZodType<T>
): Promise<T> {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  assertOk(res);

  const json = (await res.json()) as {
    data: unknown;
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
  return schema ? validate(json.data, schema) : (json.data as T);
}
