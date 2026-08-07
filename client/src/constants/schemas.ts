/**
 * Runtime schemas for every GitHub payload the client consumes, and the types
 * derived from them.
 *
 * `Response.json()` resolves to `unknown` at best and untyped at worst, so
 * before this file `strict: true` could not see a single field the app
 * actually renders — every payload was implicitly untyped. Hand-written
 * interfaces did not help: they were assertions about a shape nobody checked,
 * and several were simply wrong (`hireable: boolean` when GitHub returns `null`
 * for most accounts; `items: GitHubUser[]` when search returns a much smaller
 * object).
 *
 * So the schema is the source of truth and the type is `z.infer`red from it —
 * a type and a check written separately are two sources of truth that drift,
 * which is the whole problem being fixed. `constants/common.types.ts`
 * re-exports these names, so import sites are unchanged.
 *
 * Two rules when editing:
 *
 *   - **Be liberal with `.nullish()` on profile fields.** `blog`, `company`,
 *     `email` and `twitter_username` are `null` *or absent* depending on the
 *     account. A too-strict schema rejects users GitHub returns happily, and a
 *     rejection is a hard error page for a real profile.
 *   - **`z.object` strips unknown keys.** Anything a component reads must be
 *     declared here, or it will be `undefined` at runtime with the compiler
 *     none the wiser.
 */
import { z } from "zod";

/* ------------------------------------------------------------------ REST -- */

/** `GET /users/:login` — the profile payload. */
export const GitHubApiUserSchema = z.object({
  login: z.string(),
  node_id: z.string(),
  avatar_url: z.url(),
  html_url: z.url(),
  name: z.string().nullish(),
  bio: z.string().nullish(),
  company: z.string().nullish(),
  location: z.string().nullish(),
  blog: z.string().nullish(),
  email: z.string().nullish(),
  twitter_username: z.string().nullish(),
  hireable: z.boolean().nullish(), // GitHub returns null for most accounts
  // "Bot" is a real value (`dependabot`, `github-actions`), so a two-value
  // enum would reject accounts GitHub serves happily.
  type: z.enum(["User", "Organization", "Bot"]),
  created_at: z.string(),
  updated_at: z.string(),
  followers: z.number(),
  following: z.number(),
  public_repos: z.number(),
  public_gists: z.number(),
  repos_url: z.string(),
  followers_url: z.string(),
  following_url: z.string(),
  starred_url: z.string(),
});
export type GitHubApiUser = z.infer<typeof GitHubApiUserSchema>;

/** One entry of `GET /users/:login/repos` — only the fields the list renders. */
export const RepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullish(),
  stargazers_count: z.number(),
  full_name: z.string(),
  url: z.string(),
});
export type Repo = z.infer<typeof RepoSchema>;

export const RepoListSchema = z.array(RepoSchema);

/** `GET /repos/:owner/:name` — the repo detail page. */
export const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.url(),
  description: z.string().nullish(),
  language: z.string().nullish(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  size: z.number(),
  visibility: z.string(),
  default_branch: z.string(),
  license: z.object({ name: z.string() }).nullish(),
  created_at: z.string(),
  updated_at: z.string(),
  pushed_at: z.string(),
});
export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

/**
 * `GET /search/users` returns a far smaller user object than `/users/:login`
 * — five fields, which is also exactly what `Explorer` reads.
 */
export const UserObjectSchema = z.object({
  id: z.number(),
  login: z.string(),
  avatar_url: z.url(),
  html_url: z.url(),
  repos_url: z.string(),
});
export type UserObjectType = z.infer<typeof UserObjectSchema>;

export const UserSearchResultSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(UserObjectSchema),
});
export type GitHubUserSearchResult = z.infer<typeof UserSearchResultSchema>;

/* --------------------------------------------------------------- GraphQL -- */
/*
 * These describe `data`, not the `{ data, errors }` envelope — githubGraphQL
 * unwraps it and throws on `errors`.
 *
 * Every top-level field is nullable. That is what GitHub returns for a login it
 * cannot resolve, and modelling it is what makes the resulting crash visible to
 * the compiler instead of only at runtime.
 */

/**
 * `contributionCount` is nullable because the calendar grid pads short weeks
 * with blank days — one shape for the API row and the rendered cell, rather
 * than a second near-identical type declared inside the component.
 */
export const ContributionDaySchema = z.object({
  date: z.string(),
  contributionCount: z.number().nullable(),
  color: z.string(),
});
export type ContributionDay = z.infer<typeof ContributionDaySchema>;

export const WeekSchema = z.object({
  contributionDays: z.array(ContributionDaySchema),
});
export type Week = z.infer<typeof WeekSchema>;

export const ContributionCalendarResponseSchema = z.object({
  user: z
    .object({
      contributionsCollection: z.object({
        contributionCalendar: z.object({
          totalContributions: z.number(),
          weeks: z.array(WeekSchema),
        }),
      }),
    })
    .nullable(),
});
export type ContributionCalendarResponse = z.infer<
  typeof ContributionCalendarResponseSchema
>;

export const LoginTypeResponseSchema = z.object({
  repositoryOwner: z.object({ __typename: z.string() }).nullable(),
});
export type LoginTypeResponse = z.infer<typeof LoginTypeResponseSchema>;

export const OrgRepoNodeSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  stargazerCount: z.number().nullable(),
  updatedAt: z.string(),
});
export type OrgRepoNode = z.infer<typeof OrgRepoNodeSchema>;

export const OrganizationTop10ReposSchema = z.object({
  organization: z
    .object({
      repositories: z.object({ nodes: z.array(OrgRepoNodeSchema) }),
    })
    .nullable(),
});
export type OrganizationTop10ReposType = z.infer<
  typeof OrganizationTop10ReposSchema
>;
