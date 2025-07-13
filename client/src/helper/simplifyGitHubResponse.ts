import type { GitHubApiUser, GitHubUser } from "../constants/common.types";
export function mapGitHubResponse(data: GitHubApiUser): GitHubUser {
  return {
    id: data.node_id,
    login: data.login,
    username: data.login,
    name: data.name || "Not Provided",
    avatar_url: data.avatar_url,
    bio: data.bio || "Not Provided",
    company: data.company || "Not Provided",
    location: data.location || "Not Provided",
    joined: data.created_at,
    lastActive: data.updated_at,
    followers: data.followers,
    following: data.following,
    followers_url: data.followers_url,
    following_url: data.following_url,
    html_url: data.html_url,
    public_repos: data.public_repos,
    repos_url: data.repos_url,
    email: data.email || "Not Provided",
    hirable: data.hireable ? "Actively Applying" : "Busy Learning",
    accountType: data.type || "Not Provided",
    blog: data.blog || "Coming Soon",
    gists: data.public_gists,
    x_handle: data.twitter_username || "Not Provided",
    starred_url: data.starred_url,
  };
}
