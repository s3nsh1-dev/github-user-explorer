/**
 * Every GitHub API URL the client builds, in one place.
 *
 * The rule these exist to enforce: a URL is never assembled by template
 * interpolation. `https://api.github.com/users/${username}` with username
 * `x/../../orgs/github` is normalised by the URL parser into
 * `https://api.github.com/orgs/github` — a different endpoint, still carrying
 * the Authorization header. `encodeURIComponent` turns the `/` into `%2F`,
 * which GitHub reads as a literal inside one path segment, and the traversal
 * collapses into an ordinary 404.
 *
 * ⚠️ Two different encodings, do not mix them:
 *   - path segments need an explicit `encodeURIComponent`
 *   - query params must NOT — `URLSearchParams.set` already encodes, so
 *     pre-encoding yields `%2520`
 */

const GITHUB_API_ROOT = "https://api.github.com";

export const usersUrl = (login: string): URL =>
  new URL(`${GITHUB_API_ROOT}/users/${encodeURIComponent(login)}`);

export const userReposUrl = (
  login: string,
  page: number,
  perPage = 8
): URL => {
  const url = new URL(
    `${GITHUB_API_ROOT}/users/${encodeURIComponent(login)}/repos`
  );
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));
  return url;
};

export const repoUrl = (owner: string, name: string): URL =>
  new URL(
    `${GITHUB_API_ROOT}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      name
    )}`
  );

export const searchUsersUrl = (q: string, page: number, perPage = 20): URL => {
  const url = new URL(`${GITHUB_API_ROOT}/search/users`);
  // Not pre-encoded: URLSearchParams does it, and it keeps GitHub search
  // qualifiers (`location:india`, `followers:>100`) intact.
  url.searchParams.set("q", q);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));
  return url;
};
