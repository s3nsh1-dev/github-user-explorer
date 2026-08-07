/**
 * The server's environment contract, checked once at cold start.
 *
 * The whole point of the proxy is that exactly one process ever sees the
 * token, so the moment that value is wrong the app has no fallback — it just
 * 401s from GitHub twenty minutes later with nothing pointing at the cause.
 * Validating here turns three specific failures into a readable startup error:
 *
 *   - the variable is missing or was never set in Netlify's UI
 *   - the value carries whitespace (`GITHUB_TOKEN =` in a dotenv file produced
 *     exactly this — see report/implementation_plans/P28)
 *   - the variable name was typo'd, so the value is something else entirely
 *
 * ⚠️ The one rule this file must never break: **error messages name fields,
 * never values.** A thrown message ends up in Netlify's build and function
 * logs, which are not a place to put a credential.
 *
 * No Zod here, deliberately — see the S4 completion report. `netlify.toml`
 * sets `base = "client"`, so npm installs into `client/node_modules`, which is
 * not on the resolution path from `netlify/functions/`. A one-field schema is
 * not worth a dependency the function bundle may not be able to resolve at
 * deploy time. The guarantees P28 asked for are all still here.
 */

/** Classic PAT, fine-grained PAT, OAuth token, server-to-server token. */
const TOKEN_SHAPE = /^(ghp_|github_pat_|gho_|ghs_)/;

export type ServerEnv = {
  GITHUB_TOKEN: string;
};

/** Returns a human-readable reason, or `null` when the value is usable. */
function tokenIssue(value: string): string | null {
  if (value === "") return "required";
  if (value !== value.trim()) return "has leading or trailing whitespace";
  if (!TOKEN_SHAPE.test(value)) return "does not look like a GitHub token";
  return null;
}

/**
 * Exported separately from `env` so it can be exercised against a fabricated
 * source object without a real credential anywhere near the test.
 */
export function parseEnv(source: Record<string, string | undefined>): ServerEnv {
  // `?? ""` rather than a later cast: the value is a `string` from here down,
  // so `env.GITHUB_TOKEN` is typed without an assertion.
  const token = source.GITHUB_TOKEN ?? "";
  const issue = tokenIssue(token);

  if (issue !== null) {
    throw new Error(`Invalid environment — GITHUB_TOKEN: ${issue}`);
  }

  return { GITHUB_TOKEN: token };
}

/**
 * Evaluated at module load, which on Netlify is cold start. A bad value fails
 * the function before it can send a request, instead of after.
 */
export const env: ServerEnv = parseEnv(process.env);
