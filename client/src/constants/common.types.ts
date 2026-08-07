/**
 * Types the app owns, plus a re-export of the API types.
 *
 * Anything that describes a GitHub payload is derived from a Zod schema in
 * `./schemas.ts` and only re-exported here, so the type and the runtime check
 * cannot disagree. Everything below the re-export is a view model or a prop
 * type — shapes the app invents, which have no wire format to validate.
 */
export type {
  GitHubApiUser,
  GitHubRepo,
  GitHubUserSearchResult,
  Repo,
  UserObjectType,
  ContributionDay,
  Week,
  ContributionCalendarResponse,
  LoginTypeResponse,
  OrgRepoNode,
  OrganizationTop10ReposType,
} from "./schemas";

export type ModeType = "light" | "dark";

export type ModeContextType = {
  mode: ModeType;
  handleSettingMode: (mode: ModeType) => void;
};

/** The view model `mapGitHubResponse` produces from a `GitHubApiUser`. */
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
  email: string;
  hirable: string;
  accountType: string;
  blog: string | null;
  gists: number;
  x_handle: string;
  starred_url: string;
};

export type UserCardsProps = {
  userName: string;
  imageURL: string;
  githubURL: string;
};

export type PaginationProps = {
  page: number;
  username: string;
  totalRepos: number;
};
