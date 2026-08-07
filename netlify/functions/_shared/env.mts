/**
 * The one environment variable the server needs.
 *
 * Checked here, at module load, so a missing token fails the function
 * immediately with a message that says which variable is missing — instead of
 * a confusing 401 from GitHub later.
 *
 * ⚠️ Never put the value in an error message or a log. Function logs are not
 * a place for a credential. Field names only.
 */
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN?.trim() ?? "";

if (!GITHUB_TOKEN) {
  throw new Error("Missing environment variable: GITHUB_TOKEN");
}
