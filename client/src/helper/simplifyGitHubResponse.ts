import type { GitHubApiUser, GitHubUser } from "../constants/common.types";

/**
 * The sentinel this mapper substitutes for a field GitHub left null.
 *
 * Exported because `ProfileInfo` has to recognise it, and it used to compare
 * against the string "Not Provided" — without the emoji, so the comparison
 * never matched and an account with no X handle got a live link to
 * `https://x.com/🚫 Not Provided`.
 */
export const NOT_PROVIDED = "🚫 Not Provided";

export function mapGitHubResponse(data: GitHubApiUser): GitHubUser {
  return {
    id: data.node_id,
    login: data.login,
    username: data.login,
    name: data.name || NOT_PROVIDED,
    avatar_url: data.avatar_url,
    bio: data.bio || NOT_PROVIDED,
    company: data.company || NOT_PROVIDED,
    location: data.location || NOT_PROVIDED,
    joined: data.created_at,
    lastActive: data.updated_at,
    followers: data.followers,
    following: data.following,
    followers_url: data.followers_url,
    following_url: data.following_url,
    html_url: data.html_url,
    public_repos: data.public_repos,
    repos_url: data.repos_url,
    email: data.email || NOT_PROVIDED,
    hireable: data.hireable ? "📨 Actively Applying" : "🧑‍💻 Busy Learning",
    accountType: data.type || NOT_PROVIDED,
    // Was "⏳ Coming Soon " — which promised something the app cannot know,
    // and carried a trailing space. An empty field is an empty field.
    blog: data.blog || NOT_PROVIDED,
    gists: data.public_gists,
    x_handle: data.twitter_username || NOT_PROVIDED,
    starred_url: data.starred_url,
  };
}
