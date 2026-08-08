import type { z } from "zod";
import { GitHubError, NotFoundError, RateLimitError } from "./githubErrors";

/**
 * The single place the app talks to the API, and the single place a payload
 * becomes typed data.
 *
 * It no longer reads a credential. It used to: `VITE_GITHUB_AUTHENTICATION_TOKEN`
 * was read here and sent as a `Bearer` header, which meant Vite inlined a live
 * personal access token into the bundle served to every visitor. That is not
 * fixable in the browser — a client cannot hold a secret — so the token moved
 * to `netlify/functions/`, and these requests now go to this site's own
 * `/api/*`. Centralising the token read in this one file is what made that a
 * change to one file. See report/vulnerabilities/01.
 *
 * `githubGraphQL` is gone with it. The three GraphQL calls are ordinary GETs
 * to named proxy endpoints now, because the query documents had to move
 * server-side: a proxy that forwards a client-supplied `query` string is the
 * injection hole P08 closed, except authenticated. The proxy unwraps the
 * `{ data, errors }` envelope and maps a GraphQL failure onto a status, so the
 * schemas below still describe `data` and there is one response path instead
 * of two.
 *
 * Every hook used to hand-roll `fetch` + `if (!res.ok) throw new Error(...)`.
 * That pattern cannot tell a 404 from a rate limit.
 */

/**
 * The proxy answers with a fixed error code, never GitHub's own error text —
 * an upstream body can name the token's scopes or its owner. The status is
 * what carries meaning, and `assertOk` is what reads it.
 */
function assertOk(res: Response): void {
  if (res.ok) return;

  // The proxy forwards GitHub's `x-ratelimit-*` headers verbatim precisely so
  // this check still works across the hop. Without them every rate limit would
  // read as a generic error, and the retry predicate in main.tsx would answer
  // "you have made too many requests" with more requests.
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
 * `schema` is optional so callers opt in, but every hook passes one: without it
 * this function ends in `json as T`, an assertion about a shape nobody checked.
 *
 * `.safeParse`, never `.parse` — a schema gap must degrade into a handled
 * error the UI can render, not an uncaught throw and a white screen. The issue
 * detail goes to the console in dev only; the thrown message stays generic so
 * nothing about the response shape reaches the page.
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
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  assertOk(res);
  const json: unknown = await res.json();
  return schema ? validate(json, schema) : (json as T);
}
