/**
 * GitHub login rules: alphanumeric plus single internal hyphens,
 * cannot start or end with a hyphen, max 39 characters.
 */
export const GITHUB_LOGIN = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

/** Repo names allow dots and underscores; max 100 characters. */
export const GITHUB_REPO_NAME = /^[A-Za-z0-9_.-]{1,100}$/;

export const isValidLogin = (value: string | undefined): value is string =>
  typeof value === "string" && GITHUB_LOGIN.test(value);

export const isValidRepoName = (value: string | undefined): value is string =>
  typeof value === "string" &&
  value !== "." &&
  value !== ".." &&
  GITHUB_REPO_NAME.test(value);
