export type ModeType = "light" | "dark";

export type ModeContextType = {
  mode: ModeType;
  handleSettingMode: (mode: ModeType) => void;
};

export type GitHubUser = {
  id: string; // node_id
  username: string; // login
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  joined: string; // created_at
  lastActive: string; // updated_at
  followers: number;
  following: number;
  followers_url: string;
  following_url: string;
  html_url: string; // Main GitHub profile link
  public_repos: number;
  repos_url: string;
  login: string;
};
export type GitHubApiUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  name: string | null;
  created_at: string;
  updated_at: string;
  followers: number;
  following: number;
  followers_url: string;
  following_url: string;
  public_repos: number;
  repos_url: string;
  // You can add more fields if needed
};

export type UserObjectType = {
  login: string;
  avatar_url: string;
  html_url: string;
  id: number;
  repos_url: string;
};

export type UserCardsProps = {
  userName: string;
  imageURL: string;
  githubURL: string;
  seeRepos: string;
};

export type Repo = {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  full_name: string;
  url: string;
};
export type PaginationProps = {
  repos: Repo[];
  reposPerPage: number;
  page: number;
  username: string;
};

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  visibility: string;
  default_branch: string;
  license: { name: string } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubUserSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}
