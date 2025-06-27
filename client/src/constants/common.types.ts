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
