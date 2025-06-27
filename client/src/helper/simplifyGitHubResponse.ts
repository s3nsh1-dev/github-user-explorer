import type { GitHubApiUser, GitHubUser } from "../constants/common.types";
export function mapGitHubResponse(data: GitHubApiUser): GitHubUser {
  return {
    id: data.node_id,
    username: data.login,
    name: data.name,
    avatar_url: data.avatar_url,
    bio: data.bio,
    company: data.company,
    location: data.location,
    joined: data.created_at,
    lastActive: data.updated_at,
    followers: data.followers,
    following: data.following,
    followers_url: data.followers_url,
    following_url: data.following_url,
    html_url: data.html_url,
    public_repos: data.public_repos,
    repos_url: data.repos_url,
  };
}
