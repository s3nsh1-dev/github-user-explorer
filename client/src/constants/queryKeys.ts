/**
 * Every React Query cache key the app uses, in one place.
 *
 * Two real bugs came from hand-written keys scattered across eight hooks:
 *
 *   1. `useShowIndividualRepo` keyed on the repo name plus a literal string
 *      asserting the key was unique — the owner was in the request URL but not
 *      in the key. `/user/facebook/react` followed by
 *      `/user/typescript-cheatsheets/react` inside the 5-minute staleTime
 *      served Facebook's repo for both. The literal was a comment claiming the
 *      opposite of what the code did.
 *   2. `useFetchOrganizationRepos` was copy-pasted from
 *      `useFetchContributionInfo` and kept its `["contributionInfo", username]`
 *      key, so two hooks with completely different response shapes shared one
 *      cache entry. Latent only because a login is either a User or an
 *      Organization, never both — a property of the current control flow, not a
 *      guarantee.
 *
 * Keys are noun-first and `as const`, which gives TanStack Query v5 literal key
 * inference and makes prefix invalidation (`["userProfile", login]`) possible.
 * The `[username, "loginType"]` shape had no usable prefix.
 */
export const qk = {
  userProfile: (login: string) => ["userProfile", login] as const,
  userRepos: (login: string, page: number) =>
    ["userRepos", login, page] as const,
  repo: (owner: string, name: string) => ["repo", owner, name] as const,
  searchUsers: (q: string) => ["searchUsers", q] as const,
  ownerType: (login: string) => ["ownerType", login] as const,
  contributions: (login: string) => ["contributions", login] as const,
  orgRepos: (login: string) => ["orgRepos", login] as const,
} as const;
